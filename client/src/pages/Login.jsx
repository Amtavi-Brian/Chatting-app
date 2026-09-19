import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError("Invalid username or password");
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
          <h1 style={{ textAlign: "center", margin: 0, fontSize: 24 }}>Welcome back</h1>
          <p style={{ textAlign: "center", color: "var(--text-muted)", margin: "0 0 8px" }}>
            Log in to continue chatting
          </p>
          {error && (
            <p role="alert" style={{ color: "var(--accent-2)", textAlign: "center", margin: 0 }}>
              {error}
            </p>
          )}
          <input
            className="auth-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="gradient-btn" style={{ padding: "12px 0", marginTop: 6 }}>
            Log In
          </button>
          <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
