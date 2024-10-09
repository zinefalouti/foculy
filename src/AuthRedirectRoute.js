import React from "react";
import { Navigate } from "react-router-dom";

const AuthRedirectRoute = ({ user, children }) => {
  if (user) {
    // If user is logged in, redirect away from login/signup pages to dashboard
    return <Navigate to="/dashboard" replace />;
  }
  
  // If user is not logged in, allow access to login/signup pages
  return children;
};

export default AuthRedirectRoute;
