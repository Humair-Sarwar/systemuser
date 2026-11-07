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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  Pagination,
  InputAdornment,
  Skeleton,
  Stack,
  Breadcrumbs,
  Grid,
  MenuItem,
  Link as MuiLink,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  getCountriesApi,
  createCountryApi,
  updateCountryApi,
  deleteCountryApi,
  toggleCountryStatusApi,
} from "../../utils/apis/APIs";
import { handleError, handleSuccess } from "../../toast";

// Popular Currencies
const COMMON_CURRENCIES = [
  "USD", "EUR", "GBP", "AFN", "ALL", "DZD", "AOA", "XCD", "ARS", "AMD",
  "AWG", "AUD", "CAD", "PKR", "INR", "JPY", "CNY", "SAR", "AED", "TRY",
  "CHF", "NZD", "SGD", "HKD", "SEK", "NOK", "MXN", "BRL", "ZAR"
];

// Popular Time Zones
const COMMON_TIME_ZONES = [
  "Asia/Kabul",
  "Europe/Tirane",
  "Africa/Algiers",
  "Pacific/Pago_Pago",
  "Europe/Andorra",
  "Africa/Luanda",
  "America/Anguilla",
  "America/Antigua",
  "America/Argentina/Buenos_Aires",
  "Asia/Yerevan",
  "America/Aruba",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Australia/Perth",
  "Europe/Vienna",
  "Europe/Brussels",
  "America/Toronto",
  "America/Vancouver",
  "Europe/Berlin",
  "Europe/Paris",
  "Europe/Rome",
  "Europe/Madrid",
  "Europe/London",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Riyadh",
  "Asia/Tokyo",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
];

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCountries, setTotalCountries] = useState(0);
  const perPage = 10;

  // Toggle status loading
  const [togglingId, setTogglingId] = useState(null);

  // Dialog state: Create / Edit
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    nice_name: "",
    iso3: "",
    iso: "",
    phone_code: "",
    num_code: "",
    currency: "",
    time_zone: "",
    status: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Dialog state: Delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch countries
  const fetchCountries = useCallback(
    async (page = 1, search = "") => {
      try {
        setLoading(true);
        const res = await getCountriesApi({ search, page, per_page: perPage });
        if (res && res.status === 200 && res.data?.status === true) {
          setCountries(res.data.data || []);
          setCurrentPage(res.data.current_page || 1);
          setTotalPages(res.data.last_page || 1);
          setTotalCountries(res.data.total || 0);
        } else {
          setCountries([]);
        }
      } catch (err) {
        console.error("Failed to load countries", err);
        handleError("Unable to fetch countries");
      } finally {
        setLoading(false);
      }
    },
    [perPage]
  );

  useEffect(() => {
    fetchCountries(currentPage, searchTerm);
  }, [fetchCountries, currentPage, searchTerm]);

  // Search handler
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Open Create Dialog
  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedCountry(null);
    setFormData({
      name: "",
      nice_name: "",
      iso3: "",
      iso: "",
      phone_code: "",
      num_code: "",
      currency: "USD",
      time_zone: "Europe/London",
      status: true,
    });
    setFormErrors({});
    setOpenModal(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (country) => {
    setModalMode("edit");
    setSelectedCountry(country);
    setFormData({
      name: country.name || "",
      nice_name: country.nice_name || "",
      iso3: country.iso3 || "",
      iso: country.iso || "",
      phone_code: country.phone_code || "",
      num_code: country.num_code || "",
      currency: country.currency || "",
      time_zone: country.time_zone || "",
      status: country.status ?? true,
    });
    setFormErrors({});
    setOpenModal(true);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Required";
    if (!formData.iso3.trim()) errors.iso3 = "Required";
    if (!formData.iso.trim()) errors.iso = "Required";
    if (!formData.phone_code.toString().trim()) errors.phone_code = "Required";
    if (!formData.num_code.toString().trim()) errors.num_code = "Required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save (Create or Update)
  const handleSaveCountry = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        nice_name: formData.nice_name.trim() || formData.name.trim(),
        iso3: formData.iso3.trim().toUpperCase(),
        iso: formData.iso.trim().toUpperCase(),
        phone_code: formData.phone_code.toString().trim(),
        num_code: formData.num_code.toString().trim(),
        currency: formData.currency,
        time_zone: formData.time_zone,
        status: formData.status,
      };

      if (modalMode === "create") {
        const res = await createCountryApi(payload);
        if (res && (res.status === 200 || res.status === 201) && res.data?.status === true) {
          handleSuccess("Country created successfully!");
          setOpenModal(false);
          fetchCountries(1, searchTerm);
        } else {
          const msg = res?.response?.data?.message || res?.data?.message || "Failed to create country";
          handleError(msg);
        }
      } else {
        const res = await updateCountryApi(selectedCountry.id, payload);
        if (res && res.status === 200 && res.data?.status === true) {
          handleSuccess("Country updated successfully!");
          setOpenModal(false);
          fetchCountries(currentPage, searchTerm);
        } else {
          const msg = res?.response?.data?.message || res?.data?.message || "Failed to update country";
          handleError(msg);
        }
      }
    } catch (err) {
      handleError("An error occurred while saving country");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Country status switch
  const handleToggleStatus = async (country) => {
    try {
      setTogglingId(country.id);
      const res = await toggleCountryStatusApi(country.id);
      if (res && res.status === 200 && res.data?.status === true) {
        setCountries((prev) =>
          prev.map((c) => (c.id === country.id ? { ...c, status: !c.status } : c))
        );
        handleSuccess(`Status updated for "${country.name}"`);
      } else {
        handleError("Failed to update status");
      }
    } catch (err) {
      handleError("Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  // Open Delete Dialog
  const handleOpenDelete = (country) => {
    setCountryToDelete(country);
    setDeleteDialogOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!countryToDelete) return;
    try {
      setDeleting(true);
      const res = await deleteCountryApi(countryToDelete.id);
      if (res && res.status === 200 && res.data?.status === true) {
        handleSuccess("Country deleted successfully!");
        setDeleteDialogOpen(false);
        setCountryToDelete(null);
        fetchCountries(currentPage, searchTerm);
      } else {
        const msg = res?.response?.data?.message || "Failed to delete country";
        handleError(msg);
      }
    } catch (err) {
      handleError("Failed to delete country");
    } finally {
      setDeleting(false);
    }
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
          <Typography sx={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>
            Locations
          </Typography>
          <Typography sx={{ fontSize: "13px", color: "#2563eb", fontWeight: 600 }}>
            Countries
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
                Countries
              </Typography>
              <Chip
                label={`${totalCountries} total`}
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
              Manage global country records, currency defaults, and timezones
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
            Create Country
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
        {/* Search Bar */}
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
            placeholder="Search Country..."
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

          <Tooltip title="Refresh countries list">
            <IconButton
              onClick={() => fetchCountries(currentPage, searchTerm)}
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

        {/* Countries Table */}
        <TableContainer>
          <Table sx={{ minWidth: 950 }}>
            <TableHead sx={{ backgroundColor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#475569", py: 1.75 }}>
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#475569", py: 1.75 }}>
                  Nice Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#475569", py: 1.75 }}>
                  ISO3
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#475569", py: 1.75 }}>
                  ISO
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#475569", py: 1.75 }}>
                  Phone Code
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#475569", py: 1.75 }}>
                  Num Code
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#475569", py: 1.75 }}>
                  Currency
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#475569", py: 1.75 }}>
                  Time Zone
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#475569", py: 1.75 }}>
                  Status
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, fontSize: "13px", color: "#475569", py: 1.75, pr: 3 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 10 }).map((__, c) => (
                      <TableCell key={c}>
                        <Skeleton variant="text" width="80%" height={22} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : countries.length > 0 ? (
                countries.map((country) => (
                  <TableRow
                    key={country.id}
                    hover
                    sx={{
                      transition: "background-color 0.15s ease",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell sx={{ py: 1.8, fontWeight: 600, color: "#0f172a", fontSize: "13.5px" }}>
                      {country.name}
                    </TableCell>
                    <TableCell sx={{ py: 1.8, color: "#475569", fontSize: "13.5px" }}>
                      {country.nice_name || country.name}
                    </TableCell>
                    <TableCell sx={{ py: 1.8, color: "#475569", fontSize: "13.5px", fontWeight: 500 }}>
                      {country.iso3 || "—"}
                    </TableCell>
                    <TableCell sx={{ py: 1.8, color: "#475569", fontSize: "13.5px", fontWeight: 500 }}>
                      {country.iso || "—"}
                    </TableCell>
                    <TableCell sx={{ py: 1.8, color: "#475569", fontSize: "13.5px" }}>
                      {country.phone_code || "—"}
                    </TableCell>
                    <TableCell sx={{ py: 1.8, color: "#475569", fontSize: "13.5px" }}>
                      {country.num_code || "—"}
                    </TableCell>
                    <TableCell sx={{ py: 1.8, color: "#475569", fontSize: "13.5px", fontWeight: 600 }}>
                      {country.currency || "—"}
                    </TableCell>
                    <TableCell sx={{ py: 1.8, color: "#475569", fontSize: "13px" }}>
                      {country.time_zone || "—"}
                    </TableCell>
                    <TableCell sx={{ py: 1.8 }}>
                      <Switch
                        size="small"
                        checked={Boolean(country.status)}
                        disabled={togglingId === country.id}
                        onChange={() => handleToggleStatus(country)}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#2563eb",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                            backgroundColor: "#2563eb",
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1.8, pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                        <Tooltip title="Edit Country">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(country)}
                            sx={{
                              color: "#2563eb",
                              backgroundColor: "#eff6ff",
                              borderRadius: "8px",
                              p: 0.8,
                              "&:hover": { backgroundColor: "#dbeafe" },
                            }}
                          >
                            <EditOutlinedIcon sx={{ fontSize: 17 }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Country">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDelete(country)}
                            sx={{
                              color: "#ef4444",
                              backgroundColor: "#fef2f2",
                              borderRadius: "8px",
                              p: 0.8,
                              "&:hover": { backgroundColor: "#fee2e2" },
                            }}
                          >
                            <DeleteOutlineRoundedIcon sx={{ fontSize: 17 }} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} sx={{ py: 8, textAlign: "center" }}>
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
                        <PublicOutlinedIcon sx={{ fontSize: 28 }} />
                      </Box>
                      <Typography sx={{ fontWeight: 600, fontSize: "15px", color: "#1e293b" }}>
                        No countries found
                      </Typography>
                      <Typography sx={{ color: "#64748b", fontSize: "13px", mt: 0.5, mb: 2 }}>
                        {searchTerm
                          ? `No countries matched "${searchTerm}".`
                          : "No countries have been added yet."}
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
                          Create Country
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
        {totalPages > 1 && (
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
              Page {currentPage} of {totalPages} ({totalCountries} countries)
            </Typography>

            <Pagination
              count={totalPages}
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

      {/* CREATE / EDIT COUNTRY MODAL */}
      <Dialog
        open={openModal}
        onClose={() => !submitting && setOpenModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            boxShadow: "0 25px 60px -10px rgba(15, 23, 42, 0.2)",
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
            pt: 2,
            px: 3,
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: "18px", color: "#0f172a" }}>
            {modalMode === "create" ? "Create Country" : "Edit Country"}
          </Typography>

          <IconButton
            size="small"
            onClick={() => setOpenModal(false)}
            disabled={submitting}
            sx={{ color: "#94a3b8" }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
              gap: 2.5,
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* Country Name */}
            <Box sx={{ minWidth: 0, width: "100%" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", mb: 0.5 }}>
                Country Name
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Country Name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (formErrors.name) setFormErrors({ ...formErrors, name: null });
                }}
                error={Boolean(formErrors.name)}
                helperText={formErrors.name}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": { borderColor: formErrors.name ? "#ef4444" : "#cbd5e1" },
                  },
                }}
              />
            </Box>

            {/* Nice Name */}
            <Box sx={{ minWidth: 0, width: "100%" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", mb: 0.5 }}>
                Nice Name
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Nice Name"
                value={formData.nice_name}
                onChange={(e) => setFormData({ ...formData, nice_name: e.target.value })}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": { borderColor: "#cbd5e1" },
                  },
                }}
              />
            </Box>

            {/* ISO3 */}
            <Box sx={{ minWidth: 0, width: "100%" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", mb: 0.5 }}>
                ISO3
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="ISO3"
                value={formData.iso3}
                onChange={(e) => {
                  setFormData({ ...formData, iso3: e.target.value });
                  if (formErrors.iso3) setFormErrors({ ...formErrors, iso3: null });
                }}
                error={Boolean(formErrors.iso3)}
                helperText={formErrors.iso3}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": { borderColor: formErrors.iso3 ? "#ef4444" : "#cbd5e1" },
                  },
                }}
              />
            </Box>

            {/* ISO */}
            <Box sx={{ minWidth: 0, width: "100%" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", mb: 0.5 }}>
                ISO
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="ISO"
                value={formData.iso}
                onChange={(e) => {
                  setFormData({ ...formData, iso: e.target.value });
                  if (formErrors.iso) setFormErrors({ ...formErrors, iso: null });
                }}
                error={Boolean(formErrors.iso)}
                helperText={formErrors.iso}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": { borderColor: formErrors.iso ? "#ef4444" : "#cbd5e1" },
                  },
                }}
              />
            </Box>

            {/* Phone Code */}
            <Box sx={{ minWidth: 0, width: "100%" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", mb: 0.5 }}>
                Phone Code
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Phone Code"
                value={formData.phone_code}
                onChange={(e) => {
                  setFormData({ ...formData, phone_code: e.target.value });
                  if (formErrors.phone_code) setFormErrors({ ...formErrors, phone_code: null });
                }}
                error={Boolean(formErrors.phone_code)}
                helperText={formErrors.phone_code}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": { borderColor: formErrors.phone_code ? "#ef4444" : "#cbd5e1" },
                  },
                }}
              />
            </Box>

            {/* Num Code */}
            <Box sx={{ minWidth: 0, width: "100%" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", mb: 0.5 }}>
                Num Code
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Num Code"
                value={formData.num_code}
                onChange={(e) => {
                  setFormData({ ...formData, num_code: e.target.value });
                  if (formErrors.num_code) setFormErrors({ ...formErrors, num_code: null });
                }}
                error={Boolean(formErrors.num_code)}
                helperText={formErrors.num_code}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": { borderColor: formErrors.num_code ? "#ef4444" : "#cbd5e1" },
                  },
                }}
              />
            </Box>

            {/* Default Currency */}
            <Box sx={{ minWidth: 0, width: "100%" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", mb: 0.5 }}>
                Default Currency
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                helperText="A new business of this country starts with it; a business can change its own."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": { borderColor: "#cbd5e1" },
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: "11px",
                    color: "#64748b",
                    lineHeight: 1.3,
                    mt: 0.5,
                  },
                }}
              >
                {COMMON_CURRENCIES.map((curr) => (
                  <MenuItem key={curr} value={curr}>
                    {curr}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Time Zone */}
            <Box sx={{ minWidth: 0, width: "100%" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", mb: 0.5 }}>
                Time Zone
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={formData.time_zone}
                onChange={(e) => setFormData({ ...formData, time_zone: e.target.value })}
                helperText="The zone its receipts and e-mails show dates in."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": { borderColor: "#cbd5e1" },
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: "11px",
                    color: "#64748b",
                    lineHeight: 1.3,
                    mt: 0.5,
                  },
                }}
              >
                {COMMON_TIME_ZONES.map((tz) => (
                  <MenuItem key={tz} value={tz}>
                    {tz}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1, justifyContent: "flex-start" }}>
          <Button
            variant="contained"
            startIcon={<SaveRoundedIcon />}
            onClick={handleSaveCountry}
            disabled={submitting}
            sx={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "13.5px",
              textTransform: "none",
              borderRadius: "10px",
              px: 3,
              py: 0.9,
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
              "&:hover": { backgroundColor: "#1d4ed8" },
            }}
          >
            {submitting ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

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
            Delete Country
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ py: 1 }}>
          <Typography sx={{ fontSize: "14px", color: "#475569", lineHeight: 1.5 }}>
            Are you sure you want to delete the country{" "}
            <strong>"{countryToDelete?.name}"</strong>? All associated cities will also be removed.
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
            {deleting ? "Deleting..." : "Delete Country"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Countries;
