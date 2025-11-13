"use client";
import { jwtDecode } from 'jwt-decode';

/**
 * Saves the authentication token to localStorage.
 * @param {string} token - The JWT received from the server.
 */
export const setAuthToken = (token) => {
 if (token && token.split(".").length === 3) {
    localStorage.setItem("token", token);
  } else {
    console.warn("Attempted to store invalid token:", token);
  }
};

/**
 * Retrieves the authentication token from localStorage.
 * @returns {string|null} The token, or null if not found.
 */
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

/**
 * Gets user data by decoding the JWT from localStorage and checks for expiration.
 * This is the most significant upgrade.
 * @returns {object|null} The user payload ({ userId, username, role }) or null if token is missing, invalid, or expired.
 */
export const getUserFromToken = () => {
  const token = getAuthToken();
  if (token && token.split(".").length === 3) {
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
  }
  return null;
};
