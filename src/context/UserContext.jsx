import React, { createContext, useContext, useState, useEffect } from "react";
import { authDataContext } from "./AuthContext";
import axios from "axios";

export const userDataContext = createContext();

function UserContext({ children }) {
  const { serverUrl } = useContext(authDataContext);

  // Restore user session immediately from localStorage to prevent logout on page refresh
  const [userData, setUserData] = useState(() => {
    try {
      const saved = localStorage.getItem("userData");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authLoading, setAuthLoading] = useState(true);

  const getCurrentUser = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/user/currentuser", {
        withCredentials: true,
      });
      if (result.data) {
        setUserData(result.data);
        localStorage.setItem("userData", JSON.stringify(result.data));
      }
    } catch (error) {
      console.log("getCurrentUser notice:", error?.message);
      // Preserve existing userData from localStorage - never force-logout the user
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [userData]);

  const value = {
    userData,
    setUserData,
    getCurrentUser,
    authLoading,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
