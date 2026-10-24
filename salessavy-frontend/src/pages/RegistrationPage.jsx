import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles.css";
import { apiFetch } from "../services/api";

export default function RegistrationPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    if (
      !username.trim() ||
      !email.trim() ||
      !password
    ) {
      setError(
        "Username, email and password are required"
      );
      return;
    }

    try {
      const response = await apiFetch(
        "/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        navigate("/");
      } else {
        throw new Error(
          data.error ||
            "Registration failed"
        );
      }
    } catch (err) {
      setError(
        err.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="page-container register-page">
      <div className="form-container">
        <h1 className="form-title">
          Register
        </h1>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSignUp}
          className="form-content"
        >
          <div className="form-group">
            <label
              htmlFor="username"
              className="form-label"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="email"
              className="form-label"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="password"
              className="form-label"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              className="form-input"
            />
          </div>

          <button
            type="submit"
            className="form-button"
          >
            Sign Up
          </button>
        </form>

        <p className="form-footer">
          Already a user?{" "}
          <a
            href="/"
            className="form-link"
          >
            Log in here
          </a>
        </p>
      </div>
    </div>
  );
}