import React from "react";
import "../assets/styles.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <h3 className="footer-title">
            SalesSavvy
          </h3>

          <p className="footer-tagline">
            Your one-stop shop for women's fashion
          </p>
        </div>

        <div className="footer-links">
          <span>About Us</span>
          <span>Contact</span>
          <span>Terms of Service</span>
          <span>Privacy Policy</span>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © 2026 SalesSavvy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}