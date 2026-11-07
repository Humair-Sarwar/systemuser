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
  MenuItem,
  Link as MuiLink,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  getCitiesApi,
  createCityApi,
  updateCityApi,
  deleteCityApi,
  toggleCityStatusApi,
  getAllCountriesApi,
} from "../../utils/apis/APIs";
import { handleError, handleSuccess } from "../../toast";

const Cities = () => {
  const [cities, setCities] = useState([]);
  const [countriesList, setCountriesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCities, setTotalCities] = useState(0);
  const perPage = 10;

  // Toggle status loading
  const [togglingId, setTogglingId] = useState(null);

  // Dialog state: Create / Edit
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [selectedCity, setSelectedCity] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    country_id: "",
    status: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Dialog state: Delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load countries for dropdown selection
  const fetchCountriesList = useCallback(async () => {
    try {
      const res = await getAllCountriesApi();
      if (res && res.status === 200 && res.data?.status === true) {
        setCountriesList(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load countries list", err);
    }
  }, []);

  useEffect(() => {
    fetchCountriesList();
  }, [fetchCountriesList]);

  // Fetch cities
  const fetchCities = useCallback(
    async (page = 1, search = "", countryId = "") => {
      try {
        setLoading(true);
        const params = {
          search,
          page,
          per_page: perPage,
        };
        if (countryId) {
          params.country_id = countryId;
        }

        const res = await getCitiesApi(params);
        if (res && res.status === 200 && res.data?.status === true) {
          setCities(res.data.data || []);
          setCurrentPage(res.data.current_page || 1);
          setTotalPages(res.data.last_page || 1);
          setTotalCities(res.data.total || 0);
        } else {
          setCities([]);
        }
      } catch (err) {
        console.error("Failed to load cities", err);
        handleError("Unable to fetch cities");
      } finally {
        setLoading(false);
      }
    },
    [perPage]
  );

  useEffect(() => {
    fetchCities(currentPage, searchTerm, countryFilter);
  }, [fetchCities, currentPage, searchTerm, countryFilter]);

  // Search handler
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCountryFilterChange = (e) => {
    setCountryFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Open Create Dialog
  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedCity(null);
    setFormData({
      name: "",
      country_id: countriesList.length > 0 ? countriesList[0].id : "",
      status: true,
    });
    setFormErrors({});
    setOpenModal(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (city) => {
    setModalMode("edit");
    setSelectedCity(city);
    setFormData({
      name: city.name || "",
      country_id: city.country_id || (city.country ? city.country.id : ""),
      status: city.status ?? true,
    });
    setFormErrors({});
    setOpenModal(true);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Required";
    if (!formData.country_id) errors.country_id = "Required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save (Create or Update)
  const handleSaveCity = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        country_id: formData.country_id,
        status: formData.status,
      };

      if (modalMode === "create") {
        const res = await createCityApi(payload);
        if (res && (res.status === 200 || res.status === 201) && res.data?.status === true) {
          handleSuccess("City created successfully!");
          setOpenModal(false);
          fetchCities(1, searchTerm, countryFilter);
        } else {
          const msg = res?.response?.data?.message || res?.data?.message || "Failed to create city";
          handleError(msg);
        }
      } else {
        const res = await updateCityApi(selectedCity.id, payload);
        if (res && res.status === 200 && res.data?.status === true) {
          handleSuccess("City updated successfully!");
          setOpenModal(false);
          fetchCities(currentPage, searchTerm, countryFilter);
        } else {
          const msg = res?.response?.data?.message || res?.data?.message || "Failed to update city";
          handleError(msg);
        }
      }
    } catch (err) {
      handleError("An error occurred while saving city");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle City status switch
  const handleToggleStatus = async (city) => {
    try {
      setTogglingId(city.id);
      const res = await toggleCityStatusApi(city.id);
      if (res && res.status === 200 && res.data?.status === true) {
        setCities((prev) =>
          prev.map((c) => (c.id === city.id ? { ...c, status: !c.status } : c))
        );
        handleSuccess(`Status updated for "${city.name}"`);
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
  const handleOpenDelete = (city) => {
    setCityToDelete(city);
    setDeleteDialogOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!cityToDelete) return;
    try {
      setDeleting(true);
      const res = await deleteCityApi(cityToDelete.id);
      if (res && res.status === 200 && res.data?.status === true) {
        handleSuccess("City deleted successfully!");
        setDeleteDialogOpen(false);
        setCityToDelete(null);
        fetchCities(currentPage, searchTerm, countryFilter);
      } else {
        const msg = res?.response?.data?.message || "Failed to delete city";
        handleError(msg);
      }
    } catch (err) {
      handleError("Failed to delete city");
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
            Cities
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
                Cities
              </Typography>
              <Chip
                label={`${totalCities} total`}
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
              Manage cities mapped to their respective countries
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
            Create City
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
        {/* Search & Country Filter Bar */}
        <Box
          sx={{
            p: 2.5,
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <TextField
            size="small"
            placeholder="Search City..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              flex: { xs: "1 1 100%", sm: "0 1 380px" },
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

          <TextField
            select
            size="small"
            value={countryFilter}
            onChange={handleCountryFilterChange}
            displayEmpty
            sx={{
              minWidth: 200,
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#f8fafc",
                fontSize: "13.5px",
                "& fieldset": { borderColor: "#e2e8f0" },
              },
            }}
          >
            <MenuItem value="">
              <em>All Countries</em>
            </MenuItem>
            {countriesList.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <Tooltip title="Refresh cities list">
            <IconButton
              onClick={() => fetchCities(currentPage, searchTerm, countryFilter)}
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

        {/* Cities Table */}
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#475569", py: 1.75, width: "38%" }}>
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#475569", py: 1.75, width: "32%" }}>
                  Country
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "13px", color: "#475569", py: 1.75, width: "15%" }}>
                  Active
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, fontSize: "13px", color: "#475569", py: 1.75, pr: 4, width: "15%" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 4 }).map((__, c) => (
                      <TableCell key={c}>
                        <Skeleton variant="text" width="80%" height={22} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : cities.length > 0 ? (
                cities.map((city) => (
                  <TableRow
                    key={city.id}
                    hover
                    sx={{
                      transition: "background-color 0.15s ease",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell sx={{ py: 2, fontWeight: 600, color: "#0f172a", fontSize: "14px" }}>
                      {city.name}
                    </TableCell>

                    <TableCell sx={{ py: 2, color: "#334155", fontSize: "14px" }}>
                      {city.country?.name || "—"}
                    </TableCell>

                    <TableCell sx={{ py: 2 }}>
                      <Switch
                        size="small"
                        checked={Boolean(city.status)}
                        disabled={togglingId === city.id}
                        onChange={() => handleToggleStatus(city)}
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

                    <TableCell align="right" sx={{ py: 2, pr: 4 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                        <Tooltip title="Edit City">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(city)}
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

                        <Tooltip title="Delete City">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDelete(city)}
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
                  <TableCell colSpan={4} sx={{ py: 8, textAlign: "center" }}>
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
                        <LocationCityOutlinedIcon sx={{ fontSize: 28 }} />
                      </Box>
                      <Typography sx={{ fontWeight: 600, fontSize: "15px", color: "#1e293b" }}>
                        No cities found
                      </Typography>
                      <Typography sx={{ color: "#64748b", fontSize: "13px", mt: 0.5, mb: 2 }}>
                        {searchTerm
                          ? `No cities matched "${searchTerm}".`
                          : "No cities have been added yet."}
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
                          Create City
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
              Page {currentPage} of {totalPages} ({totalCities} cities)
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

      {/* CREATE / EDIT CITY MODAL */}
      <Dialog
        open={openModal}
        onClose={() => !submitting && setOpenModal(false)}
        maxWidth="xs"
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
            {modalMode === "create" ? "Create City" : "Edit City"}
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
            {/* Name */}
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", mb: 0.5 }}>
                Name
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Name"
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

            {/* Country */}
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", mb: 0.5 }}>
                Country
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={formData.country_id}
                onChange={(e) => {
                  setFormData({ ...formData, country_id: e.target.value });
                  if (formErrors.country_id) setFormErrors({ ...formErrors, country_id: null });
                }}
                error={Boolean(formErrors.country_id)}
                helperText={formErrors.country_id}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": { borderColor: formErrors.country_id ? "#ef4444" : "#cbd5e1" },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em>Select Country</em>
                </MenuItem>
                {countriesList.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
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
            onClick={handleSaveCity}
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
            Delete City
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ py: 1 }}>
          <Typography sx={{ fontSize: "14px", color: "#475569", lineHeight: 1.5 }}>
            Are you sure you want to delete the city{" "}
            <strong>"{cityToDelete?.name}"</strong>?
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
            {deleting ? "Deleting..." : "Delete City"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Cities;
