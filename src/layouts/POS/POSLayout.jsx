import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import { apiAuth } from "../../utils/apis/api-client";

const POSLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Verify token & vendor role on POS mount and route transitions
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("user_type");

    if (
      !token ||
      token === "undefined" ||
      token === "null" ||
      Number(userType) !== 2
    ) {
      navigate("/login", { replace: true });
      return;
    }

    const controller = new AbortController();
    apiAuth
      .get("/api/user", { signal: controller.signal })
      .then((res) => {
        if (res?.data?.user_type && Number(res.data.user_type) !== 2) {
          localStorage.removeItem("token");
          localStorage.removeItem("user_id");
          localStorage.removeItem("user_type");
          navigate("/login", { replace: true });
        }
      })
      .catch((err) => {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user_id");
          localStorage.removeItem("user_type");
          navigate("/login", { replace: true });
        }
      });

    return () => controller.abort();
  }, [location.pathname, navigate]);

  useEffect(() => {
    nprogress.configure({ showSpinner: false, speed: 400 });
    nprogress.start();
    const timer = setTimeout(() => {
      nprogress.done();
    }, 100);
    return () => {
      clearTimeout(timer);
      nprogress.done();
    };
  }, [location.pathname]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        bgcolor: "#f1f5f9",
        fontFamily: "'Poppins', sans-serif",
        "& *": {
          fontFamily: "'Poppins', sans-serif !important",
        },
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default POSLayout;
