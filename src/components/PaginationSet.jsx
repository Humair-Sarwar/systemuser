import { Box, Pagination, Typography } from "@mui/material";
import React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const PaginationSet = ({
  count,
  page,
  onPageChange,
  per_page,
  onPerPageChange,
  variant,
  color,
  from,
  to,
  total,
}) => {
  const handleChange = (event) => {
    setAge(event.target.value);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between !important",
        gap: 2,
        width: "100%",
        py: 1.75,
        px: 0.5,
      }}
    >
      {/* Left: Showing X-Y of Z */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          fontSize: "13px",
          fontWeight: 500,
          color: "#64748b",
        }}
      >
        <span>Showing</span>
        <Box
          component="span"
          sx={{
            px: 1.1,
            py: 0.3,
            borderRadius: "8px",
            backgroundColor: "#f1f5f9",
            border: "1px solid #e2e8f0",
            color: "#0f172a",
            fontWeight: 700,
            fontSize: "12.5px",
          }}
        >
          {from ?? 0}–{to ?? 0}
        </Box>
        <span>of</span>
        <Box
          component="span"
          sx={{
            px: 1.1,
            py: 0.3,
            borderRadius: "8px",
            backgroundColor: "#fff7ed",
            border: "1px solid #ffedd5",
            color: "#f97316",
            fontWeight: 700,
            fontSize: "12.5px",
          }}
        >
          {total ?? 0}
        </Box>
        <span>records</span>
      </Box>

      {/* Center: Modern Page Numbers */}
      <Pagination
        count={count}
        page={page}
        onChange={(e, value) => onPageChange(value)}
        variant={variant}
        color={color}
        sx={{
          "& .MuiPagination-ul": {
            gap: "6px",
          },
          "& .MuiPaginationItem-root": {
            minWidth: "34px",
            height: "34px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 600,
            color: "#475569",
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            margin: 0,
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "#f8fafc",
              borderColor: "#cbd5e1",
              color: "#0f172a",
            },
            "&.Mui-selected": {
              backgroundColor: "#0f172a !important",
              color: "#ffffff !important",
              borderColor: "#0f172a !important",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.2)",
              "&:hover": {
                backgroundColor: "#1e293b !important",
              },
            },
            "&.Mui-disabled": {
              opacity: 0.45,
              backgroundColor: "#f8fafc",
              borderColor: "#f1f5f9",
            },
          },
          "& .MuiPaginationItem-ellipsis": {
            border: "none",
            backgroundColor: "transparent",
          },
        }}
      />

      {/* Right: Records per page selector */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          fontSize: "13px",
          fontWeight: 600,
          color: "#64748b",
        }}
      >
        <Typography
          component="span"
          sx={{ fontSize: "13px", fontWeight: 600, color: "#64748b" }}
        >
          Records per page:
        </Typography>
        <FormControl size="small">
          <Select
            value={per_page}
            size="small"
            onChange={(e) => onPerPageChange(e.target.value)}
            sx={{
              height: "34px",
              minWidth: "68px",
              borderRadius: "10px",
              backgroundColor: "#f8fafc",
              fontSize: "13px",
              fontWeight: 700,
              color: "#0f172a",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e2e8f0",
              },
              "&:hover": {
                backgroundColor: "#ffffff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#cbd5e1",
                },
              },
              "&.Mui-focused": {
                backgroundColor: "#ffffff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0f172a",
                  borderWidth: "1.5px",
                },
              },
              "& .MuiSelect-select": {
                py: "6px",
                pl: "12px",
                pr: "28px !important",
              },
            }}
          >
            <MenuItem value={10} sx={{ fontSize: "13px", fontWeight: 500 }}>
              10
            </MenuItem>
            <MenuItem value={15} sx={{ fontSize: "13px", fontWeight: 500 }}>
              15
            </MenuItem>
            <MenuItem value={25} sx={{ fontSize: "13px", fontWeight: 500 }}>
              25
            </MenuItem>
            <MenuItem value={30} sx={{ fontSize: "13px", fontWeight: 500 }}>
              30
            </MenuItem>
            <MenuItem value={50} sx={{ fontSize: "13px", fontWeight: 500 }}>
              50
            </MenuItem>
            <MenuItem value={60} sx={{ fontSize: "13px", fontWeight: 500 }}>
              60
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default PaginationSet;
