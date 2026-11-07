import * as React from "react";
import {
  Dialog,
  DialogTitle,
  Box,
  IconButton,
  Typography,
  Button,
  Divider,
  Grid,
  Skeleton,
  Tooltip,
  Snackbar,
  Alert,
  Badge,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import {
  fetchMedia,
  useDeleteMedia,
  useUploadMedia,
  useUploadSingleMedia,
} from "../hook/vendor/useMedia";
import { handleError, handleSuccess } from "../toast";
import { useState } from "react";
import PaginationSet from "./PaginationSet";
import MediaImageView from "./MediaImageView";
import ConfirmDeletePopup from "./ConfirmDeletePopup";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SyncIcon from "@mui/icons-material/Sync";
import PhotoIcon from "@mui/icons-material/Photo";
import ClearIcon from "@mui/icons-material/Clear";

function SimpleDialog(props) {
  const { open, onClose } = props;
  const uploadSingleMedia = useUploadSingleMedia();
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(15);
  const { data, isLoading } = fetchMedia(page, per_page, {
    enabled: Boolean(open),
  });
  const media = data?.data || [];
  const pagination = data?.pagination;
  const deleteMutation = useDeleteMedia();
  const [snackbar, setSnackbar] = useState({
    openSnack: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal } = snackbar;

  const handleClick = (newState) => () => {
    setSnackbar({ ...newState, openSnack: true });
  };

  const handleCloseSnack = () => {
    setSnackbar({ ...snackbar, openSnack: false });
  };

  const handleDialogClose = () => {
    onClose();
  };

  const handleDeleteImage = async (data) => {
    deleteMutation.mutate(data.id, {
      onSuccess: () => {
        handleSuccess("Media Deleted Successfully!");
        setPage(1);
      },
    });
  };

  const uploadMutation = useUploadMedia();
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = (files) => {
    const newPreviews = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file: file,
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) handleUpload(file);

    event.target.value = null;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = Array.from(e.dataTransfer.files).find((f) =>
      f.type.startsWith("image/"),
    );

    if (file) handleUpload(file);
  };

  const handleUpload = (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    uploadSingleMedia.mutate(formData, {
      onSuccess: () => {
        handleSuccess("Uploaded successfully");
      },
      onError: () => {
        handleError("Upload failed");
      },
    });
  };

  return (
    <Dialog
      onClose={handleDialogClose}
      open={open}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: "24px",
          border: "1px solid #f1f5f9",
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.16)",
          overflow: "hidden",
        },
      }}
      sx={{ zIndex: "55510 !important" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
          bgcolor: "#ffffff",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "11px",
              bgcolor: "#0f172a",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
            }}
          >
            <CollectionsOutlinedIcon sx={{ fontSize: 19 }} />
          </Box>
          <Box>
            <DialogTitle sx={{ p: 0, fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
              Select Media
            </DialogTitle>
            <Typography sx={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
              Upload a new image or pick from your media library
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleDialogClose}
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
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ p: 3, bgcolor: "#f8fafc" }}>
        <Box
          component="label"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            border: isDragging ? "2px dashed #10b981" : "2px dashed #cbd5e1",
            borderRadius: "18px",
            backgroundColor: isDragging ? "#ecfdf5" : "#ffffff",
            textAlign: "center",
            py: 3,
            px: 2,
            cursor: "pointer",
            display: "block",
            transition: "all 0.2s ease",
            "&:hover": { backgroundColor: "#f8fafc", borderColor: "#0f172a" },
          }}
        >
          <input
            type="file"
            hidden
            multiple
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleFileChange}
          />

          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "14px",
              bgcolor: "#f1f5f9",
              color: "#0f172a",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
            }}
          >
            <CloudUploadOutlinedIcon sx={{ fontSize: 22 }} />
          </Box>

          <Typography sx={{ color: "#0f172a", fontWeight: 700, fontSize: "14px" }}>
            {isDragging ? "Drop images here!" : "Drag & drop images here"}
          </Typography>

          <Typography sx={{ fontSize: "11.5px", color: "#64748b", mt: 0.5 }}>
            JPG, JPEG, PNG, WEBP (Max: 2MB per file)
          </Typography>

          <Button
            variant="contained"
            component="span"
            sx={{
              mt: 1.5,
              textTransform: "none",
              borderRadius: "999px",
              bgcolor: "#0f172a",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "12.5px",
              px: 2.5,
              py: 0.7,
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
              "&:hover": { bgcolor: "#1e293b" },
            }}
          >
            Browse Files
          </Button>
        </Box>

        <Box sx={{ overflowX: "auto", mt: 2.5 }}>
          <Grid container spacing={1.25}>
            {isLoading ? (
              Array.from(new Array(18)).map((_, index) => (
                <Grid item key={index} sx={{ width: "16.66%" }}>
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    sx={{
                      width: "100%",
                      height: 0,
                      pt: "100%",
                      borderRadius: "14px",
                      backgroundColor: "rgba(15, 23, 42, 0.06)",
                    }}
                  />
                </Grid>
              ))
            ) : media.length === 0 ? (
              <Grid item xs={12} sx={{ width: "100%" }}>
                <Box
                  sx={{
                    textAlign: "center",
                    py: 5,
                    color: "#64748b",
                    fontSize: "14px",
                    fontWeight: 600,
                    width: "100%",
                    bgcolor: "#ffffff",
                    borderRadius: "16px",
                    border: "1px dashed #e2e8f0",
                  }}
                >
                  No media available!
                </Box>
              </Grid>
            ) : (
              media.map((list) => (
                <Grid item key={list.id} sx={{ width: { xs: "33.33%", sm: "20%", md: "16.66%" } }}>
                  <Box
                    onClick={() => {
                      const imagePayload = {
                        image_id: list.id,
                        cover_image_id: list.id,
                        image_path: `${import.meta.env.VITE_BASE_URL}/storage/${list.media_path}`,
                      };

                      if (props.isProduct || props.imageData) {
                        if (typeof props.setImageData === "function") {
                          props.setImageData(imagePayload);
                        }
                      } else {
                        if (typeof props.setImageDataCover === "function") {
                          props.setImageDataCover(imagePayload);
                        } else if (typeof props.setImageData === "function") {
                          props.setImageData(imagePayload);
                        }
                      }

                      if (props.isSelectedTermsS) {
                        props.handleSaveTermImg(props.termImageP.id, list?.id);
                      }

                      handleDialogClose();
                    }}
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "1 / 1",
                      borderRadius: "14px",
                      overflow: "hidden",
                      cursor: "pointer",
                      backgroundColor: "#fff",
                      border: "2px solid #e2e8f0",
                      boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        borderColor: "#10b981",
                        boxShadow: "0 10px 20px rgba(16, 185, 129, 0.15)",
                      },
                    }}
                  >
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}/storage/${list.media_path}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      alt="media content"
                    />

                    <ConfirmDeletePopup
                      showMediaDelBtn={true}
                      title={"Image"}
                      description={"Are your sure you want to delete this image?"}
                      handleDeleteImage={handleDeleteImage}
                      singleImageDelRec={{
                        id: list?.id,
                      }}
                    />

                    <Tooltip describeChild title="Copy URL" arrow>
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          bottom: 6,
                          left: 6,
                          width: 26,
                          height: 26,
                          borderRadius: "8px",
                          backgroundColor: "rgba(255, 255, 255, 0.92)",
                          backdropFilter: "blur(6px)",
                          color: "#0f172a",
                          boxShadow: "0 2px 8px rgba(15,23,42,0.12)",
                          "&:hover": {
                            backgroundColor: "#0f172a",
                            color: "#fff",
                          },
                          padding: "2px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = `${import.meta.env.VITE_BASE_URL}/storage/${list.media_path}`;
                          navigator.clipboard.writeText(url);
                          handleClick({
                            vertical: "top",
                            horizontal: "center",
                          })();
                        }}
                      >
                        <ContentCopyIcon sx={{ fontSize: "13px" }} />
                      </IconButton>
                    </Tooltip>

                    <MediaImageView
                      src={`${import.meta.env.VITE_BASE_URL}/storage/${list.media_path}`}
                    />
                  </Box>
                </Grid>
              ))
            )}
          </Grid>
          {media.length > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 2.5,
                bgcolor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                px: 2,
              }}
            >
              <PaginationSet
                count={pagination?.last_page || 1}
                page={page}
                per_page={per_page}
                from={pagination?.from}
                to={pagination?.to}
                total={pagination?.total}
                onPageChange={(value) => setPage(value)}
                onPerPageChange={(value) => {
                  setPerPage(value);
                  setPage(1);
                }}
                variant="outlined"
                color="secondary"
              />
            </Box>
          )}
        </Box>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={snackbar.openSnack}
        autoHideDuration={2000}
        onClose={handleCloseSnack}
        message="Image URL copied!"
      >
        <Alert
          onClose={handleCloseSnack}
          severity="success"
          variant="filled"
          sx={{ width: "100%", borderRadius: "12px", bgcolor: "#10b981" }}
        >
          Image URL copied!
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

export default function MediaSelectModal({
  setImageData,
  imageData,
  isBrand,
  isCategory,
  setImageDataCover,
  imageDataCover,
  isCategoryCover,
  isProduct,
  isVariationSelectImg,
  variationImage,
  onClear,
  isSelectedTermsS,
  termImageP,
  handleSaveTermImg,
  handleClearTermImage,
  clearTermImage,
  saveTermImage,
  syncTermImage,
  handleSyncVariationImage,
}) {
  const [open, setOpen] = React.useState(false);
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${import.meta.env.VITE_BASE_URL}/storage/${path}`;
  };
  return (
    <>
      {isBrand && (
        <Box
          sx={{
            border: "1.5px dashed #cbd5e1",
            borderRadius: "12px",
            position: "relative",
            bgcolor: "#f8fafc",
            transition: "all 0.2s ease",
            "&:hover": { borderColor: "#0f172a" },
          }}
          className="image-upload-box-target"
        >
          <Box
            onClick={() => setOpen(true)}
            component="label"
            sx={{ cursor: "pointer", display: "block", width: "100%", height: "100%" }}
          >
            <img
              src={imageData.image_id ? imageData.image_path : "/empty-image.jpg"}
              style={{ borderRadius: "10px" }}
            />
          </Box>
          {imageData.image_id == "" ? (
            <AddCircleIcon
              onClick={() => setOpen(true)}
              sx={{
                backgroundColor: "white",
                borderRadius: "50%",
                fontSize: "20px",
                cursor: "pointer",
                color: "#0f172a",
                position: "absolute",
                right: "-6px",
                bottom: "-6px",
                boxShadow: "0 2px 6px rgba(15,23,42,0.15)",
              }}
            />
          ) : (
            <RemoveCircleIcon
              onClick={() => setImageData({ image_id: "", image_path: "" })}
              sx={{
                backgroundColor: "white",
                borderRadius: "50%",
                fontSize: "20px",
                cursor: "pointer",
                color: "#ef4444",
                position: "absolute",
                right: "-6px",
                bottom: "-6px",
                boxShadow: "0 2px 6px rgba(15,23,42,0.15)",
              }}
            />
          )}
        </Box>
      )}

      {isCategory && (
        <Box
          sx={{
            border: "1.5px dashed #cbd5e1",
            borderRadius: "12px",
            position: "relative",
            bgcolor: "#f8fafc",
            transition: "all 0.2s ease",
            "&:hover": { borderColor: "#0f172a" },
          }}
          className="image-upload-box-target"
        >
          <Box
            onClick={() => setOpen(true)}
            component="label"
            sx={{ cursor: "pointer", display: "block", width: "100%", height: "100%" }}
          >
            <img
              src={imageData.image_id ? imageData.image_path : "/empty-image.jpg"}
              style={{ borderRadius: "10px" }}
            />
          </Box>
          {imageData.image_id == "" ? (
            <AddCircleIcon
              onClick={() => setOpen(true)}
              sx={{
                backgroundColor: "white",
                borderRadius: "50%",
                fontSize: "20px",
                cursor: "pointer",
                color: "#0f172a",
                position: "absolute",
                right: "-6px",
                bottom: "-6px",
                boxShadow: "0 2px 6px rgba(15,23,42,0.15)",
              }}
            />
          ) : (
            <RemoveCircleIcon
              onClick={() => setImageData({ image_id: "", image_path: "" })}
              sx={{
                backgroundColor: "white",
                borderRadius: "50%",
                fontSize: "20px",
                cursor: "pointer",
                color: "#ef4444",
                position: "absolute",
                right: "-6px",
                bottom: "-6px",
                boxShadow: "0 2px 6px rgba(15,23,42,0.15)",
              }}
            />
          )}
        </Box>
      )}

      {isCategoryCover && (
        <Box
          className="image-upload-box-target-cover-img"
          sx={{
            border: "1.5px dashed #cbd5e1",
            cursor: "pointer",
            borderRadius: "12px",
            position: "relative",
            ml: 1,
            width: "100% !important",
            bgcolor: "#f8fafc",
            transition: "all 0.2s ease",
            "&:hover": { borderColor: "#0f172a" },
          }}
        >
          <Box
            onClick={() => setOpen(true)}
            component="label"
            sx={{ cursor: "pointer", display: "block", width: "100%", height: "100%" }}
          >
            <img
              src={
                imageDataCover.cover_image_id
                  ? imageDataCover.image_path
                  : "/empty-image.jpg"
              }
              style={{ borderRadius: "10px" }}
            />
          </Box>
          {imageDataCover.cover_image_id == "" ? (
            <AddCircleIcon
              onClick={() => setOpen(true)}
              sx={{
                backgroundColor: "white",
                borderRadius: "50%",
                fontSize: "20px",
                cursor: "pointer",
                color: "#0f172a",
                position: "absolute",
                right: "-6px",
                bottom: "-6px",
                boxShadow: "0 2px 6px rgba(15,23,42,0.15)",
              }}
            />
          ) : (
            <RemoveCircleIcon
              onClick={() =>
                setImageDataCover({ cover_image_id: "", image_path: "" })
              }
              sx={{
                backgroundColor: "white",
                borderRadius: "50%",
                fontSize: "20px",
                cursor: "pointer",
                color: "#ef4444",
                position: "absolute",
                right: "-6px",
                bottom: "-6px",
                boxShadow: "0 2px 6px rgba(15,23,42,0.15)",
              }}
            />
          )}
        </Box>
      )}

      {isProduct && (
        <Button
          onClick={() => setOpen(true)}
          variant="outlined"
          component="span"
          sx={{
            textTransform: "none",
            borderRadius: "999px",
            borderColor: "#cbd5e1",
            color: "#0f172a",
            fontWeight: 700,
            fontSize: "12.5px",
            px: 2.5,
            "&:hover": {
              bgcolor: "#0f172a",
              color: "#ffffff",
              borderColor: "#0f172a",
            },
          }}
        >
          Select Media
        </Button>
      )}

      {isVariationSelectImg && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <>
                {variationImage && (
                  <ClearIcon
                    onClick={onClear}
                    sx={{
                      position: "absolute",
                      top: -30,
                      right: 8,
                      fontSize: "1.1rem",
                      p: 0.4,
                      borderRadius: "50%",
                      cursor: "pointer",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(8px)",
                      color: "#ef4444",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      zIndex: 10,
                      "&:hover": {
                        backgroundColor: "#ef4444",
                        color: "#fff",
                        transform: "scale(1.15) rotate(90deg)",
                        boxShadow: "0 6px 16px rgba(239, 68, 68, 0.4)",
                      },
                    }}
                  />
                )}

                <IconButton
                  onClick={() => setOpen(true)}
                  component="label"
                  sx={{
                    width: 22,
                    height: 22,
                    background: "#0f172a",
                    color: "white",
                    border: "2.5px solid #fff",
                    boxShadow: "0px 4px 12px rgba(15, 23, 42, 0.2)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "#10b981",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <CameraAltIcon sx={{ fontSize: "0.7rem" }} />
                </IconButton>
              </>
            }
          >
            <Avatar
              src={getImageUrl(variationImage)}
              sx={{
                width: 41,
                height: 41,
                bgcolor: "#f8fafc",
                color: "#94a3b8",
                border: "1.5px solid #e2e8f0",
                boxShadow: "0px 4px 10px rgba(15, 23, 42, 0.05)",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#0f172a",
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  fontSize: "2rem",
                  filter: "grayscale(1)",
                  opacity: 0.9,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {!variationImage && <PhotoIcon sx={{ fontSize: 22 }} />}
              </Box>
            </Avatar>
          </Badge>
        </Box>
      )}

      {isSelectedTermsS && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            badgeContent={
              <>
                {termImageP?.media && (
                  <>
                    <SyncIcon
                      onClick={() => handleSyncVariationImage(termImageP?.id)}
                      sx={{
                        position: "absolute",
                        top: -12,
                        left: -20,
                        fontSize: "1.1rem",
                        p: 0.3,
                        borderRadius: "50%",
                        cursor: "pointer",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(8px)",
                        color: "#10b981",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        zIndex: 10,
                        "&:hover": {
                          backgroundColor: "#10b981",
                          color: "#fff",
                          transform: "scale(1.15) rotate(90deg)",
                        },
                      }}
                    />
                    <ClearIcon
                      onClick={() => handleClearTermImage(termImageP?.id)}
                      sx={{
                        position: "absolute",
                        top: -24,
                        right: 6,
                        fontSize: "1.1rem",
                        p: 0.3,
                        borderRadius: "50%",
                        cursor: "pointer",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(8px)",
                        color: "#ef4444",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        zIndex: 10,
                        "&:hover": {
                          backgroundColor: "#ef4444",
                          color: "#fff",
                          transform: "scale(1.15) rotate(90deg)",
                        },
                      }}
                    />
                  </>
                )}

                <IconButton
                  onClick={() => setOpen(true)}
                  component="label"
                  sx={{
                    width: 20,
                    height: 20,
                    background: "#0f172a",
                    color: "white",
                    border: "2.5px solid #fff",
                    boxShadow: "0px 4px 12px rgba(15, 23, 42, 0.2)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "#10b981",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <CameraAltIcon sx={{ fontSize: "0.7rem" }} />
                </IconButton>
              </>
            }
          >
            <Avatar
              src={`${import.meta.env.VITE_BASE_URL}/storage/${termImageP?.media?.media_path}`}
              sx={{
                width: 35,
                height: 35,
                bgcolor: "#f8fafc",
                color: "#94a3b8",
                border: "1.5px solid #e2e8f0",
                boxShadow: "0px 4px 10px rgba(15, 23, 42, 0.05)",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#0f172a",
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  fontSize: "2rem",
                  filter: "grayscale(1)",
                  opacity: 0.9,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <PhotoIcon sx={{ fontSize: 22 }} />
              </Box>
            </Avatar>
          </Badge>
        </Box>
      )}

      <SimpleDialog
        open={open}
        onClose={() => setOpen(false)}
        setImageData={setImageData}
        setImageDataCover={setImageDataCover}
        imageData={imageData}
        isProduct={isProduct}
        isSelectedTermsS={isSelectedTermsS}
        termImageP={termImageP}
        handleSaveTermImg={handleSaveTermImg}
      />
    </>
  );
}
