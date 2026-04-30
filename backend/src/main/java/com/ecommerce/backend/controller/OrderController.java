package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.ApiResponse;
import com.ecommerce.backend.dto.CreateOrderRequest;
import com.ecommerce.backend.dto.OrderDto;
import com.ecommerce.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    // POST /api/orders  — place a new order
    @PostMapping
    public ResponseEntity<ApiResponse<OrderDto>> placeOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal String userEmail) {

        OrderDto order = orderService.placeOrder(userEmail, request);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("Order placed successfully", order));
    }

    // GET /api/orders  — get current user's orders
    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderDto>>> getMyOrders(
            @AuthenticationPrincipal String userEmail) {

        List<OrderDto> orders = orderService.getUserOrders(userEmail);
        return ResponseEntity.ok(
            ApiResponse.success("Orders fetched successfully", orders));
    }

    // GET /api/orders/1  — get single order
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderById(
            @PathVariable Long id,
            @AuthenticationPrincipal String userEmail) {

        OrderDto order = orderService.getOrderById(id, userEmail);
        return ResponseEntity.ok(
            ApiResponse.success("Order fetched successfully", order));
    }

    // PUT /api/orders/1/status?status=SHIPPED  — admin updates status
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        OrderDto order = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(
            ApiResponse.success("Order status updated", order));
    }
}

/* 

**🧠 `@AuthenticationPrincipal String userEmail`** — remember in `JwtAuthFilter` we set the email as the principal in the security context? This annotation extracts it directly into the method parameter. No need to manually parse the token in the controller — Spring Security hands it to us cleanly.

---

### 8.3 — Test the Order API

First get a token by logging in via Thunder Client:
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "john@gmail.com",
  "password": "john123"
}
```

Copy the token from the response. Now place an order — add the token to the `Authorization` header:
```
POST http://localhost:8080/api/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Content-Type: application/json

{
  "items": [
    { "productId": 1, "quantity": 1 },
    { "productId": 3, "quantity": 2 }
  ]
}

*/