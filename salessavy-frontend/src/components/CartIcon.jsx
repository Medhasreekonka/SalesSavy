import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles.css';

export function CartIcon({ count }) {
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate('/UserCartPage');
  };

  return (
    <button
      type="button"
      className="cart-icon"
      onClick={handleCartClick}
      aria-label={`Shopping cart with ${count} items`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        stroke="currentColor"
        className="cart-icon-svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 1.9-1.4L22 7H6"
        />
        <circle cx="10" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
      </svg>

      {count > 0 && (
        <span className="cart-badge">
          {count}
        </span>
      )}
    </button>
  );
}