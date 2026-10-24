package com.kodnest.demo.Service;

import java.math.BigDecimal;
import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kodnest.demo.Entity.CartItem;
import com.kodnest.demo.Entity.Order;
import com.kodnest.demo.Entity.OrderItem;
import com.kodnest.demo.Entity.OrderStatus;
import com.kodnest.demo.Repository.CartRepository;
import com.kodnest.demo.Repository.OrderItemRepository;
import com.kodnest.demo.Repository.OrderRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@Service
public class PaymentService {

    @Value("${razorpay.key_id}")
    private String razorpayKeyId;

    @Value("${razorpay.key_secret}")
    private String razorpayKeySecret;

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;

    public PaymentService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartRepository cartRepository) {

        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
    }

    @Transactional
    public String createOrder(int userId)
            throws RazorpayException {

        List<CartItem> cartItems =
                cartRepository.findCartItemsWithProductDetails(userId);

        if (cartItems == null || cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        BigDecimal calculatedTotal = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {

            if (cartItem.getQuantity() <= 0) {
                throw new IllegalArgumentException(
                        "Invalid cart quantity");
            }

            if (cartItem.getProduct() == null
                    || cartItem.getProduct().getPrice() == null) {

                throw new IllegalArgumentException(
                        "Invalid product in cart");
            }

            if (cartItem.getQuantity()
                    > cartItem.getProduct().getStock()) {

                throw new IllegalArgumentException(
                        "Requested quantity exceeds available stock");
            }

            BigDecimal itemTotal =
                    cartItem.getProduct()
                            .getPrice()
                            .multiply(
                                    BigDecimal.valueOf(
                                            cartItem.getQuantity()));

            calculatedTotal =
                    calculatedTotal.add(itemTotal);
        }

        if (calculatedTotal.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Order amount must be greater than zero");
        }

        RazorpayClient razorpayClient =
                new RazorpayClient(
                        razorpayKeyId,
                        razorpayKeySecret);

        JSONObject orderRequest = new JSONObject();

        orderRequest.put(
                "amount",
                calculatedTotal
                        .multiply(BigDecimal.valueOf(100))
                        .intValue());

        orderRequest.put("currency", "INR");

        orderRequest.put(
                "receipt",
                "txn_" + System.currentTimeMillis());

        com.razorpay.Order razorpayOrder =
                razorpayClient.orders.create(orderRequest);

        Order order = new Order();

        order.setOrderId(
                razorpayOrder.get("id"));

        order.setUserId(userId);

        order.setTotalAmount(
                calculatedTotal);

        order.setStatus(
                OrderStatus.PENDING);

        orderRepository.save(order);

        return razorpayOrder.get("id");
    }

    @Transactional
    public boolean verifyPayment(
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature,
            int userId) {

        try {

            JSONObject attributes =
                    new JSONObject();

            attributes.put(
                    "razorpay_order_id",
                    razorpayOrderId);

            attributes.put(
                    "razorpay_payment_id",
                    razorpayPaymentId);

            attributes.put(
                    "razorpay_signature",
                    razorpaySignature);

            boolean signatureValid =
                    com.razorpay.Utils.verifyPaymentSignature(
                            attributes,
                            razorpayKeySecret);

            if (!signatureValid) {
                return false;
            }

            Order order =
                    orderRepository
                            .findById(razorpayOrderId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Order not found"));

            if (order.getUserId() != userId) {
                return false;
            }

            if (order.getStatus()
                    == OrderStatus.SUCCESS) {

                return true;
            }

            if (order.getStatus()
                    != OrderStatus.PENDING) {

                return false;
            }

            order.setStatus(
                    OrderStatus.SUCCESS);

            orderRepository.save(order);

            List<CartItem> cartItems =
                    cartRepository
                            .findCartItemsWithProductDetails(
                                    userId);

            for (CartItem cartItem : cartItems) {

                OrderItem orderItem =
                        new OrderItem();

                orderItem.setOrder(order);

                orderItem.setProductId(
                        cartItem.getProduct()
                                .getProductId());

                orderItem.setQuantity(
                        cartItem.getQuantity());

                orderItem.setPricePerUnit(
                        cartItem.getProduct()
                                .getPrice());

                orderItem.setTotalPrice(
                        cartItem.getProduct()
                                .getPrice()
                                .multiply(
                                        BigDecimal.valueOf(
                                                cartItem.getQuantity())));

                orderItemRepository.save(
                        orderItem);
            }

            cartRepository
                    .deleteAllCartItemsByUserId(userId);

            return true;

        } catch (Exception e) {
            return false;
        }
    }
}