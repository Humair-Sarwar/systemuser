import { TextField, Typography, Box } from "@mui/material";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import React from "react";

const TextFieldCommon = ({ errormessage, helperText, error, ...props }) => {
  const displayError = errormessage || (error ? helperText : null);

  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        {...props}
        error={Boolean(error)}
        autoComplete="off"
        id={props.name || "outlined-basic"}
        fullWidth
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
      />
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
};

export default TextFieldCommon;
