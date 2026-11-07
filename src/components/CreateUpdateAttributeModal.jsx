import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  TextField,
  FormControl,
  RadioGroup,
  Radio,
  Tooltip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import * as yup from "yup";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import { useFormik } from "formik";
import TextEditor from "./TextEditor";
import { fetchCategoriesPanel } from "../hook/vendor/useCategories";
import {
  useCreateAttribute,
  useUpdateAttribute,
} from "../hook/vendor/useAttributesTerms";
import { handleError, handleSuccess } from "../toast";

export default function CreateUpdateAttributeModal({
  title_heading,
  attribute,
  editAtt,
}) {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen) => () => setOpen(newOpen);
  const createAttribute = useCreateAttribute();
  const updateAttribute = useUpdateAttribute();
  const isLoading = createAttribute.isPending || updateAttribute.isPending;
  const { data } = fetchCategoriesPanel("");
  const categoriesList = data?.data || [];

  const getAllCategoryIds = (items) => {
    let ids = [];
    items.forEach((item) => {
      ids.push(item.id);
      if (item.children && item.children.length > 0) {
        ids = [...ids, ...getAllCategoryIds(item.children)];
      }
    });
    return ids;
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: attribute?.title || "",
      sub_title: attribute?.sub_title || "",
      category_ids: attribute?.categories
        ? attribute.categories.map((cat) => cat.id)
        : [],
      description: attribute?.description || "",
      design: attribute?.design || 1,
      is_active_for_buy: attribute
        ? Number(attribute.is_active_for_buy) === 1
        : true,
    },
    validationSchema: yup.object({
      title: yup.string().min(3).max(200).required("Title is required!").trim(),
    }),
    onSubmit: async (values, actions) => {
      if (!values.category_ids || values.category_ids.length === 0) {
        handleError("Please select category!");
        return;
      }

      if (attribute?.id) {
        updateAttribute.mutate(
          { ...values, id: attribute?.id },
          {
            onSuccess: (res) => {
              actions.resetForm();
              setOpen(false);
              handleSuccess(res?.message || "Attribute updated successfully!");
            },
            onError: (error) => {
              const status = error?.response?.status;
              if (status === 422) {
                handleError("Validation Error!");
              } else if (status === 404) {
                handleError("Attribute not found!");
              } else {
                handleError(
                  error?.response?.data?.message ||
                    "Failed to update attribute!",
                );
              }
            },
          },
        );
      } else {
        createAttribute.mutate(values, {
          onSuccess: () => {
            actions.resetForm();
            setOpen(false);
            handleSuccess("Attribute Created!");
          },
          onError: (error) => {
            handleError(error?.response?.data?.message || "Error occurred");
          },
        });
      }
    },
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = getAllCategoryIds(categoriesList);
      setFieldValue("category_ids", allIds);
    } else {
      setFieldValue("category_ids", []);
    }
  };

  const renderCategoryTree = (nodes, level = 0) => {
    return nodes.map((node) => (
      <Box key={node.id} sx={{ ml: level > 0 ? 2.5 : 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", py: 0.2 }}>
          {level > 0 && (
            <SubdirectoryArrowRightIcon
              sx={{ color: "#94a3b8", fontSize: 15 }}
            />
          )}
          <FormControlLabel
            sx={{
              ml: level > 0 ? 0.5 : 0.5,
              "& .MuiFormControlLabel-label": {
                fontSize: "13px",
                fontWeight: level === 0 ? 700 : 500,
                color: level === 0 ? "#0f172a" : "#475569",
              },
            }}
            control={
              <Checkbox
                size="small"
                name="category_ids"
                value={node.id}
                checked={values.category_ids.includes(node.id)}
                onChange={handleChange}
                sx={{
                  p: 0.5,
                  color: "#cbd5e1",
                  "&.Mui-checked": { color: "#10b981" },
                }}
              />
            }
            label={node.title}
          />
        </Box>
        {node.children && node.children.length > 0 && (
          <Box>{renderCategoryTree(node.children, level + 1)}</Box>
        )}
      </Box>
    ));
  };

  const nameInputRef = React.useRef(null);

  const Drawerattribute = (
    <Box
      sx={{
        width: { xs: "100vw", sm: 640 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#ffffff",
      }}
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
            <TuneRoundedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: "17px", color: "#0f172a", lineHeight: 1.2 }}>
              {title_heading} Attribute
            </Typography>
            <Typography sx={{ fontSize: "12px", color: "#64748b", fontWeight: 500, mt: 0.25 }}>
              Configure attribute name, linked categories, and display style
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
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Title"
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
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Sub Title"
                      name="sub_title"
                      value={values.sub_title}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ fontSize: "12.5px", fontWeight: 700, color: "#0f172a", mb: 1 }}>
                      Attribute Description
                    </Typography>
                    <TextEditor
                      value={values.description}
                      onChange={(content) => {
                        const baseContent =
                          content === "<p><br></p>" ? "" : content;
                        setFieldValue("description", baseContent);
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Categories & Design Section */}
              <Grid container spacing={2} sx={{ width: "100%", mt: 1 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid #e2e8f0",
                      bgcolor: "#ffffff",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        px: 2,
                        py: 1.25,
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#f8fafc",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      <Typography sx={{ fontWeight: 800, fontSize: "13px", color: "#0f172a" }}>
                        Categories
                      </Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            onChange={handleSelectAll}
                            checked={
                              categoriesList.length > 0 &&
                              values.category_ids.length ===
                                getAllCategoryIds(categoriesList).length
                            }
                            sx={{
                              p: 0.5,
                              color: "#cbd5e1",
                              "&.Mui-checked": { color: "#10b981" },
                            }}
                          />
                        }
                        label="Select All"
                        sx={{
                          mr: 0,
                          "& .MuiFormControlLabel-label": {
                            fontSize: "12.5px",
                            fontWeight: 700,
                            color: "#475569",
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ p: 1.5, maxHeight: "340px", overflowY: "auto" }}>
                      {categoriesList.length > 0 ? (
                        renderCategoryTree(categoriesList)
                      ) : (
                        <Typography sx={{ p: 2, textAlign: "center", fontSize: "12.5px", color: "#64748b" }}>
                          No Categories Found
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid #e2e8f0",
                      bgcolor: "#ffffff",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        px: 2,
                        py: 1.25,
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#f8fafc",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      <Typography sx={{ fontWeight: 800, fontSize: "13px", color: "#0f172a" }}>
                        Display Design
                      </Typography>
                    </Box>

                    <FormControl sx={{ px: 2, py: 1.5 }}>
                      <RadioGroup
                        row
                        value={values.design}
                        name="design"
                        onChange={(event) => {
                          setFieldValue("design", Number(event.target.value));
                        }}
                        sx={{ gap: 2 }}
                      >
                        <FormControlLabel
                          value={1}
                          control={
                            <Radio
                              size="small"
                              sx={{ color: "#cbd5e1", "&.Mui-checked": { color: "#0f172a" } }}
                            />
                          }
                          label="Button"
                          sx={{
                            mr: 0,
                            "& .MuiFormControlLabel-label": {
                              fontSize: "13px",
                              fontWeight: 600,
                            },
                          }}
                        />
                        <FormControlLabel
                          value={2}
                          control={
                            <Radio
                              size="small"
                              sx={{ color: "#cbd5e1", "&.Mui-checked": { color: "#0f172a" } }}
                            />
                          }
                          label="Tabs"
                          sx={{
                            mr: 0,
                            "& .MuiFormControlLabel-label": {
                              fontSize: "13px",
                              fontWeight: 600,
                            },
                          }}
                        />
                        <FormControlLabel
                          value={3}
                          control={
                            <Radio
                              size="small"
                              sx={{ color: "#cbd5e1", "&.Mui-checked": { color: "#0f172a" } }}
                            />
                          }
                          label="Radio"
                          sx={{
                            mr: 0,
                            "& .MuiFormControlLabel-label": {
                              fontSize: "13px",
                              fontWeight: 600,
                            },
                          }}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>

                  <Box
                    sx={{
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid #e2e8f0",
                      bgcolor: "#ffffff",
                      mt: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        px: 2,
                        py: 1.25,
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#f8fafc",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      <Typography sx={{ fontWeight: 800, fontSize: "13px", color: "#0f172a" }}>
                        Purpose
                      </Typography>
                    </Box>

                    <Box sx={{ px: 2, py: 1 }}>
                      <FormControlLabel
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "13.5px",
                            fontWeight: 600,
                          },
                        }}
                        control={
                          <Checkbox
                            size="small"
                            name="is_active_for_buy"
                            checked={values.is_active_for_buy}
                            onChange={handleChange}
                            sx={{
                              color: "#cbd5e1",
                              "&.Mui-checked": { color: "#10b981" },
                            }}
                          />
                        }
                        label="Sale"
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.25, mt: 3 }}>
                <Button
                  type="button"
                  onClick={toggleDrawer(false)}
                  className="custom-primary-btn-admin-side"
                >
                  Cancel
                </Button>
                {values.is_active_for_buy && (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="custom-secondary-btn-admin-side"
                    sx={{
                      opacity: isLoading ? 0.6 : 1,
                      cursor: isLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    {isLoading
                      ? "Saving..."
                      : attribute?.id
                        ? "Update Attribute"
                        : "Create Attribute"}
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );

  return (
    <>
      {editAtt ? (
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
          onClick={toggleDrawer(true)}
          className="custom-secondary-btn-admin-side"
          startIcon={<AddIcon />}
          sx={{ textWrap: "nowrap" }}
        >
          Create Attribute
        </Button>
      )}

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        className="search-modal-panel-style-set"
        sx={{ zIndex: "6000" }}
      >
        {Drawerattribute}
      </Drawer>
    </>
  );
}
