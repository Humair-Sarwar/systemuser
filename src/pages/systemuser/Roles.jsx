import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  Pagination,
  InputAdornment,
  Skeleton,
  Stack,
  Breadcrumbs,
  Grid,
  Link as MuiLink,
  Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import RemoveDoneRoundedIcon from "@mui/icons-material/RemoveDoneRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import {
  getRolesApi,
  createRoleApi,
  updateRoleApi,
  deleteRoleApi,
  syncRoleApi,
} from "../../utils/apis/APIs";
import { handleError, handleSuccess } from "../../toast";
import { ROLE_PRIVILEGE_GROUPS } from "./rolePrivilegesData";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRoles, setTotalRoles] = useState(0);
  const perPage = 5;

  // Sync loading state per role id
  const [syncingId, setSyncingId] = useState(null);

  // Drawer state: Create / Edit
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // In-drawer search filter for privileges
  const [privilegeFilter, setPrivilegeFilter] = useState("");

  // Dialog state: Delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Dialog state: Sync
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [roleToSync, setRoleToSync] = useState(null);

  // All privilege IDs flat list
  const allPrivilegeIds = useMemo(() => {
    const ids = [];
    ROLE_PRIVILEGE_GROUPS.forEach((group) => {
      group.items.forEach((item) => ids.push(item.id));
    });
    return ids;
  }, []);

  // Filter groups according to user search inside the right drawer
  const filteredGroups = useMemo(() => {
    if (!privilegeFilter.trim()) return ROLE_PRIVILEGE_GROUPS;
    const query = privilegeFilter.toLowerCase().trim();
    return ROLE_PRIVILEGE_GROUPS.map((group) => {
      const titleMatches = group.title.toLowerCase().includes(query);
      const matchingItems = group.items.filter((item) =>
        item.label.toLowerCase().includes(query)
      );
      if (titleMatches) {
        return group;
      }
      if (matchingItems.length > 0) {
        return {
          ...group,
          items: matchingItems,
        };
      }
      return null;
    }).filter(Boolean);
  }, [privilegeFilter]);

  // Fetch roles
  const fetchRoles = useCallback(
    async (page = 1, search = "") => {
      try {
        setLoading(true);
        const res = await getRolesApi({ search, page, per_page: perPage });
        if (res && res.status === 200 && res.data?.status === true) {
          setRoles(res.data.data || []);
          setCurrentPage(res.data.current_page || 1);
          setTotalPages(res.data.last_page || 1);
          setTotalRoles(res.data.total || 0);
        } else {
          setRoles([]);
        }
      } catch (err) {
        console.error("Failed to load roles", err);
        handleError("Unable to fetch roles");
      } finally {
        setLoading(false);
      }
    },
    [perPage]
  );

  useEffect(() => {
    fetchRoles(currentPage, searchTerm);
  }, [fetchRoles, currentPage, searchTerm]);

  // Search handler
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Open Create Drawer
  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedRole(null);
    setFormData({
      title: "",
      description: "",
    });
    setSelectedPermissions([]);
    setFormErrors({});
    setPrivilegeFilter("");
    setOpenModal(true);
  };

  // Open Edit Drawer
  const handleOpenEdit = (role) => {
    setModalMode("edit");
    setSelectedRole(role);
    setFormData({
      title: role.title || "",
      description: role.description || "",
    });
    const existing = Array.isArray(role.permissions) ? role.permissions : [];
    setSelectedPermissions(existing);
    setFormErrors({});
    setPrivilegeFilter("");
    setOpenModal(true);
  };

  // Toggle single permission checkbox
  const handleTogglePermission = (id) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle all permissions in a specific group
  const handleToggleGroupAll = (group) => {
    const groupItemIds = group.items.map((i) => i.id);
    const allSelected = groupItemIds.every((id) => selectedPermissions.includes(id));

    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((id) => !groupItemIds.includes(id)));
    } else {
      setSelectedPermissions((prev) => [
        ...prev,
        ...groupItemIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  // Global Select / Deselect All
  const handleSelectAllGlobal = () => {
    setSelectedPermissions(allPrivilegeIds);
  };

  const handleDeselectAllGlobal = () => {
    setSelectedPermissions([]);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = "Role title is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Broadcast role privilege synchronization event across tabs and vendors
  const triggerRoleSyncBroadcast = (roleId) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("vendor_privileges_sync_time", Date.now().toString());
        if ("BroadcastChannel" in window) {
          const bc = new BroadcastChannel("vendor_privileges_sync");
          bc.postMessage({ roleId, timestamp: Date.now() });
          bc.close();
        }
      }
    } catch {
      // ignore broadcast errors
    }
  };

  // Save (Create or Update)
  const handleSaveRole = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title,
        description: formData.description,
        permissions: selectedPermissions,
      };

      if (modalMode === "create") {
        const res = await createRoleApi(payload);
        if (res && (res.status === 200 || res.status === 201) && res.data?.status === true) {
          handleSuccess("Role created successfully!");
          setOpenModal(false);
          fetchRoles(1, searchTerm);
        } else {
          const msg = res?.response?.data?.message || res?.data?.message || "Failed to create role";
          handleError(msg);
        }
      } else {
        const res = await updateRoleApi(selectedRole.id, payload);
        if (res && res.status === 200 && res.data?.status === true) {
          handleSuccess("Role updated successfully! Click 'Sync' on this role to apply privileges to vendors.");
          // NOTE: Privileges only apply to vendor after administrator clicks the Sync button
          setOpenModal(false);
          fetchRoles(currentPage, searchTerm);
        } else {
          const msg = res?.response?.data?.message || res?.data?.message || "Failed to update role";
          handleError(msg);
        }
      }
    } catch (err) {
      handleError("An error occurred while saving the role");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Delete Dialog
  const handleOpenDelete = (role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;
    try {
      setDeleting(true);
      const res = await deleteRoleApi(roleToDelete.id);
      if (res && res.status === 200 && res.data?.status === true) {
        handleSuccess("Role deleted successfully!");
        setDeleteDialogOpen(false);
        setRoleToDelete(null);
        fetchRoles(currentPage, searchTerm);
      } else {
        const msg = res?.response?.data?.message || "Failed to delete role";
        handleError(msg);
      }
    } catch (err) {
      handleError("Failed to delete role");
    } finally {
      setDeleting(false);
    }
  };

  // Open Sync confirmation dialog
  const handleOpenSync = (role) => {
    setRoleToSync(role);
    setSyncDialogOpen(true);
  };

  // Confirm Sync Role
  const handleConfirmSync = async () => {
    if (!roleToSync) return;
    try {
      setSyncingId(roleToSync.id);
      const res = await syncRoleApi(roleToSync.id);
      if (res && res.status === 200 && res.data?.status === true) {
        handleSuccess(`Role "${roleToSync.title}" synchronized successfully! Privileges are now active in vendor portals.`);
        triggerRoleSyncBroadcast(roleToSync.id);
        setSyncDialogOpen(false);
        setRoleToSync(null);
        fetchRoles(currentPage, searchTerm);
      } else {
        const msg = res?.response?.data?.message || "Failed to sync role";
        handleError(msg);
      }
    } catch (err) {
      handleError("Failed to sync role");
    } finally {
      setSyncingId(null);
    }
  };

  // Helper to render a group of permissions inside a modern card
  const renderPrivilegeGroup = (group) => {
    const groupItemIds = group.items.map((i) => i.id);
    const selectedCount = groupItemIds.filter((id) => selectedPermissions.includes(id)).length;
    const isAllSelected = selectedCount === groupItemIds.length && groupItemIds.length > 0;
    const isIndeterminate = selectedCount > 0 && selectedCount < groupItemIds.length;

    return (
      <Paper
        key={group.id}
        elevation={0}
        sx={{
          width: "100%",
          boxSizing: "border-box",
          borderRadius: "14px",
          border: isAllSelected ? "1.5px solid #93c5fd" : "1px solid #e2e8f0",
          backgroundColor: isAllSelected ? "#fbfdff" : "#ffffff",
          overflow: "hidden",
          transition: "all 0.15s ease",
          boxShadow: isAllSelected
            ? "0 4px 14px rgba(37, 99, 235, 0.06)"
            : "0 1px 3px rgba(15, 23, 42, 0.03)",
          "&:hover": {
            borderColor: isAllSelected ? "#60a5fa" : "#cbd5e1",
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
          },
        }}
      >
        {/* Group Header */}
        <Box
          sx={{
            py: 1.1,
            px: 1.75,
            backgroundColor: isAllSelected ? "#eff6ff" : "#f8fafc",
            borderBottom: isAllSelected ? "1px solid #dbeafe" : "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "13.5px",
                color: isAllSelected ? "#1e40af" : "#1e293b",
                letterSpacing: "-0.01em",
              }}
            >
              {group.title}
            </Typography>
            {selectedCount > 0 && (
              <Chip
                label={`${selectedCount}/${groupItemIds.length}`}
                size="small"
                sx={{
                  height: "20px",
                  fontSize: "11px",
                  fontWeight: 700,
                  backgroundColor: isAllSelected ? "#2563eb" : "#e0e7ff",
                  color: isAllSelected ? "#ffffff" : "#3730a3",
                  borderRadius: "6px",
                }}
              />
            )}
          </Box>

          <Box
            onClick={() => handleToggleGroupAll(group)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              cursor: "pointer",
              userSelect: "none",
              py: 0.25,
              px: 0.75,
              borderRadius: "6px",
              "&:hover": { backgroundColor: isAllSelected ? "#dbeafe" : "#edf2f7" },
            }}
          >
            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>
              All
            </Typography>
            <Checkbox
              size="small"
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              sx={{
                p: 0.2,
                color: "#94a3b8",
                "&.Mui-checked": { color: "#2563eb" },
                "&.MuiCheckbox-indeterminate": { color: "#2563eb" },
              }}
            />
          </Box>
        </Box>

        {/* Group Checklist */}
        <Box sx={{ p: 1.25, display: "flex", flexDirection: "column", gap: 0.4 }}>
          {group.items.map((item) => {
            const isChecked = selectedPermissions.includes(item.id);
            return (
              <Box
                key={item.id}
                onClick={() => handleTogglePermission(item.id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  py: 0.45,
                  px: 1,
                  borderRadius: "8px",
                  cursor: "pointer",
                  userSelect: "none",
                  backgroundColor: isChecked ? "#f0f7ff" : "transparent",
                  transition: "all 0.1s ease",
                  "&:hover": {
                    backgroundColor: isChecked ? "#e0efff" : "#f8fafc",
                  },
                }}
              >
                <Checkbox
                  size="small"
                  checked={isChecked}
                  sx={{
                    p: 0.2,
                    color: "#cbd5e1",
                    "&.Mui-checked": { color: "#2563eb" },
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: isChecked ? 600 : 400,
                    color: isChecked ? "#1e40af" : "#334155",
                    lineHeight: 1.35,
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Paper>
    );
  };

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      {/* Breadcrumbs & Header Section */}
      <Box sx={{ mb: 3 }}>
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
            Roles
          </Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "22px", sm: "26px" },
                  color: "#0f172a",
                  letterSpacing: "-0.02em",
                }}
              >
                Roles
              </Typography>
              <Chip
                label={`${totalRoles} total`}
                size="small"
                sx={{
                  backgroundColor: "#eff6ff",
                  color: "#2563eb",
                  fontWeight: 600,
                  fontSize: "12px",
                  borderRadius: "8px",
                }}
              />
            </Box>
            <Typography sx={{ color: "#64748b", fontSize: "13.5px", mt: 0.5 }}>
              Configure administrator access roles and privileges
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={handleOpenCreate}
            sx={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "14px",
              textTransform: "none",
              borderRadius: "12px",
              px: 2.75,
              py: 1.1,
              boxShadow: "0 6px 16px rgba(37, 99, 235, 0.25)",
              "&:hover": {
                backgroundColor: "#1d4ed8",
                boxShadow: "0 8px 20px rgba(37, 99, 235, 0.35)",
              },
            }}
          >
            Create Role
          </Button>
        </Box>
      </Box>

      {/* Main Table Card */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
        }}
      >
        {/* Search bar inside header */}
        <Box
          sx={{
            p: 2.5,
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search Role..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              maxWidth: 420,
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#f8fafc",
                fontSize: "14px",
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
                  <SearchIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          <Tooltip title="Refresh roles list">
            <IconButton
              onClick={() => fetchRoles(currentPage, searchTerm)}
              size="small"
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                p: 1,
                color: "#64748b",
                "&:hover": { color: "#2563eb", borderColor: "#2563eb", backgroundColor: "#eff6ff" },
              }}
            >
              <SyncRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Roles Table */}
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: "#f8fafc" }}>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "13px",
                    color: "#475569",
                    py: 1.75,
                    borderBottom: "1px solid #f1f5f9",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    width: "28%",
                  }}
                >
                  Title
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "13px",
                    color: "#475569",
                    py: 1.75,
                    borderBottom: "1px solid #f1f5f9",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Description
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "13px",
                    color: "#475569",
                    py: 1.75,
                    borderBottom: "1px solid #f1f5f9",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    textAlign: "right",
                    pr: 4,
                    width: "160px",
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Skeleton variant="rounded" width={36} height={36} sx={{ borderRadius: "10px" }} />
                        <Box sx={{ width: "160px" }}>
                          <Skeleton variant="text" width="100%" height={24} />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="80%" height={20} />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 4 }}>
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                        <Skeleton variant="circular" width={30} height={30} />
                        <Skeleton variant="circular" width={30} height={30} />
                        <Skeleton variant="circular" width={30} height={30} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : roles.length > 0 ? (
                roles.map((role) => {
                  const p1 = Array.isArray(role.permissions) ? [...role.permissions].sort() : [];
                  const p2 = Array.isArray(role.synced_permissions) ? [...role.synced_permissions].sort() : [];
                  const hasUnsynced = JSON.stringify(p1) !== JSON.stringify(p2);

                  return (
                  <TableRow
                    key={role.id}
                    hover
                    sx={{
                      transition: "background-color 0.15s ease",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    {/* Role Title */}
                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "10px",
                            backgroundColor: "#eff6ff",
                            color: "#2563eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            border: "1px solid #dbeafe",
                          }}
                        >
                          <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 20 }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "#0f172a" }}>
                            {role.title}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mt: 0.25 }}>
                            {Array.isArray(role.permissions) && role.permissions.length > 0 && (
                              <Typography sx={{ fontSize: "11.5px", color: "#64748b" }}>
                                {role.permissions.length} privilege{role.permissions.length === 1 ? "" : "s"} granted
                              </Typography>
                            )}
                            {hasUnsynced && (
                              <Chip
                                label="Sync pending"
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: "10px",
                                  fontWeight: 700,
                                  backgroundColor: "#eff6ff",
                                  color: "#2563eb",
                                  border: "1px solid #bfdbfe",
                                  "& .MuiChip-label": { px: 0.8 },
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Role Description */}
                    <TableCell sx={{ py: 2 }}>
                      <Typography sx={{ fontSize: "13.5px", color: "#475569" }}>
                        {role.description || "—"}
                      </Typography>
                    </TableCell>

                    {/* Action Column: Edit, Delete, Sync */}
                    <TableCell align="right" sx={{ py: 2, pr: 4 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                        {/* 1. Edit Button (Blue pen) */}
                        <Tooltip title="Edit Role">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(role)}
                            sx={{
                              color: "#2563eb",
                              backgroundColor: "#eff6ff",
                              borderRadius: "8px",
                              p: 0.8,
                              "&:hover": {
                                backgroundColor: "#dbeafe",
                              },
                            }}
                          >
                            <EditOutlinedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>

                        {/* 2. Delete Button (Red trash) */}
                        <Tooltip title="Delete Role">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDelete(role)}
                            sx={{
                              color: "#ef4444",
                              backgroundColor: "#fef2f2",
                              borderRadius: "8px",
                              p: 0.8,
                              "&:hover": {
                                backgroundColor: "#fee2e2",
                              },
                            }}
                          >
                            <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>

                        {/* 3. Sync Button (Circular sync to update/sync role across system) */}
                        <Tooltip
                          title={
                            hasUnsynced
                              ? "Privileges modified! Click to Sync and apply to vendors."
                              : "Sync Role Permissions"
                          }
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleOpenSync(role)}
                            disabled={syncingId === role.id}
                            sx={{
                              color: hasUnsynced ? "#2563eb" : "#0f172a",
                              backgroundColor: hasUnsynced ? "#eff6ff" : "#f1f5f9",
                              border: hasUnsynced ? "1px solid #bfdbfe" : "none",
                              borderRadius: "8px",
                              p: 0.8,
                              "&:hover": {
                                backgroundColor: hasUnsynced ? "#dbeafe" : "#e2e8f0",
                                color: "#2563eb",
                              },
                            }}
                          >
                            {hasUnsynced ? (
                              <Badge
                                color="primary"
                                variant="dot"
                                sx={{
                                  "& .MuiBadge-badge": {
                                    backgroundColor: "#2563eb",
                                    top: 1,
                                    right: 1,
                                  },
                                }}
                              >
                                <SyncRoundedIcon
                                  sx={{
                                    fontSize: 18,
                                    animation: syncingId === role.id ? "spin 1s linear infinite" : "none",
                                    "@keyframes spin": {
                                      "0%": { transform: "rotate(0deg)" },
                                      "100%": { transform: "rotate(360deg)" },
                                    },
                                  }}
                                />
                              </Badge>
                            ) : (
                              <SyncRoundedIcon
                                sx={{
                                  fontSize: 18,
                                  animation: syncingId === role.id ? "spin 1s linear infinite" : "none",
                                  "@keyframes spin": {
                                    "0%": { transform: "rotate(0deg)" },
                                    "100%": { transform: "rotate(360deg)" },
                                  },
                                }}
                              />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3} sx={{ py: 8, textAlign: "center" }}>
                    <Box sx={{ maxWidth: 320, mx: "auto", textAlign: "center" }}>
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
                        <ShieldOutlinedIcon sx={{ fontSize: 28 }} />
                      </Box>
                      <Typography sx={{ fontWeight: 600, fontSize: "15px", color: "#1e293b" }}>
                        No roles found
                      </Typography>
                      <Typography sx={{ color: "#64748b", fontSize: "13px", mt: 0.5, mb: 2 }}>
                        {searchTerm
                          ? `No roles matched "${searchTerm}". Try a different keyword.`
                          : "No roles have been created yet."}
                      </Typography>
                      {searchTerm ? (
                        <Button
                          size="small"
                          onClick={() => setSearchTerm("")}
                          sx={{ textTransform: "none", fontSize: "13px" }}
                        >
                          Clear Search
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={handleOpenCreate}
                          sx={{
                            backgroundColor: "#2563eb",
                            textTransform: "none",
                            borderRadius: "10px",
                            fontSize: "13px",
                          }}
                        >
                          Create Role
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Bar */}
        {roles.length > 0 && (
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
              Page {currentPage} of {Math.max(totalPages, 1)} ({totalRoles} roles)
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

      {/* CREATE / EDIT ROLE: RIGHT-SIDE SLIDE-OVER DRAWER */}
      <Drawer
        anchor="right"
        open={openModal}
        onClose={() => !submitting && setOpenModal(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "92vw", md: "86vw", lg: "78vw", xl: "1260px" },
            maxWidth: "100vw",
            backgroundColor: "#f8fafc",
            display: "flex",
            flexDirection: "column",
            boxShadow: "-8px 0 40px rgba(15, 23, 42, 0.16)",
          },
        }}
      >
        {/* Sticky Drawer Header */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e2e8f0",
            boxShadow: "0 2px 10px rgba(15, 23, 42, 0.04)",
          }}
        >
          {/* Top Line: Mode Title, Badges & Top Actions */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
              px: { xs: 2, sm: 3.5 },
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "12px",
                  backgroundColor: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #dbeafe",
                }}
              >
                <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "18px", color: "#0f172a" }}>
                  {modalMode === "create" ? "Create New Role" : `Edit Role: ${selectedRole?.title || ""}`}
                </Typography>
                <Typography sx={{ fontSize: "12.5px", color: "#64748b" }}>
                  Configure role information and assign granular privileges
                </Typography>
              </Box>
            </Box>

            {/* Top Right Save & Close Actions */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Chip
                icon={<CheckCircleRoundedIcon sx={{ fontSize: "16px !important", color: "#2563eb !important" }} />}
                label={`${selectedPermissions.length} Privileges Selected`}
                sx={{
                  display: { xs: "none", sm: "flex" },
                  backgroundColor: "#eff6ff",
                  color: "#1d4ed8",
                  fontWeight: 700,
                  fontSize: "12.5px",
                  borderRadius: "8px",
                  border: "1px solid #bfdbfe",
                }}
              />

              <Button
                variant="contained"
                onClick={handleSaveRole}
                disabled={submitting}
                sx={{
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "13.5px",
                  textTransform: "none",
                  borderRadius: "10px",
                  px: 2.75,
                  py: 0.8,
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                  "&:hover": { backgroundColor: "#1d4ed8" },
                }}
              >
                {submitting ? "Saving..." : modalMode === "create" ? "Save Role" : "Update Role"}
              </Button>

              <IconButton
                size="small"
                onClick={() => setOpenModal(false)}
                disabled={submitting}
                sx={{
                  color: "#64748b",
                  backgroundColor: "#f1f5f9",
                  borderRadius: "10px",
                  p: 0.9,
                  "&:hover": { backgroundColor: "#e2e8f0", color: "#0f172a" },
                }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>

          {/* Form Fields: Role & Descriptions */}
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              backgroundColor: "#ffffff",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1.6fr" },
              gap: 2,
            }}
          >
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", mb: 0.75 }}>
                Role Name <span style={{ color: "#ef4444" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. POS Access, Store Manager, Web Admin"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (formErrors.title) setFormErrors({ ...formErrors, title: null });
                }}
                error={Boolean(formErrors.title)}
                helperText={formErrors.title}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "#f8fafc",
                    fontSize: "14px",
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

            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", mb: 0.75 }}>
                Description
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Provide a short description of the responsibilities and scope of this role..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "#f8fafc",
                    fontSize: "14px",
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
          </Box>

          {/* Privilege Controls: Search filter & Batch Toggles */}
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: 1.5,
              backgroundColor: "#f1f5f9",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            {/* Live Filter Box */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: { xs: "1 1 100%", sm: "0 1 380px" } }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Filter privileges by keyword (e.g. pos, orders, stock)..."
                value={privilegeFilter}
                onChange={(e) => setPrivilegeFilter(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "9px",
                    backgroundColor: "#ffffff",
                    fontSize: "13px",
                    "& fieldset": { borderColor: "#cbd5e1" },
                    "&:hover fieldset": { borderColor: "#94a3b8" },
                    "&.Mui-focused": {
                      "& fieldset": { borderColor: "#2563eb" },
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterListRoundedIcon sx={{ color: "#64748b", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  endAdornment: privilegeFilter ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setPrivilegeFilter("")} sx={{ p: 0.5 }}>
                        <ClearRoundedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />
            </Box>

            {/* Quick Batch Select / Deselect */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                size="small"
                startIcon={<DoneAllRoundedIcon sx={{ fontSize: "16px !important" }} />}
                onClick={handleSelectAllGlobal}
                sx={{
                  textTransform: "none",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "#2563eb",
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  px: 1.75,
                  py: 0.6,
                  border: "1px solid #bfdbfe",
                  "&:hover": { backgroundColor: "#eff6ff", borderColor: "#2563eb" },
                }}
              >
                Select All ({allPrivilegeIds.length})
              </Button>
              <Button
                size="small"
                startIcon={<RemoveDoneRoundedIcon sx={{ fontSize: "16px !important" }} />}
                onClick={handleDeselectAllGlobal}
                sx={{
                  textTransform: "none",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "#64748b",
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  px: 1.75,
                  py: 0.6,
                  border: "1px solid #cbd5e1",
                  "&:hover": { backgroundColor: "#f8fafc", color: "#0f172a" },
                }}
              >
                Deselect All
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Drawer Scrollable Body: 3 Columns Grid of Privileges */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: { xs: 2, sm: 3 },
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {filteredGroups.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: "center",
                borderRadius: "16px",
                border: "1px dashed #cbd5e1",
                backgroundColor: "#ffffff",
              }}
            >
              <Typography sx={{ fontWeight: 600, fontSize: "15px", color: "#1e293b", mb: 0.5 }}>
                No privileges match "{privilegeFilter}"
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: "13px", mb: 2 }}>
                Try searching for another keyword or clear the filter.
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setPrivilegeFilter("")}
                sx={{ textTransform: "none", borderRadius: "8px" }}
              >
                Clear Filter
              </Button>
            </Paper>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2.5,
                width: "100%",
                alignItems: "start",
                boxSizing: "border-box",
              }}
            >
              {/* Column 1 */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, width: "100%" }}>
                {filteredGroups
                  .filter((g) => g.column === 1)
                  .map(renderPrivilegeGroup)}
              </Box>

              {/* Column 2 */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, width: "100%" }}>
                {filteredGroups
                  .filter((g) => g.column === 2)
                  .map(renderPrivilegeGroup)}
              </Box>

              {/* Column 3 */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, width: "100%" }}>
                {filteredGroups
                  .filter((g) => g.column === 3)
                  .map(renderPrivilegeGroup)}
              </Box>
            </Box>
          )}
        </Box>

        {/* Drawer Sticky Footer Bar */}
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            zIndex: 10,
            backgroundColor: "#ffffff",
            borderTop: "1px solid #e2e8f0",
            py: 2,
            px: { xs: 2, sm: 3.5 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 -4px 16px rgba(15, 23, 42, 0.05)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>
              <strong style={{ color: "#0f172a", fontWeight: 700 }}>{selectedPermissions.length}</strong> of {allPrivilegeIds.length} privileges assigned
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Button
              onClick={() => setOpenModal(false)}
              disabled={submitting}
              sx={{
                color: "#64748b",
                fontWeight: 600,
                fontSize: "13.5px",
                textTransform: "none",
                borderRadius: "10px",
                px: 2.5,
                py: 0.8,
                "&:hover": { backgroundColor: "#f1f5f9", color: "#0f172a" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveRole}
              disabled={submitting}
              sx={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "13.5px",
                textTransform: "none",
                borderRadius: "10px",
                px: 3.5,
                py: 0.85,
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                "&:hover": { backgroundColor: "#1d4ed8" },
              }}
            >
              {submitting ? "Saving..." : modalMode === "create" ? "Save Role" : "Update Role"}
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            p: 1.5,
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.15)",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              backgroundColor: "#fee2e2",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WarningAmberRoundedIcon sx={{ fontSize: 24 }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: "17px", color: "#0f172a" }}>
            Delete Role
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ py: 1 }}>
          <Typography sx={{ fontSize: "14px", color: "#475569", lineHeight: 1.5 }}>
            Are you sure you want to delete the role{" "}
            <strong>"{roleToDelete?.title}"</strong>? This will revoke associated privileges.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 2, pt: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
            sx={{
              color: "#64748b",
              fontWeight: 600,
              fontSize: "13.5px",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={deleting}
            sx={{
              backgroundColor: "#ef4444",
              fontWeight: 600,
              fontSize: "13.5px",
              textTransform: "none",
              borderRadius: "10px",
              px: 2.5,
              "&:hover": { backgroundColor: "#dc2626" },
            }}
          >
            {deleting ? "Deleting..." : "Delete Role"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* SYNC CONFIRMATION DIALOG */}
      <Dialog
        open={syncDialogOpen}
        onClose={() => syncingId === null && setSyncDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            p: 1.5,
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.15)",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              backgroundColor: "#eff6ff",
              color: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #dbeafe",
            }}
          >
            <SyncRoundedIcon sx={{ fontSize: 24 }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: "17px", color: "#0f172a" }}>
            Sync Role Permissions
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ py: 1 }}>
          <Typography sx={{ fontSize: "14px", color: "#475569", lineHeight: 1.5 }}>
            Are you sure you want to synchronize permissions for{" "}
            <strong>"{roleToSync?.title}"</strong>? This will propagate and refresh all assigned permissions across the system.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 2, pt: 2 }}>
          <Button
            onClick={() => setSyncDialogOpen(false)}
            disabled={syncingId !== null}
            sx={{
              color: "#64748b",
              fontWeight: 600,
              fontSize: "13.5px",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmSync}
            disabled={syncingId !== null}
            sx={{
              backgroundColor: "#2563eb",
              fontWeight: 600,
              fontSize: "13.5px",
              textTransform: "none",
              borderRadius: "10px",
              px: 2.5,
              "&:hover": { backgroundColor: "#1d4ed8" },
            }}
          >
            {syncingId !== null ? "Syncing..." : "Yes, Sync Role"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Roles;
