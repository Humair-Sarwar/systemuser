import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export const isSystemUserAuthenticated = () => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("user_type");

  const hasValidToken =
    Boolean(token) &&
    token !== "undefined" &&
    token !== "null" &&
    token.trim() !== "";

  return hasValidToken && Number(userType) === 3;
};

const PrivateSystemUserRoute = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    isSystemUserAuthenticated()
  );

  useEffect(() => {
    setIsAuthenticated(isSystemUserAuthenticated());
  }, [location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/systemuser/login" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateSystemUserRoute;
