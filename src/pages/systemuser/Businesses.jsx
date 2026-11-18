import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
  getSchemaProgressApi,
  updateSystemBusinessApi,
  toggleBlockBusinessApi,
  deleteSystemBusinessApi,
} from "../../utils/apis/APIs";
import { handleError, handleSuccess } from "../../toast";
import AsyncSearchAutocomplete from "../../components/AsyncSearchAutocomplete";
import PhoneDialPicker from "../../components/PhoneDialPicker";
import { CountryFlag } from "../../utils/countryDialData";

// Service options mapping: "Own site" removed as requested
const SERVICE_OPTIONS = [
  { id: "sale", label: "Sale" },
  { id: "trade_in", label: "Trade-in" },
  { id: "repair", label: "Repair" },
  { id: "pos", label: "POS" },
  { id: "on_store", label: "On Store" },
];

const REQUIRED_CORE_SERVICES = ["sale", "trade_in", "repair"];

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
  mobile_iso: "gb",
  mobile_no: "",
  whatsapp_dial: "+44",
  whatsapp_iso: "gb",
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

// Isolated memoized TextField so typing in any input never re-renders the Businesses table or sibling fields
const FastTextField = React.memo(function FastTextField({
  field,
  formValuesRef,
  value,
  touched,
  error,
  onCommit,
  validateFnRef,
  onErrorChange,
  ...textFieldProps
}) {
  const [localVal, setLocalVal] = useState(value ?? "");

  useEffect(() => {
    setLocalVal(value ?? "");
    if (formValuesRef?.current) {
      formValuesRef.current[field] = value ?? "";
    }
  }, [value, field, formValuesRef]);

  const handleChange = (e) => {
    const nextVal = e.target.value;
    setLocalVal(nextVal);
    if (formValuesRef?.current) {
      formValuesRef.current[field] = nextVal;
    }
    if (touched && validateFnRef?.current && onErrorChange) {
      const nextErr = validateFnRef.current(field, nextVal, {
        ...(formValuesRef?.current || {}),
        [field]: nextVal,
      });
      onErrorChange(field, nextErr);
    }
  };

  return (
    <TextField
      {...textFieldProps}
      value={localVal}
      onChange={handleChange}
      onBlur={() => onCommit?.(field, localVal)}
      error={Boolean(error && touched)}
      helperText={touched ? error : textFieldProps.helperText}
    />
  );
});

// Isolated memoized Schema Name field with instant local availability feedback
const SchemaNameField = React.memo(function SchemaNameField({
  formValuesRef,
  value,
  touched,
  error,
  existingSchemas,
  onCommit,
  onErrorChange,
}) {
  const [localVal, setLocalVal] = useState(value ?? "");
  const [localSchemaErr, setLocalSchemaErr] = useState(error || "");

  const computeSchemaErr = useCallback(
    (rawVal) => {
      const val = (rawVal || "").trim().toLowerCase();
      if (!val) return "Schema name is required";
      const sanitized = val.replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "");
      const exists = (existingSchemas || []).some(
        (s) => s.toLowerCase() === val || s.toLowerCase() === sanitized
      );
      return exists ? `The schema "${val}" already exists.` : "";
    },
    [existingSchemas]
  );

  useEffect(() => {
    const v = value ?? "";
    setLocalVal(v);
    if (formValuesRef?.current) {
      formValuesRef.current.schema_name = v;
    }
    setLocalSchemaErr(error || (v ? computeSchemaErr(v) : ""));
  }, [value, error, formValuesRef, computeSchemaErr]);

  const handleChange = (e) => {
    const nextVal = e.target.value;
    setLocalVal(nextVal);
    if (formValuesRef?.current) {
      formValuesRef.current.schema_name = nextVal;
    }
    const nextErr = computeSchemaErr(nextVal);
    setLocalSchemaErr(nextErr);
    if (touched && onErrorChange) {
      onErrorChange("schema_name", nextErr);
    }
  };

  const displayError = touched ? localSchemaErr || error : "";

  return (
    <Box sx={{ pl: 4, pt: 1, maxWidth: "480px" }}>
      <TextField
        fullWidth
        size="small"
        label="New schema name *"
        placeholder="e.g. humair_sarwar, shop_schema"
        value={localVal}
        onChange={handleChange}
        onBlur={() => onCommit?.("schema_name", localVal)}
        error={Boolean(displayError)}
        helperText={displayError}
        sx={modernInputStyles}
        InputProps={{
          endAdornment: localVal ? (
            <InputAdornment position="end">
              {localSchemaErr ? (
                <CloseRoundedIcon sx={{ color: "#dc2626", fontSize: 20 }} />
              ) : (
                <CheckCircleOutlineRoundedIcon sx={{ color: "#16a34a", fontSize: 20 }} />
              )}
            </InputAdornment>
          ) : null,
        }}
      />
      {!localSchemaErr && localVal && (
        <Typography sx={{ fontSize: "11.5px", color: "#16a34a", mt: 0.5 }}>
          This name is free. When you save, this schema is registered and migrations can be applied.
        </Typography>
      )}
    </Box>
  );
});

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
  const [formSessionKey, setFormSessionKey] = useState(0);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const formValuesRef = useRef({});
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
        if (!Array.isArray(val) || !val.some((s) => REQUIRED_CORE_SERVICES.includes(s))) {
          error = "Please select at least one of Sale, Trade-in, or Repair";
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

  const validateAll = (data = formData) => {
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
    if (!editingBusiness && data.schema_type === "new") {
      fields.push("schema_name");
    }

    const errors = {};
    const touched = {};
    fields.forEach((f) => {
      touched[f] = true;
      const err = validateField(f, data[f], data);
      if (err) errors[f] = err;
    });
    setFormTouched((prev) => ({ ...prev, ...touched }));
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateFieldRef = useRef(null);
  validateFieldRef.current = validateField;

  const commitFieldValue = useCallback((field, val) => {
    if (formValuesRef.current) {
      formValuesRef.current[field] = val;
    }
    setFormData((prev) => (prev[field] === val ? prev : { ...prev, [field]: val }));
    setFormTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
    const err = validateFieldRef.current(field, val, {
      ...formValuesRef.current,
      [field]: val,
    });
    setFormErrors((prev) => (prev[field] === err ? prev : { ...prev, [field]: err }));
  }, []);

  const handleFastErrorChange = useCallback((field, err) => {
    setFormErrors((prev) => (prev[field] === err ? prev : { ...prev, [field]: err }));
  }, []);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (formTouched[field]) {
        const err = validateField(field, value, next);
        setFormErrors((prevErr) => (prevErr[field] === err ? prevErr : { ...prevErr, [field]: err }));
      }
      return next;
    });
  };

  const handleBlur = (field) => {
    setFormTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
    const err = validateField(field, formData[field]);
    setFormErrors((prev) => (prev[field] === err ? prev : { ...prev, [field]: err }));
  };

  // Schema creation progress popup states
  const TOTAL_MIGRATIONS = 22;
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
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Fetch form options (owners, roles, countries, cities, etc.)
  const fetchFormOptions = async () => {
    try {
      setLoadingOptions(true);
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
    } finally {
      setLoadingOptions(false);
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

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deleteConfirmBusiness, setDeleteConfirmBusiness] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchBusinesses(currentPage, activeTab, debouncedSearch, ownerFilter, schemaFilter, viewMode);
  }, [fetchBusinesses, currentPage, activeTab, debouncedSearch, ownerFilter, schemaFilter, viewMode]);

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
      setDeleteLoading(true);
      const res = await deleteSystemBusinessApi(business.id);
      if (res && res.status === 200 && res.data?.status === true) {
        handleSuccess(res.data.message || "Operation successful");
        setDeleteConfirmBusiness(null);
        fetchBusinesses(currentPage, activeTab, debouncedSearch, ownerFilter, schemaFilter, viewMode);
      } else {
        handleError("Operation failed");
      }
    } catch (err) {
      handleError("An error occurred");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Selected full option metadata for async search fields (preserves label across searches & edit mode)
  const [selectedMeta, setSelectedMeta] = useState({
    owner: null,
    group: null,
    city: null,
    country: null,
  });

  const latestCountryIdRef = useRef(formData.country_id);
  latestCountryIdRef.current = formData.country_id;

  const fetchOwnerOptions = useCallback(async (q = "") => {
    const res = await getBusinessFormOptionsApi({ scope: "owners", owner_search: q });
    return res?.data?.data?.owners || [];
  }, []);

  const fetchGroupOptions = useCallback(async (q = "") => {
    const res = await getBusinessFormOptionsApi({ scope: "groups", group_search: q });
    return res?.data?.data?.business_groups || [];
  }, []);

  const fetchCountryOptions = useCallback(async (q = "") => {
    const res = await getBusinessFormOptionsApi({ scope: "countries", country_search: q });
    return res?.data?.data?.countries || [];
  }, []);

  const fetchCityOptions = useCallback(async (q = "") => {
    const params = { scope: "cities", city_search: q };
    if (latestCountryIdRef.current) {
      params.country_id = latestCountryIdRef.current;
    }
    const res = await getBusinessFormOptionsApi(params);
    return res?.data?.data?.cities || [];
  }, []);

  const businessTypeOptions = useMemo(() => {
    const list = formOptions.business_types || [];
    const current = formData.business_type;
    const merged = current && !list.includes(current) ? [current, ...list] : list;
    return merged.map((t) => ({ id: t, label: t }));
  }, [formOptions.business_types, formData.business_type]);

  // Open Create Drawer
  const handleOpenCreateDrawer = () => {
    setEditingBusiness(null);
    formValuesRef.current = {};
    setSelectedMeta({ owner: null, group: null, city: null, country: null });
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
    setFormTouched({});
    setFormSessionKey((k) => k + 1);
    setFormDrawerOpen(true);
    fetchFormOptions();
  };

  // Open Edit Drawer
  const handleOpenEditDrawer = (business) => {
    setEditingBusiness(business);
    formValuesRef.current = {};
    setFormErrors({});
    setFormTouched({});
    setFormSessionKey((k) => k + 1);
    setSelectedMeta({
      owner:
        business.owner ||
        (business.owner_id
          ? {
              id: business.owner_id,
              first_name: business.owner_name || "Owner",
              last_name: "",
              email: business.owner_email || "",
            }
          : null),
      group:
        business.group ||
        (business.business_group_id
          ? { id: business.business_group_id, name: business.group_name || `Group #${business.business_group_id}` }
          : null),
      city:
        business.city ||
        (business.city_id
          ? { id: business.city_id, name: business.city_name || "", country_id: business.country_id }
          : null),
      country:
        business.country ||
        (business.country_id
          ? { id: business.country_id, name: business.country_name || "", currency: business.currency || "GBP" }
          : null),
    });
    setFormData({
      name: business.name || "",
      branch_name: business.branch_name || "",
      business_type: business.business_type || "Electronics Store",
      email: business.email || "",
      mobile_dial: "+44",
      mobile_iso: "gb",
      mobile_no: business.mobile_no || "",
      whatsapp_dial: "+44",
      whatsapp_iso: "gb",
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
    fetchFormOptions();
  };

  // Open Detail Drawer
  const handleOpenDetail = (business) => {
    setSelectedBusiness(business);
    setDetailDrawerOpen(true);
  };

  // Country change auto-sync currency
  const handleCountrySelect = useCallback((selectedCountry) => {
    const cId = selectedCountry ? selectedCountry.id : "";
    setSelectedMeta((prev) => ({ ...prev, country: selectedCountry || null }));
    setFormData((prev) => {
      const next = {
        ...prev,
        country_id: cId,
        currency: selectedCountry?.currency || prev.currency,
      };
      setFormTouched((t) => ({ ...t, country_id: true }));
      setFormErrors((prevErr) => ({
        ...prevErr,
        country_id: validateFieldRef.current("country_id", cId, next),
      }));
      return next;
    });
  }, []);

  const handleBusinessTypeSelect = useCallback((opt) => {
    const val = opt ? (typeof opt === "string" ? opt : opt.id) : "";
    setFormData((prev) => {
      const next = { ...prev, business_type: val };
      setFormTouched((t) => ({ ...t, business_type: true }));
      setFormErrors((prevErr) => ({
        ...prevErr,
        business_type: validateFieldRef.current("business_type", val, next),
      }));
      return next;
    });
  }, []);

  const handleOwnerSelect = useCallback(
    (newValue) => {
      const ownerId = newValue ? newValue.id : "";
      setSelectedMeta((prev) => ({ ...prev, owner: newValue || null }));
      setFormData((prev) => {
        let suggestedSchema = prev.schema_name;
        if (newValue && prev.schema_type === "new") {
          suggestedSchema = `${(newValue.first_name || "").toLowerCase()}_${(newValue.last_name || "").toLowerCase()}`.replace(/\s+/g, "_");
        } else if (prev.schema_type === "existing" && (!prev.schema_name || prev.schema_name === "public")) {
          suggestedSchema = formOptions.existing_schemas.find((s) => s !== "public") || "public";
        }
        const next = {
          ...prev,
          owner_id: ownerId,
          schema_name: suggestedSchema,
        };
        setFormTouched((t) => ({ ...t, owner_id: true }));
        setFormErrors((prevErr) => ({
          ...prevErr,
          owner_id: validateFieldRef.current("owner_id", ownerId, next),
        }));
        return next;
      });
    },
    [formOptions.existing_schemas]
  );

  const handleRoleSelect = useCallback((selectedRole) => {
    const rId = selectedRole ? selectedRole.id : "";
    setFormData((prev) => {
      const next = { ...prev, role_id: rId };
      setFormTouched((t) => ({ ...t, role_id: true }));
      setFormErrors((prevErr) => ({
        ...prevErr,
        role_id: validateFieldRef.current("role_id", rId, next),
      }));
      return next;
    });
  }, []);

  const handleGroupSelect = useCallback((selectedGroup) => {
    setSelectedMeta((prev) => ({ ...prev, group: selectedGroup || null }));
    setFormData((prev) => ({
      ...prev,
      business_group_id: selectedGroup ? selectedGroup.id : "",
    }));
  }, []);

  const handleCitySelect = useCallback((selectedCity) => {
    const selectedId = selectedCity ? selectedCity.id : "";
    const nextCityName = selectedCity ? selectedCity.name : "";
    setSelectedMeta((prev) => ({
      ...prev,
      city: selectedCity || null,
      country: (!prev.country && selectedCity?.country) ? selectedCity.country : prev.country,
    }));
    setFormData((prev) => {
      const autoCountryId = (!prev.country_id && selectedCity?.country_id) ? selectedCity.country_id : prev.country_id;
      const autoCurrency = (!prev.country_id && selectedCity?.country?.currency) ? selectedCity.country.currency : prev.currency;
      const next = {
        ...prev,
        city_id: selectedId,
        city_name: nextCityName,
        country_id: autoCountryId,
        currency: autoCurrency,
      };
      setFormTouched((t) => ({ ...t, city_id: true }));
      setFormErrors((prevErr) => ({
        ...prevErr,
        city_id: validateFieldRef.current("city_id", selectedId, next),
      }));
      return next;
    });
  }, []);

  const handleCurrencySelect = useCallback((selectedCurrency) => {
    if (!selectedCurrency) return;
    setFormData((prev) => ({ ...prev, currency: selectedCurrency.code }));
  }, []);

  const handleMobileDialSelect = useCallback((country) => {
    setFormData((prev) => ({ ...prev, mobile_dial: country.dialCode, mobile_iso: country.iso }));
  }, []);

  const handleWhatsappDialSelect = useCallback((country) => {
    setFormData((prev) => ({ ...prev, whatsapp_dial: country.dialCode, whatsapp_iso: country.iso }));
  }, []);

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

  // Filter available cities based on selected country (memoized for fast input typing)
  const availableCities = useMemo(() => {
    if (!formData.country_id) return formOptions.cities;
    const filtered = formOptions.cities.filter((c) => String(c.country_id) === String(formData.country_id));
    return filtered.length > 0 ? filtered : formOptions.cities;
  }, [formData.country_id, formOptions.cities]);

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

    const latestData = { ...formData, ...formValuesRef.current };
    setFormData(latestData);

    // Trigger full live validation check
    const isValid = validateAll(latestData);
    if (!isValid) {
      handleError("Please complete all required fields correctly.");
      return;
    }

    const isPersonal = latestData.website_option === "personal";
    const payload = {
      ...latestData,
      is_system_website: !isPersonal,
      is_personal_website: isPersonal,
      website_url: isPersonal ? latestData.website_url : null,
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

    // If Creating with new schema: launch Schema Migration Progress Popup with live backend polling
    if (latestData.schema_type === "new") {
      let interval;
      try {
        setFormSubmitting(true);
        setSchemaProgressOpen(true);
        setSchemaProgressStatus("running");
        setSchemaProgressError("");
        setSchemaMigrationCount(0);
        setSchemaProgressPercent(0);

        const targetSchema = latestData.schema_name;
        interval = setInterval(async () => {
          if (!targetSchema) return;
          const progRes = await getSchemaProgressApi(targetSchema);
          const prog = progRes?.data?.data;
          if (prog && typeof prog.applied === "number") {
            const total = prog.total || TOTAL_MIGRATIONS;
            setSchemaMigrationCount(prog.applied);
            setSchemaProgressPercent(Math.round((prog.applied / total) * 100));
          }
        }, 250);

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
                                    onClick={() => setDeleteConfirmBusiness(biz)}
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
            <Stack spacing={2.5} key={formSessionKey}>
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
                        <FastTextField
                          field="website_url"
                          formValuesRef={formValuesRef}
                          value={formData.website_url}
                          touched={Boolean(formTouched.website_url)}
                          error={formErrors.website_url}
                          onCommit={commitFieldValue}
                          validateFnRef={validateFieldRef}
                          onErrorChange={handleFastErrorChange}
                          size="small"
                          label="Website Url"
                          placeholder="e.g. localhost:3000 or mydomain.com"
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
                    <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.75, mb: 0.5 }}>
                      <Typography sx={{ fontSize: "12.5px", fontWeight: 600, color: formErrors.services && formTouched.services ? "#ef4444" : "#64748b" }}>
                        Enabled Services (Select applicable services) *
                      </Typography>
                      <Typography sx={{ fontSize: "11.5px", color: formErrors.services && formTouched.services ? "#ef4444" : "#94a3b8" }}>
                        (At least one of Sale, Trade-in, or Repair is required)
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
                      <FastTextField
                        field="name"
                        formValuesRef={formValuesRef}
                        value={formData.name}
                        touched={Boolean(formTouched.name)}
                        error={formErrors.name}
                        onCommit={commitFieldValue}
                        validateFnRef={validateFieldRef}
                        onErrorChange={handleFastErrorChange}
                        fullWidth
                        size="small"
                        label="Business Name *"
                        placeholder="e.g. iTech, Coffee Shop"
                        sx={modernInputStyles}
                      />
                    </Box>

                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 220px" } }}>
                      <AsyncSearchAutocomplete
                        label="Business Type *"
                        placeholder="Search business type..."
                        valueId={formData.business_type}
                        initialOptions={businessTypeOptions}
                        getOptionId={(opt) => opt?.id ?? opt}
                        getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt?.label || "")}
                        onChange={handleBusinessTypeSelect}
                        onBlur={() => handleBlur("business_type")}
                        error={Boolean(formErrors.business_type && formTouched.business_type)}
                        helperText={formTouched.business_type && formErrors.business_type}
                        noOptionsText="No business type matched"
                        sx={modernInputStyles}
                      />
                    </Box>

                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 200px" } }}>
                      <FastTextField
                        field="branch_name"
                        formValuesRef={formValuesRef}
                        value={formData.branch_name}
                        touched={Boolean(formTouched.branch_name)}
                        error={formErrors.branch_name}
                        onCommit={commitFieldValue}
                        validateFnRef={validateFieldRef}
                        onErrorChange={handleFastErrorChange}
                        fullWidth
                        size="small"
                        label="Branch Name *"
                        placeholder="e.g. Main Branch, Test branch"
                        sx={modernInputStyles}
                      />
                    </Box>
                  </Box>

                  {/* Row 2: Business Email, Searchable Business Owner (Shows all users), Role (Shows all roles) */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 250px" } }}>
                      <FastTextField
                        field="email"
                        formValuesRef={formValuesRef}
                        value={formData.email}
                        touched={Boolean(formTouched.email)}
                        error={formErrors.email}
                        onCommit={commitFieldValue}
                        validateFnRef={validateFieldRef}
                        onErrorChange={handleFastErrorChange}
                        fullWidth
                        size="small"
                        type="email"
                        label="Business Email *"
                        placeholder="e.g. info@business.com"
                        sx={modernInputStyles}
                      />
                    </Box>

                    {/* Live Backend Searchable Business Owner Autocomplete */}
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1.4 1 300px" } }}>
                      <AsyncSearchAutocomplete
                        label="Business Owner *"
                        placeholder="Type to search owner by name, email, phone..."
                        disabled={Boolean(editingBusiness)}
                        valueId={formData.owner_id}
                        initialOptions={formOptions.owners}
                        selectedFallback={selectedMeta.owner}
                        fetchOptions={fetchOwnerOptions}
                        getOptionLabel={(option) => {
                          if (!option) return "";
                          if (typeof option === "string") return option;
                          return `${option.first_name || ""} ${option.last_name || ""} (${option.email || ""})`.trim();
                        }}
                        localFilterFn={(opt, q) => {
                          const name = `${opt.first_name || ""} ${opt.last_name || ""}`.toLowerCase();
                          const email = (opt.email || "").toLowerCase();
                          const biz = (opt.business_name || "").toLowerCase();
                          const phone = (opt.phone || "").toLowerCase();
                          return name.includes(q) || email.includes(q) || biz.includes(q) || phone.includes(q);
                        }}
                        onChange={handleOwnerSelect}
                        onBlur={() => handleBlur("owner_id")}
                        error={Boolean(formErrors.owner_id && formTouched.owner_id)}
                        helperText={formTouched.owner_id && formErrors.owner_id}
                        noOptionsText="No owners found"
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
                              {option.business_name || option.phone || "No business yet"}
                            </Typography>
                          </Box>
                        )}
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
                    </Box>

                    {/* Searchable Role Dropdown */}
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 200px" } }}>
                      <AsyncSearchAutocomplete
                        label="Role *"
                        placeholder={loadingOptions ? "Loading roles..." : "Search role..."}
                        disabled={loadingOptions}
                        valueId={formData.role_id}
                        initialOptions={formOptions.roles || []}
                        getOptionLabel={(role) => role?.title || ""}
                        localFilterFn={(role, q) =>
                          (role.title || "").toLowerCase().includes(q) ||
                          (role.description || "").toLowerCase().includes(q)
                        }
                        onChange={handleRoleSelect}
                        onBlur={() => handleBlur("role_id")}
                        error={Boolean(formErrors.role_id && formTouched.role_id)}
                        helperText={formTouched.role_id && formErrors.role_id}
                        noOptionsText="No roles available"
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            key={option.id}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                              py: 0.75,
                              borderBottom: "1px solid #f1f5f9",
                            }}
                          >
                            <Typography sx={{ fontSize: "13.5px", fontWeight: 600, color: "#1e293b" }}>
                              {option.title}
                            </Typography>
                            {option.description ? (
                              <Typography sx={{ fontSize: "11.5px", color: "#64748b" }}>
                                {option.description}
                              </Typography>
                            ) : null}
                          </Box>
                        )}
                        sx={modernInputStyles}
                      />
                    </Box>
                  </Box>

                  {/* Row 3: Live Backend Searchable Business Group Dropdown */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 320px" } }}>
                      <AsyncSearchAutocomplete
                        label="Business Group"
                        placeholder="Search business group (Optional)..."
                        valueId={formData.business_group_id || ""}
                        initialOptions={formOptions.business_groups || []}
                        selectedFallback={selectedMeta.group}
                        fetchOptions={fetchGroupOptions}
                        getOptionLabel={(grp) => grp?.name || ""}
                        onChange={handleGroupSelect}
                        helperText="Assign this business to a business group (Optional)"
                        noOptionsText="No business groups found"
                        sx={modernInputStyles}
                      />
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
                          delete formValuesRef.current.schema_name;
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
                        <SchemaNameField
                          formValuesRef={formValuesRef}
                          value={formData.schema_name}
                          touched={Boolean(formTouched.schema_name)}
                          error={formErrors.schema_name}
                          existingSchemas={formOptions.existing_schemas}
                          onCommit={commitFieldValue}
                          onErrorChange={handleFastErrorChange}
                        />
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
                    {/* Business Mobile No - All country flags & searchable dial picker */}
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 320px" } }}>
                      <FastTextField
                        field="mobile_no"
                        formValuesRef={formValuesRef}
                        value={formData.mobile_no}
                        onCommit={commitFieldValue}
                        fullWidth
                        size="small"
                        label="Business Mobile No"
                        placeholder="7123456789"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ mr: 0.5, display: "flex", alignItems: "center" }}>
                              <PhoneDialPicker
                                dialCode={formData.mobile_dial}
                                iso={formData.mobile_iso}
                                onChange={handleMobileDialSelect}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={modernInputStyles}
                      />
                    </Box>

                    {/* Business Whatsapp No - All country flags & searchable dial picker */}
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 320px" } }}>
                      <FastTextField
                        field="whatsapp_no"
                        formValuesRef={formValuesRef}
                        value={formData.whatsapp_no}
                        onCommit={commitFieldValue}
                        fullWidth
                        size="small"
                        label="Business Whatsapp No"
                        placeholder="7123456789"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ mr: 0.5, display: "flex", alignItems: "center" }}>
                              <PhoneDialPicker
                                dialCode={formData.whatsapp_dial}
                                iso={formData.whatsapp_iso}
                                onChange={handleWhatsappDialSelect}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={modernInputStyles}
                      />
                    </Box>
                  </Box>

                  {/* Address */}
                  <FastTextField
                    field="address"
                    formValuesRef={formValuesRef}
                    value={formData.address}
                    onCommit={commitFieldValue}
                    fullWidth
                    size="small"
                    label="Business Address"
                    placeholder="Street address, building number..."
                    sx={modernInputStyles}
                  />

                  {/* City Dropdown (Shows all created cities), State, Post Code */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {/* Live Backend Searchable City Dropdown */}
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 200px" } }}>
                      <AsyncSearchAutocomplete
                        required
                        label="City"
                        placeholder="Search city..."
                        valueId={formData.city_id || ""}
                        initialOptions={availableCities}
                        selectedFallback={selectedMeta.city}
                        fetchOptions={fetchCityOptions}
                        resetKey={formData.country_id || "all"}
                        getOptionLabel={(city) => city?.name || ""}
                        onChange={handleCitySelect}
                        onBlur={() => handleBlur("city_id")}
                        error={Boolean(formErrors.city_id && formTouched.city_id)}
                        helperText={formTouched.city_id && formErrors.city_id}
                        noOptionsText="No cities found"
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            key={option.id}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              py: 0.75,
                              borderBottom: "1px solid #f1f5f9",
                            }}
                          >
                            <Typography sx={{ fontSize: "13.5px", fontWeight: 500, color: "#1e293b" }}>
                              {option.name}
                            </Typography>
                            {option.country?.name ? (
                              <Typography sx={{ fontSize: "11.5px", color: "#64748b", ml: 1 }}>
                                {option.country.name}
                              </Typography>
                            ) : null}
                          </Box>
                        )}
                        sx={modernInputStyles}
                      />
                    </Box>

                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 200px" } }}>
                      <FastTextField
                        field="state_region"
                        formValuesRef={formValuesRef}
                        value={formData.state_region}
                        onCommit={commitFieldValue}
                        fullWidth
                        size="small"
                        label="State / Region"
                        placeholder="e.g. Greater London, Punjab"
                        sx={modernInputStyles}
                      />
                    </Box>

                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 200px" } }}>
                      <FastTextField
                        field="post_code"
                        formValuesRef={formValuesRef}
                        value={formData.post_code}
                        onCommit={commitFieldValue}
                        fullWidth
                        size="small"
                        label="Post Code"
                        placeholder="e.g. E1 6AN, 40100"
                        sx={modernInputStyles}
                      />
                    </Box>
                  </Box>

                  {/* Country (Live Backend Search) & Currency (All Currencies Search) */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 300px" } }}>
                      <AsyncSearchAutocomplete
                        required
                        label="Country"
                        placeholder="Search country..."
                        valueId={formData.country_id || ""}
                        initialOptions={formOptions.countries}
                        selectedFallback={selectedMeta.country}
                        fetchOptions={fetchCountryOptions}
                        getOptionLabel={(c) => c?.name || ""}
                        localFilterFn={(c, q) =>
                          (c.name || "").toLowerCase().includes(q) ||
                          (c.nice_name || "").toLowerCase().includes(q) ||
                          (c.iso || "").toLowerCase().includes(q) ||
                          (c.currency || "").toLowerCase().includes(q)
                        }
                        onChange={handleCountrySelect}
                        onBlur={() => handleBlur("country_id")}
                        error={Boolean(formErrors.country_id && formTouched.country_id)}
                        helperText={formTouched.country_id && formErrors.country_id}
                        noOptionsText="No countries found"
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            key={option.id}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 1,
                              py: 0.75,
                              borderBottom: "1px solid #f1f5f9",
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              {option.iso ? <CountryFlag iso={option.iso} width={20} height={14} /> : null}
                              <Typography sx={{ fontSize: "13.5px", fontWeight: 500, color: "#1e293b" }}>
                                {option.name}
                              </Typography>
                            </Box>
                            {option.currency ? (
                              <Typography sx={{ fontSize: "11.5px", color: "#64748b" }}>
                                {option.currency}
                              </Typography>
                            ) : null}
                          </Box>
                        )}
                        sx={modernInputStyles}
                      />
                    </Box>

                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 300px" } }}>
                      <AsyncSearchAutocomplete
                        label="Currency"
                        placeholder="Search currency (GBP, USD, PKR...)"
                        clearable={false}
                        valueId={formData.currency || "GBP"}
                        initialOptions={formOptions.currencies || []}
                        getOptionId={(c) => c?.code}
                        getOptionLabel={(c) => (c ? `${c.name} (${c.code})` : "")}
                        localFilterFn={(c, q) =>
                          (c.code || "").toLowerCase().includes(q) ||
                          (c.name || "").toLowerCase().includes(q)
                        }
                        onChange={handleCurrencySelect}
                        helperText="Fills in from country. You can change it."
                        noOptionsText="No currency matched"
                        sx={modernInputStyles}
                      />
                    </Box>
                  </Box>

                  {/* Coordinates */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 250px" } }}>
                      <FastTextField
                        field="latitude"
                        formValuesRef={formValuesRef}
                        value={formData.latitude}
                        onCommit={commitFieldValue}
                        fullWidth
                        size="small"
                        label="Latitude"
                        placeholder="e.g. 51.5074"
                        sx={modernInputStyles}
                      />
                    </Box>
                    <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 250px" } }}>
                      <FastTextField
                        field="longitude"
                        formValuesRef={formValuesRef}
                        value={formData.longitude}
                        onCommit={commitFieldValue}
                        fullWidth
                        size="small"
                        label="Longitude"
                        placeholder="e.g. -0.1278"
                        sx={modernInputStyles}
                      />
                    </Box>
                  </Box>

                  {/* Description */}
                  <FastTextField
                    field="description"
                    formValuesRef={formValuesRef}
                    value={formData.description}
                    onCommit={commitFieldValue}
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                    label="Description"
                    placeholder="Brief notes, business overview or scope..."
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

      {/* Confirm Delete Business Dialog */}
      <Dialog
        open={Boolean(deleteConfirmBusiness)}
        onClose={() => !deleteLoading && setDeleteConfirmBusiness(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", p: 2.5, border: "1px solid #e2e8f0" },
        }}
      >
        {deleteConfirmBusiness && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "10px",
                    bgcolor: "#fef2f2",
                    color: "#ef4444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                </Box>
                <Typography sx={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
                  Delete Business?
                </Typography>
              </Box>
              <IconButton
                size="small"
                disabled={deleteLoading}
                onClick={() => setDeleteConfirmBusiness(null)}
              >
                <CloseRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>

            <Typography sx={{ fontSize: "13px", color: "#475569", mb: 2.5, lineHeight: 1.5 }}>
              Are you sure you want to delete{" "}
              <Box component="span" sx={{ fontWeight: 700, color: "#0f172a" }}>
                "{deleteConfirmBusiness.name}"
              </Box>
              ? You can restore it later from the Deleted tab.
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                variant="outlined"
                disabled={deleteLoading}
                onClick={() => setDeleteConfirmBusiness(null)}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#475569",
                  borderColor: "#cbd5e1",
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                disableElevation
                disabled={deleteLoading}
                onClick={() => handleDeleteOrRestore(deleteConfirmBusiness)}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </Button>
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}
