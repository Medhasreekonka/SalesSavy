package com.kodnest.demo.adminservices;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional; 

import com.kodnest.demo.Entity.Category;
import com.kodnest.demo.Entity.Product;
import com.kodnest.demo.Entity.ProductImage;
import com.kodnest.demo.Repository.CategoryRepository;
import com.kodnest.demo.Repository.ProductImageRepository;
import com.kodnest.demo.Repository.ProductRepository;

@Service
public class AdminProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final CategoryRepository categoryRepository;

    public AdminProductService(ProductRepository productRepository, ProductImageRepository productImageRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public Product addProductWithImage(
            String name,
            String description,
            Double price,
            Integer stock,
            Integer categoryId,
            String imageUrl) {

        // Validate product name
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Product name cannot be empty");
        }

        // Validate price
        if (price == null || price <= 0) {
            throw new IllegalArgumentException("Product price must be greater than 0");
        }

        // Validate stock
        if (stock == null || stock < 0) {
            throw new IllegalArgumentException("Product stock cannot be negative");
        }

        // Validate category ID
        if (categoryId == null) {
            throw new IllegalArgumentException("Category ID is required");
        }

        // Validate image URL
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("Product image URL cannot be empty");
        }

        // Check if category exists
        Optional<Category> category =
                categoryRepository.findById(categoryId);

        if (category.isEmpty()) {
            throw new IllegalArgumentException("Invalid category ID");
        }

        // Create product
        Product product = new Product();

        product.setName(name.trim());
        product.setDescription(description);
        product.setPrice(BigDecimal.valueOf(price));
        product.setStock(stock);
        product.setCategory(category.get());

        // Save product
        Product savedProduct = productRepository.save(product);

        // Create product image
        ProductImage productImage = new ProductImage();

        productImage.setProduct(savedProduct);
        productImage.setImageUrl(imageUrl.trim());

        productImageRepository.save(productImage);

        return savedProduct;
    }
    
    public void deleteProduct(Integer productId) {
        // Check if the product exists
        if (!productRepository.existsById(productId)) {
            throw new IllegalArgumentException("Product not found");
        }

        // Delete associated product images
        productImageRepository.deleteByProductId(productId);

        // Delete the product
        productRepository.deleteById(productId);
    }
}