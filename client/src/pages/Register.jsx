import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      await register(phoneNumber, password, { username, email });
      navigate("/");
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="app-shell">
      <div
        className="phone-frame"
        style={{ justifyContent: "center", alignItems: "center", padding: 24 }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div className="logo-icon" style={{ margin: "0 auto 8px" }}>
            Z
          </div>
          <h1 style={{ textAlign: "center", margin: 0, fontSize: 24 }}>Create account</h1>
          <p style={{ textAlign: "center", color: "var(--text-muted)", margin: "0 0 8px" }}>
            Join and start chatting
          </p>
          {error && (
            <p role="alert" style={{ color: "var(--accent-2)", textAlign: "center", margin: 0 }}>
              {error}
            </p>
          )}
          <input
            className="auth-input"
            type="tel"
            placeholder="Phone number (e.g. +15551234567)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <input
            className="auth-input"
            placeholder="Display name (optional)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="auth-input"
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="gradient-btn"
            disabled={submitting}
            style={{ padding: "12px 0", marginTop: 6, opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? "Creating account..." : "Sign Up"}
          </button>
          <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
