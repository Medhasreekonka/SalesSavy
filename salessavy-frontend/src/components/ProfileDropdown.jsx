import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useravatar from "./useravatar.png";
import "../assets/styles.css";
import { apiFetch } from "../services/api";

export function ProfileDropdown({
  username,
}) {
  const [isOpen, setIsOpen] =
    useState(false);

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen((previous) => !previous);
  };

  const handleLogout = async () => {
    try {
      await apiFetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );
    } catch (error) {
      console.error(
        "Logout request failed:",
        error
      );
    } finally {
      navigate("/");
    }
  };

  const handleOrdersClick = () => {
    setIsOpen(false);
    navigate("/orders");
  };

  return (
    <div className="profile-dropdown">
      <button
        type="button"
        className="profile-button"
        onClick={toggleDropdown}
      >
        <img
          src={useravatar}
          alt="User Avatar"
          className="user-avatar"
          onError={(e) => {
            e.currentTarget.style.display =
              "none";
          }}
        />

        <span className="username">
          {username || "Guest"}
        </span>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <button
            type="button"
            onClick={handleOrdersClick}
          >
            Orders
          </button>

          <button
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}