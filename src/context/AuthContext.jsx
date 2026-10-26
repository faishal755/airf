import React, { createContext, useState } from "react";
import axios from "axios";

export const authDataContext = createContext();

// Automatically attach Bearer token and credentials to all axios requests
axios.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
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
  // Vite's same-origin proxy to Render. This guarantees cookies are NEVER blocked by Chrome!
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
