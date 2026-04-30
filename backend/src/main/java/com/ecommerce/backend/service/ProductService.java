package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProductDto;
import com.ecommerce.backend.dto.ProductRequestDto;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // ── Get all products (paginated) ──────────────────────
    public Page<ProductDto> getAllProducts(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        return productRepository.findAll(pageable)
                .map(this::toDto);
    }

    // ── Get products by category ──────────────────────────
    public Page<ProductDto> getProductsByCategory(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return productRepository.findByCategory(category, pageable)
                .map(this::toDto);
    }

    // ── Search products by name ───────────────────────────
    public Page<ProductDto> searchProducts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByNameContainingIgnoreCase(keyword, pageable)
                .map(this::toDto);
    }

    // ── Get single product ────────────────────────────────
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Product not found with id: " + id));
        return toDto(product);
    }

    // ── Get all categories ────────────────────────────────
    public List<String> getAllCategories() {
        return productRepository.findDistinctCategories();
    }

    // ── Create product (admin only) ───────────────────────
    public ProductDto createProduct(ProductRequestDto request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        return toDto(productRepository.save(product));
    }

    // ── Update product (admin only) ───────────────────────
    public ProductDto updateProduct(Long id, ProductRequestDto request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Product not found with id: " + id));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());

        return toDto(productRepository.save(product));
    }

    // ── Delete product (admin only) ───────────────────────
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Product not found with id: " + id));
        productRepository.delete(product);
    }

    // ── Entity → DTO mapper ───────────────────────────────
    private ProductDto toDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());
        dto.setImageUrl(product.getImageUrl());
        dto.setCategory(product.getCategory());
        dto.setCreatedAt(product.getCreatedAt());
        return dto;
    }
}

/*
Page<ProductDto> — pagination is built in. Instead of returning all 1000 products at once, we return 10 at a time. The Page object also contains metadata — total pages, total elements, current page — which the frontend uses to render pagination controls.
.map(this::toDto) — transforms every Product entity in the page into a ProductDto cleanly in one line.
orElseThrow — if product doesn't exist, immediately throws ResourceNotFoundException which our GlobalExceptionHandler catches and returns a clean 404 JSON.
*/