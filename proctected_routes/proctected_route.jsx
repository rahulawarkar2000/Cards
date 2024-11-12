import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { pathname } = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Track authentication state
  const token = localStorage.getItem('token');

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'token') {
        localStorage.removeItem('token'); // Remove the token from local storage
        setIsAuthenticated(false); // Set authentication state to false
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange); // Clean up the event listener
    };
  }, []);

  // Function to decode the JWT
  const decodeToken = (token) => {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null; // Ensure it's a valid JWT format
    const payload = parts[1];
    return JSON.parse(atob(payload)); // Decode from Base64URL
  };

  // Function to check if the token is modified
  const isTokenModified = (token) => {
    if (!token) return true; // Token is null or undefined
    const parts = token.split('.');
    if (parts.length !== 3) return true; // Not a valid JWT

    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp || !decoded.userId) return true; // Malformed token

    return false; // Token is valid
  };

  // Check if the user is trying to access the dashboard without a token
  if (!token && ["/dashboard"].includes(pathname)) {
    return <Navigate to="/" />; // Redirect to login if no token
  }

  // If a token exists, check its validity
  if (token) {
    // Check if the token has been modified
    if (isTokenModified(token)) {
      localStorage.removeItem('token'); // Remove the invalid token
      setIsAuthenticated(false); // Set authentication state to false
    }

    const decodedToken = decodeToken(token); // Decode the token
    const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

    // Check if the token is expired
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('token'); // Remove the invalid token
      setIsAuthenticated(false); // Set authentication state to false
    }
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // If the token is valid, render the protected component
  return children;
};

export default ProtectedRoute;
