import React, { useEffect, useState } from "react";
import "./CartPage.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { apiFetch, API_BASE_URL } from "../services/api";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  const navigate = useNavigate();

  // Fetch cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await apiFetch("/api/cart/items");

        if (response.status === 401) {
          navigate("/");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }

        const data = await response.json();

        const items =
          data?.cart?.products ||
          data?.products ||
          [];

        setCartItems(
          Array.isArray(items)
            ? items.map((item) => ({
                ...item,
                total_price: Number(
                  item.total_price
                ).toFixed(2),
                price_per_unit: Number(
                  item.price_per_unit
                ).toFixed(2),
              }))
            : []
        );
      } catch (error) {
        console.error(
          "Error fetching cart items:",
          error
        );
      }
    };

    fetchCartItems();
  }, [navigate]);

  // Calculate subtotal
  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) =>
        sum + Number(item.total_price || 0),
      0
    );

    setSubtotal(total.toFixed(2));
  }, [cartItems]);

  // Remove item
  const handleRemoveItem = async (productId) => {
    try {
      const response = await apiFetch(
        "/api/cart/delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
          }),
        }
      );

      if (response.status === 401) {
        navigate("/");
        return;
      }

      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          message || "Failed to remove item"
        );
      }

      setCartItems((prevItems) =>
        prevItems.filter(
          (item) =>
            item.product_id !== productId
        )
      );
    } catch (error) {
      console.error(
        "Error removing item:",
        error
      );

      alert(
        error.message ||
          "Unable to remove item"
      );
    }
  };

  // Update quantity
  const handleQuantityChange = async (
    productId,
    newQuantity
  ) => {
    try {
      if (newQuantity <= 0) {
        await handleRemoveItem(productId);
        return;
      }

      const response = await apiFetch(
        "/api/cart/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            quantity: newQuantity,
          }),
        }
      );

      if (response.status === 401) {
        navigate("/");
        return;
      }

      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          message || "Failed to update quantity"
        );
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === productId
            ? {
                ...item,
                quantity: newQuantity,
                total_price: (
                  Number(item.price_per_unit) *
                  newQuantity
                ).toFixed(2),
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Error updating quantity:",
        error
      );

      alert(
        error.message ||
          "Unable to update quantity"
      );
    }
  };

  // Razorpay checkout
  const handleCheckout = async () => {
    try {
      if (cartItems.length === 0) {
        alert("Your cart is empty.");
        return;
      }

      /*
       * The backend calculates the actual order total.
       * Do NOT send totalAmount or cartItems here.
       */
      const response = await apiFetch(
        "/api/payment/create",
        {
          method: "POST",
        }
      );

      if (response.status === 401) {
        navigate("/");
        return;
      }

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || "Unable to create payment order"
        );
      }

      const razorpayOrderId =
        await response.text();

      const options = {
        key:
          import.meta.env
            .VITE_RAZORPAY_KEY_ID,

        currency: "INR",

        name: "SalesSavvy",

        description:
          "Women's Fashion Store",

        order_id: razorpayOrderId,

        handler: async function (
          razorpayResponse
        ) {
          try {
            const verifyResponse =
              await apiFetch(
                "/api/payment/verify",
                {
                  method: "POST",
                  headers: {
                    "Content-Type":
                      "application/json",
                  },
                  body: JSON.stringify({
                    razorpayOrderId:
                      razorpayResponse.razorpay_order_id,

                    razorpayPaymentId:
                      razorpayResponse.razorpay_payment_id,

                    razorpaySignature:
                      razorpayResponse.razorpay_signature,
                  }),
                }
              );

            const result =
              await verifyResponse.text();

            if (verifyResponse.ok) {
              alert(
                "Payment verified successfully!"
              );

              navigate("/customerhome");
            } else {
              alert(
                "Payment verification failed: " +
                  result
              );
            }
          } catch (error) {
            console.error(
              "Error verifying payment:",
              error
            );

            alert(
              "Payment verification failed. Please try again."
            );
          }
        },

        theme: {
          color: "#2F80ED",
        },
      };

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay checkout is not loaded"
        );
      }

      const razorpay =
        new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error(
        "Error during checkout:",
        error
      );

      alert(
        error.message ||
          "Payment failed. Please try again."
      );
    }
  };

  const totalProducts = () =>
    cartItems.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );

  // Free shipping for now so frontend,
  // backend and Razorpay totals remain consistent.
  const shipping = 0;

  const total = (
    Number(subtotal) + shipping
  ).toFixed(2);

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty">
        <h2>Your Cart is Empty</h2>

        <p>
          Add some items to get started!
        </p>

        <button
          type="button"
          className="checkout-button"
          onClick={() =>
            navigate("/customerhome")
          }
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw" }}>
      <Header
        cartCount={totalProducts()}
      />

      <div className="cart-container">
        <div className="cart-page">
          <button
            type="button"
            className="back-button"
            onClick={() =>
              navigate("/customerhome")
            }
          >
            ← Shopping Continue
          </button>

          <div className="cart-header">
            <h2>Shopping Cart</h2>

            <p>
              You have {cartItems.length} items
              in your cart
            </p>
          </div>

          <div className="cart-items">
            {cartItems.map((item) => (
              <div
                key={item.product_id}
                className="cart-item"
              >
                <img
                  src={
                    item.image_url
                      ? `${API_BASE_URL}${item.image_url}`
                      : "https://via.placeholder.com/80?text=No+Image"
                  }
                  alt={
                    item.name || "Product"
                  }
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/80?text=No+Image";
                  }}
                />

                <div className="item-details">
                  <div className="item-info">
                    <h3>{item.name}</h3>

                    <p>
                      {item.description}
                    </p>
                  </div>

                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(
                            item.product_id,
                            item.quantity - 1
                          )
                        }
                      >
                        -
                      </button>

                      <span className="quantity-display">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(
                            item.product_id,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    <span className="price">
                      ₹{item.total_price}
                    </span>

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() =>
                        handleRemoveItem(
                          item.product_id
                        )
                      }
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="checkout-section">
          <h2>Order Summary</h2>

          <div className="checkout-summary">
            <div className="summary-row">
              <span>Subtotal</span>

              <span>
                ₹{subtotal}
              </span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>

              <span>
                Free
              </span>
            </div>

            <div className="summary-row">
              <span>Total Products</span>

              <span>
                {totalProducts()}
              </span>
            </div>

            <div className="summary-row total">
              <span>Total</span>

              <span>
                ₹{total}
              </span>
            </div>

            <button
              type="button"
              className="checkout-button"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;