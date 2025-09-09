// src/services/api.js

import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized access
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/Login";
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
};

// Artwork API calls
export const artworkAPI = {
  create: (artworkData) => {
    // Check if artworkData is FormData (for file uploads)
    const isFormData = artworkData instanceof FormData;

    // Set the correct content type for FormData
    const headers = isFormData
      ? {
          "Content-Type": "multipart/form-data",
        }
      : {};

    return api.post("/artworks/create", artworkData, { headers });
  },
  getAll: (params) => api.get("/artworks", { params }),
  getById: (id) => api.get(`/artworks/${id}`),
  update: (id, artworkData) => {
    // Check if artworkData is FormData (for file uploads)
    const isFormData = artworkData instanceof FormData;

    // Set the correct content type for FormData
    const headers = isFormData
      ? {
          "Content-Type": "multipart/form-data",
        }
      : {};

    return api.put(`/artworks/${id}`, artworkData, { headers });
  },
  delete: (id) => api.delete(`/artworks/${id}`),
};

// User API calls
export const userAPI = {
  getProfile: (userId) => api.get(`/users/${userId}`),
  updateEducation: (userId, education) =>
    api.put(`/users/${userId}/education`, { education }),
  updateSkills: (userId, skills) =>
    api.put(`/users/${userId}/skills`, { skills }),
  updateContact: (userId, contactInfo) =>
    api.put(`/users/${userId}/contact`, { contactInfo }),
  updateProfile: (userId, profileData) => {
    const isFormData =
      typeof FormData !== "undefined" && profileData instanceof FormData;
    const headers = isFormData ? { "Content-Type": "multipart/form-data" } : {};
    return api.put(`/users/${userId}/profile`, profileData, { headers });
  },
};

// Purchase API calls
export const purchaseAPI = {
  createPurchase: (artworkId, buyerName, buyerEmail) =>
    api.post("/purchases", { artworkId, buyerName, buyerEmail }),
  getPurchaseHistory: (type) =>
    api.get("/purchases/history", { params: { type } }),
  getPurchaseById: (id) => api.get(`/purchases/${id}`),
};

export default api;
