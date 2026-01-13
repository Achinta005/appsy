"use client";

import { jwtDecode } from "jwt-decode";

export const AUTH_TOKEN_KEY = "auth_token";

/**
 * Save JWT to localStorage
 */
export const setAuthToken = (token) => {
  if (typeof window === "undefined") return;

  if (token && token.split(".").length === 3) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
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
 * Check if token exists and is structurally valid
 */
export const hasValidToken = () => {
  const token = getAuthToken();
  return !!(token && token.split(".").length === 3);
};

/**
 * Decode user info from JWT
 */
export const getUserFromToken = (token) => {
  if (!token || token.split(".").length !== 3) return null;

  try {
    const decoded = jwtDecode(token);
    return {
      userId: decoded.id, // backend uses `sub`
      username: decoded.username,
      role: decoded.role,
      email: decoded.email, // exists in your JWT
    };
  } catch (err) {
    console.error("JWT decode failed:", err);
    return null;
  }
};
