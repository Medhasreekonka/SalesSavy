package com.kodnest.demo.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kodnest.demo.Entity.User;
import com.kodnest.demo.Service.CartService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true")
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/items/count")
    public ResponseEntity<?> getCartItemCount(
            HttpServletRequest request) {

        User user =
                (User) request.getAttribute("authenticatedUser");

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User not authenticated");
        }

        return ResponseEntity.ok(
                cartService.getCartItemCount(user.getUserId()));
    }

    @GetMapping("/items")
    public ResponseEntity<?> getCartItems(
            HttpServletRequest request) {

        User user =
                (User) request.getAttribute("authenticatedUser");

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User not authenticated");
        }

        return ResponseEntity.ok(
                cartService.getCartItems(user.getUserId()));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @RequestBody Map<String, Object> request,
            HttpServletRequest servletRequest) {

        try {

            User user =
                    (User) servletRequest
                            .getAttribute("authenticatedUser");

            if (user == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            if (request == null || !request.containsKey("productId")) {
                return ResponseEntity
                        .badRequest()
                        .body("Product ID is required");
            }

            int productId =
                    Integer.parseInt(
                            request.get("productId").toString());

            int quantity =
                    request.containsKey("quantity")
                            ? Integer.parseInt(
                                    request.get("quantity").toString())
                            : 1;

            cartService.addToCart(
                    user.getUserId(),
                    productId,
                    quantity);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .build();

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unable to add product to cart");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateCartItemQuantity(
            @RequestBody Map<String, Object> request,
            HttpServletRequest servletRequest) {

        try {

            User user =
                    (User) servletRequest
                            .getAttribute("authenticatedUser");

            if (user == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            if (request == null
                    || !request.containsKey("productId")
                    || !request.containsKey("quantity")) {

                return ResponseEntity
                        .badRequest()
                        .body("Product ID and quantity are required");
            }

            int productId =
                    Integer.parseInt(
                            request.get("productId").toString());

            int quantity =
                    Integer.parseInt(
                            request.get("quantity").toString());

            cartService.updateCartItemQuantity(
                    user.getUserId(),
                    productId,
                    quantity);

            return ResponseEntity.ok().build();

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unable to update cart");
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteCartItem(
            @RequestBody Map<String, Object> request,
            HttpServletRequest servletRequest) {

        try {

            User user =
                    (User) servletRequest
                            .getAttribute("authenticatedUser");

            if (user == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            if (request == null
                    || !request.containsKey("productId")) {

                return ResponseEntity
                        .badRequest()
                        .body("Product ID is required");
            }

            int productId =
                    Integer.parseInt(
                            request.get("productId").toString());

            cartService.deleteCartItem(
                    user.getUserId(),
                    productId);

            return ResponseEntity
                    .noContent()
                    .build();

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unable to remove cart item");
        }
    }
}