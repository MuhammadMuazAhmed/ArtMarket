import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI, userAPI } from "../services/api";

// 1. Create the context
const UserContext = createContext();

// 2. Create a provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setUserType(parsedUser.role || "");
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setUserType(userData.role || "");
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Registration error in context:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
        details: error.response?.data || {},
        status: error.response?.status,
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setUserType("");
    setIsAuthenticated(false);
  };

  // Update user data
  const updateUser = (userData) => {
    // Merge to preserve existing fields when partial updates come back from backend
    setUser((prev) => {
      const merged = { ...(prev || {}), ...(userData || {}) };
      setUserType(merged.role || "");
      localStorage.setItem("user", JSON.stringify(merged));
      return merged;
    });
  };

  // ✅ Update user profile picture
  const updateProfilePic = (newPicUrl) => {
    setUser((prev) => {
      const updated = { ...(prev || {}), profilePic: newPicUrl };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  // Update user education
  const updateEducation = async (userId, education) => {
    try {
      const res = await userAPI.updateEducation(userId, education);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      return { success: true, user: res.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update education",
      };
    }
  };

  const value = {
    user,
    userType,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    updateProfilePic, // ✅ added here
    updateEducation,
    setUserType,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// 3. Create a custom hook for easy access
export const useUser = () => useContext(UserContext);
