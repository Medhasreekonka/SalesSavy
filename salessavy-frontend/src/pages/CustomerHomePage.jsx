import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CategoryNavigation } from "../components/CategoryNavigation";
import ProductList from "../components/ProductList";

import { apiFetch } from "../services/api";

function CustomerHomePage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const toastTimerRef = useRef(null);

  const loadProducts = async (category = "") => {
    try {
      setLoading(true);
      setError("");

      const url = category
        ? `/api/products?category=${encodeURIComponent(category)}`
        : "/api/products";

      const response = await apiFetch(url);

      if (!response.ok) {
        throw new Error("Unable to fetch products");
      }

      const data = await response.json();

      setProducts(
        Array.isArray(data?.products)
          ? data.products
          : []
      );
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCartCount();
  }, []);

  const handleCategoryClick = (category) => {
    loadProducts(category);
  };

  const loadCartCount = async () => {
    try {
      const response = await apiFetch("/api/cart/items/count");

      if (response.status === 401) {
        setCartCount(0);
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to fetch cart count");
      }

      const data = await response.json();

      setCartCount(Number(data) || 0);
    } catch (err) {
      console.error("Error loading cart count:", err);
      setCartCount(0);
    }
  };

  const showCartMessage = (message) => {
    setCartMessage(message);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setCartMessage("");
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const response = await apiFetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });
      if (response.status === 401) {
        navigate("/");
        return;
      }
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to add product to cart");
      }
      await loadCartCount();
      showCartMessage("Product added to cart");
    } catch (err) {
      console.error("Error adding product to cart:", err);
      showCartMessage(err.message || "Unable to add product to cart");
    }
  };

  const handleViewCart = () => {
    navigate("/UserCartPage");
  };

  return (
    <>
      <Header
        cartCount={cartCount}
        onCartClick={handleViewCart}
      />

      <CategoryNavigation onCategoryClick={handleCategoryClick} />

      <main className="customer-home-page">
        <section className="hero-section">
          <div className="hero-content">
            <p className="hero-eyebrow">
              SALES SAVVY
            </p>

            <h1>
              Discover Your
              <br />
              Everyday Style
            </h1>

            <p>
              Explore fashion pieces curated for
              your wardrobe.
            </p>
          </div>
        </section>

        <section className="products-section">
          <div className="section-heading">
            <h2>Shop Our Collection</h2>

            <p>
              Find something you'll love.
            </p>
          </div>

          {loading && (
            <div className="loading-message">
              Loading products...
            </div>
          )}

          {!loading && error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            products.length === 0 && (
              <div className="empty-message">
                No products available.
              </div>
            )}

          {!loading &&
            !error &&
            products.length > 0 && (
              <ProductList
                products={products}
                onAddToCart={handleAddToCart}
              />
            )}
        </section>
      </main>
      {cartMessage && (
        <div className="cart-toast">
          <span>{cartMessage}</span>

          {cartMessage === "Product added to cart" && (
            <button
              type="button"
              onClick={handleViewCart}
              className="toast-cart-button"
            >
              View Cart
            </button>
          )}

          <button
            type="button"
            className="toast-close"
            onClick={() => {
              setCartMessage("");
              if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
            }}
          >
            ×
          </button>
        </div>
      )}
      <Footer />
    </>
  );
}

export default CustomerHomePage;