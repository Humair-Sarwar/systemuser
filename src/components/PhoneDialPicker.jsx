import React, { useState, useMemo } from "react";
import {
  Box,
  Popover,
  TextField,
  Typography,
  InputAdornment,
  Divider,
} from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import SearchIcon from "@mui/icons-material/Search";
import {
  ALL_COUNTRY_DIAL_CODES,
  CountryFlag,
  findDialCountry,
} from "../utils/countryDialData";

/**
 * Compact clickable dial-code trigger + searchable world country-flag popover.
 * Keeps all 240+ flags lazy inside the popover so parent form typing stays instant.
 */
const PhoneDialPicker = React.memo(function PhoneDialPicker({
  dialCode = "+44",
  iso,
  onChange,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [query, setQuery] = useState("");

  const activeCountry = useMemo(
    () => findDialCountry(dialCode, iso),
    [dialCode, iso]
  );

  const filteredCountries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_COUNTRY_DIAL_CODES;
    const digitsOnly = q.replace(/^\+/, "");
    return ALL_COUNTRY_DIAL_CODES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.toLowerCase().includes(q) ||
        c.dialCode.replace(/^\+/, "").includes(digitsOnly) ||
        c.iso.toLowerCase() === q
    );
  }, [query]);

  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
    setQuery("");
  };

  const handleClose = () => {
    setAnchorEl(null);
    setQuery("");
  };

  const handleSelect = (country) => {
    onChange?.(country);
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Box
        component="button"
        type="button"
        onClick={handleOpen}
        aria-label="Select country dial code"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          px: 0.4,
          py: 0.25,
          borderRadius: "6px",
          color: "#1e293b",
          fontWeight: 600,
          fontSize: "13.5px",
          flexShrink: 0,
          "&:hover": {
            backgroundColor: "#f1f5f9",
          },
        }}
      >
        <CountryFlag iso={activeCountry.iso} width={22} height={15} />
        <span>{activeCountry.dialCode}</span>
        <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18, color: "#64748b", ml: -0.25 }} />
      </Box>
      <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.8, my: "auto" }} />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            mt: 1,
            width: 310,
            borderRadius: "10px",
            boxShadow: "0 12px 32px rgba(15, 23, 42, 0.14)",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          },
        }}
      >
        <Box sx={{ p: 1.25, borderBottom: "1px solid #f1f5f9", backgroundColor: "#fff" }}>
          <TextField
            autoFocus
            fullWidth
            size="small"
            placeholder="Search country or code (+92, UK...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 17, color: "#94a3b8" }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: "8px",
                fontSize: "13px",
                backgroundColor: "#f8fafc",
              },
            }}
          />
        </Box>

        <Box sx={{ maxHeight: 270, overflowY: "auto", py: 0.5 }}>
          {filteredCountries.length === 0 ? (
            <Typography sx={{ px: 2, py: 2, fontSize: "13px", color: "#64748b", textAlign: "center" }}>
              No country matched "{query}"
            </Typography>
          ) : (
            filteredCountries.map((country) => {
              const isSelected =
                country.iso === activeCountry.iso && country.dialCode === activeCountry.dialCode;
              return (
                <Box
                  key={`${country.iso}-${country.dialCode}`}
                  onClick={() => handleSelect(country)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1.2,
                    px: 1.5,
                    py: 0.85,
                    cursor: "pointer",
                    backgroundColor: isSelected ? "#eff6ff" : "transparent",
                    "&:hover": {
                      backgroundColor: isSelected ? "#dbeafe" : "#f8fafc",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, minWidth: 0 }}>
                    <CountryFlag iso={country.iso} width={22} height={15} />
                    <Typography
                      noWrap
                      sx={{
                        fontSize: "13px",
                        fontWeight: isSelected ? 600 : 500,
                        color: "#1e293b",
                      }}
                    >
                      {country.name}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "12.5px",
                      fontWeight: 600,
                      color: isSelected ? "#2563eb" : "#64748b",
                      flexShrink: 0,
                    }}
                  >
                    {country.dialCode}
                  </Typography>
                </Box>
              );
            })
          )}
        </Box>
      </Popover>
    </>
  );
});

export default PhoneDialPicker;
