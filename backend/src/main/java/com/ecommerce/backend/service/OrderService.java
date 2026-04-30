package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.CreateOrderRequest;
import com.ecommerce.backend.dto.OrderDto;
import com.ecommerce.backend.dto.OrderItemDto;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.exception.BadRequestException;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // ── Place a new order ─────────────────────────────────
    @Transactional
    public OrderDto placeOrder(String userEmail, CreateOrderRequest request) {

        // Step 1: Find the user placing the order
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Step 2: Build order items + validate stock
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CreateOrderRequest.OrderItemRequest itemRequest : request.getItems()) {

            // Find the product
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with id: " + itemRequest.getProductId()));

            // Check stock availability
            if (product.getStock() < itemRequest.getQuantity()) {
                throw new BadRequestException(
                    "Insufficient stock for product: " + product.getName() +
                    ". Available: " + product.getStock() +
                    ", Requested: " + itemRequest.getQuantity());
            }

            // Deduct stock
            product.setStock(product.getStock() - itemRequest.getQuantity());
            productRepository.save(product);

            // Build OrderItem
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPriceAtPurchase(product.getPrice());

            orderItems.add(orderItem);

            // Add to total: price × quantity
            totalAmount = totalAmount.add(
                product.getPrice().multiply(
                    BigDecimal.valueOf(itemRequest.getQuantity())));
        }

        // Step 3: Create the Order
        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(totalAmount);
        order.setStatus(Order.OrderStatus.PENDING);

        // Step 4: Link each OrderItem back to this Order
        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }
        order.setOrderItems(orderItems);

        // Step 5: Save — cascades to OrderItems automatically
        Order savedOrder = orderRepository.save(order);

        return toDto(savedOrder);
    }

    // ── Get all orders for a user ─────────────────────────
    public List<OrderDto> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // ── Get single order by ID ────────────────────────────
    public OrderDto getOrderById(Long orderId, String userEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Order not found with id: " + orderId));

        // Security check — users can only see their own orders
        if (!order.getUser().getEmail().equals(userEmail)) {
            throw new BadRequestException("Access denied");
        }

        return toDto(order);
    }

    // ── Update order status (admin) ───────────────────────
    @Transactional
    public OrderDto updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Order not found with id: " + orderId));

        try {
            order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + status);
        }

        return toDto(orderRepository.save(order));
    }

    // ── Entity → DTO mapper ───────────────────────────────
    private OrderDto toDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setStatus(order.getStatus().name());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setCreatedAt(order.getCreatedAt());

        List<OrderItemDto> itemDtos = order.getOrderItems()
                .stream()
                .map(this::toItemDto)
                .collect(Collectors.toList());

        dto.setOrderItems(itemDtos);
        return dto;
    }

    private OrderItemDto toItemDto(OrderItem item) {
        OrderItemDto dto = new OrderItemDto();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setProductImageUrl(item.getProduct().getImageUrl());
        dto.setQuantity(item.getQuantity());
        dto.setPriceAtPurchase(item.getPriceAtPurchase());
        return dto;
    }
}