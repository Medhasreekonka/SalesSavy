import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png";
import "../assets/styles.css";

export default function Logo({
  to = "/customerhome",
}) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="logo-container"
      onClick={() => navigate(to)}
    >
      <img
        src={logo}
        alt="SalesSavvy"
        className="logo-image"
        onError={(e) => {
          e.currentTarget.style.display =
            "none";
        }}
      />

      <span className="logo-text">
        SalesSavvy
      </span>
    </button>
  );
}