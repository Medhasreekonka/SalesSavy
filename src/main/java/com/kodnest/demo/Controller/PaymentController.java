package com.kodnest.demo.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kodnest.demo.Entity.User;
import com.kodnest.demo.Service.PaymentService;
import com.razorpay.RazorpayException;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<String> createPaymentOrder(
            HttpServletRequest request) {

        try {

            User user =
                    (User) request.getAttribute(
                            "authenticatedUser");

            if (user == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            String razorpayOrderId =
                    paymentService.createOrder(
                            user.getUserId());

            return ResponseEntity.ok(
                    razorpayOrderId);

        } catch (RazorpayException e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unable to create payment order");

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unable to create payment order");
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(
            @RequestBody Map<String, Object> requestBody,
            HttpServletRequest request) {

        try {
            User user =
                    (User) request.getAttribute("authenticatedUser");

            if (user == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            int userId = user.getUserId();

            String razorpayOrderId =
                    (String) requestBody.get("razorpayOrderId");

            String razorpayPaymentId =
                    (String) requestBody.get("razorpayPaymentId");

            String razorpaySignature =
                    (String) requestBody.get("razorpaySignature");

            if (razorpayOrderId == null || razorpayOrderId.isBlank()
                    || razorpayPaymentId == null || razorpayPaymentId.isBlank()
                    || razorpaySignature == null || razorpaySignature.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body("Payment details are incomplete");
            }

            boolean isVerified =
                    paymentService.verifyPayment(
                            razorpayOrderId,
                            razorpayPaymentId,
                            razorpaySignature,
                            userId);

            if (isVerified) {
                return ResponseEntity.ok(
                        "Payment verified successfully");
            }

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Payment verification failed");

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error verifying payment");
        }
    }}
