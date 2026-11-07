import * as React from "react";
import { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  Button,
  TextField,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  alpha,
  Skeleton,
  InputAdornment,
  IconButton,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import { fetchCategoriesPanel } from "../hook/vendor/useCategories";
import { handleError } from "../toast";

export default function CategoriesLoadModal({
  handleTargetParentCategoryId,
  initialParentId,
  initialParentTitle,
  categoryPMdl,
}) {
  const [open, setOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [currentSelectedId, setCurrentSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    if (!searchQuery) {
      setDebouncedSearchQuery("");
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleDrawer = (newOpen) => () => setOpen(newOpen);

  const { data, isLoading, isError } = fetchCategoriesPanel(
    debouncedSearchQuery,
    { enabled: Boolean(open) },
  );
  const categoriesList = data?.data || [];

  useEffect(() => {
    if (isError) {
      handleError("Error fetching categories!");
    }
  }, [isError]);

  useEffect(() => {
    if (initialParentId && !currentSelectedId) {
      setCurrentSelectedId(initialParentId);
      setSelectedCategoryName(initialParentTitle || "Selected Parent");
    }
  }, [initialParentId, initialParentTitle]);

  const handleSelectCategory = (categoryId, categoryName, level) => {
    if (currentSelectedId === categoryId) {
      // Unselect logic
      setCurrentSelectedId(null);
      setSelectedCategoryName("");
      handleTargetParentCategoryId(null, null);
    } else {
      // Selection logic
      setCurrentSelectedId(categoryId);
      setSelectedCategoryName(categoryName);
      handleTargetParentCategoryId(categoryId, level);
    }
    setOpen(false);
  };

  const renderCategoryAccordion = (category, level = 0, categoryPMdl) => {
    const hasChildren = category.children && category.children.length > 0;
    const isSelected = currentSelectedId === category.id;

    return (
      <Accordion
        key={category.id}
        disableGutters
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          "&:before": { display: "none" },
          ml: level > 0 ? `${level * 14}px` : 0,
          borderLeft: level > 0 ? "1.5px dashed #e2e8f0" : "none",
          pl: level > 0 ? 1 : 0,
          mb: 0.75,
          transition: "all 0.2s ease",
        }}
      >
        <AccordionSummary
          expandIcon={
            hasChildren ? (
              <ExpandMoreIcon
                sx={{
                  fontSize: "1.15rem",
                  color: isSelected ? "#ffffff" : "#64748b",
                }}
              />
            ) : null
          }
          sx={{
            px: 1.5,
            minHeight: "44px !important",
            borderRadius: "12px",
            backgroundColor: isSelected
              ? "#0f172a"
              : level === 0
                ? "#f8fafc"
                : "#ffffff",
            border: "1px solid",
            borderColor: isSelected
              ? "#0f172a"
              : level === 0
                ? "#eef2f6"
                : "transparent",
            boxShadow: isSelected
              ? "0 6px 16px -4px rgba(15, 23, 42, 0.25)"
              : "none",
            transition: "all 0.2s ease",
            "& .MuiAccordionSummary-content": {
              my: "8px !important",
              alignItems: "center",
            },
            "&:hover": {
              backgroundColor: isSelected ? "#1e293b" : "#f1f5f9",
              borderColor: isSelected ? "#1e293b" : "#cbd5e1",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
              pr: 0.5,
              gap: 1,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectCategory(category.id, category.title, category.level);
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: 0,
              }}
            >
              {level === 0 ? (
                <FolderOutlinedIcon
                  sx={{
                    fontSize: 17,
                    color: isSelected ? "#10b981" : "#64748b",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <SubdirectoryArrowRightIcon
                  sx={{
                    fontSize: 15,
                    color: isSelected ? "#10b981" : "#94a3b8",
                    flexShrink: 0,
                  }}
                />
              )}
              <Typography
                variant="body2"
                sx={{
                  fontSize: "13.5px",
                  fontWeight: isSelected ? 700 : level === 0 ? 600 : 500,
                  color: isSelected
                    ? "#ffffff"
                    : level === 0
                      ? "#0f172a"
                      : "#334155",
                  cursor: "pointer",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {category.title}
              </Typography>
            </Box>

            {isSelected && (
              <CheckCircleIcon
                sx={{
                  fontSize: "1.1rem",
                  color: "#10b981",
                  flexShrink: 0,
                }}
              />
            )}
          </Box>
        </AccordionSummary>

        {hasChildren && (
          <AccordionDetails sx={{ p: 0, pt: 0.75 }}>
            {category.children.map((child) =>
              renderCategoryAccordion(child, level + 1),
            )}
          </AccordionDetails>
        )}
      </Accordion>
    );
  };

  return (
    <>
      <Button
        onClick={toggleDrawer(true)}
        fullWidth
        variant="outlined"
        sx={{
          justifyContent: "space-between",
          textTransform: "none",
          height: "40px",
          px: 1.75,
          borderRadius: "12px !important",
          backgroundColor: selectedCategoryName
            ? "#0f172a !important"
            : "#f8fafc !important",
          backgroundImage: "none !important",
          color: selectedCategoryName
            ? "#ffffff !important"
            : "#475569 !important",
          border: "1px solid !important",
          borderColor: selectedCategoryName
            ? "#0f172a !important"
            : "#e2e8f0 !important",
          fontSize: "13.5px !important",
          fontWeight: selectedCategoryName ? "600 !important" : "500 !important",
          boxShadow: selectedCategoryName
            ? "0 4px 12px rgba(15, 23, 42, 0.14) !important"
            : "none !important",
          transition: "all 0.2s ease !important",
          "&:hover": {
            backgroundColor: selectedCategoryName
              ? "#1e293b !important"
              : "#ffffff !important",
            borderColor: selectedCategoryName
              ? "#1e293b !important"
              : "#cbd5e1 !important",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <CategoryIcon
            sx={{
              fontSize: 17,
              color: selectedCategoryName ? "#10b981" : "#64748b",
              flexShrink: 0,
            }}
          />
          <Box
            component="span"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {selectedCategoryName
              ? categoryPMdl
                ? `Category: ${selectedCategoryName}`
                : `Parent: ${selectedCategoryName}`
              : categoryPMdl
                ? "Select Category"
                : "Select Parent Category"}
          </Box>
        </Box>
        <ExpandMoreIcon
          sx={{
            fontSize: 19,
            color: selectedCategoryName ? "#94a3b8" : "#64748b",
            flexShrink: 0,
          }}
        />
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        sx={{ zIndex: "6001" }}
        PaperProps={{
          sx: {
            width: { xs: 320, sm: 380 },
            p: 0,
            borderRadius: "24px 0 0 24px",
            borderLeft: "1px solid #eef2f6",
            boxShadow: "-12px 0 40px -8px rgba(15, 23, 42, 0.14)",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffffff",
          },
        }}
      >
        {/* Modern Drawer Header */}
        <Box
          sx={{
            px: 2.5,
            py: 2.25,
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "12px",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.16)",
              }}
            >
              <CategoryIcon sx={{ fontSize: 19 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#0f172a",
                  lineHeight: 1.2,
                  letterSpacing: "-0.01em",
                }}
              >
                Categories
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#64748b",
                  mt: 0.25,
                }}
              >
                Choose a category from list
              </Typography>
            </Box>
          </Box>

          <IconButton
            size="small"
            onClick={toggleDrawer(false)}
            sx={{
              width: 34,
              height: 34,
              borderRadius: "10px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              color: "#64748b",
              "&:hover": {
                backgroundColor: "#fef2f2",
                borderColor: "#fecaca",
                color: "#ef4444",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Box>

        {/* Search & Selected Status Bar */}
        <Box sx={{ px: 2.5, pt: 2, pb: 1.5 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery("")}
                    sx={{ p: 0.25, color: "#94a3b8" }}
                  >
                    <CloseIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#f8fafc",
                fontSize: "13.5px",
                "& fieldset": { borderColor: "#e2e8f0" },
                "&:hover": {
                  backgroundColor: "#ffffff",
                  "& fieldset": { borderColor: "#cbd5e1" },
                },
                "&.Mui-focused": {
                  backgroundColor: "#ffffff",
                  boxShadow: "0 0 0 3px rgba(15, 23, 42, 0.06)",
                  "& fieldset": {
                    borderColor: "#0f172a",
                    borderWidth: "1.5px",
                  },
                },
              },
            }}
          />

          {selectedCategoryName && (
            <Box
              sx={{
                mt: 1.5,
                px: 1.5,
                py: 1,
                borderRadius: "10px",
                backgroundColor: "#ecfdf5",
                border: "1px solid #a7f3d0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  minWidth: 0,
                }}
              >
                <CheckCircleIcon
                  sx={{ fontSize: 15, color: "#10b981", flexShrink: 0 }}
                />
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#065f46",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Selected: <strong>{selectedCategoryName}</strong>
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* List Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 2.5,
            pb: 2.5,
            "&::-webkit-scrollbar": { width: "5px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#cbd5e1",
              borderRadius: "999px",
            },
          }}
        >
          {isLoading ? (
            <Box sx={{ mt: 0.5 }}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Box
                  key={item}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.25,
                    mb: 0.75,
                    borderRadius: "12px",
                    backgroundColor: "#f8fafc",
                    gap: 1.5,
                  }}
                >
                  <Skeleton
                    variant="rounded"
                    width={22}
                    height={22}
                    animation="wave"
                    sx={{ borderRadius: "6px" }}
                  />
                  <Skeleton
                    variant="text"
                    width="75%"
                    height={22}
                    animation="wave"
                    sx={{ borderRadius: "4px" }}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            categoriesList.map((item) => renderCategoryAccordion(item))
          )}

          {!isLoading && categoriesList.length === 0 && (
            <Box
              sx={{
                mt: 6,
                p: 3,
                textAlign: "center",
                borderRadius: "16px",
                backgroundColor: "#f8fafc",
                border: "1px dashed #e2e8f0",
              }}
            >
              <CategoryIcon sx={{ fontSize: 32, color: "#cbd5e1", mb: 1 }} />
              <Typography
                sx={{
                  fontSize: "13.5px",
                  fontWeight: 600,
                  color: "#475569",
                }}
              >
                No categories found
              </Typography>
              <Typography sx={{ fontSize: "12px", color: "#94a3b8", mt: 0.25 }}>
                Try searching with a different keyword
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}
