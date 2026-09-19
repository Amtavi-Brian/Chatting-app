import React, { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    apiClient
      .get("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("access_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(phoneNumber, password) {
    const form = new URLSearchParams();
    form.append("username", phoneNumber);
    form.append("password", password);
    const { data } = await apiClient.post("/auth/login", form);
    localStorage.setItem("access_token", data.access_token);
    const { data: me } = await apiClient.get("/users/me");
    setUser(me);
  }

  async function register(phoneNumber, password, { username, email } = {}) {
    await apiClient.post("/auth/register", {
      phone_number: phoneNumber,
      username: username || undefined,
      email: email || undefined,
      password,
    });
    await login(phoneNumber, password);
  }

  function logout() {
    localStorage.removeItem("access_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
