package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.ApiResponse;
import com.ecommerce.backend.dto.ProductDto;
import com.ecommerce.backend.dto.ProductRequestDto;
import com.ecommerce.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService productService;

    // GET /api/products?page=0&size=10&sortBy=createdAt
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductDto>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy) {

        Page<ProductDto> products = productService.getAllProducts(page, size, sortBy);
        return ResponseEntity.ok(
            ApiResponse.success("Products fetched successfully", products));
    }

    // GET /api/products/search?keyword=iphone
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<ProductDto>>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<ProductDto> products = productService.searchProducts(keyword, page, size);
        return ResponseEntity.ok(
            ApiResponse.success("Search results fetched", products));
    }

    // GET /api/products/categories
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        List<String> categories = productService.getAllCategories();
        return ResponseEntity.ok(
            ApiResponse.success("Categories fetched", categories));
    }

    // GET /api/products/category/Electronics
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<Page<ProductDto>>> getByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<ProductDto> products = productService.getProductsByCategory(category, page, size);
        return ResponseEntity.ok(
            ApiResponse.success("Products fetched by category", products));
    }

    // GET /api/products/1
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> getProductById(@PathVariable Long id) {
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(
            ApiResponse.success("Product fetched successfully", product));
    }

    // POST /api/products
    @PostMapping
    public ResponseEntity<ApiResponse<ProductDto>> createProduct(
            @Valid @RequestBody ProductRequestDto request) {

        ProductDto product = productService.createProduct(request);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("Product created successfully", product));
    }

    // PUT /api/products/1
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequestDto request) {

        ProductDto product = productService.updateProduct(id, request);
        return ResponseEntity.ok(
            ApiResponse.success("Product updated successfully", product));
    }

    // DELETE /api/products/1
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(
            ApiResponse.success("Product deleted successfully", null));
    }
}

/* 
**🧠 Controller design decisions:**

- `@CrossOrigin(origins = "http://localhost:5173")` — allows our Vite frontend to call this API. Without this, the browser blocks the request due to CORS policy.
- `@RequestParam(defaultValue = "0")` — if the caller doesn't send `?page=0`, it defaults to 0. Makes the API forgiving.
- `@Valid` — triggers the validation annotations on `ProductRequestDto`. If `name` is blank, the request is rejected before it even reaches the service.
- `ResponseEntity` — gives us full control over the HTTP status code. `200 OK` for fetches, `201 CREATED` for new resources.

---

### 6.3 — Test the API in browser

Restart the app and open these URLs directly in your browser:

**All products:**
```
http://localhost:8080/api/products
```

**Single product:**
```
http://localhost:8080/api/products/1
```

**Search:**
```
http://localhost:8080/api/products/search?keyword=iphone
```

**Categories:**
```
http://localhost:8080/api/products/categories
```

**By category:**
```
http://localhost:8080/api/products/category/Electronics

*/