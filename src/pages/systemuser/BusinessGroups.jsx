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
  TextField,
  Pagination,
  InputAdornment,
  Skeleton,
  Stack,
  MenuItem,
  Drawer,
  Divider,
  Grid,
  Card,
  Avatar,
  Autocomplete,
  Breadcrumbs,
  Link as MuiLink,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";

import {
  getSystemBusinessGroupsApi,
  searchGroupOwnersApi,
  getSystemBusinessGroupApi,
  createSystemBusinessGroupApi,
  updateSystemBusinessGroupApi,
  toggleStatusBusinessGroupApi,
  deleteSystemBusinessGroupApi,
} from "../../utils/apis/APIs";
import { handleError, handleSuccess } from "../../toast";

// Modern refined styling for inputs matching Businesses.jsx
const modernInputStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    fontSize: "13.5px",
    transition: "all 0.2s ease-in-out",
    "& fieldset": {
      borderColor: "#cbd5e1",
    },
    "&:hover fieldset": {
      borderColor: "#94a3b8",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2563eb",
      borderWidth: "1.5px",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "13.5px",
    color: "#64748b",
    "&.Mui-focused": {
      color: "#2563eb",
      fontWeight: 600,
    },
  },
};

export default function BusinessGroups() {
  // Tabs & Filters
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  // Data states
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [counts, setCounts] = useState({ all: 0, active: 0, inactive: 0, without_businesses: 0 });
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

  // Details Drawer state
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Create / Edit Drawer state
  const [formDrawerOpen, setFormDrawerOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    owner_id: null,
    owner_option: null,
    description: "",
  });

  // Inline validation errors & touched
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});

  // Owner search in Create/Edit
  const [ownerOptions, setOwnerOptions] = useState([]);
  const [ownerLoading, setOwnerLoading] = useState(false);

  // Delete modal state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Load owner options
  const fetchOwnerOptions = async (query = "") => {
    setOwnerLoading(true);
    try {
      const res = await searchGroupOwnersApi(query);
      if (res && (res.status === 200 || res.data?.status)) {
        setOwnerOptions(res.data?.data || []);
      }
    } catch {
      // ignore
    } finally {
      setOwnerLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerOptions("");
  }, []);

  // Fetch groups list
  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSystemBusinessGroupsApi({
        tab: activeTab,
        search: debouncedSearch,
        sort_by: sortBy,
        page,
        per_page: perPage,
      });

      if (res && (res.status === 200 || res.data?.status)) {
        const payload = res.data?.data ? res.data : res;
        setGroups(payload.data || []);
        if (payload.counts) {
          setCounts(payload.counts);
        }
        if (payload.pagination) {
          setPagination(payload.pagination);
        }
      } else {
        handleError(res?.data?.message || "Failed to load business groups");
      }
    } catch (err) {
      handleError("Network error while loading business groups");
    } finally {
      setLoading(false);
    }
  }, [activeTab, debouncedSearch, sortBy, page, perPage]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  // Open Details Drawer
  const handleOpenDetails = (group) => {
    setSelectedGroup(group);
    setDetailsDrawerOpen(true);
  };

  // Toggle active / inactive status
  const handleToggleStatus = async (groupId) => {
    try {
      const res = await toggleStatusBusinessGroupApi(groupId);
      if (res && (res.status === 200 || res.data?.status)) {
        handleSuccess(res.data?.message || "Status updated successfully");
        fetchGroups();
        if (selectedGroup && selectedGroup.id === groupId) {
          setSelectedGroup((prev) => ({
            ...prev,
            status: prev.status === "active" ? "inactive" : "active",
          }));
        }
      } else {
        handleError(res?.data?.message || "Failed to toggle status");
      }
    } catch {
      handleError("Failed to update status");
    }
  };

  // Open Create Drawer
  const handleOpenCreateDrawer = () => {
    setEditingGroup(null);
    setFormData({
      name: "",
      owner_id: null,
      owner_option: null,
      description: "",
    });
    setFormErrors({});
    setFormTouched({});
    setFormDrawerOpen(true);
    fetchOwnerOptions("");
  };

  // Open Edit Drawer
  const handleOpenEditDrawer = (group) => {
    setEditingGroup(group);
    const existingOwner = group.owner
      ? {
          id: group.owner.id,
          name: group.owner.name,
          email: group.owner.email,
          label: `${group.owner.name} (${group.owner.email})`,
          sub_label: `Owner`,
        }
      : null;

    setFormData({
      name: group.name || "",
      owner_id: group.owner?.id || null,
      owner_option: existingOwner,
      description: group.description || "",
    });
    setFormErrors({});
    setFormTouched({});
    setFormDrawerOpen(true);
    fetchOwnerOptions("");
  };

  // Handle Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Inline validation check
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Group Name is required";
    }
    if (!formData.owner_id) {
      errors.owner_id = "Group Owner is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setFormTouched({ name: true, owner_id: true });
      return;
    }

    setFormSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        owner_id: formData.owner_id,
        description: formData.description,
      };

      let res;
      if (editingGroup) {
        res = await updateSystemBusinessGroupApi(editingGroup.id, payload);
      } else {
        res = await createSystemBusinessGroupApi(payload);
      }

      if (res && (res.status === 200 || res.status === 201 || res.data?.status)) {
        handleSuccess(editingGroup ? "Business group updated successfully" : "Business group created successfully");
        setFormDrawerOpen(false);
        fetchGroups();
        if (detailsDrawerOpen && editingGroup) {
          setDetailsDrawerOpen(false);
        }
      } else {
        handleError(res?.data?.message || "Operation failed");
      }
    } catch {
      handleError("Error saving business group");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete handling
  const handleConfirmDelete = async () => {
    if (!groupToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await deleteSystemBusinessGroupApi(groupToDelete.id);
      if (res && (res.status === 200 || res.data?.status)) {
        handleSuccess("Business group deleted successfully");
        setDeleteDialogOpen(false);
        setGroupToDelete(null);
        if (detailsDrawerOpen && selectedGroup?.id === groupToDelete.id) {
          setDetailsDrawerOpen(false);
        }
        fetchGroups();
      } else {
        handleError(res?.data?.message || "Failed to delete group");
      }
    } catch {
      handleError("Error deleting business group");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      {/* Breadcrumb Navigation matching Businesses.jsx */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" sx={{ color: "#94a3b8" }} />}
        aria-label="breadcrumb"
        sx={{ mb: 1.5 }}
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
          Business Groups
        </Typography>
      </Breadcrumbs>

      {/* Header Bar matching Businesses.jsx */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 2.5,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "22px", sm: "28px" },
              color: "#0f172a",
              letterSpacing: "-0.02em",
            }}
          >
            Business Groups
          </Typography>
          <Typography sx={{ fontSize: "13px", color: "#64748b", mt: 0.5 }}>
            Each group with its owner, the businesses assigned to it and who owns them. Open a group to see them all.
          </Typography>
        </Box>

        {/* Create Business Group Button */}
        <Button
          variant="contained"
          onClick={handleOpenCreateDrawer}
          startIcon={<AddRoundedIcon />}
          sx={{
            backgroundColor: "#2563eb",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "14px",
            borderRadius: "10px",
            px: 2.5,
            py: 0.9,
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
            "&:hover": { backgroundColor: "#1d4ed8" },
          }}
        >
          Create Business Group
        </Button>
      </Box>

      {/* Main Container Card matching Businesses.jsx Paper */}
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
        {/* Status Tabs Header with Counter Badges inside card */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2.5,
            px: 2.5,
            pt: 2,
            borderBottom: "1px solid #f1f5f9",
            overflowX: "auto",
          }}
        >
          {/* Tab: ALL GROUPS */}
          <Box
            onClick={() => handleTabChange("all")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              pb: 1.5,
              cursor: "pointer",
              borderBottom: activeTab === "all" ? "2.5px solid #b91c1c" : "2.5px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            <Typography
              sx={{
                fontSize: "13.5px",
                fontWeight: activeTab === "all" ? 700 : 600,
                color: activeTab === "all" ? "#b91c1c" : "#64748b",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              All Groups
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

          {/* Tab: ACTIVE */}
          <Box
            onClick={() => handleTabChange("active")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              pb: 1.5,
              cursor: "pointer",
              borderBottom: activeTab === "active" ? "2.5px solid #b91c1c" : "2.5px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            <Typography
              sx={{
                fontSize: "13.5px",
                fontWeight: activeTab === "active" ? 700 : 600,
                color: activeTab === "active" ? "#b91c1c" : "#64748b",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              Active
            </Typography>
            <Chip
              label={counts.active}
              size="small"
              sx={{
                height: "22px",
                fontSize: "11.5px",
                fontWeight: 700,
                backgroundColor: activeTab === "active" ? "#16a34a" : "#f1f5f9",
                color: activeTab === "active" ? "#ffffff" : "#64748b",
                borderRadius: "6px",
              }}
            />
          </Box>

          {/* Tab: INACTIVE */}
          <Box
            onClick={() => handleTabChange("inactive")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              pb: 1.5,
              cursor: "pointer",
              borderBottom: activeTab === "inactive" ? "2.5px solid #b91c1c" : "2.5px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            <Typography
              sx={{
                fontSize: "13.5px",
                fontWeight: activeTab === "inactive" ? 700 : 600,
                color: activeTab === "inactive" ? "#b91c1c" : "#64748b",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              Inactive
            </Typography>
            <Chip
              label={counts.inactive}
              size="small"
              sx={{
                height: "22px",
                fontSize: "11.5px",
                fontWeight: 700,
                backgroundColor: activeTab === "inactive" ? "#64748b" : "#f1f5f9",
                color: activeTab === "inactive" ? "#ffffff" : "#64748b",
                borderRadius: "6px",
              }}
            />
          </Box>

          {/* Tab: WITHOUT BUSINESSES */}
          <Box
            onClick={() => handleTabChange("without_businesses")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              pb: 1.5,
              cursor: "pointer",
              borderBottom: activeTab === "without_businesses" ? "2.5px solid #b91c1c" : "2.5px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            <Typography
              sx={{
                fontSize: "13.5px",
                fontWeight: activeTab === "without_businesses" ? 700 : 600,
                color: activeTab === "without_businesses" ? "#b91c1c" : "#64748b",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              Without Businesses
            </Typography>
            <Chip
              label={counts.without_businesses}
              size="small"
              sx={{
                height: "22px",
                fontSize: "11.5px",
                fontWeight: 700,
                backgroundColor: activeTab === "without_businesses" ? "#d97706" : "#f1f5f9",
                color: activeTab === "without_businesses" ? "#ffffff" : "#64748b",
                borderRadius: "6px",
              }}
            />
          </Box>
        </Box>

        {/* Filter Toolbar matching Businesses.jsx */}
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          {/* Search Box */}
          <TextField
            size="small"
            placeholder="Search group, owner or a business in it..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              flex: { xs: "1 1 100%", md: "1 1 360px" },
              ...modernInputStyles,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94a3b8", fontSize: "20px" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Sort By Dropdown */}
          <TextField
            select
            size="small"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            sx={{
              minWidth: "200px",
              ...modernInputStyles,
            }}
          >
            <MenuItem value="newest">Sort by: Newest first</MenuItem>
            <MenuItem value="oldest">Sort by: Oldest first</MenuItem>
            <MenuItem value="name_asc">Sort by: Name (A-Z)</MenuItem>
            <MenuItem value="name_desc">Sort by: Name (Z-A)</MenuItem>
          </TextField>

          {/* Clear Filters */}
          {(search || sortBy !== "newest") && (
            <Button
              size="small"
              onClick={() => {
                setSearch("");
                setSortBy("newest");
                setPage(1);
              }}
              sx={{
                color: "#2563eb",
                fontSize: "13px",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Clear Filters
            </Button>
          )}
        </Box>

        {/* Table View matching Businesses.jsx table */}
        <TableContainer>
          <Table sx={{ minWidth: 950 }}>
            <TableHead sx={{ backgroundColor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: "12.5px", color: "#475569", py: 1.8 }}>
                  Group
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "12.5px", color: "#475569", py: 1.8 }}>
                  Group Owner
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "12.5px", color: "#475569", py: 1.8 }}>
                  Businesses
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "12.5px", color: "#475569", py: 1.8 }}>
                  Business Owners
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "12.5px", color: "#475569", py: 1.8 }}>
                  Status
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: "12.5px", color: "#475569", py: 1.8 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                Array.from(new Array(5)).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton variant="text" width={160} /><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="text" width={140} /><Skeleton variant="text" width={120} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /><Skeleton variant="text" width={220} /></TableCell>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell><Skeleton variant="rounded" width={80} height={26} /></TableCell>
                    <TableCell align="right"><Skeleton variant="circular" width={32} height={32} /></TableCell>
                  </TableRow>
                ))
              ) : groups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <BusinessRoundedIcon sx={{ fontSize: 44, color: "#cbd5e1", mb: 1 }} />
                    <Typography sx={{ color: "#64748b", fontSize: "15px", fontWeight: 500 }}>
                      No business groups found
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5, fontSize: "13px" }}>
                      Try adjusting your search or create a new group.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                groups.map((group) => {
                  const bizCount = group.metrics?.businesses_count || 0;
                  const activeBizCount = group.metrics?.active_businesses_count || 0;
                  const ownersCount = group.metrics?.owners_count || 0;

                  const previewBusinesses = (group.businesses || []).slice(0, 3).map((b) => b.display_name).join(", ");
                  const remainingBiz = (group.businesses?.length || 0) - 3;
                  const businessesText =
                    remainingBiz > 0 ? `${previewBusinesses} and ${remainingBiz} more` : previewBusinesses;

                  return (
                    <TableRow
                      key={group.id}
                      hover
                      sx={{
                        "&:hover": { backgroundColor: "#f8fafc" },
                        transition: "background-color 0.15s ease",
                      }}
                    >
                      {/* Group Name & Date */}
                      <TableCell sx={{ py: 2 }}>
                        <Typography sx={{ fontWeight: 600, color: "#0f172a", fontSize: "14px" }}>
                          {group.name}
                        </Typography>
                        <Typography sx={{ color: "#94a3b8", fontSize: "12px", mt: 0.3 }}>
                          Created {group.created_formatted}
                        </Typography>
                      </TableCell>

                      {/* Group Owner */}
                      <TableCell sx={{ py: 2 }}>
                        <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "13.5px" }}>
                          {group.owner?.name || "-"}
                        </Typography>
                        <Typography sx={{ color: "#64748b", fontSize: "12.5px" }}>
                          {group.owner?.email || "-"}
                        </Typography>
                      </TableCell>

                      {/* Businesses */}
                      <TableCell sx={{ py: 2, maxWidth: 360 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: "14px" }}>
                            {bizCount}
                          </Typography>
                          <Typography sx={{ fontWeight: 600, color: "#16a34a", fontSize: "12.5px" }}>
                            {activeBizCount} active
                          </Typography>
                        </Box>
                        {businessesText ? (
                          <Typography
                            noWrap
                            sx={{
                              color: "#64748b",
                              fontSize: "12px",
                              mt: 0.3,
                              display: "block",
                            }}
                          >
                            {businessesText}
                          </Typography>
                        ) : (
                          <Typography sx={{ color: "#94a3b8", fontSize: "12px", fontStyle: "italic", mt: 0.3 }}>
                            No businesses assigned
                          </Typography>
                        )}
                      </TableCell>

                      {/* Business Owners */}
                      <TableCell sx={{ py: 2 }}>
                        <Typography sx={{ fontWeight: 600, color: "#334155", fontSize: "13.5px" }}>
                          {ownersCount} {ownersCount === 1 ? "owner" : "owners"}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          label={group.status === "active" ? "Active" : "Inactive"}
                          size="small"
                          sx={{
                            height: "24px",
                            fontWeight: 700,
                            fontSize: "12px",
                            backgroundColor: group.status === "active" ? "#dcfce7" : "#f1f5f9",
                            color: group.status === "active" ? "#15803d" : "#64748b",
                            borderRadius: "16px",
                          }}
                        />
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="right" sx={{ py: 2 }}>
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDetails(group)}
                              sx={{
                                color: "#64748b",
                                "&:hover": { color: "#2563eb", backgroundColor: "#eff6ff" },
                              }}
                            >
                              <VisibilityOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Edit Group">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEditDrawer(group)}
                              sx={{
                                color: "#64748b",
                                "&:hover": { color: "#2563eb", backgroundColor: "#eff6ff" },
                              }}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {pagination.total > perPage && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderTop: "1px solid #f1f5f9",
            }}
          >
            <Typography variant="body2" sx={{ color: "#64748b", fontSize: "13px" }}>
              Showing {groups.length} of {pagination.total} groups
            </Typography>
            <Pagination
              count={pagination.last_page}
              page={page}
              onChange={(_, val) => setPage(val)}
              color="primary"
              shape="rounded"
              size="small"
            />
          </Box>
        )}
      </Paper>

      {/* ======================================================== */}
      {/* 1. GROUP DETAILS DRAWER (Matching Businesses.jsx style)  */}
      {/* ======================================================== */}
      <Drawer
        anchor="right"
        open={detailsDrawerOpen}
        onClose={() => setDetailsDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "540px", md: "580px" },
            p: 0,
            backgroundColor: "#f8fafc",
            boxShadow: "-8px 0 32px rgba(15, 23, 42, 0.08)",
          },
        }}
      >
        {selectedGroup && (
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Header */}
            <Box
              sx={{
                p: 2.5,
                backgroundColor: "#ffffff",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "18px", color: "#0f172a" }}>
                  Group Details
                </Typography>
                <Typography sx={{ fontSize: "12.5px", color: "#64748b" }}>
                  Overview of assigned businesses, owners, and group settings.
                </Typography>
              </Box>
              <IconButton onClick={() => setDetailsDrawerOpen(false)} sx={{ color: "#94a3b8" }}>
                <CloseRoundedIcon />
              </IconButton>
            </Box>

            {/* Content Body */}
            <Box sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1, overflowY: "auto" }}>
              <Stack spacing={2.5}>
                {/* Card 1: Group Name & Status */}
                <Card variant="outlined" sx={{ p: 2.5, borderRadius: "14px", backgroundColor: "#ffffff" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "18px", color: "#0f172a" }}>
                      {selectedGroup.name}
                    </Typography>
                    <Chip
                      label={selectedGroup.status === "active" ? "Active" : "Inactive"}
                      size="small"
                      sx={{
                        height: "24px",
                        fontWeight: 700,
                        fontSize: "12px",
                        backgroundColor: selectedGroup.status === "active" ? "#dcfce7" : "#f1f5f9",
                        color: selectedGroup.status === "active" ? "#15803d" : "#64748b",
                        borderRadius: "16px",
                      }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: "13px", color: "#64748b", mb: 2 }}>
                    Created: {selectedGroup.created_formatted}
                  </Typography>

                  {/* 4 Stat Boxes inside Card */}
                  <Grid container spacing={1.5}>
                    <Grid item xs={3}>
                      <Box sx={{ p: 1.5, borderRadius: "10px", bgcolor: "#f8fafc", border: "1px solid #e2e8f0", textAlign: "center" }}>
                        <Typography sx={{ color: "#64748b", fontSize: "11.5px", fontWeight: 600, mb: 0.3 }}>
                          Businesses
                        </Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: "18px", color: "#0f172a" }}>
                          {selectedGroup.metrics?.businesses_count || selectedGroup.businesses?.length || 0}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={3}>
                      <Box sx={{ p: 1.5, borderRadius: "10px", bgcolor: "#f8fafc", border: "1px solid #e2e8f0", textAlign: "center" }}>
                        <Typography sx={{ color: "#64748b", fontSize: "11.5px", fontWeight: 600, mb: 0.3 }}>
                          Active
                        </Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: "18px", color: "#16a34a" }}>
                          {selectedGroup.metrics?.active_businesses_count || 0}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={3}>
                      <Box sx={{ p: 1.5, borderRadius: "10px", bgcolor: "#f8fafc", border: "1px solid #e2e8f0", textAlign: "center" }}>
                        <Typography sx={{ color: "#64748b", fontSize: "11.5px", fontWeight: 600, mb: 0.3 }}>
                          Blocked
                        </Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: "18px", color: "#ef4444" }}>
                          {selectedGroup.metrics?.blocked_businesses_count || 0}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={3}>
                      <Box sx={{ p: 1.5, borderRadius: "10px", bgcolor: "#f8fafc", border: "1px solid #e2e8f0", textAlign: "center" }}>
                        <Typography sx={{ color: "#64748b", fontSize: "11.5px", fontWeight: 600, mb: 0.3 }}>
                          Owners
                        </Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: "18px", color: "#0f172a" }}>
                          {selectedGroup.metrics?.owners_count || selectedGroup.business_owners?.length || 0}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>

                {/* Card 2: Group Owner */}
                <Card variant="outlined" sx={{ p: 2.5, borderRadius: "14px", backgroundColor: "#ffffff" }}>
                  <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", mb: 1.5 }}>
                    Group Owner
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: "15px", color: "#b91c1c" }}>
                    {selectedGroup.owner?.name || "No owner assigned"}
                  </Typography>
                  <Typography sx={{ fontSize: "13px", color: "#64748b" }}>
                    {selectedGroup.owner?.email || "—"}
                  </Typography>
                  {selectedGroup.owner?.phone && (
                    <Typography sx={{ fontSize: "13px", color: "#64748b" }}>
                      {selectedGroup.owner.phone}
                    </Typography>
                  )}
                </Card>

                {/* Card 3: Businesses in this group */}
                <Card variant="outlined" sx={{ p: 2.5, borderRadius: "14px", backgroundColor: "#ffffff" }}>
                  <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", mb: 1.5 }}>
                    Businesses in this group ({selectedGroup.businesses?.length || 0})
                  </Typography>

                  {(!selectedGroup.businesses || selectedGroup.businesses.length === 0) ? (
                    <Typography sx={{ color: "#94a3b8", fontSize: "13px", fontStyle: "italic" }}>
                      No businesses assigned to this group.
                    </Typography>
                  ) : (
                    <Stack spacing={1.2}>
                      {selectedGroup.businesses.map((biz) => (
                        <Box
                          key={biz.id}
                          sx={{
                            p: 1.5,
                            borderRadius: "10px",
                            border: "1px solid #f1f5f9",
                            backgroundColor: "#f8fafc",
                          }}
                        >
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.3 }}>
                            <Typography sx={{ fontWeight: 600, color: "#0f172a", fontSize: "13.5px" }}>
                              {biz.display_name}
                            </Typography>
                            <Chip
                              label={biz.status === "active" ? "Active" : "Blocked"}
                              size="small"
                              sx={{
                                height: "20px",
                                fontWeight: 700,
                                fontSize: "11px",
                                backgroundColor: biz.status === "active" ? "#dcfce7" : "#fee2e2",
                                color: biz.status === "active" ? "#15803d" : "#991b1b",
                              }}
                            />
                          </Box>
                          <Typography sx={{ color: "#64748b", fontSize: "12px" }}>
                            Owner: {biz.owner_name} ({biz.owner_email}) {biz.schema_name ? `· ${biz.schema_name}` : ""}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Card>

                {/* Card 4: Who owns these businesses */}
                <Card variant="outlined" sx={{ p: 2.5, borderRadius: "14px", backgroundColor: "#ffffff" }}>
                  <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", mb: 1.5 }}>
                    Who owns these businesses ({selectedGroup.business_owners?.length || 0})
                  </Typography>

                  {(!selectedGroup.business_owners || selectedGroup.business_owners.length === 0) ? (
                    <Typography sx={{ color: "#94a3b8", fontSize: "13px", fontStyle: "italic" }}>
                      No business owners found.
                    </Typography>
                  ) : (
                    <Stack spacing={1.2}>
                      {selectedGroup.business_owners.map((bo) => (
                        <Box
                          key={bo.id}
                          sx={{
                            p: 1.5,
                            borderRadius: "10px",
                            border: "1px solid #f1f5f9",
                            backgroundColor: "#f8fafc",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography sx={{ fontWeight: 600, color: "#0f172a", fontSize: "13.5px" }}>
                              {bo.name}
                            </Typography>
                            <Typography sx={{ color: "#64748b", fontSize: "12px" }}>
                              {bo.email}
                            </Typography>
                          </Box>
                          <Chip
                            label={`${bo.businesses_count} ${bo.businesses_count === 1 ? "business" : "businesses"}`}
                            size="small"
                            sx={{
                              height: "22px",
                              fontSize: "11.5px",
                              fontWeight: 600,
                              backgroundColor: "#ffffff",
                              border: "1px solid #e2e8f0",
                              color: "#475569",
                            }}
                          />
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Card>
              </Stack>
            </Box>

            {/* Footer Actions */}
            <Box
              sx={{
                p: 2.5,
                backgroundColor: "#ffffff",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                color="error"
                onClick={() => {
                  setGroupToDelete(selectedGroup);
                  setDeleteDialogOpen(true);
                }}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "13.5px",
                  color: "#dc2626",
                  "&:hover": { bgcolor: "#fef2f2" },
                }}
              >
                Delete Group
              </Button>

              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button
                  variant="outlined"
                  onClick={() => handleToggleStatus(selectedGroup.id)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "10px",
                    borderColor: "#cbd5e1",
                    color: "#334155",
                    "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" },
                  }}
                >
                  {selectedGroup.status === "active" ? "Deactivate" : "Activate"}
                </Button>

                <Button
                  variant="contained"
                  onClick={() => handleOpenEditDrawer(selectedGroup)}
                  sx={{
                    backgroundColor: "#2563eb",
                    "&:hover": { backgroundColor: "#1d4ed8" },
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "10px",
                    px: 2.5,
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                  }}
                >
                  Edit
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Drawer>

      {/* ======================================================== */}
      {/* 2. CREATE / EDIT DRAWER (Matching Businesses.jsx style)  */}
      {/* ======================================================== */}
      <Drawer
        anchor="right"
        open={formDrawerOpen}
        onClose={() => setFormDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "540px", md: "620px" },
            maxWidth: "100vw",
            p: 0,
            backgroundColor: "#f8fafc",
            boxShadow: "-8px 0 32px rgba(15, 23, 42, 0.08)",
          },
        }}
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleFormSubmit}
          sx={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2.5,
              backgroundColor: "#ffffff",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "20px", color: "#0f172a" }}>
                {editingGroup ? "Edit Business Group" : "Create Business Group"}
              </Typography>
              <Typography sx={{ fontSize: "12.5px", color: "#64748b", mt: 0.3 }}>
                Groups organize businesses under a common owner for consolidated reporting and access.
              </Typography>
            </Box>
            <IconButton onClick={() => setFormDrawerOpen(false)} sx={{ color: "#94a3b8" }}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          {/* Form Body Cards */}
          <Box sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1, overflowY: "auto" }}>
            <Stack spacing={2.5}>
              <Card
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: "14px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: "14px", color: "#334155", mb: 2 }}>
                  Group Information
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                  {/* Group Name with Inline Validation */}
                  <TextField
                    fullWidth
                    size="small"
                    label="Group Name *"
                    placeholder="e.g. My Business TV"
                    value={formData.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({ ...prev, name: val }));
                      if (formTouched.name) {
                        setFormErrors((prev) => ({
                          ...prev,
                          name: !val.trim() ? "Group Name is required" : "",
                        }));
                      }
                    }}
                    onBlur={() => {
                      setFormTouched((prev) => ({ ...prev, name: true }));
                      if (!formData.name.trim()) {
                        setFormErrors((prev) => ({ ...prev, name: "Group Name is required" }));
                      }
                    }}
                    error={Boolean(formTouched.name && formErrors.name)}
                    helperText={formTouched.name && formErrors.name}
                    sx={modernInputStyles}
                  />

                  {/* Group Owner with Inline Validation */}
                  <Box>
                    <Autocomplete
                      size="small"
                      openOnFocus
                      options={ownerOptions}
                      getOptionLabel={(option) => {
                        if (typeof option === "string") return option;
                        if (!option) return "";
                        return option.name && option.email
                          ? `${option.name} (${option.email})`
                          : option.name || option.email || "";
                      }}
                      isOptionEqualToValue={(option, value) => option?.id === value?.id}
                      value={formData.owner_option}
                      loading={ownerLoading}
                      filterOptions={(options, state) => {
                        const input = (state.inputValue || "").toLowerCase().trim();
                        if (!input) return options;
                        return options.filter((opt) => {
                          const name = (opt.name || "").toLowerCase();
                          const email = (opt.email || "").toLowerCase();
                          const phone = (opt.phone || "").toLowerCase();
                          return name.includes(input) || email.includes(input) || phone.includes(input);
                        });
                      }}
                      onInputChange={(_, newInputValue, reason) => {
                        if (reason === "input") {
                          fetchOwnerOptions(newInputValue);
                        }
                      }}
                      onChange={(_, newValue) => {
                        const ownerId = newValue ? newValue.id : null;
                        setFormData((prev) => ({
                          ...prev,
                          owner_id: ownerId,
                          owner_option: newValue,
                        }));
                        if (formTouched.owner_id) {
                          setFormErrors((prev) => ({
                            ...prev,
                            owner_id: !ownerId ? "Group Owner is required" : "",
                          }));
                        }
                      }}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          {...props}
                          key={option.id}
                          sx={{
                            display: "flex !important",
                            flexDirection: "column",
                            alignItems: "flex-start !important",
                            py: 1.2,
                            px: 1.8,
                            borderBottom: "1px solid #f1f5f9",
                            "&:hover": { bgcolor: "#f8fafc" },
                            cursor: "pointer",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                            <Typography sx={{ fontWeight: 600, fontSize: "13.5px", color: "#0f172a" }}>
                              {option.name}
                            </Typography>
                            <Typography sx={{ fontSize: "12.5px", color: "#2563eb", fontWeight: 500 }}>
                              ({option.email})
                            </Typography>
                          </Box>
                          <Typography sx={{ fontSize: "12px", color: "#94a3b8", mt: 0.3 }}>
                            {option.sub_label || `Owns ${option.businesses_count || 0} businesses`}
                          </Typography>
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Group Owner *"
                          placeholder="Search group owner by name or email"
                          onBlur={() => {
                            setFormTouched((prev) => ({ ...prev, owner_id: true }));
                            if (!formData.owner_id) {
                              setFormErrors((prev) => ({ ...prev, owner_id: "Group Owner is required" }));
                            }
                          }}
                          error={Boolean(formTouched.owner_id && formErrors.owner_id)}
                          helperText={formTouched.owner_id && formErrors.owner_id}
                          sx={modernInputStyles}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {ownerLoading ? <CircularProgress color="inherit" size={18} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                    {!formErrors.owner_id && (
                      <Typography sx={{ color: "#94a3b8", fontSize: "12px", mt: 0.6, pl: 0.5 }}>
                        The user responsible for this group. When created, all businesses owned by this owner will be grouped together.
                      </Typography>
                    )}
                  </Box>

                  {/* Description */}
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                    label="Description (Optional)"
                    placeholder="Add notes about this business group..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    sx={modernInputStyles}
                  />
                </Box>
              </Card>
            </Stack>
          </Box>

          {/* Footer Actions matching Businesses.jsx */}
          <Box
            sx={{
              p: 2.5,
              backgroundColor: "#ffffff",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.5,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setFormDrawerOpen(false)}
              disabled={formSubmitting}
              sx={{
                textTransform: "none",
                borderRadius: "10px",
                px: 2.5,
                color: "#64748b",
                borderColor: "#cbd5e1",
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={formSubmitting}
              startIcon={<SaveRoundedIcon />}
              sx={{
                backgroundColor: "#2563eb",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "10px",
                px: 3,
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                "&:hover": { backgroundColor: "#1d4ed8" },
              }}
            >
              {formSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : editingGroup ? (
                "Save Changes"
              ) : (
                "Save"
              )}
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* ======================================================== */}
      {/* 3. DELETE CONFIRMATION MODAL                             */}
      {/* ======================================================== */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleteLoading && setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#0f172a", pb: 1, fontSize: "17px" }}>
          Delete Business Group?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#64748b", fontSize: "13.5px" }}>
            Are you sure you want to delete <strong>{groupToDelete?.name}</strong>? Any businesses currently in this group will be unlinked but will not be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteLoading}
            sx={{ textTransform: "none", color: "#64748b", fontWeight: 600, borderRadius: "8px" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={deleteLoading}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
              boxShadow: "none",
              px: 2.5,
            }}
          >
            {deleteLoading ? <CircularProgress size={18} color="inherit" /> : "Delete Group"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
