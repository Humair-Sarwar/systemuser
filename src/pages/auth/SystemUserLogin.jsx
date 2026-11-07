import React from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  InputAdornment,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useFormik } from "formik";
import * as yup from "yup";
import TextFieldCommon from "../../components/TextFieldCommon";
import PassHideShow from "../../components/PassHideShow";
import { systemUserLoginApi } from "../../utils/apis/APIs";
import { handleError, handleSuccess } from "../../toast";

const SystemUserLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Enter a valid email address")
        .required("Email address is required"),
      password: yup
        .string()
        .min(5, "Password must be at least 5 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await systemUserLoginApi({
          email: values.email,
          password: values.password,
        });

        if (res && (res.status === 200 || res.data?.status === true)) {
          const data = res.data;
          handleSuccess("System User logged in successfully!");
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_id", data.user?.id);
          localStorage.setItem("user_type", data.user?.user_type);
          navigate("/systermuser/dashboard");
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
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#f8fafc",
        backgroundImage: `
          radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.08) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.08) 0px, transparent 50%),
          radial-gradient(at 50% 50%, rgba(241, 245, 249, 0.5) 0px, transparent 100%)
        `,
        py: { xs: 4, md: 6 },
        px: 2,
      }}
    >
      {/* Subtle decorative background circles */}
      <Box
        sx={{
          position: "absolute",
          top: "-120px",
          right: "-120px",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(147, 197, 253, 0.05) 100%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(199, 210, 254, 0.04) 100%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1, maxWidth: "460px !important" }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3.5, sm: 5 },
            borderRadius: "24px",
            backgroundColor: "#ffffff",
            border: "1px solid rgba(226, 232, 240, 0.8)",
            boxShadow: "0 20px 45px -10px rgba(15, 23, 42, 0.07), 0 10px 20px -5px rgba(15, 23, 42, 0.03)",
          }}
        >
          {/* Header & Logo */}
          <Box sx={{ textAlign: "center", mb: 3.5 }}>
            <Box
              sx={{
                width: 62,
                height: 62,
                borderRadius: "18px",
                backgroundColor: "#eff6ff",
                color: "#2563eb",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                boxShadow: "0 8px 16px rgba(37, 99, 235, 0.12)",
                border: "1px solid #dbeafe",
              }}
            >
              <AdminPanelSettingsIcon sx={{ fontSize: 34 }} />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
              <Chip
                icon={<VerifiedUserOutlinedIcon sx={{ fontSize: "14px !important", color: "#2563eb !important" }} />}
                label="System Administrator Access"
                size="small"
                sx={{
                  backgroundColor: "#eff6ff",
                  color: "#1e40af",
                  fontWeight: 600,
                  fontSize: "11.5px",
                  borderRadius: "20px",
                  height: 24,
                  border: "1px solid #dbeafe",
                }}
              />
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "22px", sm: "25px" },
                color: "#0f172a",
                letterSpacing: "-0.02em",
                mt: 0.5,
              }}
            >
              System User Login
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                mt: 0.75,
                fontSize: "13.5px",
                lineHeight: 1.5,
              }}
            >
              Enter your system credentials to access the central management console
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ mb: 2.5 }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1e293b",
                  mb: 0.75,
                }}
              >
                Email Address
              </Typography>
              <TextFieldCommon
                fullWidth
                name="email"
                placeholder="systemuser@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                errormessage={formik.touched.email && formik.errors.email}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f8fafc",
                    borderRadius: "12px",
                    transition: "all 0.2s ease",
                    "& fieldset": { borderColor: "#e2e8f0" },
                    "&:hover fieldset": { borderColor: "#cbd5e1" },
                    "&.Mui-focused": {
                      backgroundColor: "#ffffff",
                      "& fieldset": { borderColor: "#2563eb", borderWidth: "1.5px" },
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ mb: 3.5 }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1e293b",
                  mb: 0.75,
                }}
              >
                Password
              </Typography>
              <PassHideShow
                fullWidth
                name="password"
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                errormessage={formik.touched.password && formik.errors.password}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f8fafc",
                    borderRadius: "12px",
                    transition: "all 0.2s ease",
                    "& fieldset": { borderColor: "#e2e8f0" },
                    "&:hover fieldset": { borderColor: "#cbd5e1" },
                    "&.Mui-focused": {
                      backgroundColor: "#ffffff",
                      "& fieldset": { borderColor: "#2563eb", borderWidth: "1.5px" },
                    },
                  },
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              endIcon={!loading && <ArrowForwardRoundedIcon sx={{ fontSize: "18px !important" }} />}
              sx={{
                py: 1.4,
                borderRadius: "12px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                fontSize: "14.5px",
                fontWeight: 600,
                textTransform: "none",
                letterSpacing: "-0.01em",
                boxShadow: "0 10px 20px -5px rgba(37, 99, 235, 0.35)",
                transition: "all 0.25s ease",
                "&:hover": {
                  backgroundColor: "#1d4ed8",
                  boxShadow: "0 14px 24px -5px rgba(37, 99, 235, 0.45)",
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  transform: "translateY(0px)",
                },
              }}
            >
              {loading ? "Authenticating..." : "Sign In to System"}
            </Button>
          </form>

          {/* Footer note */}
          <Box
            sx={{
              mt: 3.5,
              pt: 2.5,
              borderTop: "1px solid #f1f5f9",
              textAlign: "center",
            }}
          >
            <Typography sx={{ color: "#94a3b8", fontSize: "12px", fontWeight: 500 }}>
              Authorized system operators only
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SystemUserLogin;
