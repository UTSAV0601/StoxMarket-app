// src/context/AuthContext.jsx
import React, { createContext, useContext, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  // axios instance with Authorization header
  const api = useMemo(() => {
    const instance = axios.create({ baseURL: API_BASE });
    instance.interceptors.request.use((config) => {
      const t = localStorage.getItem("token");
      if (t) config.headers.Authorization = `Bearer ${t}`;
      return config;
    });
    return instance;
  }, []);

  const login = async (username, password) => {
    const form = new FormData();
    form.append("username", username);
    form.append("password", password);
    const res = await axios.post(`${API_BASE}/auth/login`, form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    const t = res.data?.access_token;
    if (!t) throw new Error("No token received");

    setToken(t);
    localStorage.setItem("token", t);

    const u = { username };
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
    return u;
  };

  const signup = async (username, password, email = null) => {
    await axios.post(`${API_BASE}/auth/signup`, { username, password, email });
    return login(username, password);
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, signup, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
};
