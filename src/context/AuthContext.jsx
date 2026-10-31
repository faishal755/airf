import React, { createContext, useState } from "react";
import axios from "axios";

export const authDataContext = createContext();

// Automatically attach Bearer token and credentials to all axios requests
axios.interceptors.request.use((config) => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      // Fallback: check if token was saved inside the userData object
      const savedUser = localStorage.getItem("userData");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          token = parsed?.token;
          if (token) {
            localStorage.setItem("token", token);
          }
        } catch {
          // ignore parse errors
        }
      }
    }

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error("Error reading token:", e);
  }
  config.withCredentials = true;
  return config;
});

function AuthContext({ children }) {
  // When running locally in Vite dev mode, use relative URL "" so requests go through 
  // Vite's proxy (to localhost:8000)
  const isDev =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  const serverUrl = isDev ? "" : "https://airbe.onrender.com";

  let [loading, setLoading] = useState(false);
  let value = {
    serverUrl,
    loading,
    setLoading,
  };
  return (
    <div>
      <authDataContext.Provider value={value}>
        {children}
      </authDataContext.Provider>
    </div>
  );
}

export default AuthContext;
