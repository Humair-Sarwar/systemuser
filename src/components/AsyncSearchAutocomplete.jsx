import React, { useState, useEffect, useRef, useMemo } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";

/**
 * Isolated, memoized searchable Autocomplete component supporting both
 * static client-side search and live debounced backend search without
 * causing parent component re-renders while typing.
 */
const AsyncSearchAutocomplete = React.memo(function AsyncSearchAutocomplete({
  label,
  placeholder,
  valueId,
  initialOptions = [],
  selectedFallback = null,
  fetchOptions,
  getOptionLabel,
  getOptionId = (opt) => opt?.id,
  localFilterFn,
  renderOption,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  error = false,
  helperText = "",
  sx,
  resetKey = "",
  clearable = true,
  noOptionsText = "No matching records found",
  size = "small",
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [remoteOptions, setRemoteOptions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncedQuery, setSyncedQuery] = useState(null);

  const requestIdRef = useRef(0);
  const debounceRef = useRef(null);
  const fetchOptionsRef = useRef(fetchOptions);
  fetchOptionsRef.current = fetchOptions;

  // Reset cached remote results when parent context changes (e.g. country changes for City)
  useEffect(() => {
    setRemoteOptions(null);
    setSyncedQuery(null);
  }, [resetKey]);

  // Trigger live backend search when fetchOptions is provided
  useEffect(() => {
    if (!fetchOptionsRef.current || disabled) return undefined;

    const effectiveQuery = isFiltering ? inputValue.trim() : "";

    if (effectiveQuery === "" && !open) {
      return undefined;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const reqId = ++requestIdRef.current;
      setLoading(true);
      try {
        const fetched = await fetchOptionsRef.current(effectiveQuery);
        if (reqId === requestIdRef.current && Array.isArray(fetched)) {
          setRemoteOptions(fetched);
          setSyncedQuery(effectiveQuery);
        }
      } catch (err) {
        // Keep existing options gracefully on transient error
      } finally {
        if (reqId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }, effectiveQuery === "" ? 0 : 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, isFiltering, open, resetKey, disabled]);

  const baseOptions = useMemo(() => {
    const source = remoteOptions !== null ? remoteOptions : initialOptions;
    if (!selectedFallback) return source;
    const selId = getOptionId(selectedFallback);
    if (selId === undefined || selId === null || selId === "") return source;
    const exists = source.some((o) => String(getOptionId(o)) === String(selId));
    return exists ? source : [selectedFallback, ...source];
  }, [remoteOptions, initialOptions, selectedFallback, getOptionId]);

  const selectedOption = useMemo(() => {
    if (valueId === undefined || valueId === null || valueId === "") return null;
    const found =
      baseOptions.find((o) => String(getOptionId(o)) === String(valueId)) ||
      initialOptions.find((o) => String(getOptionId(o)) === String(valueId));
    if (found) return found;
    return selectedFallback || null;
  }, [valueId, baseOptions, initialOptions, selectedFallback, getOptionId]);

  // Keep input text in sync with external value selection when dropdown is closed
  useEffect(() => {
    if (!open) {
      setIsFiltering(false);
      setInputValue(selectedOption ? getOptionLabel(selectedOption) : "");
    }
  }, [selectedOption, open, getOptionLabel]);

  const handleFilterOptions = useMemo(() => {
    return (options, state) => {
      if (!isFiltering) return options;
      const q = (state.inputValue || "").trim().toLowerCase();
      if (!q) return options;
      // When backend has already returned results for the exact typed query, trust server results
      if (fetchOptionsRef.current && syncedQuery !== null && syncedQuery.toLowerCase() === q) {
        return options;
      }
      if (localFilterFn) {
        return options.filter((opt) => localFilterFn(opt, q));
      }
      return options.filter((opt) => getOptionLabel(opt).toLowerCase().includes(q));
    };
  }, [isFiltering, syncedQuery, localFilterFn, getOptionLabel]);

  return (
    <Autocomplete
      size={size}
      fullWidth
      open={open}
      onOpen={() => {
        setIsFiltering(false);
        setOpen(true);
      }}
      onClose={() => {
        setIsFiltering(false);
        setOpen(false);
      }}
      disabled={disabled}
      disableClearable={!clearable}
      options={baseOptions}
      loading={loading}
      value={selectedOption}
      inputValue={inputValue}
      onInputChange={(event, newInputValue, reason) => {
        if (reason === "input") {
          setIsFiltering(true);
          setInputValue(newInputValue);
        } else if (reason === "clear") {
          setIsFiltering(false);
          setInputValue("");
          setRemoteOptions(null);
          setSyncedQuery(null);
        } else if (reason === "reset") {
          setIsFiltering(false);
          setInputValue(newInputValue);
        }
      }}
      onChange={(event, newValue) => {
        setIsFiltering(false);
        if (newValue) {
          setInputValue(getOptionLabel(newValue));
        } else {
          setInputValue("");
        }
        onChange?.(newValue);
      }}
      onBlur={onBlur}
      filterOptions={handleFilterOptions}
      getOptionLabel={getOptionLabel}
      getOptionKey={(option) => String(getOptionId(option) ?? getOptionLabel(option))}
      isOptionEqualToValue={(option, val) => {
        if (!option || !val) return false;
        return String(getOptionId(option)) === String(getOptionId(val));
      }}
      renderOption={renderOption}
      loadingText="Searching..."
      noOptionsText={noOptionsText}
      renderInput={(params) => (
        <TextField
          {...params}
          required={required}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          sx={sx}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={16} sx={{ mr: 0.5 }} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
});

export default AsyncSearchAutocomplete;
