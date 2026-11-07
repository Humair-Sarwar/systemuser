import React from "react";
import {
  Box,
  Button,
  CardMedia,
  Typography,
  Container,
  Paper,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { useFormik } from "formik";
import * as yup from "yup";
import TextFieldCommon from "../../components/TextFieldCommon";
import PassHideShow from "../../components/PassHideShow";
import { vendorLoginApi } from "../../utils/apis/APIs";
import { handleError, handleSuccess } from "../../toast";

const VendorLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().email("Enter a valid email").required("Email is required"),
      password: yup.string().min(5, "Password must be at least 5 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await vendorLoginApi({
          email: values.email,
          password: values.password,
        });

        if (res && (res.status === 200 || res.data?.status === true)) {
          const data = res.data;
          handleSuccess("Vendor logged in successfully!");
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_id", data.user?.id);
          localStorage.setItem("user_type", data.user?.user_type);
          navigate("/vendor/dashboard");
        } else {
          const msg =
            res?.response?.data?.message ||
            res?.data?.message ||
            "Invalid email or password";
          handleError(msg);
        }
      } catch (err) {
        handleError("Unable to login. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f6f9",
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 20px 40px rgba(15, 23, 42, 0.06)",
            backgroundColor: "#ffffff",
          }}
        >
          {/* Logo / Brand Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "16px",
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <StorefrontIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "24px", sm: "28px" },
                color: "#0f172a",
                letterSpacing: "-0.02em",
              }}
            >
              Vendor & Staff Portal
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#64748b", mt: 0.75, fontSize: "14px" }}
            >
              Sign in to manage your inventory, point of sale, and store orders
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ mb: 2.5 }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#334155",
                  mb: 0.75,
                }}
              >
                Email Address
              </Typography>
              <TextFieldCommon
                fullWidth
                name="email"
                placeholder="vendor@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#334155",
                  mb: 0.75,
                }}
              >
                Password
              </Typography>
              <PassHideShow
                fullWidth
                name="password"
                placeholder="Enter password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: "12px",
                backgroundColor: "#dc2626",
                fontSize: "15px",
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 10px 20px rgba(220, 38, 38, 0.2)",
                "&:hover": {
                  backgroundColor: "#b91c1c",
                  boxShadow: "0 14px 28px rgba(220, 38, 38, 0.3)",
                },
              }}
            >
              {loading ? "Signing in..." : "Sign In to Dashboard"}
            </Button>
          </form>

          {/* POS Quick Shortcut */}
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              color: "#64748b",
              fontSize: "13px",
            }}
          >
            <PointOfSaleIcon sx={{ fontSize: 18, color: "#64748b" }} />
            <span>POS terminal authentication enabled</span>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default VendorLogin;
