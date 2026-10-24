import React, {
  useEffect,
  useState,
} from "react";

import {
  CategoryNavigation,
} from "../components/CategoryNavigation";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

import {
  apiFetch,
  API_BASE_URL,
} from "../services/api";

import "../assets/styles.css";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [cartCount, setCartCount] =
    useState(0);

  const [cartError, setCartError] =
    useState(false);

  const [isCartLoading, setIsCartLoading] =
    useState(true);

  useEffect(() => {
    fetchOrders();
    fetchCartCount();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await apiFetch("/api/orders");

      if (response.status === 401) {
        setError(
          "Please log in to view your orders."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to fetch orders"
        );
      }

      const data =
        await response.json();

      setOrders(
        Array.isArray(data.products)
          ? data.products
          : []
      );
    } catch (err) {
      console.error(
        "Error fetching orders:",
        err
      );

      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    setIsCartLoading(true);

    try {
      const response =
        await apiFetch(
          "/api/cart/items/count"
        );

      if (response.status === 401) {
        setCartCount(0);
        setCartError(false);
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to fetch cart count"
        );
      }

      const count =
        await response.json();

      setCartCount(
        Number(count) || 0
      );

      setCartError(false);
    } catch (error) {
      console.error(
        "Error fetching cart count:",
        error
      );

      setCartError(true);
    } finally {
      setIsCartLoading(false);
    }
  };

  return (
    <div className="maindiv">
      <div className="customer-homepage">
        <Header
          cartCount={
            isCartLoading
              ? "..."
              : cartError
                ? "Error"
                : cartCount
          }
        />

        <CategoryNavigation />

        <main className="main-content">
          <h1 className="form-title">
            Your Orders
          </h1>

          {loading && (
            <p>Loading orders...</p>
          )}

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {!loading &&
            !error &&
            orders.length === 0 && (
              <p>
                No orders found. Start
                shopping now!
              </p>
            )}

          {!loading &&
            !error &&
            orders.length > 0 && (
              <div className="orders-list">
                {orders.map(
                  (order, index) => (
                    <div
                      key={`${order.order_id}-${order.product_id}-${index}`}
                      className="order-card"
                    >
                      <div className="order-card-header">
                        <h3>
                          Order Id :{" "}
                          {order.order_id}
                        </h3>
                      </div>

                      <div className="order-card-body">
                        <img
                          src={
                            order.image_url
                              ? `${API_BASE_URL}${order.image_url}`
                              : "https://via.placeholder.com/80?text=No+Image"
                          }
                          alt={
                            order.name ||
                            "Product"
                          }
                          className="order-product-image"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/80?text=No+Image";
                          }}
                        />

                        <div className="order-details">
                          <h3 className="product-name">
                            ProductName :{" "}
                            {order.name}
                          </h3>

                          <h3>
                            Description :{" "}
                            {order.description}
                          </h3>

                          <h3>
                            Quantity :{" "}
                            {order.quantity}
                          </h3>

                          <h3>
                            Price per Unit : ₹
                            {Number(
                              order.price_per_unit
                            ).toFixed(2)}
                          </h3>

                          <h3>
                            Total Price : ₹
                            {Number(
                              order.total_price
                            ).toFixed(2)}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
        </main>

        <Footer />
      </div>
    </div>
  );
}