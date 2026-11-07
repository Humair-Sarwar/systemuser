import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const isVendorAuthenticated = () => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("user_type");

  const hasValidToken =
    Boolean(token) &&
    token !== "undefined" &&
    token !== "null" &&
    token.trim() !== "";

  return hasValidToken && Number(userType) === 2;
};

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    isVendorAuthenticated(),
  );

  useEffect(() => {
    setIsAuthenticated(isVendorAuthenticated());
  }, [location.pathname]);

  useEffect(() => {
    const syncAuth = () => {
      setIsAuthenticated(isVendorAuthenticated());
    };

    window.addEventListener("storage", syncAuth);
    window.addEventListener("auth-unauthorized", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth-unauthorized", syncAuth);
    };
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
