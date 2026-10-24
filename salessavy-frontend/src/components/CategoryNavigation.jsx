import React from "react";
import "../assets/styles.css";

export function CategoryNavigation({ onCategoryClick }) {
  const categories = [
    "Dresses",
    "Kurtis",
    "Tops",
    "Bottom Wear",
    "Accessories",
  ];

  return (
    <nav className="category-navigation">
      <div className="category-list">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className="category-item"
            onClick={() => onCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </nav>
  );
}