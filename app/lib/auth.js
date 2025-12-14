"use client";

import { jwtDecode } from "jwt-decode";

// ✅ Single source of truth
export const AUTH_TOKEN_KEY = "auth_token";

/**
 * Save JWT to localStorage
 */
export const setAuthToken = (token) => {
  if (typeof window === "undefined") return;

  if (token && token.split(".").length === 3) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    console.warn("Attempted to store invalid token:", token);
  }
};

/**
 * Get JWT from localStorage
 */
export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Remove JWT
 */
export const removeAuthToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!(token && token.split(".").length === 3);
};

/**
 * Decode user info from JWT
 */
export const getUserFromToken = () => {
  const token = getAuthToken();

  if (!token || token.split(".").length !== 3) return null;

  try {
    const decoded = jwtDecode(token);
    return {
      userId: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };
  } catch (err) {
    console.error("Error decoding token:", err);
    return null;
  }
};
