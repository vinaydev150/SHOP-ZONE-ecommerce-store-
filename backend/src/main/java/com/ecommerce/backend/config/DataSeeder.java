package com.ecommerce.backend.config;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {

        // ── Seed Users ──────────────────────────────────────
        if (userRepository.count() == 0) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

            User admin = new User();
            admin.setEmail("admin@store.com");
            admin.setPassword(encoder.encode("admin123"));
            admin.setName("Store Admin");
            admin.setRole(User.Role.ADMIN);

            User customer = new User();
            customer.setEmail("john@gmail.com");
            customer.setPassword(encoder.encode("john123"));
            customer.setName("John Doe");
            customer.setRole(User.Role.CUSTOMER);

            userRepository.saveAll(List.of(admin, customer));
            System.out.println("✅ Users seeded");
        }

        // ── Seed Products ────────────────────────────────────
        if (productRepository.count() == 0) {
            List<Product> products = List.of(

                // Electronics
                createProduct("iPhone 15 Pro", "Latest Apple smartphone with A17 chip and titanium design",
                    new BigDecimal("999.99"), 50, "Electronics",
                    "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500"),

                createProduct("Samsung Galaxy S24", "Flagship Android phone with AI features and 200MP camera",
                    new BigDecimal("849.99"), 40, "Electronics",
                    "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500"),

                createProduct("Sony WH-1000XM5", "Industry leading noise cancelling wireless headphones",
                    new BigDecimal("349.99"), 75, "Electronics",
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"),

                createProduct("MacBook Air M2", "Supercharged by M2 chip, incredibly thin and light laptop",
                    new BigDecimal("1099.99"), 30, "Electronics",
                    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500"),

                createProduct("iPad Pro 12.9", "The ultimate iPad experience with M2 chip",
                    new BigDecimal("799.99"), 35, "Electronics",
                    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500"),

                // Footwear
                createProduct("Nike Air Max 270", "Lightweight running shoes with Air cushioning",
                    new BigDecimal("129.99"), 120, "Footwear",
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"),

                createProduct("Adidas Ultraboost 23", "Responsive running shoe with Boost midsole",
                    new BigDecimal("189.99"), 90, "Footwear",
                    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500"),

                createProduct("Converse Chuck Taylor", "Classic canvas high top sneaker",
                    new BigDecimal("64.99"), 200, "Footwear",
                    "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=500"),

                // Books
                createProduct("Clean Code", "A handbook of agile software craftsmanship by Robert Martin",
                    new BigDecimal("42.99"), 60, "Books",
                    "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500"),

                createProduct("Spring Boot in Action", "Practical guide to building Spring Boot applications",
                    new BigDecimal("49.99"), 45, "Books",
                    "https://images.unsplash.com/photo-1589998059171-988d887df646?w=500"),

                createProduct("System Design Interview", "An insider guide to system design interviews",
                    new BigDecimal("39.99"), 80, "Books",
                    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500"),

                // Clothing
                createProduct("Levi's 501 Jeans", "Original straight fit jeans in classic blue denim",
                    new BigDecimal("69.99"), 150, "Clothing",
                    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500"),

                createProduct("The North Face Jacket", "Waterproof shell jacket for all conditions",
                    new BigDecimal("249.99"), 55, "Clothing",
                    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500")
            );

            productRepository.saveAll(products);
            System.out.println("✅ " + products.size() + " Products seeded");
        }
    }

    private Product createProduct(String name, String description,
                                   BigDecimal price, int stock,
                                   String category, String imageUrl) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(description);
        p.setPrice(price);
        p.setStock(stock);
        p.setCategory(category);
        p.setImageUrl(imageUrl);
        return p;
    }
}