import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import {
  Button,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import * as yup from "yup";
import { useFormik } from "formik";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import { handleError, handleSuccess } from "../toast";
import MediaSelectModal from "./MediaSelectModal";
import TextEditor from "./TextEditor";
import {
  useCreateTerm,
  useUpdateTerm,
} from "../hook/vendor/useAttributesTerms";

export default function CreateUpdateTermModal({
  showEditBtn,
  title_heading,
  term,
  selectedId,
}) {
  const [open, setOpen] = React.useState(false);
  const [imageData, setImageData] = useState({ image_id: "", image_path: "" });
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  React.useEffect(() => {
    if (showEditBtn && term) {
      setImageData({
        image_id: term?.image_id ?? term?.media?.id ?? "",
        image_path: term?.media?.media_path
          ? `${import.meta.env.VITE_BASE_URL}/storage/${term.media.media_path}`
          : "",
      });
    }
  }, [showEditBtn, term]);
  const createTerm = useCreateTerm();
  const updateTerm = useUpdateTerm();
  const isLoading = createTerm.isPending || updateTerm.isPending;
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: term?.title || "",
      sort_order: term?.sort_order ?? 1,
      description: term?.description || "",
    },
    validationSchema: yup.object({
      title: yup
        .string()
        .min(3)
        .max(200)
        .required("Term name is required!")
        .trim(),
      sort_order: yup.number().required("Sort order is required!"),
    }),
    onSubmit: async (values, action) => {
      const payload = {
        attribute_id: selectedId,
        ...values,
        image_id: imageData?.image_id,
      };

      if (term?.id) {
        updateTerm.mutate(
          { ...payload, id: term?.id },
          {
            onSuccess: (res) => {
              setOpen(false);
              handleSuccess(res?.message || "Term updated successfully!");
              action.resetForm();
              setImageData({ image_id: "", image_path: "" });
            },
            onError: (error) => {
              const status = error?.response?.status;
              if (status === 404) {
                handleError("Term not found!");
              } else if (status === 422) {
                handleError("Term already exists!");
              } else {
                handleError(
                  error?.response?.data?.message || "Failed to update term!",
                );
              }
            },
          },
        );
      } else {
        createTerm.mutate(payload, {
          onSuccess: (res) => {
            handleSuccess(res?.message || "Term created successfully!");
            action.resetForm();
            setOpen(false);
            setImageData({ image_id: "", image_path: "" });
          },
          onError: (error) => {
            const status = error?.response?.status;
            if (status === 422) {
              handleError("Validation errors!!");
            } else {
              handleError(
                error?.response?.data?.message || "Failed to create term!",
              );
            }
          },
        });
      }
    },
  });

  const nameInputRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const DrawerList = (
    <Box
      sx={{
        width: { xs: "100vw", sm: 580 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#ffffff",
      }}
      role="presentation"
      className="inner-modal-search-view-set"
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2.5,
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              bgcolor: "#0f172a",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
            }}
          >
            <StyleOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: "17px", color: "#0f172a", lineHeight: 1.2 }}>
              {title_heading} Term
            </Typography>
            <Typography sx={{ fontSize: "12px", color: "#64748b", fontWeight: 500, mt: 0.25 }}>
              Configure term value, sort order, swatch image, and description
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={toggleDrawer(false)}
          size="small"
          sx={{
            width: 34,
            height: 34,
            borderRadius: "10px",
            bgcolor: "#f8fafc",
            border: "1px solid #e2e8f0",
            color: "#64748b",
            "&:hover": { bgcolor: "#0f172a", color: "#ffffff", borderColor: "#0f172a" },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ p: 3, flex: 1, overflowY: "auto" }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  width: "100%",
                  border: "1px solid #e2e8f0",
                  borderRadius: "18px",
                  p: 2.5,
                  bgcolor: "#ffffff",
                  boxShadow: "0 4px 16px rgba(15, 23, 42, 0.03)",
                }}
              >
                <Grid container spacing={2} sx={{ width: "100%" }}>
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Term Title"
                      variant="outlined"
                      type="text"
                      name="title"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.title && touched.title)}
                      inputRef={nameInputRef}
                    />
                    {touched.title && errors.title && (
                      <Typography sx={{ fontSize: "12px", color: "#ef4444", fontWeight: 600, mt: 0.5 }}>
                        {errors.title}
                      </Typography>
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Sort Order"
                      variant="outlined"
                      type="number"
                      name="sort_order"
                      value={values.sort_order}
                      onChange={(e) => {
                        const val = e.target.value;
                        const finalVal =
                          val === "" ? "" : Math.max(1, parseInt(val, 10) || 1);
                        setFieldValue("sort_order", finalVal);
                      }}
                      onBlur={handleBlur}
                      error={Boolean(errors.sort_order && touched.sort_order)}
                      inputProps={{ min: 1 }}
                      sx={{
                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                          display: "none",
                          margin: 0,
                        },
                        "& input[type=number]": {
                          MozAppearance: "textfield",
                        },
                      }}
                    />
                    {touched.sort_order && errors.sort_order && (
                      <Typography sx={{ fontSize: "12px", color: "#ef4444", fontWeight: 600, mt: 0.5 }}>
                        {errors.sort_order}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #e2e8f0",
                  bgcolor: "#f8fafc",
                  borderRadius: "16px",
                  p: 2,
                  height: "100%",
                  gap: 1,
                }}
              >
                <MediaSelectModal
                  setImageData={setImageData}
                  imageData={imageData}
                  isBrand={true}
                />
                <Typography sx={{ fontSize: "11px", fontWeight: 600, color: "#64748b", textAlign: "center" }}>
                  Term Swatch
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 9 }}>
              <TextEditor
                value={values.description}
                onChange={(content) => {
                  const baseContent = content === "<p><br></p>" ? "" : content;
                  setFieldValue("description", baseContent);
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.25, mt: 1 }}>
                <Button
                  type="button"
                  onClick={toggleDrawer(false)}
                  className="custom-primary-btn-admin-side"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="custom-secondary-btn-admin-side"
                  sx={{
                    opacity: isLoading ? 0.6 : 1,
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {isLoading ? "Saving..." : term?.id ? "Update Term" : "Create Term"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );

  return (
    <>
      {showEditBtn ? (
        <Tooltip title="Edit" arrow>
          <IconButton
            onClick={toggleDrawer(true)}
            size="small"
            sx={{
              width: 32,
              height: 32,
              borderRadius: "10px",
              color: "#0f172a",
              ml: 0.75,
              bgcolor: "#f8fafc",
              border: "1px solid #e2e8f0",
              "&:hover": { bgcolor: "#0f172a", color: "#ffffff", borderColor: "#0f172a" },
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          disabled={!selectedId}
          onClick={toggleDrawer(true)}
          className="custom-secondary-btn-admin-side"
          startIcon={<AddIcon />}
          sx={{
            textWrap: "nowrap",
            "&.Mui-disabled": {
              bgcolor: "#e2e8f0 !important",
              borderColor: "#e2e8f0 !important",
              color: "#94a3b8 !important",
              boxShadow: "none !important",
            },
          }}
        >
          Create Term
        </Button>
      )}

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        className="search-modal-panel-style-set"
        sx={{ zIndex: "6000" }}
      >
        {DrawerList}
      </Drawer>
    </>
  );
}
