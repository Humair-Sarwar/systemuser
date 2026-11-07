import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  Switch,
  Pagination,
  InputAdornment,
  Skeleton,
  Stack,
  Breadcrumbs,
  MenuItem,
  Drawer,
  Divider,
  Link as MuiLink,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

import {
  getSystemUsersApi,
  toggleSystemUserStatusApi,
  exportSystemUsersCsvApi,
} from "../../utils/apis/APIs";
import { handleError, handleSuccess } from "../../toast";

// Helper to format relative time
const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
};

// Helper to format readable date
const formatReadableDate = (dateString) => {
  if (!dateString) return "Never logged in";
  const date = new Date(dateString);
  const day = date.getDate();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year} · ${hours}:${minutes}`;
};

// Helper for user initials avatar
const getInitials = (firstName = "", lastName = "") => {
  const f = firstName ? firstName[0].toUpperCase() : "";
  const l = lastName ? lastName[0].toUpperCase() : "";
  return f + l || "U";
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({ all: 0, business_owners: 0, website_users: 0 });

  // Filters state
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'business_owners' | 'website_users'
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [registeredFilter, setRegisteredFilter] = useState("any");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const perPage = 10;

  // Toggle status loading
  const [togglingId, setTogglingId] = useState(null);

  // User detail drawer
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Export loading
  const [exporting, setExporting] = useState(false);

  // Check if any filter is active
  const hasActiveFilters = Boolean(
    searchTerm.trim() || statusFilter !== "all" || registeredFilter !== "any" || sortBy !== "newest"
  );

  // Fetch users
  const fetchUsers = useCallback(
    async (page = 1, tab = "all", search = "", status = "all", registered = "any", sort = "newest") => {
      try {
        setLoading(true);
        const params = {
          page,
          tab,
          search,
          status,
          registered,
          sort,
          per_page: perPage,
        };

        const res = await getSystemUsersApi(params);
        if (res && res.status === 200 && res.data?.status === true) {
          setUsers(res.data.data || []);
          if (res.data.counts) {
            setCounts(res.data.counts);
          }
          setCurrentPage(res.data.current_page || 1);
          setTotalPages(res.data.last_page || 1);
          setTotalUsers(res.data.total || 0);
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.error("Failed to load users", err);
        handleError("Unable to fetch users");
      } finally {
        setLoading(false);
      }
    },
    [perPage]
  );

  useEffect(() => {
    fetchUsers(currentPage, activeTab, searchTerm, statusFilter, registeredFilter, sortBy);
  }, [fetchUsers, currentPage, activeTab, searchTerm, statusFilter, registeredFilter, sortBy]);

  // Tab switch handler
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Search input handler
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setRegisteredFilter("any");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Toggle user status switch
  const handleToggleStatus = async (user) => {
    try {
      setTogglingId(user.id);
      const res = await toggleSystemUserStatusApi(user.id);
      if (res && res.status === 200 && res.data?.status === true) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: !u.status } : u))
        );
        handleSuccess(`Account status updated for ${user.first_name} ${user.last_name}`);
      } else {
        handleError("Failed to update user status");
      }
    } catch (err) {
      handleError("Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  // Open detail drawer
  const handleOpenDetail = (user) => {
    setSelectedUser(user);
    setDetailDrawerOpen(true);
  };

  // Export CSV handler
  const handleExportCsv = async () => {
    try {
      setExporting(true);
      const params = {
        tab: activeTab,
        search: searchTerm,
        status: statusFilter,
        registered: registeredFilter,
      };

      const res = await exportSystemUsersCsvApi(params);
      if (res && res.status === 200) {
        const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `users_export_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        handleSuccess("Users exported successfully!");
      } else {
        handleError("Failed to export users");
      }
    } catch (err) {
      handleError("An error occurred during export");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      {/* Breadcrumbs & Header Section */}
      <Box sx={{ mb: 2.5 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" sx={{ color: "#94a3b8" }} />}
          aria-label="breadcrumb"
          sx={{ mb: 1 }}
        >
          <MuiLink
            underline="hover"
            color="inherit"
            href="/systermuser/dashboard"
            sx={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}
          >
            System Portal
          </MuiLink>
          <Typography sx={{ fontSize: "13px", color: "#2563eb", fontWeight: 600 }}>
            Users
          </Typography>
        </Breadcrumbs>

        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "22px", sm: "26px" },
              color: "#0f172a",
              letterSpacing: "-0.02em",
            }}
          >
            Users
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: "13.5px", mt: 0.5 }}>
            Business owners and website users, newest first. Times are UK time.
          </Typography>
        </Box>
      </Box>

      {/* Modern Filter Card Container */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
          mb: 3,
        }}
      >
        {/* Top Category Tabs Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2.5,
            pt: 2,
            pb: 0,
            borderBottom: "1px solid #f1f5f9",
            overflowX: "auto",
          }}
        >
          {/* Tab 1: All Users */}
          <Box
            onClick={() => handleTabChange("all")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              pb: 1.5,
              cursor: "pointer",
              borderBottom: activeTab === "all" ? "2.5px solid #2563eb" : "2.5px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            <Typography
              sx={{
                fontSize: "13.5px",
                fontWeight: activeTab === "all" ? 700 : 500,
                color: activeTab === "all" ? "#0f172a" : "#64748b",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              All Users
            </Typography>
            <Chip
              label={counts.all}
              size="small"
              sx={{
                height: "22px",
                fontSize: "11.5px",
                fontWeight: 700,
                backgroundColor: activeTab === "all" ? "#2563eb" : "#f1f5f9",
                color: activeTab === "all" ? "#ffffff" : "#64748b",
                borderRadius: "6px",
              }}
            />
          </Box>

          {/* Tab 2: Business Owners (Vendors) */}
          <Box
            onClick={() => handleTabChange("business_owners")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              pb: 1.5,
              cursor: "pointer",
              borderBottom:
                activeTab === "business_owners" ? "2.5px solid #2563eb" : "2.5px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#2563eb",
              }}
            />
            <Typography
              sx={{
                fontSize: "13.5px",
                fontWeight: activeTab === "business_owners" ? 700 : 500,
                color: activeTab === "business_owners" ? "#0f172a" : "#64748b",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              Business Owners
            </Typography>
            <Chip
              label={counts.business_owners}
              size="small"
              sx={{
                height: "22px",
                fontSize: "11.5px",
                fontWeight: 700,
                backgroundColor: activeTab === "business_owners" ? "#2563eb" : "#f1f5f9",
                color: activeTab === "business_owners" ? "#ffffff" : "#64748b",
                borderRadius: "6px",
              }}
            />
          </Box>

          {/* Tab 3: Website Users */}
          <Box
            onClick={() => handleTabChange("website_users")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              pb: 1.5,
              cursor: "pointer",
              borderBottom:
                activeTab === "website_users" ? "2.5px solid #ef4444" : "2.5px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#ef4444",
              }}
            />
            <Typography
              sx={{
                fontSize: "13.5px",
                fontWeight: activeTab === "website_users" ? 700 : 500,
                color: activeTab === "website_users" ? "#0f172a" : "#64748b",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              Website Users
            </Typography>
            <Chip
              label={counts.website_users}
              size="small"
              sx={{
                height: "22px",
                fontSize: "11.5px",
                fontWeight: 700,
                backgroundColor: activeTab === "website_users" ? "#ef4444" : "#f1f5f9",
                color: activeTab === "website_users" ? "#ffffff" : "#64748b",
                borderRadius: "6px",
              }}
            />
          </Box>
        </Box>

        {/* Filter Controls Row */}
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          {/* 1. Global Search Box */}
          <TextField
            size="small"
            placeholder="Search name, email, phone, business or website"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              flex: { xs: "1 1 100%", md: "1 1 360px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#f8fafc",
                fontSize: "13.5px",
                "& fieldset": { borderColor: "#cbd5e1" },
                "&:hover fieldset": { borderColor: "#94a3b8" },
                "&.Mui-focused": {
                  backgroundColor: "#ffffff",
                  "& fieldset": { borderColor: "#2563eb", borderWidth: "1.5px" },
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94a3b8", fontSize: 19 }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm("")} sx={{ p: 0.5 }}>
                    <ClearRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />

          {/* 2. Status Select Dropdown */}
          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            sx={{
              minWidth: { xs: "100%", sm: 160 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                fontSize: "13.5px",
                backgroundColor: "#f8fafc",
                "& fieldset": { borderColor: "#cbd5e1" },
              },
            }}
          >
            <MenuItem value="all">Any status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>

          {/* 3. Registered Date Filter */}
          <TextField
            select
            size="small"
            label="Registered"
            value={registeredFilter}
            onChange={(e) => {
              setRegisteredFilter(e.target.value);
              setCurrentPage(1);
            }}
            sx={{
              minWidth: { xs: "100%", sm: 160 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                fontSize: "13.5px",
                backgroundColor: "#f8fafc",
                "& fieldset": { borderColor: "#cbd5e1" },
              },
            }}
          >
            <MenuItem value="any">Any time</MenuItem>
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="7days">Last 7 days</MenuItem>
            <MenuItem value="month">This month</MenuItem>
            <MenuItem value="year">This year</MenuItem>
          </TextField>

          {/* 4. Sort By Dropdown */}
          <TextField
            select
            size="small"
            label="Sort by"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            sx={{
              minWidth: { xs: "100%", sm: 180 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                fontSize: "13.5px",
                backgroundColor: "#f8fafc",
                "& fieldset": { borderColor: "#cbd5e1" },
              },
            }}
          >
            <MenuItem value="newest">Newest registered</MenuItem>
            <MenuItem value="oldest">Oldest registered</MenuItem>
            <MenuItem value="name_asc">Name (A-Z)</MenuItem>
            <MenuItem value="name_desc">Name (Z-A)</MenuItem>
          </TextField>

          {/* Refresh Icon */}
          <Tooltip title="Refresh users">
            <IconButton
              onClick={() =>
                fetchUsers(currentPage, activeTab, searchTerm, statusFilter, registeredFilter, sortBy)
              }
              size="small"
              sx={{
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                p: 1,
                color: "#64748b",
                "&:hover": { color: "#2563eb", borderColor: "#2563eb", backgroundColor: "#eff6ff" },
              }}
            >
              <SyncRoundedIcon sx={{ fontSize: 19 }} />
            </IconButton>
          </Tooltip>

          {/* Right Align Actions: Clear Filters & Export CSV */}
          <Box sx={{ ml: { xs: 0, lg: "auto" }, display: "flex", alignItems: "center", gap: 1.5 }}>
            {hasActiveFilters && (
              <Button
                size="small"
                onClick={handleClearFilters}
                sx={{
                  textTransform: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#2563eb",
                  "&:hover": { backgroundColor: "#eff6ff" },
                }}
              >
                Clear All Filters
              </Button>
            )}

            <Button
              variant="outlined"
              size="small"
              startIcon={<FileDownloadOutlinedIcon />}
              onClick={handleExportCsv}
              disabled={exporting}
              sx={{
                textTransform: "none",
                fontSize: "13px",
                fontWeight: 600,
                color: "#0f172a",
                borderColor: "#cbd5e1",
                borderRadius: "10px",
                px: 2,
                py: 0.75,
                "&:hover": { borderColor: "#94a3b8", backgroundColor: "#f8fafc" },
              }}
            >
              {exporting ? "Exporting..." : "Export CSV"}
            </Button>
          </Box>
        </Box>

        {/* Users Table */}
        <TableContainer>
          <Table sx={{ minWidth: 950 }}>
            <TableHead sx={{ backgroundColor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#475569", py: 1.75, width: "24%" }}>
                  User
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#475569", py: 1.75, width: "16%" }}>
                  Type
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#475569", py: 1.75, width: "20%" }}>
                  Business / website
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#475569", py: 1.75, width: "16%" }}>
                  Registered
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#475569", py: 1.75, width: "20%" }}>
                  Last login
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#475569", py: 1.75, width: "12%" }}>
                  Status
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, fontSize: "13px", color: "#475569", py: 1.75, pr: 3, width: "8%" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((__, c) => (
                      <TableCell key={c}>
                        <Skeleton variant="text" width="80%" height={24} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : users.length > 0 ? (
                users.map((user) => {
                  const isBusinessOwner = user.user_type === 2;
                  const initials = getInitials(user.first_name, user.last_name);

                  return (
                    <TableRow
                      key={user.id}
                      hover
                      sx={{
                        transition: "background-color 0.15s ease",
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      {/* Column 1: User Initials, Name, Email, Phone */}
                      <TableCell sx={{ py: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 38,
                              height: 38,
                              borderRadius: "50%",
                              border: isBusinessOwner ? "1.5px solid #3b82f6" : "1.5px solid #ef4444",
                              color: isBusinessOwner ? "#1d4ed8" : "#dc2626",
                              backgroundColor: isBusinessOwner ? "#eff6ff" : "#fef2f2",
                              fontWeight: 700,
                              fontSize: "13px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              mt: 0.25,
                            }}
                          >
                            {initials}
                          </Box>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "#0f172a", lineHeight: 1.3 }}>
                              {user.first_name} {user.last_name}
                            </Typography>
                            <Typography sx={{ fontSize: "12px", color: "#64748b", mt: 0.2, wordBreak: "break-all" }}>
                              {user.email}
                            </Typography>
                            {user.phone && (
                              <Typography sx={{ fontSize: "11.5px", color: "#94a3b8", mt: 0.1 }}>
                                {user.phone}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Column 2: Type Pill Badge */}
                      <TableCell sx={{ py: 2 }}>
                        {isBusinessOwner ? (
                          <Chip
                            icon={<StorefrontOutlinedIcon sx={{ fontSize: "15px !important", color: "#2563eb !important" }} />}
                            label="Business owner"
                            size="small"
                            sx={{
                              backgroundColor: "#eff6ff",
                              color: "#1d4ed8",
                              fontWeight: 600,
                              fontSize: "12px",
                              borderRadius: "6px",
                              border: "1px solid #bfdbfe",
                              py: 0.5,
                              px: 0.5,
                            }}
                          />
                        ) : (
                          <Chip
                            icon={<LanguageOutlinedIcon sx={{ fontSize: "15px !important", color: "#ef4444 !important" }} />}
                            label="Website user"
                            size="small"
                            sx={{
                              backgroundColor: "#fef2f2",
                              color: "#b91c1c",
                              fontWeight: 600,
                              fontSize: "12px",
                              borderRadius: "6px",
                              border: "1px solid #fecaca",
                              py: 0.5,
                              px: 0.5,
                            }}
                          />
                        )}
                      </TableCell>

                      {/* Column 3: Business / website */}
                      <TableCell sx={{ py: 2 }}>
                        <Typography sx={{ fontSize: "13.5px", color: "#334155", fontWeight: 500 }}>
                          {user.business_name || (isBusinessOwner ? "Store owner" : "Website customer")}
                        </Typography>
                      </TableCell>

                      {/* Column 4: Registered Date & Time */}
                      <TableCell sx={{ py: 2 }}>
                        <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", lineHeight: 1.3 }}>
                          {formatReadableDate(user.created_at)}
                        </Typography>
                        <Typography sx={{ fontSize: "11.5px", color: "#64748b", mt: 0.2 }}>
                          {formatRelativeTime(user.created_at)}
                        </Typography>
                      </TableCell>

                      {/* Column 5: Last login (Date, IP, Browser/OS) */}
                      <TableCell sx={{ py: 2 }}>
                        {user.last_login_at ? (
                          <Box>
                            <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", lineHeight: 1.3 }}>
                              {formatReadableDate(user.last_login_at)}
                            </Typography>
                            <Typography sx={{ fontSize: "11.5px", color: "#64748b", mt: 0.2 }}>
                              {formatRelativeTime(user.last_login_at)}
                            </Typography>
                            {(user.last_login_ip || user.last_login_device) && (
                              <Typography sx={{ fontSize: "11px", color: "#94a3b8", mt: 0.2 }}>
                                {[user.last_login_ip, user.last_login_device].filter(Boolean).join(" · ")}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Typography sx={{ fontSize: "12.5px", color: "#94a3b8", fontStyle: "italic" }}>
                            Never logged in
                          </Typography>
                        )}
                      </TableCell>

                      {/* Column 6: Status Toggle with Active Indicator */}
                      <TableCell sx={{ py: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                            <Box
                              sx={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                backgroundColor: user.status ? "#10b981" : "#94a3b8",
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: "12.5px",
                                fontWeight: 600,
                                color: user.status ? "#059669" : "#64748b",
                              }}
                            >
                              {user.status ? "Active" : "Inactive"}
                            </Typography>
                          </Box>
                          <Switch
                            size="small"
                            checked={Boolean(user.status)}
                            disabled={togglingId === user.id}
                            onChange={() => handleToggleStatus(user)}
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#2563eb",
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                backgroundColor: "#2563eb",
                              },
                            }}
                          />
                        </Box>
                      </TableCell>

                      {/* Column 7: Action (Eye icon view details) */}
                      <TableCell align="right" sx={{ py: 2, pr: 3 }}>
                        <Tooltip title="View User Details">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDetail(user)}
                            sx={{
                              color: "#475569",
                              backgroundColor: "#f1f5f9",
                              borderRadius: "8px",
                              p: 0.8,
                              "&:hover": { backgroundColor: "#e2e8f0", color: "#0f172a" },
                            }}
                          >
                            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} sx={{ py: 8, textAlign: "center" }}>
                    <Box sx={{ maxWidth: 340, mx: "auto", textAlign: "center" }}>
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: "16px",
                          backgroundColor: "#f1f5f9",
                          color: "#94a3b8",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 1.5,
                        }}
                      >
                        <PersonOutlineRoundedIcon sx={{ fontSize: 28 }} />
                      </Box>
                      <Typography sx={{ fontWeight: 600, fontSize: "15px", color: "#1e293b" }}>
                        No users found
                      </Typography>
                      <Typography sx={{ color: "#64748b", fontSize: "13px", mt: 0.5, mb: 2 }}>
                        {searchTerm || statusFilter !== "all" || registeredFilter !== "any"
                          ? "No users matched your search criteria."
                          : "No users exist in this category yet."}
                      </Typography>
                      {hasActiveFilters && (
                        <Button
                          size="small"
                          onClick={handleClearFilters}
                          sx={{ textTransform: "none", fontSize: "13px" }}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Bottom Pagination Bar */}
        {users.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 3,
              py: 2,
              borderTop: "1px solid #f1f5f9",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography sx={{ fontSize: "13px", color: "#64748b" }}>
              Page {currentPage} of {Math.max(totalPages, 1)} ({totalUsers} users)
            </Typography>

            <Pagination
              count={Math.max(totalPages, 1)}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: "8px",
                  fontSize: "13px",
                  "&.Mui-selected": {
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    borderColor: "#2563eb",
                    "&:hover": { backgroundColor: "#1d4ed8" },
                  },
                },
              }}
            />
          </Box>
        )}
      </Paper>

      {/* USER DETAILS SLIDE-OVER DRAWER */}
      <Drawer
        anchor="right"
        open={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "460px" },
            maxWidth: "100vw",
            backgroundColor: "#f8fafc",
            display: "flex",
            flexDirection: "column",
            boxShadow: "-8px 0 40px rgba(15, 23, 42, 0.16)",
          },
        }}
      >
        {selectedUser && (
          <>
            {/* Drawer Header */}
            <Box
              sx={{
                p: 3,
                backgroundColor: "#ffffff",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: "17px", color: "#0f172a" }}>
                User Profile
              </Typography>
              <IconButton size="small" onClick={() => setDetailDrawerOpen(false)} sx={{ color: "#94a3b8" }}>
                <CloseRoundedIcon />
              </IconButton>
            </Box>

            {/* Drawer Content */}
            <Box sx={{ p: 3, overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Profile Card */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: "14px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    border: selectedUser.user_type === 2 ? "2px solid #2563eb" : "2px solid #ef4444",
                    color: selectedUser.user_type === 2 ? "#1d4ed8" : "#dc2626",
                    backgroundColor: selectedUser.user_type === 2 ? "#eff6ff" : "#fef2f2",
                    fontWeight: 700,
                    fontSize: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {getInitials(selectedUser.first_name, selectedUser.last_name)}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "16px", color: "#0f172a" }}>
                    {selectedUser.first_name} {selectedUser.last_name}
                  </Typography>
                  <Chip
                    label={selectedUser.user_type === 2 ? "Business Owner (Vendor)" : "Website User (Customer)"}
                    size="small"
                    sx={{
                      mt: 0.5,
                      height: "22px",
                      fontSize: "11px",
                      fontWeight: 700,
                      backgroundColor: selectedUser.user_type === 2 ? "#eff6ff" : "#fef2f2",
                      color: selectedUser.user_type === 2 ? "#2563eb" : "#ef4444",
                      borderRadius: "6px",
                    }}
                  />
                </Box>
              </Paper>

              {/* Contact Information */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: "14px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                }}
              >
                <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#475569", textTransform: "uppercase", mb: 2 }}>
                  Contact Details
                </Typography>

                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <EmailOutlinedIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                    <Box>
                      <Typography sx={{ fontSize: "11px", color: "#64748b" }}>Email Address</Typography>
                      <Typography sx={{ fontSize: "13.5px", fontWeight: 600, color: "#0f172a" }}>
                        {selectedUser.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <PhoneOutlinedIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                    <Box>
                      <Typography sx={{ fontSize: "11px", color: "#64748b" }}>Phone Number</Typography>
                      <Typography sx={{ fontSize: "13.5px", fontWeight: 600, color: "#0f172a" }}>
                        {selectedUser.phone || "—"}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <StorefrontOutlinedIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                    <Box>
                      <Typography sx={{ fontSize: "11px", color: "#64748b" }}>Business / Website</Typography>
                      <Typography sx={{ fontSize: "13.5px", fontWeight: 600, color: "#0f172a" }}>
                        {selectedUser.business_name || "—"}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Paper>

              {/* Login & Activity Information */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: "14px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                }}
              >
                <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#475569", textTransform: "uppercase", mb: 2 }}>
                  Activity & Timestamps
                </Typography>

                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                    <Box>
                      <Typography sx={{ fontSize: "11px", color: "#64748b" }}>Registered Date</Typography>
                      <Typography sx={{ fontSize: "13.5px", fontWeight: 600, color: "#0f172a" }}>
                        {formatReadableDate(selectedUser.created_at)}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <DevicesOutlinedIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                    <Box>
                      <Typography sx={{ fontSize: "11px", color: "#64748b" }}>Last Login Date</Typography>
                      <Typography sx={{ fontSize: "13.5px", fontWeight: 600, color: "#0f172a" }}>
                        {selectedUser.last_login_at ? formatReadableDate(selectedUser.last_login_at) : "Never logged in"}
                      </Typography>
                    </Box>
                  </Box>

                  {selectedUser.last_login_ip && (
                    <>
                      <Divider />
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <DnsOutlinedIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                        <Box>
                          <Typography sx={{ fontSize: "11px", color: "#64748b" }}>Last IP & Device</Typography>
                          <Typography sx={{ fontSize: "13.5px", fontWeight: 600, color: "#0f172a" }}>
                            {[selectedUser.last_login_ip, selectedUser.last_login_device].filter(Boolean).join(" · ")}
                          </Typography>
                        </Box>
                      </Box>
                    </>
                  )}
                </Stack>
              </Paper>
            </Box>

            {/* Drawer Footer Actions */}
            <Box
              sx={{
                p: 2.5,
                backgroundColor: "#ffffff",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setDetailDrawerOpen(false)}
                sx={{
                  textTransform: "none",
                  borderRadius: "10px",
                  borderColor: "#cbd5e1",
                  color: "#475569",
                  fontWeight: 600,
                  px: 3,
                }}
              >
                Close
              </Button>
            </Box>
          </>
        )}
      </Drawer>
    </Box>
  );
};

export default Users;
