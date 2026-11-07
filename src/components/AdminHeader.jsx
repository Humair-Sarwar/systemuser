import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router";

// Icons
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

const THEME_STORAGE_KEY = "themeMode";

const AdminHeader = ({ handleLeftSidebar }) => {
  const navigation = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [themeMode, setThemeMode] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return saved === "dark" || saved === "light" ? saved : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    } catch {
      // Ignore storage write errors
    }

    if (themeMode === "dark") {
      document.body.classList.add("admin-dark-mode");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.body.classList.remove("admin-dark-mode");
      document.documentElement.setAttribute("data-theme", "light");
    }

    return () => {
      document.body.classList.remove("admin-dark-mode");
    };
  }, [themeMode]);

  const isDark = themeMode === "dark";

  return (
    <header
      className="admin-header"
      style={{
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        backgroundColor: isDark ? "#111827" : "#ffffff",
        borderBottom: isDark ? "1px solid #1e293b" : "1px solid #f1f5f9",
        boxShadow: isDark
          ? "0 2px 14px rgba(0, 0, 0, 0.28)"
          : "0 1px 4px rgba(0, 0, 0, 0.03)",
        gap: "16px",
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        boxSizing: "border-box",
        zIndex: 1100,
        transition: "background-color 0.25s ease, border-color 0.25s ease",
      }}
    >
      {/* Left Side: Mobile Menu Trigger + Modern Pill Search Bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
        <IconButton
          onClick={handleLeftSidebar}
          className="menu-mobile-btn"
          size="small"
          sx={{
            mr: 0.5,
            width: 38,
            height: 38,
            borderRadius: "10px",
            border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
            color: isDark ? "#f8fafc" : "#0f172a",
            bgcolor: isDark ? "#1e293b" : "#f8fafc",
            "&:hover": {
              bgcolor: isDark ? "#334155" : "#f1f5f9",
              borderColor: isDark ? "#475569" : "#cbd5e1",
            },
          }}
        >
          <MenuIcon sx={{ fontSize: "20px" }} />
        </IconButton>

        {/* Pill Search Bar */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            bgcolor: isDark ? "#0f172a" : "#f8fafc",
            border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
            borderRadius: "9999px",
            px: 1.8,
            py: 0.5,
            width: { sm: "260px", md: "360px", lg: "420px" },
            transition: "all 0.2s ease",
            "&:focus-within": {
              bgcolor: isDark ? "#0b0f19" : "#ffffff",
              borderColor: isDark ? "#10b981" : "#0f172a",
              boxShadow: isDark
                ? "0 0 0 3px rgba(16, 185, 129, 0.15)"
                : "0 0 0 3px rgba(15, 23, 42, 0.06)",
            },
          }}
        >
          <SearchIcon sx={{ color: "#94a3b8", fontSize: "19px", mr: 1 }} />
          <InputBase
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flex: 1,
              fontSize: "13px",
              fontWeight: 500,
              color: isDark ? "#f8fafc" : "#0f172a",
              fontFamily: "'Poppins', sans-serif",
              "& input::placeholder": {
                color: "#94a3b8",
                opacity: 1,
              },
            }}
          />

          {/* Shortcut Chip */}
          <Box
            sx={{
              px: 0.8,
              py: 0.15,
              borderRadius: "6px",
              bgcolor: isDark ? "#1e293b" : "#ffffff",
              border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
              fontSize: "10.5px",
              fontWeight: 600,
              color: isDark ? "#94a3b8" : "#64748b",
              mr: 0.6,
              lineHeight: 1.3,
              userSelect: "none",
            }}
          >
            ⌘S
          </Box>

          {/* Filter Icon */}
          <IconButton
            size="small"
            sx={{
              p: 0.4,
              color: isDark ? "#94a3b8" : "#64748b",
              "&:hover": {
                color: isDark ? "#f8fafc" : "#0f172a",
                bgcolor: isDark ? "#334155" : "#e2e8f0",
              },
            }}
          >
            <TuneIcon sx={{ fontSize: "17px" }} />
          </IconButton>
        </Box>
      </Box>

      {/* Right Side: Action Buttons + Theme Toggle + Notifications */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
        {/* Browse Web Button */}
        <Button
          component="a"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          startIcon={<TravelExploreIcon sx={{ fontSize: "18px !important" }} />}
          sx={{
            px: 2.2,
            py: 0.8,
            textTransform: "none",
            fontSize: "13px",
            fontWeight: 600,
            borderRadius: "9999px",
            bgcolor: isDark ? "#10b981" : "#0f172a",
            color: "#ffffff",
            boxShadow: isDark
              ? "0 4px 12px rgba(16, 185, 129, 0.25)"
              : "0 4px 12px rgba(15, 23, 42, 0.18)",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              bgcolor: isDark ? "#059669" : "#1e293b",
              boxShadow: isDark
                ? "0 6px 16px rgba(16, 185, 129, 0.35)"
                : "0 6px 16px rgba(15, 23, 42, 0.26)",
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          }}
        >
          Browse Web
        </Button>

        

        {/* Divider */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: "1px",
            height: "24px",
            bgcolor: isDark ? "#334155" : "#e2e8f0",
            mx: 0.5,
          }}
        />

        {/* Light / Dark Mode Pill Toggle */}
        <Tooltip
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          arrow
        >
          <Box
            onClick={() => setThemeMode(isDark ? "light" : "dark")}
            role="button"
            aria-label="Toggle theme mode"
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: isDark ? "#0f172a" : "#f1f5f9",
              border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
              borderRadius: "9999px",
              p: 0.35,
              cursor: "pointer",
              userSelect: "none",
              transition: "all 0.2s ease",
            }}
          >
            <Box
              onClick={(e) => {
                e.stopPropagation();
                setThemeMode("light");
              }}
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: !isDark ? "#0f172a" : "transparent",
                color: !isDark ? "#ffffff" : "#64748b",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: !isDark ? "#ffffff" : "#cbd5e1",
                },
              }}
            >
              <LightModeOutlinedIcon sx={{ fontSize: "15px" }} />
            </Box>
            <Box
              onClick={(e) => {
                e.stopPropagation();
                setThemeMode("dark");
              }}
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: isDark ? "#10b981" : "transparent",
                color: isDark ? "#ffffff" : "#64748b",
                boxShadow: isDark
                  ? "0 2px 8px rgba(16, 185, 129, 0.35)"
                  : "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: isDark ? "#ffffff" : "#0f172a",
                },
              }}
            >
              <DarkModeOutlinedIcon sx={{ fontSize: "15px" }} />
            </Box>
          </Box>
        </Tooltip>

        {/* Notification Bell with Orange Dot */}
        <Box sx={{ position: "relative" }}>
          <IconButton
            size="small"
            sx={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              bgcolor: isDark ? "#1e293b" : "#f8fafc",
              border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
              color: isDark ? "#cbd5e1" : "#334155",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: isDark ? "#334155" : "#f1f5f9",
                color: isDark ? "#ffffff" : "#0f172a",
                borderColor: isDark ? "#475569" : "#cbd5e1",
              },
            }}
          >
            <NotificationsNoneOutlinedIcon sx={{ fontSize: "20px" }} />
          </IconButton>
          <Box
            sx={{
              position: "absolute",
              top: 7,
              right: 8,
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "#f97316",
              border: isDark ? "1.5px solid #111827" : "1.5px solid #ffffff",
            }}
          />
        </Box>
      </Box>
    </header>
  );
};

export default AdminHeader;
