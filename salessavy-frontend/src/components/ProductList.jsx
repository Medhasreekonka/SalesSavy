import React from "react";
import "../assets/styles.css";
import { API_BASE_URL } from "../services/api";

export default function ProductList({ products, onAddToCart }) {
  if (!products || products.length === 0) {
    return <p className="no-products">No products available.</p>;
  }

  return (
    <div className="product-list">
      <div className="product-grid">
        {products.map((product) => {
          const imageUrl =
            product.images?.length > 0
              ? `${API_BASE_URL}${product.images[0]}`
              : "https://via.placeholder.com/150";

          const stock = Number(product.stock) || 0;

          return (
            <div
              key={product.product_id}
              className="product-card"
            >
              <img
                src={imageUrl}
                alt={product.name || "Product"}
                className="product-image"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/150";
                }}
              />

              <div className="product-info">
                <h3 className="product-name">
                  {product.name}
                </h3>

                <p className="product-description">
                  {product.description}
                </p>

                <p className="product-price">
                  ₹{Number(product.price).toFixed(2)}
                </p>

                {stock > 0 ? (
                  <button
                    type="button"
                    className="add-to-cart-btn"
                    onClick={() =>
                      onAddToCart(product.product_id)
                    }
                  >
                    Add to Cart
                  </button>
                ) : (
                  <button
                    type="button"
                    className="add-to-cart-btn"
                    disabled
                  >
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}