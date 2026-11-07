import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { Typography } from "@mui/material";

export default function PassHideShow({ errormessage, helperText, error, ...props }) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const inputId = `outlined-adornment-password-${props.name || "default"}`;
  const displayError = errormessage || (error ? helperText : null);

  return (
    <Box sx={{ width: "100%" }}>
      <FormControl
        variant="outlined"
        fullWidth
        error={Boolean(error)}
        sx={{
          marginTop: props.mb,
          "& label": {
            color: "#64748b",
            fontWeight: 500,
            fontSize: "14px",
          },
          "& label.Mui-focused": {
            color: "#0f172a",
            fontWeight: 600,
          },
          "& label.Mui-error": {
            color: "#ef4444",
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#f8fafc",
            fontSize: "14px",
            fontWeight: 500,
            color: "#0f172a",
            transition: "all 0.2s ease",
            "& fieldset": {
              borderColor: "#e2e8f0",
              borderWidth: "1.5px",
            },
            "&:hover": {
              backgroundColor: "#ffffff",
            },
            "&:hover fieldset": {
              borderColor: "#94a3b8",
            },
            "&.Mui-focused": {
              backgroundColor: "#ffffff",
              boxShadow: "0 0 0 4px rgba(15, 23, 42, 0.06)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#0f172a",
              borderWidth: "1.5px",
            },
            "&.Mui-error fieldset": {
              borderColor: "#ef4444",
            },
          },
          ...props.sx,
        }}
      >
        {props.label && <InputLabel htmlFor={inputId}>{props.label}</InputLabel>}
        <OutlinedInput
          id={inputId}
          type={showPassword ? "text" : "password"}
          {...props}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showPassword ? "hide the password" : "display the password"
                }
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                onMouseUp={handleMouseUpPassword}
                edge="end"
                size="small"
                sx={{
                  color: "#64748b",
                  mr: 0.25,
                  "&:hover": {
                    color: "#0f172a",
                    backgroundColor: "rgba(15, 23, 42, 0.05)",
                  },
                }}
              >
                {showPassword ? (
                  <VisibilityOff sx={{ fontSize: "20px" }} />
                ) : (
                  <Visibility sx={{ fontSize: "20px" }} />
                )}
              </IconButton>
            </InputAdornment>
          }
          label={props.label}
        />
      </FormControl>
      {error && displayError && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mt: 0.6,
            ml: 0.5,
          }}
        >
          <ErrorOutlineRoundedIcon sx={{ fontSize: "14px", color: "#ef4444" }} />
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#ef4444",
              lineHeight: 1.3,
            }}
          >
            {displayError}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
