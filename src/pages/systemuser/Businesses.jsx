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
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Grid,
  Card,
  Avatar,
  Collapse,
  Autocomplete,
  Select,
  Dialog,
  DialogContent,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import {
  getSystemBusinessesApi,
  getBusinessFormOptionsApi,
  createSystemBusinessApi,
  updateSystemBusinessApi,
  toggleBlockBusinessApi,
  deleteSystemBusinessApi,
} from "../../utils/apis/APIs";
import { handleError, handleSuccess } from "../../toast";

// Self-contained high-res SVG flag renderer so true graphical flags display on all OS (including Windows)
const CountryFlag = ({ code, width = 24, height = 16 }) => {
  switch (code) {
    case "+44": // United Kingdom Union Jack (Matches user reference image)
      return (
        <svg
          width={width}
          height={height}
          viewBox="0 0 60 30"
          style={{ borderRadius: 3, display: "inline-block", verticalAlign: "middle", boxShadow: "0 0 1px rgba(0,0,0,0.3)" }}
        >
          <clipPath id="uk-clip">
            <path d="M0,0 v30 h60 v-30 z" />
          </clipPath>
          <g clipPath="url(#uk-clip)">
            <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" strokeWidth="6" />
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
            <path d="M30,0 v30 M0,15 h60" stroke="#ffffff" strokeWidth="10" />
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
          </g>
        </svg>
      );
    case "+92": // Pakistan
      return (
        <svg
          width={width}
          height={height}
          viewBox="0 0 60 40"
          style={{ borderRadius: 3, display: "inline-block", verticalAlign: "middle", boxShadow: "0 0 1px rgba(0,0,0,0.3)" }}
        >
          <rect width="15" height="40" fill="#ffffff" />
          <rect x="15" width="45" height="40" fill="#01411C" />
          <circle cx="38" cy="20" r="10" fill="#ffffff" />
          <circle cx="41" cy="18" r="9" fill="#01411C" />
          <polygon points="41,13 42,16 45,16 42.5,18 43.5,21 41,19 38.5,21 39.5,18 37,16 40,16" fill="#ffffff" />
        </svg>
      );
    case "+1": // USA / Canada
      return (
        <svg
          width={width}
          height={height}
          viewBox="0 0 60 32"
          style={{ borderRadius: 3, display: "inline-block", verticalAlign: "middle", boxShadow: "0 0 1px rgba(0,0,0,0.3)" }}
        >
          <rect width="60" height="32" fill="#B22234" />
          <rect y="2.5" width="60" height="2.5" fill="#ffffff" />
          <rect y="7.5" width="60" height="2.5" fill="#ffffff" />
          <rect y="12.5" width="60" height="2.5" fill="#ffffff" />
          <rect y="17.5" width="60" height="2.5" fill="#ffffff" />
          <rect y="22.5" width="60" height="2.5" fill="#ffffff" />
          <rect y="27.5" width="60" height="2.5" fill="#ffffff" />
          <rect width="24" height="17.5" fill="#3C3B6E" />
        </svg>
      );
    case "+971": // UAE
      return (
        <svg
          width={width}
          height={height}
          viewBox="0 0 60 30"
          style={{ borderRadius: 3, display: "inline-block", verticalAlign: "middle", boxShadow: "0 0 1px rgba(0,0,0,0.3)" }}
        >
          <rect width="60" height="10" fill="#00732f" />
          <rect y="10" width="60" height="10" fill="#ffffff" />
          <rect y="20" width="60" height="10" fill="#000000" />
          <rect width="15" height="30" fill="#ff0000" />
        </svg>
      );
    case "+966": // Saudi Arabia
      return (
        <svg
          width={width}
          height={height}
          viewBox="0 0 60 40"
          style={{ borderRadius: 3, display: "inline-block", verticalAlign: "middle", boxShadow: "0 0 1px rgba(0,0,0,0.3)" }}
        >
          <rect width="60" height="40" fill="#006C35" />
          <rect x="15" y="24" width="30" height="3" fill="#ffffff" rx="1" />
        </svg>
      );
    case "+49": // Germany
      return (
        <svg
          width={width}
          height={height}
          viewBox="0 0 60 36"
          style={{ borderRadius: 3, display: "inline-block", verticalAlign: "middle", boxShadow: "0 0 1px rgba(0,0,0,0.3)" }}
        >
          <rect width="60" height="12" fill="#000000" />
          <rect y="12" width="60" height="12" fill="#DD0000" />
          <rect y="24" width="60" height="12" fill="#FFCE00" />
        </svg>
      );
    case "+33": // France
      return (
        <svg
          width={width}
          height={height}
          viewBox="0 0 60 40"
          style={{ borderRadius: 3, display: "inline-block", verticalAlign: "middle", boxShadow: "0 0 1px rgba(0,0,0,0.3)" }}
        >
          <rect width="20" height="40" fill="#002654" />
          <rect x="20" width="20" height="40" fill="#ffffff" />
          <rect x="40" width="20" height="40" fill="#ED2939" />
        </svg>
      );
    default:
      return <span style={{ fontSize: "14px" }}>🌐</span>;
  }
};

const DIAL_CODES = [
  { code: "+44", name: "United Kingdom (+44)" },
  { code: "+92", name: "Pakistan (+92)" },
  { code: "+1", name: "US / Canada (+1)" },
  { code: "+971", name: "UAE (+971)" },
  { code: "+966", name: "Saudi Arabia (+966)" },
  { code: "+49", name: "Germany (+49)" },
  { code: "+33", name: "France (+33)" },
];

// Service options mapping: "Own site" removed as requested
const SERVICE_OPTIONS = [
  { id: "sale", label: "Sale" },
  { id: "trade_in", label: "Trade-in" },
  { id: "repair", label: "Repair" },
  { id: "pos", label: "POS" },
  { id: "on_store", label: "On Store" },
];

// Schema Creation Progress Steps
const SCHEMA_STEPS = [
  { label: "Validating business & owner assignment" },
  { label: "Provisioning PostgreSQL multi-tenant schema" },
  { label: "Migrating tenant tables (products, categories, brands, etc.)" },
  { label: "Activating store search_path & services" },
];

// Modern refined styling for all text fields
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

// Initial form data: services default completely UNCHECKED
const INITIAL_FORM_DATA = {
  name: "",
  branch_name: "",
  business_type: "Electronics Store",
  email: "",
  mobile_dial: "+44",
  mobile_no: "",
  whatsapp_dial: "+44",
  whatsapp_no: "",
  website_option: "system", // Radio: 'system' or 'personal'
  website_url: "",
  package_level: "Basic",
  services: [], // DEFAULT ALL UNCHECKED
  owner_id: "",
  role_id: "",
  schema_type: "new",
  schema_name: "",
  address: "",
  city_id: "",
  city_name: "",
  state_region: "",
  post_code: "",
  country_id: "",
  currency: "GBP",
  latitude: "",
  longitude: "",
  description: "",
  business_group_id: "",
};

export default function Businesses() {
  const [businesses, setBusinesses] = useState([]);
  const [groupedByOwner, setGroupedByOwner] = useState([]);
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({ all: 0, active: 0, blocked: 0, deleted: 0 });

  // Navigation / Views
  const [viewMode, setViewMode] = useState("businesses"); // 'businesses' | 'by_owner'
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'active' | 'blocked' | 'deleted'

  // Filters
  const [search, setSearch] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [schemaFilter, setSchemaFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;

  // Options from API
  const [formOptions, setFormOptions] = useState({
    owners: [],
    roles: [],
    countries: [],
    cities: [],
    existing_schemas: [],
    business_types: [],
    currencies: [],
    business_groups: [],
  });

  // Drawer states
  const [formDrawerOpen, setFormDrawerOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Live validation errors
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});

  // Validate a single field or all fields
  const validateField = (field, value, allData = formData) => {
    let error = "";
    switch (field) {
      case "services": {
        const val = value !== undefined ? value : allData.services;
        if (!Array.isArray(val) || val.length === 0) {
          error = "Please select at least one enabled service";
        }
        break;
      }
      case "name": {
        const val = (value !== undefined ? value : allData.name) || "";
        if (!val.trim()) {
          error = "Business Name is required";
        }
        break;
      }
      case "business_type": {
        const val = (value !== undefined ? value : allData.business_type) || "";
        if (!val.trim()) {
          error = "Business Type is required";
        }
        break;
      }
      case "branch_name": {
        const val = (value !== undefined ? value : allData.branch_name) || "";
        if (!val.trim()) {
          error = "Branch Name is required";
        }
        break;
      }
      case "email": {
        const val = (value !== undefined ? value : allData.email) || "";
        if (!val.trim()) {
          error = "Business Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) {
          error = "Please enter a valid email address";
        }
        break;
      }
      case "owner_id": {
        const val = value !== undefined ? value : allData.owner_id;
        if (!val) {
          error = "Business Owner is required";
        }
        break;
      }
      case "role_id": {
        const val = value !== undefined ? value : allData.role_id;
        if (!val) {
          error = "Role is required";
        }
        break;
      }
      case "city_id": {
        const val = value !== undefined ? value : allData.city_id;
        if (!val) {
          error = "City is required";
        }
        break;
      }
      case "country_id": {
        const val = value !== undefined ? value : allData.country_id;
        if (!val) {
          error = "Country is required";
        }
        break;
      }
      case "schema_name": {
        if (allData.schema_type === "new") {
          const val = (value !== undefined ? value : allData.schema_name || "").trim().toLowerCase();
          if (!val) {
            error = "Schema name is required";
          } else {
            const sanitized = val.replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "");
            const exists = (formOptions.existing_schemas || []).some(
              (s) => s.toLowerCase() === val || s.toLowerCase() === sanitized
            );
            if (exists) {
              error = `The schema "${val}" already exists.`;
            }
          }
        }
        break;
      }
      default:
        break;
    }
    return error;
  };

  const validateAll = () => {
    const fields = [
      "services",
      "name",
      "business_type",
      "branch_name",
      "email",
      "owner_id",
      "role_id",
      "city_id",
      "country_id",
    ];

    // Only validate schema_name when creating a brand new business with schema_type === "new"
    if (!editingBusiness && formData.schema_type === "new") {
      fields.push("schema_name");
    }

    const errors = {};
    const touched = {};
    fields.forEach((f) => {
      touched[f] = true;
      const err = validateField(f, formData[f]);
      if (err) errors[f] = err;
    });
    setFormTouched((prev) => ({ ...prev, ...touched }));
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (formTouched[field]) {
        const err = validateField(field, value, next);
        setFormErrors((prevErr) => ({ ...prevErr, [field]: err }));
      }
      return next;
    });
  };

  const handleBlur = (field) => {
    setFormTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, formData[field]);
    setFormErrors((prev) => ({ ...prev, [field]: err }));
  };

  // Schema creation progress popup states
  const TOTAL_MIGRATIONS = 492;
  const [schemaProgressOpen, setSchemaProgressOpen] = useState(false);
  const [schemaMigrationCount, setSchemaMigrationCount] = useState(0);
  const [schemaProgressPercent, setSchemaProgressPercent] = useState(0);
  const [schemaProgressStatus, setSchemaProgressStatus] = useState("running"); // 'running' | 'completed' | 'error'
  const [schemaProgressData, setSchemaProgressData] = useState(null);
  const [schemaProgressError, setSchemaProgressError] = useState("");

  // Detail drawer
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  // Toggle status loading
  const [togglingId, setTogglingId] = useState(null);

  // Expanded owner cards in 'by_owner' mode
  const [expandedOwners, setExpandedOwners] = useState({});

  // Fetch form options (owners, roles, countries, cities, etc.)
  const fetchFormOptions = async () => {
    try {
      const res = await getBusinessFormOptionsApi();
      if (res && res.status === 200 && res.data?.status === true) {
        setFormOptions({
          owners: (res.data.data.owners || []).filter((o) => Number(o.user_type) !== 3),
          roles: res.data.data.roles || [],
          countries: res.data.data.countries || [],
          cities: res.data.data.cities || [],
          existing_schemas: res.data.data.existing_schemas || [],
          business_types: res.data.data.business_types || [],
          currencies: res.data.data.currencies || [],
          business_groups: res.data.data.business_groups || [],
        });
      }
    } catch (err) {
      console.error("Failed to fetch business form options", err);
    }
  };

  useEffect(() => {
    fetchFormOptions();
  }, []);

  // Fetch businesses
  const fetchBusinesses = useCallback(
    async (page = 1, tab = "all", searchTerm = "", owner = "all", schema = "all", mode = "businesses") => {
      try {
        setLoading(true);
        const params = {
          page,
          tab,
          search: searchTerm,
          owner_id: owner,
          schema_name: schema,
          view_mode: mode,
          per_page: perPage,
        };

        const res = await getSystemBusinessesApi(params);
        if (res && res.status === 200 && res.data?.status === true) {
          if (res.data.counts) {
            setCounts(res.data.counts);
          }

          if (mode === "by_owner") {
            setGroupedByOwner(res.data.data || []);
          } else {
            setBusinesses(res.data.data || []);
            setCurrentPage(res.data.current_page || 1);
            setTotalPages(res.data.last_page || 1);
          }
        } else {
          setBusinesses([]);
          setGroupedByOwner([]);
        }
      } catch (err) {
        console.error("Failed to load businesses", err);
        handleError("Unable to fetch businesses");
      } finally {
        setLoading(false);
      }
    },
    [perPage]
  );

  useEffect(() => {
    fetchBusinesses(currentPage, activeTab, search, ownerFilter, schemaFilter, viewMode);
  }, [fetchBusinesses, currentPage, activeTab, search, ownerFilter, schemaFilter, viewMode]);

  // Tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Toggle block/unblock
  const handleToggleBlock = async (business) => {
    try {
      setTogglingId(business.id);
      const res = await toggleBlockBusinessApi(business.id);
      if (res && res.status === 200 && res.data?.status === true) {
        const newStatus = res.data.data.status;
        setBusinesses((prev) =>
          prev.map((b) => (b.id === business.id ? { ...b, status: newStatus } : b))
        );
        handleSuccess(`Business ${business.name} is now ${newStatus}`);
        fetchBusinesses(currentPage, activeTab, search, ownerFilter, schemaFilter, viewMode);
      } else {
        handleError("Failed to update status");
      }
    } catch (err) {
      handleError("An error occurred updating status");
    } finally {
      setTogglingId(null);
    }
  };

  // Delete or Restore
  const handleDeleteOrRestore = async (business) => {
    try {
      const res = await deleteSystemBusinessApi(business.id);
      if (res && res.status === 200 && res.data?.status === true) {
        handleSuccess(res.data.message || "Operation successful");
        fetchBusinesses(currentPage, activeTab, search, ownerFilter, schemaFilter, viewMode);
      } else {
        handleError("Operation failed");
      }
    } catch (err) {
      handleError("An error occurred");
    }
  };

  // Open Create Drawer
  const handleOpenCreateDrawer = () => {
    setEditingBusiness(null);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
    setFormTouched({});
    setFormDrawerOpen(true);
  };

  // Open Edit Drawer
  const handleOpenEditDrawer = (business) => {
    setEditingBusiness(business);
    setFormErrors({});
    setFormTouched({});
    setFormData({
      name: business.name || "",
      branch_name: business.branch_name || "",
      business_type: business.business_type || "Electronics Store",
      email: business.email || "",
      mobile_dial: "+44",
      mobile_no: business.mobile_no || "",
      whatsapp_dial: "+44",
      whatsapp_no: business.whatsapp_no || "",
      website_option: business.is_personal_website ? "personal" : "system",
      website_url: business.website_url || "",
      package_level: business.package_level || "Basic",
      services: Array.isArray(business.services) ? business.services : [],
      owner_id: business.owner_id || "",
      role_id: business.role_id || "",
      schema_type: business.schema_type || "new",
      schema_name: business.schema_name || "",
      address: business.address || "",
      city_id: business.city_id || "",
      city_name: business.city_name || "",
      state_region: business.state_region || "",
      post_code: business.post_code || "",
      country_id: business.country_id || "",
      currency: business.currency || "GBP",
      latitude: business.latitude || "",
      longitude: business.longitude || "",
      description: business.description || "",
      business_group_id: business.business_group_id || "",
    });
    setFormDrawerOpen(true);
  };

  // Open Detail Drawer
  const handleOpenDetail = (business) => {
    setSelectedBusiness(business);
    setDetailDrawerOpen(true);
  };

  // Country change auto-sync currency
  const handleCountryChange = (e) => {
    const cId = e.target.value;
    const selectedCountry = formOptions.countries.find((c) => c.id === cId);
    setFormData((prev) => {
      const next = {
        ...prev,
        country_id: cId,
        currency: selectedCountry?.currency || prev.currency,
      };
      if (formTouched.country_id) {
        setFormErrors((prevErr) => ({ ...prevErr, country_id: validateField("country_id", cId, next) }));
      }
      return next;
    });
  };

  // Service toggle checkbox
  const handleServiceToggle = (serviceId) => {
    setFormData((prev) => {
      const exists = prev.services.includes(serviceId);
      const updated = exists
        ? prev.services.filter((s) => s !== serviceId)
        : [...prev.services, serviceId];
      const next = { ...prev, services: updated };
      setFormTouched((t) => ({ ...t, services: true }));
      setFormErrors((prevErr) => ({
        ...prevErr,
        services: validateField("services", updated, next),
      }));
      return next;
    });
  };

  // Filter available cities based on selected country
  const availableCities = formData.country_id
    ? formOptions.cities.filter((c) => String(c.country_id) === String(formData.country_id)).length > 0
      ? formOptions.cities.filter((c) => String(c.country_id) === String(formData.country_id))
      : formOptions.cities
    : formOptions.cities;

  // Close progress dialog and refresh view
  const handleCloseProgressDialog = () => {
    setSchemaProgressOpen(false);
    setFormDrawerOpen(false);
    fetchBusinesses(1, activeTab, search, ownerFilter, schemaFilter, viewMode);
    fetchFormOptions();
  };

  // Form submit (create or update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Trigger full live validation check
    const isValid = validateAll();
    if (!isValid) {
      handleError("Please complete all required fields correctly.");
      return;
    }

    const isPersonal = formData.website_option === "personal";
    const payload = {
      ...formData,
      is_system_website: !isPersonal,
      is_personal_website: isPersonal,
      website_url: isPersonal ? formData.website_url : null,
    };

    // If Editing: standard update without schema provisioning dialog
    if (editingBusiness) {
      try {
        setFormSubmitting(true);
        const res = await updateSystemBusinessApi(editingBusiness.id, payload);
        if (res && res.status === 200 && res.data?.status === true) {
          handleSuccess("Business updated successfully");
          setFormDrawerOpen(false);
          fetchBusinesses(currentPage, activeTab, search, ownerFilter, schemaFilter, viewMode);
          fetchFormOptions();
        } else {
          handleError(res?.data?.message || "Failed to update business");
        }
      } catch (err) {
        handleError("An error occurred while updating business");
      } finally {
        setFormSubmitting(false);
      }
      return;
    }

    // If Creating with new schema: launch Schema Migration Progress Popup (matching user reference)
    if (formData.schema_type === "new") {
      let interval;
      try {
        setFormSubmitting(true);
        setSchemaProgressOpen(true);
        setSchemaProgressStatus("running");
        setSchemaProgressError("");
        setSchemaMigrationCount(24);
        setSchemaProgressPercent(5);

        let currentCount = 24;
        interval = setInterval(() => {
          if (currentCount < 450) {
            const step = Math.floor(Math.random() * 22) + 14;
            currentCount = Math.min(currentCount + step, 450);
            setSchemaMigrationCount(currentCount);
            setSchemaProgressPercent(Math.round((currentCount / TOTAL_MIGRATIONS) * 100));
          }
        }, 200);

        const res = await createSystemBusinessApi(payload);

        clearInterval(interval);

        if (res && (res.status === 200 || res.status === 201) && res.data?.status === true) {
          setSchemaMigrationCount(TOTAL_MIGRATIONS);
          setSchemaProgressPercent(100);
          setSchemaProgressStatus("completed");

          setTimeout(() => {
            setSchemaProgressOpen(false);
            setFormDrawerOpen(false);
            handleSuccess("Business and multi-tenant schema created successfully!");
            fetchBusinesses(currentPage, activeTab, search, ownerFilter, schemaFilter, viewMode);
            fetchFormOptions();
          }, 700);
        } else {
          setSchemaProgressStatus("error");
          setSchemaProgressError(res?.data?.message || "Failed to create business");
          handleError(res?.data?.message || "Failed to create business");
        }
      } catch (err) {
        if (interval) clearInterval(interval);
        console.error("Error creating business", err);
        setSchemaProgressStatus("error");
        const errTxt = err?.response?.data?.message || err?.message || "An error occurred while creating business";
        setSchemaProgressError(errTxt);
        handleError(errTxt);
      } finally {
        setFormSubmitting(false);
      }
      return;
    }

    // Creating with existing schema
    try {
      setFormSubmitting(true);
      const res = await createSystemBusinessApi(payload);
      if (res && (res.status === 200 || res.status === 201) && res.data?.status === true) {
        handleSuccess("Business created successfully!");
        setFormDrawerOpen(false);
        fetchBusinesses(currentPage, activeTab, search, ownerFilter, schemaFilter, viewMode);
        fetchFormOptions();
      } else {
        handleError(res?.data?.message || "Failed to create business");
      }
    } catch (err) {
      handleError(err?.response?.data?.message || err?.message || "An error occurred while creating business");
    } finally {
      setFormSubmitting(false);
    }
  };

  const toggleOwnerExpand = (ownerId) => {
    setExpandedOwners((prev) => ({ ...prev, [ownerId]: !prev[ownerId] }));
  };

  const selectedOwner = formOptions.owners.find((o) => o.id === formData.owner_id);

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      {/* Breadcrumb Navigation */}
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
          Businesses
        </Typography>
      </Breadcrumbs>

      {/* Header Bar with View Toggle & Create Button */}
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
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "22px", sm: "28px" },
            color: "#0f172a",
            letterSpacing: "-0.02em",
          }}
        >
          Businesses
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* View Toggle: Businesses vs By Owner */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f1f5f9",
              p: 0.5,
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
            }}
          >
            <Button
              size="small"
              onClick={() => setViewMode("businesses")}
              startIcon={<FormatListBulletedRoundedIcon fontSize="small" />}
              sx={{
                fontSize: "12.5px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                px: 1.5,
                py: 0.6,
                borderRadius: "8px",
                color: viewMode === "businesses" ? "#2563eb" : "#64748b",
                backgroundColor: viewMode === "businesses" ? "#ffffff" : "transparent",
                boxShadow: viewMode === "businesses" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                "&:hover": {
                  backgroundColor: viewMode === "businesses" ? "#ffffff" : "rgba(255,255,255,0.5)",
                },
              }}
            >
              Businesses
            </Button>
            <Button
              size="small"
              onClick={() => setViewMode("by_owner")}
              startIcon={<PeopleAltOutlinedIcon fontSize="small" />}
              sx={{
                fontSize: "12.5px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                px: 1.5,
                py: 0.6,
                borderRadius: "8px",
                color: viewMode === "by_owner" ? "#2563eb" : "#64748b",
                backgroundColor: viewMode === "by_owner" ? "#ffffff" : "transparent",
                boxShadow: viewMode === "by_owner" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                "&:hover": {
                  backgroundColor: viewMode === "by_owner" ? "#ffffff" : "rgba(255,255,255,0.5)",
                },
              }}
            >
              By Owner
            </Button>
          </Box>

          {/* Create Business Button */}
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
            Create Business
          </Button>
        </Box>
      </Box>

      {/* Main Container Card */}
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
        {/* Status Tabs Header with Counter Badges */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            px: 2.5,
            pt: 2,
            borderBottom: "1px solid #f1f5f9",
            overflowX: "auto",
          }}
        >
          {/* Tab: ALL */}
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
              All
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

          {/* Tab: BLOCKED */}
          <Box
            onClick={() => handleTabChange("blocked")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              pb: 1.5,
              cursor: "pointer",
              borderBottom: activeTab === "blocked" ? "2.5px solid #b91c1c" : "2.5px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            <Typography
              sx={{
                fontSize: "13.5px",
                fontWeight: activeTab === "blocked" ? 700 : 600,
                color: activeTab === "blocked" ? "#b91c1c" : "#64748b",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              Blocked
            </Typography>
            <Chip
              label={counts.blocked}
              size="small"
              sx={{
                height: "22px",
                fontSize: "11.5px",
                fontWeight: 700,
                backgroundColor: activeTab === "blocked" ? "#ef4444" : "#f1f5f9",
                color: activeTab === "blocked" ? "#ffffff" : "#64748b",
                borderRadius: "6px",
              }}
            />
          </Box>

          {/* Tab: DELETED */}
          <Box
            onClick={() => handleTabChange("deleted")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              pb: 1.5,
              cursor: "pointer",
              borderBottom: activeTab === "deleted" ? "2.5px solid #b91c1c" : "2.5px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            <Typography
              sx={{
                fontSize: "13.5px",
                fontWeight: activeTab === "deleted" ? 700 : 600,
                color: activeTab === "deleted" ? "#b91c1c" : "#64748b",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              Deleted
            </Typography>
            <Chip
              label={counts.deleted}
              size="small"
              sx={{
                height: "22px",
                fontSize: "11.5px",
                fontWeight: 700,
                backgroundColor: activeTab === "deleted" ? "#64748b" : "#f1f5f9",
                color: activeTab === "deleted" ? "#ffffff" : "#64748b",
                borderRadius: "6px",
              }}
            />
          </Box>
        </Box>

        {/* Filter Toolbar (Search, Owner, Schema) */}
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
            placeholder="Search name, branch, email, phone, owner..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            sx={{
              flex: { xs: "1 1 100%", md: "1 1 320px" },
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

          {/* Owner Filter */}
          <TextField
            select
            size="small"
            value={ownerFilter}
            onChange={(e) => {
              setOwnerFilter(e.target.value);
              setCurrentPage(1);
            }}
            sx={{
              minWidth: "160px",
              ...modernInputStyles,
            }}
          >
            <MenuItem value="all">All Owners</MenuItem>
            {formOptions.owners.map((owner) => (
              <MenuItem key={owner.id} value={owner.id}>
                {owner.first_name} {owner.last_name}
              </MenuItem>
            ))}
          </TextField>

          {/* Schema Filter */}
          <TextField
            select
            size="small"
            value={schemaFilter}
            onChange={(e) => {
              setSchemaFilter(e.target.value);
              setCurrentPage(1);
            }}
            sx={{
              minWidth: "160px",
              ...modernInputStyles,
            }}
          >
            <MenuItem value="all">All Schemas</MenuItem>
            {formOptions.existing_schemas.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>

          {/* Reset Filters / Refresh */}
          {(search || ownerFilter !== "all" || schemaFilter !== "all") && (
            <Button
              size="small"
              onClick={() => {
                setSearch("");
                setOwnerFilter("all");
                setSchemaFilter("all");
                setCurrentPage(1);
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

        {/* VIEW 1: Standard Table View */}
        {viewMode === "businesses" && (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 1050 }}>
                <TableHead sx={{ backgroundColor: "#f8fafc" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: "12.5px", color: "#475569", py: 1.8 }}>
                      Business
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "12.5px", color: "#475569", py: 1.8 }}>
                      Owner
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "12.5px", color: "#475569", py: 1.8 }}>
                      Schema
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "12.5px", color: "#475569", py: 1.8 }}>
                      Role
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "12.5px", color: "#475569", py: 1.8 }}>
                      Services
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "12.5px", color: "#475569", py: 1.8 }}>
                      Package
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "12.5px", color: "#475569", py: 1.8 }}>
                      Currency
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "12.5px", color: "#475569", py: 1.8 }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "12.5px", color: "#475569", py: 1.8 }}>
                      Created
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: "12.5px", color: "#475569", py: 1.8 }}>
                      Block / Edit
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell colSpan={10} sx={{ py: 2 }}>
                          <Skeleton variant="text" height={36} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : businesses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                        <StorefrontRoundedIcon sx={{ fontSize: 44, color: "#cbd5e1", mb: 1 }} />
                        <Typography sx={{ color: "#64748b", fontSize: "15px", fontWeight: 500 }}>
                          No businesses found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    businesses.map((biz) => {
                      const isBlocked = biz.status === "blocked";
                      const isDeleted = Boolean(biz.deleted_at);

                      return (
                        <TableRow
                          key={biz.id}
                          hover
                          sx={{
                            transition: "background-color 0.2s ease",
                            "&:hover": { backgroundColor: "#f8fafc" },
                          }}
                        >
                          {/* Business Column */}
                          <TableCell sx={{ py: 2 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: "14px", color: "#0f172a" }}>
                              {biz.name}
                            </Typography>
                            <Typography sx={{ fontSize: "12px", color: "#64748b" }}>
                              {biz.branch_name ? `${biz.branch_name} · ` : ""}
                              {biz.business_type || "Store"}
                            </Typography>
                            {biz.is_personal_website && (
                              <Typography
                                sx={{
                                  fontSize: "11px",
                                  color: "#d97706",
                                  fontWeight: 500,
                                  mt: 0.3,
                                }}
                              >
                                {biz.website_url ? `Own site (${biz.website_url})` : "Own website (no address set)"}
                              </Typography>
                            )}
                          </TableCell>

                          {/* Owner Column */}
                          <TableCell sx={{ py: 2 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: "13.5px", color: "#b91c1c" }}>
                              {biz.owner ? `${biz.owner.first_name} ${biz.owner.last_name}` : "—"}
                            </Typography>
                            <Typography sx={{ fontSize: "12px", color: "#64748b" }}>
                              {biz.owner?.email || biz.email || "—"}
                            </Typography>
                          </TableCell>

                          {/* Schema Column */}
                          <TableCell sx={{ py: 2 }}>
                            <Chip
                              label={biz.schema_name || "public"}
                              size="small"
                              sx={{
                                height: "24px",
                                fontSize: "11.5px",
                                fontWeight: 600,
                                backgroundColor: "#f1f5f9",
                                color: "#334155",
                                border: "1px solid #e2e8f0",
                                borderRadius: "12px",
                              }}
                            />
                          </TableCell>

                          {/* Role Column */}
                          <TableCell sx={{ py: 2 }}>
                            <Typography sx={{ fontSize: "12.5px", color: "#334155", fontWeight: 500 }}>
                              {biz.role_title || biz.role?.title || "—"}
                            </Typography>
                          </TableCell>

                          {/* Services Badges */}
                          <TableCell sx={{ py: 2 }}>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxWidth: "180px" }}>
                              {Array.isArray(biz.services) && biz.services.length > 0 ? (
                                biz.services.map((s, idx) => (
                                  <Chip
                                    key={idx}
                                    label={SERVICE_OPTIONS.find((opt) => opt.id === s)?.label || s}
                                    size="small"
                                    sx={{
                                      height: "20px",
                                      fontSize: "11px",
                                      backgroundColor: "#f1f5f9",
                                      color: "#475569",
                                      borderRadius: "6px",
                                      fontWeight: 500,
                                    }}
                                  />
                                ))
                              ) : (
                                <Typography sx={{ fontSize: "12px", color: "#94a3b8" }}>—</Typography>
                              )}
                            </Box>
                          </TableCell>

                          {/* Package */}
                          <TableCell sx={{ py: 2 }}>
                            <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
                              {biz.package_level || "Basic"}
                            </Typography>
                          </TableCell>

                          {/* Currency */}
                          <TableCell sx={{ py: 2 }}>
                            <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                              {biz.currency || "GBP"}
                            </Typography>
                            <Typography sx={{ fontSize: "11px", color: "#64748b" }}>
                              {biz.currency === "GBP" ? "British Pound" : biz.currency === "PKR" ? "Pakistani Rupee" : "Default"}
                            </Typography>
                          </TableCell>

                          {/* Status */}
                          <TableCell sx={{ py: 2 }}>
                            {isDeleted ? (
                              <Chip
                                label="Deleted"
                                size="small"
                                sx={{
                                  backgroundColor: "#fee2e2",
                                  color: "#991b1b",
                                  fontWeight: 700,
                                  fontSize: "11.5px",
                                  height: "24px",
                                  borderRadius: "12px",
                                }}
                              />
                            ) : isBlocked ? (
                              <Chip
                                label="Blocked"
                                size="small"
                                sx={{
                                  backgroundColor: "#fef2f2",
                                  color: "#dc2626",
                                  border: "1px solid #fecaca",
                                  fontWeight: 700,
                                  fontSize: "11.5px",
                                  height: "24px",
                                  borderRadius: "12px",
                                }}
                              />
                            ) : (
                              <Chip
                                label="Active"
                                size="small"
                                sx={{
                                  backgroundColor: "#dcfce7",
                                  color: "#15803d",
                                  fontWeight: 700,
                                  fontSize: "11.5px",
                                  height: "24px",
                                  borderRadius: "12px",
                                }}
                              />
                            )}
                          </TableCell>

                          {/* Created Date */}
                          <TableCell sx={{ py: 2 }}>
                            <Typography sx={{ fontSize: "12.5px", color: "#334155", whiteSpace: "nowrap" }}>
                              {biz.created_at ? new Date(biz.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                            </Typography>
                          </TableCell>

                          {/* Actions */}
                          <TableCell align="right" sx={{ py: 2 }}>
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center">
                              {!isDeleted && (
                                <Tooltip title={isBlocked ? "Unblock business" : "Block business"}>
                                  <Switch
                                    size="small"
                                    checked={!isBlocked}
                                    disabled={togglingId === biz.id}
                                    onChange={() => handleToggleBlock(biz)}
                                    sx={{
                                      "& .MuiSwitch-switchBase.Mui-checked": {
                                        color: "#16a34a",
                                      },
                                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                        backgroundColor: "#16a34a",
                                      },
                                    }}
                                  />
                                </Tooltip>
                              )}

                              {!isDeleted && (
                                <Tooltip title="Edit Business">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenEditDrawer(biz)}
                                    sx={{ color: "#2563eb", "&:hover": { backgroundColor: "#eff6ff" } }}
                                  >
                                    <EditOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}

                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDetail(biz)}
                                  sx={{ color: "#64748b", "&:hover": { backgroundColor: "#f1f5f9" } }}
                                >
                                  <VisibilityOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              {isDeleted ? (
                                <Tooltip title="Restore Business">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteOrRestore(biz)}
                                    sx={{ color: "#16a34a", "&:hover": { backgroundColor: "#f0fdf4" } }}
                                  >
                                    <RestoreFromTrashIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <Tooltip title="Delete Business">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteOrRestore(biz)}
                                    sx={{ color: "#ef4444", "&:hover": { backgroundColor: "#fef2f2" } }}
                                  >
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination Bar */}
            {!loading && businesses.length > 0 && (
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
                  Page {currentPage} of {Math.max(totalPages, 1)} ({counts[activeTab] ?? businesses.length} {(counts[activeTab] ?? businesses.length) === 1 ? "business" : "businesses"})
                </Typography>

                <Pagination
                  count={Math.max(totalPages, 1)}
                  page={currentPage}
                  onChange={(e, val) => setCurrentPage(val)}
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
          </>
        )}

        {/* VIEW 2: Grouped BY OWNER View */}
        {viewMode === "by_owner" && (
          <Box sx={{ p: 2.5 }}>
            {loading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} variant="rectangular" height={90} sx={{ borderRadius: "12px", mb: 2 }} />
              ))
            ) : groupedByOwner.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 6 }}>
                <PeopleAltOutlinedIcon sx={{ fontSize: 44, color: "#cbd5e1", mb: 1 }} />
                <Typography sx={{ color: "#64748b", fontSize: "15px", fontWeight: 500 }}>
                  No owners with businesses found
                </Typography>
              </Box>
            ) : (
              groupedByOwner.map((group) => {
                const owner = group.owner;
                const isExpanded = Boolean(expandedOwners[group.owner_id]);

                return (
                  <Card
                    key={group.owner_id}
                    variant="outlined"
                    sx={{
                      mb: 2,
                      borderRadius: "14px",
                      borderColor: "#e2e8f0",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      onClick={() => toggleOwnerExpand(group.owner_id)}
                      sx={{
                        p: 2,
                        backgroundColor: "#f8fafc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 42,
                            height: 42,
                            backgroundColor: "#fee2e2",
                            color: "#b91c1c",
                            fontWeight: 700,
                            fontSize: "14px",
                          }}
                        >
                          {owner?.first_name?.[0]}
                          {owner?.last_name?.[0]}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: "15px", color: "#b91c1c" }}>
                            {owner ? `${owner.first_name} ${owner.last_name}` : "Unknown Owner"}
                          </Typography>
                          <Typography sx={{ fontSize: "12.5px", color: "#64748b" }}>
                            {owner?.email} · {owner?.phone || "No phone"}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Chip
                          label={`${group.businesses_count} ${group.businesses_count === 1 ? "Business" : "Businesses"}`}
                          size="small"
                          sx={{
                            backgroundColor: "#2563eb",
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: "12px",
                          }}
                        />
                        <IconButton size="small">
                          {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </Box>
                    </Box>

                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Divider />
                      <Box sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                          {group.businesses.map((b) => (
                            <Grid item xs={12} sm={6} md={4} key={b.id}>
                              <Card
                                variant="outlined"
                                sx={{
                                  p: 2,
                                  borderRadius: "10px",
                                  borderColor: "#f1f5f9",
                                  backgroundColor: "#ffffff",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                                }}
                              >
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                  <Typography sx={{ fontWeight: 700, fontSize: "14px", color: "#0f172a" }}>
                                    {b.name}
                                  </Typography>
                                  <Chip
                                    label={b.status}
                                    size="small"
                                    sx={{
                                      height: "20px",
                                      fontSize: "10.5px",
                                      fontWeight: 700,
                                      backgroundColor: b.status === "active" ? "#dcfce7" : "#fee2e2",
                                      color: b.status === "active" ? "#15803d" : "#991b1b",
                                    }}
                                  />
                                </Box>
                                <Typography sx={{ fontSize: "12px", color: "#64748b", mb: 0.5 }}>
                                  Branch: {b.branch_name || "Main"} · {b.business_type}
                                </Typography>
                                <Typography sx={{ fontSize: "11.5px", color: "#475569" }}>
                                  Schema: <strong>{b.schema_name}</strong>
                                </Typography>
                                <Typography sx={{ fontSize: "11.5px", color: "#475569", mb: 1.5 }}>
                                  Currency: <strong>{b.currency}</strong> · Package: <strong>{b.package_level}</strong>
                                </Typography>
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleOpenDetail(b)}
                                    sx={{ textTransform: "none", fontSize: "12px", py: 0.2 }}
                                  >
                                    View
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => handleOpenEditDrawer(b)}
                                    sx={{ textTransform: "none", fontSize: "12px", py: 0.2, backgroundColor: "#2563eb" }}
                                  >
                                    Edit
                                  </Button>
                                </Stack>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Collapse>
                  </Card>
                );
              })
            )}
          </Box>
        )}
      </Paper>

      {/* CREATE / UPDATE BUSINESS DRAWER WITH PREMIUM MODERN UI */}
      <Drawer
        anchor="right"
        open={formDrawerOpen}
        onClose={() => setFormDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "680px", md: "860px", lg: "920px" },
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
          {/* Drawer Header */}
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
                {editingBusiness ? "Edit Business" : "Create Business"}
              </Typography>
              <Typography sx={{ fontSize: "12.5px", color: "#64748b" }}>
                Configure storefront options, owner assignment, services, and multi-tenant schema.
              </Typography>
            </Box>
            <IconButton onClick={() => setFormDrawerOpen(false)} sx={{ color: "#94a3b8" }}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          {/* Drawer Content Body */}
          <Box sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1, overflowY: "auto" }}>
            <Stack spacing={2.5}>
              {/* SECTION 1: Website Configuration & Services */}
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
                  Website Configuration & Services
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* Row 1: Radio Buttons for Website Selection + Package Level */}
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    {/* Website Radio Selection (One at a time) */}
                    <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                      <RadioGroup
                        row
                        value={formData.website_option}
                        onChange={(e) => setFormData({ ...formData, website_option: e.target.value })}
                        sx={{ alignItems: "center", gap: 1 }}
                      >
                        <FormControlLabel
                          value="system"
                          control={<Radio size="small" sx={{ color: "#2563eb", "&.Mui-checked": { color: "#2563eb" } }} />}
                          label={<Typography sx={{ fontSize: "13.5px", fontWeight: 600 }}>System Website</Typography>}
                        />
                        <FormControlLabel
                          value="personal"
                          control={<Radio size="small" sx={{ color: "#b91c1c", "&.Mui-checked": { color: "#b91c1c" } }} />}
                          label={<Typography sx={{ fontSize: "13.5px", fontWeight: 600 }}>Personal Website</Typography>}
                        />
                      </RadioGroup>

                      {/* If Personal Website is selected: show Website Url field */}
                      {formData.website_option === "personal" && (
                        <TextField
                          size="small"
                          label="Website Url"
                          placeholder="e.g. localhost:3000 or mydomain.com"
                          value={formData.website_url}
                          onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                          sx={{ minWidth: "240px", ...modernInputStyles }}
                        />
                      )}
                    </Box>

                    {/* Package Level Dropdown */}
                    <Box sx={{ minWidth: "160px" }}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Package Level"
                        value={formData.package_level}
                        onChange={(e) => setFormData({ ...formData, package_level: e.target.value })}
                        sx={modernInputStyles}
                      >
                        <MenuItem value="Basic">Basic</MenuItem>
                        <MenuItem value="Standard">Standard</MenuItem>
                        <MenuItem value="Premium">Premium</MenuItem>
                      </TextField>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 0.5 }} />

                  {/* Row 2: Enabled Services Checkboxes (DEFAULT ALL UNCHECKED, "Own site" removed) */}
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                      <Typography sx={{ fontSize: "12.5px", fontWeight: 600, color: formErrors.services && formTouched.services ? "#ef4444" : "#64748b" }}>
                        Enabled Services (Select applicable services) *
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 1.5, sm: 2.5 } }}>
                      {SERVICE_OPTIONS.map((srv) => (
                        <FormControlLabel
                          key={srv.id}
                          control={
                            <Checkbox
                              checked={formData.services.includes(srv.id)}
                              onChange={() => handleServiceToggle(srv.id)}
                              size="small"
                              sx={{
                                color: formErrors.services && formTouched.services ? "#ef4444" : "#94a3b8",
                                "&.Mui-checked": { color: "#2563eb" },
                              }}
                            />
                          }
                          label={<Typography sx={{ fontSize: "13.5px", fontWeight: 500, color: formErrors.services && formTouched.services ? "#ef4444" : "#1e293b" }}>{srv.label}</Typography>}
                        />
                      ))}
                    </Box>
                    {formErrors.services && formTouched.services && (
                      <Typography sx={{ fontSize: "11.5px", color: "#ef4444", mt: 0.5, fontWeight: 500 }}>
                        {formErrors.services}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Card>

              {/* SECTION 2: Business Information */}
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
                  Business Information
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
                  {/* Row 1: Business Name, Business Type, Branch Name */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1.2 1 250px" } }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Business Name *"
                        placeholder="e.g. iTech, Coffee Shop"
                        value={formData.name}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        onBlur={() => handleBlur("name")}
                        error={Boolean(formErrors.name && formTouched.name)}
                        helperText={formTouched.name && formErrors.name}
                        sx={modernInputStyles}
                      />
                    </Box>

                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 220px" } }}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Business Type *"
                        value={formData.business_type}
                        onChange={(e) => handleFieldChange("business_type", e.target.value)}
                        onBlur={() => handleBlur("business_type")}
                        error={Boolean(formErrors.business_type && formTouched.business_type)}
                        helperText={formTouched.business_type && formErrors.business_type}
                        sx={modernInputStyles}
                      >
                        <MenuItem value="">Select Business Type</MenuItem>
                        {formOptions.business_types.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>

                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 200px" } }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Branch Name *"
                        placeholder="e.g. Main Branch, Test branch"
                        value={formData.branch_name}
                        onChange={(e) => handleFieldChange("branch_name", e.target.value)}
                        onBlur={() => handleBlur("branch_name")}
                        error={Boolean(formErrors.branch_name && formTouched.branch_name)}
                        helperText={formTouched.branch_name && formErrors.branch_name}
                        sx={modernInputStyles}
                      />
                    </Box>
                  </Box>

                  {/* Row 2: Business Email, Searchable Business Owner (Shows all users), Role (Shows all roles) */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 250px" } }}>
                      <TextField
                        fullWidth
                        size="small"
                        type="email"
                        label="Business Email *"
                        placeholder="e.g. info@business.com"
                        value={formData.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        error={Boolean(formErrors.email && formTouched.email)}
                        helperText={formTouched.email && formErrors.email}
                        sx={modernInputStyles}
                      />
                    </Box>

                    {/* Searchable Business Owner Autocomplete showing all users with their business name / no business yet */}
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1.4 1 300px" } }}>
                      <Autocomplete
                        size="small"
                        disabled={Boolean(editingBusiness)}
                        options={formOptions.owners}
                        getOptionLabel={(option) => {
                          if (!option) return "";
                          if (typeof option === "string") return option;
                          return `${option.first_name || ""} ${option.last_name || ""} (${option.email || ""})`.trim();
                        }}
                        isOptionEqualToValue={(option, value) => {
                          if (!option || !value) return false;
                          const optId = option.id || option;
                          const valId = value.id || value;
                          return String(optId) === String(valId);
                        }}
                        value={
                          formOptions.owners.find((o) => String(o.id) === String(formData.owner_id)) ||
                          (editingBusiness?.owner
                            ? editingBusiness.owner
                            : formData.owner_id
                            ? { id: formData.owner_id, first_name: editingBusiness?.owner_name || "Owner", last_name: "", email: editingBusiness?.owner_email || "" }
                            : null)
                        }
                        onChange={(event, newValue) => {
                          const ownerId = newValue ? newValue.id : "";
                          let suggestedSchema = formData.schema_name;
                          if (newValue && formData.schema_type === "new") {
                            suggestedSchema = `${(newValue.first_name || "").toLowerCase()}_${(newValue.last_name || "").toLowerCase()}`.replace(/\s+/g, "_");
                          } else if (formData.schema_type === "existing" && (!formData.schema_name || formData.schema_name === "public")) {
                            suggestedSchema = formOptions.existing_schemas.find((s) => s !== "public") || "public";
                          }
                          setFormData((prev) => ({
                            ...prev,
                            owner_id: ownerId,
                            schema_name: suggestedSchema,
                          }));
                          setFormTouched((t) => ({ ...t, owner_id: true }));
                          setFormErrors((prevErr) => ({
                            ...prevErr,
                            owner_id: validateField("owner_id", ownerId),
                          }));
                        }}
                        onBlur={() => handleBlur("owner_id")}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            key={option.id}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                              py: 0.8,
                              borderBottom: "1px solid #f1f5f9",
                            }}
                          >
                            <Typography sx={{ fontSize: "13.5px", fontWeight: 600, color: "#1e293b" }}>
                              {option.first_name} {option.last_name} ({option.email})
                            </Typography>
                            <Typography sx={{ fontSize: "11.5px", color: "#64748b" }}>
                              {option.business_name || "No business yet"}
                            </Typography>
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Business Owner *"
                            placeholder="Type to search owner..."
                            error={Boolean(formErrors.owner_id && formTouched.owner_id)}
                            helperText={formTouched.owner_id && formErrors.owner_id}
                            sx={{
                              ...modernInputStyles,
                              ...(editingBusiness && {
                                "& .MuiOutlinedInput-root": {
                                  ...modernInputStyles["& .MuiOutlinedInput-root"],
                                  backgroundColor: "#f8fafc",
                                  cursor: "not-allowed",
                                },
                              }),
                            }}
                          />
                        )}
                      />
                    </Box>

                    {/* Role Dropdown: Shows all created roles */}
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 200px" } }}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Role *"
                        value={formData.role_id}
                        onChange={(e) => {
                          handleFieldChange("role_id", e.target.value);
                        }}
                        onBlur={() => handleBlur("role_id")}
                        error={Boolean(formErrors.role_id && formTouched.role_id)}
                        helperText={formTouched.role_id && formErrors.role_id}
                        sx={modernInputStyles}
                      >
                        <MenuItem value="">Select Role</MenuItem>
                        {formOptions.roles.map((role) => (
                          <MenuItem key={role.id} value={role.id}>
                            {role.title}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  </Box>

                  {/* Row 3: Business Group Dropdown */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 320px" } }}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Business Group"
                        value={formData.business_group_id || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, business_group_id: e.target.value }))}
                        helperText="Assign this business to a business group (Optional)"
                        sx={modernInputStyles}
                      >
                        <MenuItem value="">
                          <em>None (No Group)</em>
                        </MenuItem>
                        {(formOptions.business_groups || []).map((grp) => (
                          <MenuItem key={grp.id} value={grp.id}>
                            {grp.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  </Box>
                </Box>
              </Card>

              {/* SECTION 3: Where this business's data lives (Schema) */}
              {editingBusiness ? (
                /* In Edit Mode: Schema is immutable - show blue alert banner matching reference image */
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#f0f7ff",
                    border: "1px solid #dbeafe",
                    borderRadius: "10px",
                    py: 1.75,
                    px: 2.25,
                  }}
                >
                  <InfoOutlinedIcon sx={{ color: "#2563eb", fontSize: 21, mr: 1.5, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: "13.5px", color: "#334155", lineHeight: 1.5 }}>
                    Schema:{" "}
                    <Box component="span" sx={{ fontWeight: 700, color: "#0f172a" }}>
                      {formData.schema_name || editingBusiness.schema_name || "public"}
                    </Box>
                    . A business's schema cannot be changed after it is created, because its data already lives there.
                  </Typography>
                </Box>
              ) : (
                /* In Create Mode: Schema section is displayed once a Business Owner is selected */
                <Collapse in={Boolean(formData.owner_id)} timeout={300} unmountOnExit>
                  <Card
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: "14px",
                      border: "1px solid #e2e8f0",
                      backgroundColor: "#ffffff",
                      borderLeft: "4px solid #2563eb",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <DnsOutlinedIcon sx={{ color: "#2563eb", fontSize: 20 }} />
                      <Typography sx={{ fontWeight: 700, fontSize: "14px", color: "#0f172a" }}>
                        Where this business's data lives (schema)
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: "12.5px", color: "#64748b", mb: 2 }}>
                      An owner normally keeps one schema for all their businesses. Selected owner:{" "}
                      <strong>{selectedOwner ? `${selectedOwner.first_name} ${selectedOwner.last_name}` : "—"}</strong>
                    </Typography>

                    <RadioGroup
                      value={formData.schema_type}
                      onChange={(e) => {
                        const newType = e.target.value;
                        let nextSchema = formData.schema_name;
                        if (newType === "existing") {
                          // Auto pick first existing schema if none or default
                          const available = formOptions.existing_schemas.filter((s) => s !== "public");
                          nextSchema = available.length > 0 ? available[0] : "public";
                        } else if (newType === "new") {
                          if (selectedOwner) {
                            nextSchema = `${(selectedOwner.first_name || "").toLowerCase()}_${(selectedOwner.last_name || "").toLowerCase()}`.replace(/\s+/g, "_");
                          }
                        }
                        setFormData({ ...formData, schema_type: newType, schema_name: nextSchema });
                      }}
                    >
                      {/* Option: Existing schema */}
                      <FormControlLabel
                        value="existing"
                        control={<Radio size="small" />}
                        label={<Typography sx={{ fontSize: "13.5px", fontWeight: 500 }}>Use an existing schema</Typography>}
                      />

                      {formData.schema_type === "existing" && (
                        <Box sx={{ pl: 4, pb: 1.5, pt: 1, maxWidth: "420px" }}>
                          <TextField
                            select
                            size="small"
                            fullWidth
                            label="Select Schema"
                            value={formData.schema_name || "public"}
                            onChange={(e) => setFormData({ ...formData, schema_name: e.target.value })}
                            sx={modernInputStyles}
                          >
                            {formOptions.existing_schemas && formOptions.existing_schemas.length > 0 ? (
                              formOptions.existing_schemas.map((s) => (
                                <MenuItem key={s} value={s}>
                                  {s}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem value="public">public</MenuItem>
                            )}
                          </TextField>
                        </Box>
                      )}

                      {/* Option: Create new schema */}
                      <FormControlLabel
                        value="new"
                        control={<Radio size="small" />}
                        label={<Typography sx={{ fontSize: "13.5px", fontWeight: 500 }}>Create a new schema</Typography>}
                      />

                      {formData.schema_type === "new" && (
                        <Box sx={{ pl: 4, pt: 1, maxWidth: "480px" }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="New schema name *"
                            placeholder="e.g. humair_sarwar, shop_schema"
                            value={formData.schema_name}
                            onChange={(e) => handleFieldChange("schema_name", e.target.value)}
                            onBlur={() => handleBlur("schema_name")}
                            error={Boolean(formErrors.schema_name && formTouched.schema_name)}
                            helperText={formTouched.schema_name && formErrors.schema_name}
                            sx={modernInputStyles}
                            InputProps={{
                              endAdornment: formData.schema_name ? (
                                <InputAdornment position="end">
                                  {formErrors.schema_name ? (
                                    <CloseRoundedIcon sx={{ color: "#dc2626", fontSize: 20 }} />
                                  ) : (
                                    <CheckCircleOutlineRoundedIcon sx={{ color: "#16a34a", fontSize: 20 }} />
                                  )}
                                </InputAdornment>
                              ) : null,
                            }}
                          />
                          {!formErrors.schema_name && formData.schema_name && (
                            <Typography sx={{ fontSize: "11.5px", color: "#16a34a", mt: 0.5 }}>
                              This name is free. When you save, this schema is registered and migrations can be applied.
                            </Typography>
                          )}
                        </Box>
                      )}
                    </RadioGroup>
                  </Card>
                </Collapse>
              )}

              {/* SECTION 4: Contact & Location */}
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
                  Contact & Location Details
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
                  {/* Phones Row with UNIFIED outlined border (Matches User Reference Image) */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {/* Business Mobile No - Unified outline with flag inside */}
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 320px" } }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Business Mobile No"
                        placeholder="7123456789"
                        value={formData.mobile_no}
                        onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                              <Select
                                variant="standard"
                                disableUnderline
                                value={formData.mobile_dial}
                                onChange={(e) => setFormData({ ...formData, mobile_dial: e.target.value })}
                                sx={{
                                  "& .MuiSelect-select": {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.8,
                                    py: 0.2,
                                    pr: "18px !important",
                                    fontSize: "13.5px",
                                    fontWeight: 600,
                                    color: "#1e293b",
                                  },
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 18,
                                    color: "#64748b",
                                  },
                                }}
                              >
                                {DIAL_CODES.map((d) => (
                                  <MenuItem key={d.code} value={d.code} sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                                    <CountryFlag code={d.code} width={22} height={14} />
                                    <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>{d.code}</Typography>
                                    <Typography sx={{ fontSize: "12px", color: "#64748b" }}>{d.name}</Typography>
                                  </MenuItem>
                                ))}
                              </Select>
                              <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.8, my: "auto" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={modernInputStyles}
                      />
                    </Box>

                    {/* Business Whatsapp No - Unified outline with flag inside */}
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 320px" } }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Business Whatsapp No"
                        placeholder="7123456789"
                        value={formData.whatsapp_no}
                        onChange={(e) => setFormData({ ...formData, whatsapp_no: e.target.value })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                              <Select
                                variant="standard"
                                disableUnderline
                                value={formData.whatsapp_dial}
                                onChange={(e) => setFormData({ ...formData, whatsapp_dial: e.target.value })}
                                sx={{
                                  "& .MuiSelect-select": {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.8,
                                    py: 0.2,
                                    pr: "18px !important",
                                    fontSize: "13.5px",
                                    fontWeight: 600,
                                    color: "#1e293b",
                                  },
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 18,
                                    color: "#64748b",
                                  },
                                }}
                              >
                                {DIAL_CODES.map((d) => (
                                  <MenuItem key={d.code} value={d.code} sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                                    <CountryFlag code={d.code} width={22} height={14} />
                                    <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>{d.code}</Typography>
                                    <Typography sx={{ fontSize: "12px", color: "#64748b" }}>{d.name}</Typography>
                                  </MenuItem>
                                ))}
                              </Select>
                              <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.8, my: "auto" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={modernInputStyles}
                      />
                    </Box>
                  </Box>

                  {/* Address */}
                  <TextField
                    fullWidth
                    size="small"
                    label="Business Address"
                    placeholder="Street address, building number..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    sx={modernInputStyles}
                  />

                  {/* City Dropdown (Shows all created cities), State, Post Code */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {/* City Select Dropdown */}
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 200px" } }}>
                      <TextField
                        select
                        required
                        fullWidth
                        size="small"
                        label="City"
                        value={formData.city_id || ""}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const selectedCity = formOptions.cities.find((c) => String(c.id) === String(selectedId));
                          const nextCityName = selectedCity ? selectedCity.name : "";
                          const nextCountryId = (!formData.country_id && selectedCity?.country_id) ? selectedCity.country_id : formData.country_id;

                          setFormData((prev) => ({
                            ...prev,
                            city_id: selectedId,
                            city_name: nextCityName,
                            country_id: nextCountryId,
                          }));
                          setFormTouched((t) => ({ ...t, city_id: true }));
                          setFormErrors((prevErr) => ({
                            ...prevErr,
                            city_id: validateField("city_id", selectedId),
                          }));
                        }}
                        onBlur={() => handleBlur("city_id")}
                        error={Boolean(formErrors.city_id && formTouched.city_id)}
                        helperText={formTouched.city_id && formErrors.city_id}
                        sx={modernInputStyles}
                      >
                        <MenuItem value="">Select City</MenuItem>
                        {availableCities.map((city) => (
                          <MenuItem key={city.id} value={city.id}>
                            {city.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>

                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 200px" } }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="State / Region"
                        placeholder="e.g. Greater London, Punjab"
                        value={formData.state_region}
                        onChange={(e) => setFormData({ ...formData, state_region: e.target.value })}
                        sx={modernInputStyles}
                      />
                    </Box>

                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 200px" } }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Post Code"
                        placeholder="e.g. E1 6AN, 40100"
                        value={formData.post_code}
                        onChange={(e) => setFormData({ ...formData, post_code: e.target.value })}
                        sx={modernInputStyles}
                      />
                    </Box>
                  </Box>

                  {/* Country Dropdown (Shows all created countries) & Currency */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 300px" } }}>
                      <TextField
                        select
                        required
                        fullWidth
                        size="small"
                        label="Country"
                        value={formData.country_id}
                        onChange={handleCountryChange}
                        onBlur={() => handleBlur("country_id")}
                        error={Boolean(formErrors.country_id && formTouched.country_id)}
                        helperText={formTouched.country_id && formErrors.country_id}
                        sx={modernInputStyles}
                      >
                        <MenuItem value="">Select Country</MenuItem>
                        {formOptions.countries.map((c) => (
                          <MenuItem key={c.id} value={c.id}>
                            {c.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>

                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 300px" } }}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Currency"
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        helperText="Fills in from country. You can change it."
                        sx={modernInputStyles}
                      >
                        {formOptions.currencies.map((curr) => (
                          <MenuItem key={curr.code} value={curr.code}>
                            {curr.name} ({curr.code})
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  </Box>

                  {/* Coordinates */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 250px" } }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Latitude"
                        placeholder="e.g. 51.5074"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        sx={modernInputStyles}
                      />
                    </Box>
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 250px" } }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Longitude"
                        placeholder="e.g. -0.1278"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        sx={modernInputStyles}
                      />
                    </Box>
                  </Box>

                  {/* Description */}
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                    label="Description"
                    placeholder="Brief notes, business overview or scope..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    sx={modernInputStyles}
                  />
                </Box>
              </Card>
            </Stack>
          </Box>

          {/* Drawer Footer Actions */}
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
              sx={{ textTransform: "none", borderRadius: "10px", px: 2.5, color: "#64748b", borderColor: "#cbd5e1" }}
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
              {formSubmitting ? "Saving..." : editingBusiness ? "Save Changes" : "Create"}
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* DETAIL DRAWER */}
      <Drawer
        anchor="right"
        open={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "520px" },
            p: 0,
            backgroundColor: "#f8fafc",
          },
        }}
      >
        {selectedBusiness && (
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
              <Typography sx={{ fontWeight: 700, fontSize: "18px", color: "#0f172a" }}>
                Business Details
              </Typography>
              <IconButton onClick={() => setDetailDrawerOpen(false)} sx={{ color: "#94a3b8" }}>
                <CloseRoundedIcon />
              </IconButton>
            </Box>

            {/* Content */}
            <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto" }}>
              <Card variant="outlined" sx={{ p: 2.5, borderRadius: "12px", backgroundColor: "#ffffff", mb: 2.5 }}>
                <Typography sx={{ fontWeight: 700, fontSize: "18px", color: "#0f172a", mb: 0.5 }}>
                  {selectedBusiness.name}
                </Typography>
                <Typography sx={{ fontSize: "13px", color: "#64748b", mb: 1.5 }}>
                  Branch: {selectedBusiness.branch_name || "Main Branch"} · {selectedBusiness.business_type}
                </Typography>
                <Chip
                  label={selectedBusiness.status}
                  size="small"
                  sx={{
                    height: "24px",
                    fontWeight: 700,
                    fontSize: "12px",
                    backgroundColor: selectedBusiness.status === "active" ? "#dcfce7" : "#fee2e2",
                    color: selectedBusiness.status === "active" ? "#15803d" : "#991b1b",
                  }}
                />
              </Card>

              {/* Owner Info */}
              <Card variant="outlined" sx={{ p: 2.5, borderRadius: "12px", backgroundColor: "#ffffff", mb: 2.5 }}>
                <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", mb: 1.5 }}>
                  Owner Assignment
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: "15px", color: "#b91c1c" }}>
                  {selectedBusiness.owner ? `${selectedBusiness.owner.first_name} ${selectedBusiness.owner.last_name}` : "—"}
                </Typography>
                <Typography sx={{ fontSize: "13px", color: "#64748b" }}>
                  {selectedBusiness.owner?.email || selectedBusiness.email}
                </Typography>
                <Typography sx={{ fontSize: "13px", color: "#64748b" }}>
                  {selectedBusiness.owner?.phone || selectedBusiness.mobile_no || "No phone"}
                </Typography>
              </Card>

              {/* Technical / Schema */}
              <Card variant="outlined" sx={{ p: 2.5, borderRadius: "12px", backgroundColor: "#ffffff", mb: 2.5 }}>
                <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", mb: 1.5 }}>
                  Configuration & Schema
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: "12px", color: "#64748b" }}>Schema Name</Typography>
                    <Typography sx={{ fontSize: "13.5px", fontWeight: 600, color: "#0f172a" }}>
                      {selectedBusiness.schema_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: "12px", color: "#64748b" }}>Package Level</Typography>
                    <Typography sx={{ fontSize: "13.5px", fontWeight: 600, color: "#0f172a" }}>
                      {selectedBusiness.package_level}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: "12px", color: "#64748b" }}>Assigned Role</Typography>
                    <Typography sx={{ fontSize: "13.5px", fontWeight: 600, color: "#0f172a" }}>
                      {selectedBusiness.role_title || "None"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: "12px", color: "#64748b" }}>Currency</Typography>
                    <Typography sx={{ fontSize: "13.5px", fontWeight: 600, color: "#0f172a" }}>
                      {selectedBusiness.currency}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: "12px", color: "#64748b" }}>Business Group</Typography>
                    <Typography sx={{ fontSize: "13.5px", fontWeight: 600, color: "#2563eb" }}>
                      {selectedBusiness.group?.name || "None (No Group)"}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>

              {/* Location */}
              <Card variant="outlined" sx={{ p: 2.5, borderRadius: "12px", backgroundColor: "#ffffff" }}>
                <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", mb: 1.5 }}>
                  Location & Contact
                </Typography>
                <Typography sx={{ fontSize: "13px", color: "#334155", mb: 0.5 }}>
                  {selectedBusiness.address || "No address set"}
                </Typography>
                <Typography sx={{ fontSize: "13px", color: "#334155", mb: 0.5 }}>
                  {selectedBusiness.city?.name || selectedBusiness.city_name ? `${selectedBusiness.city?.name || selectedBusiness.city_name}, ` : ""}
                  {selectedBusiness.state_region ? `${selectedBusiness.state_region} ` : ""}
                  {selectedBusiness.post_code}
                </Typography>
                <Typography sx={{ fontSize: "13px", color: "#334155" }}>
                  {selectedBusiness.country?.name || selectedBusiness.country_name || "—"}
                </Typography>
              </Card>
            </Box>
          </Box>
        )}
      </Drawer>
      {/* SCHEMA CREATION PROGRESS POPUP DIALOG (Matching Reference Image) */}
      <Dialog
        open={schemaProgressOpen}
        disableEscapeKeyDown={schemaProgressStatus === "running"}
        PaperProps={{
          sx: {
            borderRadius: "14px",
            width: "560px",
            maxWidth: "94vw",
            p: 1,
            boxShadow: "0 24px 60px rgba(15, 23, 42, 0.22)",
            backgroundColor: "#ffffff",
          },
        }}
      >
        <DialogContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "1.45rem",
              color: "#1e293b",
              letterSpacing: "-0.01em",
              mb: 1.5,
            }}
          >
            Setting up the schema
          </Typography>

          <Typography
            sx={{
              fontSize: "0.95rem",
              color: "#334155",
              lineHeight: 1.6,
              mb: 2.5,
            }}
          >
            Creating <strong>{formData.schema_name || "schema"}</strong> and applying the database
            migrations. Keep this page open: the business is saved when this finishes.
          </Typography>

          {/* Progress Bar styled in SystemUser primary blue theme */}
          <Box sx={{ my: 2 }}>
            <LinearProgress
              variant="determinate"
              value={schemaProgressPercent}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: "#dbeafe",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 3,
                  backgroundColor: "#2563eb",
                  transition: "transform 0.25s ease-out",
                },
              }}
            />
          </Box>

          <Typography sx={{ fontSize: "0.875rem", color: "#475569", mt: 1.2 }}>
            {schemaMigrationCount} of {TOTAL_MIGRATIONS} migrations applied ({schemaProgressPercent}%)
          </Typography>

          {schemaProgressStatus === "error" && (
            <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #fee2e2" }}>
              <Typography sx={{ fontSize: "0.875rem", color: "#dc2626", mb: 1.5, fontWeight: 500 }}>
                {schemaProgressError || "Failed to set up schema."}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => setSchemaProgressOpen(false)}
                sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
              >
                Close
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
