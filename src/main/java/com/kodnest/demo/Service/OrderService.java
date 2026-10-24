package com.kodnest.demo.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kodnest.demo.Entity.OrderItem;
import com.kodnest.demo.Entity.OrderStatus;
import com.kodnest.demo.Entity.Product;
import com.kodnest.demo.Entity.ProductImage;
import com.kodnest.demo.Entity.User;
import com.kodnest.demo.Repository.OrderItemRepository;
import com.kodnest.demo.Repository.ProductImageRepository;
import com.kodnest.demo.Repository.ProductRepository;

@Service
public class OrderService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    /**
     * Fetches all successful orders for a given user and returns the required response format.
     *
     * @param user The authenticated user object.
     * @return A map containing the user's role, username, and ordered products.
     */
    public Map<String, Object> getOrdersForUser(User user) {
    	if (user == null) {
    	    throw new IllegalArgumentException("User is required");
    	}
        // Fetch all successful order items for the user
    	List<OrderItem> orderItems =
    	        orderItemRepository.findSuccessfulOrderItemsByUserId(
    	                user.getUserId(),
    	                OrderStatus.SUCCESS);
    	
        // Prepare the response map
        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("role", user.getRole().name()); // Directly use the role as it is an enum mapped to a string

        // Transform order items into a list of product details
        List<Map<String, Object>> products = new ArrayList<>();
        for (OrderItem item : orderItems) {
            Product product = productRepository.findById(item.getProductId()).orElse(null);
            if (product == null) {
                continue; // Skip if the product does not exist
            }

            // Fetch the product image (if available)
            List<ProductImage> images = productImageRepository.findByProduct_ProductId(product.getProductId());
            String imageUrl = images.isEmpty() ? null : images.get(0).getImageUrl();

            // Create a product details map
            Map<String, Object> productDetails = new HashMap<>();
            productDetails.put("order_id", item.getOrder().getOrderId());
            productDetails.put("quantity", item.getQuantity());
            productDetails.put("total_price", item.getTotalPrice());
            productDetails.put("image_url", imageUrl);
            productDetails.put("product_id", product.getProductId());
            productDetails.put("name", product.getName());
            productDetails.put("description", product.getDescription());
            productDetails.put("price_per_unit", item.getPricePerUnit());

            products.add(productDetails);
        }

        // Add the products list to the response
        response.put("products", products);

        return response;
    }
}

