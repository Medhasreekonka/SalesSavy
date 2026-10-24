package com.kodnest.demo.admincontrollers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kodnest.demo.adminservices.AdminProductService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/admin/products")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class AdminProductController {

    @Autowired
    private AdminProductService adminProductService;

    /**
     * Add a new product with image.
     */
    @PostMapping("/add")
    public ResponseEntity<?> addProduct(
            @RequestBody Map<String, Object> requestBody,
            HttpServletRequest request) {

        try {

            // Check authentication
            if (request.getAttribute("authenticatedUser") == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            // Validate request body
            if (requestBody == null) {
                return ResponseEntity
                        .badRequest()
                        .body("Product details are required");
            }

            // Read product fields
            String name =
                    requestBody.get("name") != null
                            ? requestBody.get("name").toString()
                            : null;

            String description =
                    requestBody.get("description") != null
                            ? requestBody.get("description").toString()
                            : null;

            Double price = null;

            if (requestBody.get("price") != null) {
                price = Double.parseDouble(
                        requestBody.get("price").toString());
            }

            Integer stock = null;

            if (requestBody.get("stock") != null) {
                stock = Integer.parseInt(
                        requestBody.get("stock").toString());
            }

            Integer categoryId = null;

            if (requestBody.get("categoryId") != null) {
                categoryId = Integer.parseInt(
                        requestBody.get("categoryId").toString());
            }

            String imageUrl =
                    requestBody.get("imageUrl") != null
                            ? requestBody.get("imageUrl").toString()
                            : null;

            // Call the actual service method
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            adminProductService.addProductWithImage(
                                    name,
                                    description,
                                    price,
                                    stock,
                                    categoryId,
                                    imageUrl
                            )
                    );

        } catch (NumberFormatException e) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid numeric value");

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unable to add product");
        }
    }

    /**
     * Delete a product.
     */
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteProduct(
            @RequestBody Map<String, Object> requestBody,
            HttpServletRequest request) {

        try {

            // Check authentication
            if (request.getAttribute("authenticatedUser") == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            // Validate request body
            if (requestBody == null
                    || requestBody.get("productId") == null) {

                return ResponseEntity
                        .badRequest()
                        .body("Product ID is required");
            }

            Integer productId;

            try {

                productId = Integer.parseInt(
                        requestBody
                                .get("productId")
                                .toString());

            } catch (NumberFormatException e) {

                return ResponseEntity
                        .badRequest()
                        .body("Invalid product ID");
            }

            // Call the actual service method
            adminProductService.deleteProduct(productId);

            return ResponseEntity.ok(
                    "Product deleted successfully");

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unable to delete product");
        }
    }
}