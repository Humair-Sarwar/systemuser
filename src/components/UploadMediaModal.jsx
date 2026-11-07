import * as React from "react";
import {
  Dialog,
  DialogTitle,
  Box,
  IconButton,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import PublishIcon from "@mui/icons-material/Publish";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useUploadMedia } from "../hook/vendor/useMedia";
import { handleError, handleSuccess } from "../toast";

function SimpleDialog(props) {
  const uploadMutation = useUploadMedia();
  const { onClose, open } = props;
  const [previews, setPreviews] = React.useState([]);
  const [isDragging, setIsDragging] = React.useState(false);

  const processFiles = (files) => {
    const newPreviews = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file: file,
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) processFiles(files);
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
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (files.length > 0) processFiles(files);
  };

  const removeImage = (id, url) => {
    URL.revokeObjectURL(url);
    setPreviews((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClose = () => {
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews([]);
    onClose();
  };

  const handleUpload = () => {
    if (previews.length === 0) return;

    const formData = new FormData();

    previews.forEach((item) => {
      formData.append("images[]", item.file);
    });

    uploadMutation.mutate(formData, {
      onSuccess: () => {
        handleSuccess("Uploaded successfully");
        previews.forEach((p) => URL.revokeObjectURL(p.url));
        setPreviews([]);
        onClose();
      },
      onError: () => {
        handleError("Upload failed ");
      },
    });
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "24px",
          border: "1px solid #f1f5f9",
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.16)",
          overflow: "hidden",
        },
      }}
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
            <CloudUploadOutlinedIcon sx={{ fontSize: 19 }} />
          </Box>
          <Box>
            <DialogTitle sx={{ p: 0, fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
              Upload Media
            </DialogTitle>
            <Typography sx={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
              Upload multiple images to your store gallery
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
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
            py: 4,
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
              width: 48,
              height: 48,
              borderRadius: "14px",
              bgcolor: "#f1f5f9",
              color: "#0f172a",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1.25,
            }}
          >
            <CloudUploadOutlinedIcon sx={{ fontSize: 24 }} />
          </Box>

          <Typography sx={{ color: "#0f172a", fontWeight: 700, fontSize: "14.5px" }}>
            {isDragging ? "Drop images here!" : "Drag & drop images here"}
          </Typography>

          <Typography sx={{ fontSize: "12px", color: "#64748b", mt: 0.5 }}>
            JPG, JPEG, PNG, WEBP (Max: 2MB per file)
          </Typography>

          <Button
            variant="contained"
            component="span"
            sx={{
              mt: 2,
              textTransform: "none",
              borderRadius: "999px",
              bgcolor: "#0f172a",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "13px",
              px: 3,
              py: 0.8,
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
              "&:hover": { bgcolor: "#1e293b" },
            }}
          >
            Select Media
          </Button>
        </Box>

        {previews.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#64748b", mb: 1.25, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Selected Files ({previews.length})
            </Typography>
            <Grid container spacing={1.5}>
              {previews.map((item) => (
                <Grid item key={item.id} sx={{ width: "20%" }}>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "1/1",
                      borderRadius: "12px",
                      border: "1.5px solid #e2e8f0",
                      bgcolor: "#ffffff",
                      overflow: "visible",
                    }}
                  >
                    <img
                      src={item.url}
                      alt="preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                    <IconButton
                      onClick={() => removeImage(item.id, item.url)}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: -6,
                        right: -6,
                        bgcolor: "#ef4444",
                        color: "white",
                        width: 20,
                        height: 20,
                        boxShadow: "0 2px 6px rgba(239, 68, 68, 0.3)",
                        "&:hover": { bgcolor: "#dc2626" },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: "11px" }} />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button
                onClick={handleUpload}
                variant="contained"
                startIcon={<PublishIcon />}
                className="custom-secondary-btn-admin-side"
                disabled={uploadMutation.isPending}
                sx={{
                  "&.Mui-disabled": {
                    backgroundColor: "#cbd5e1 !important",
                    color: "#64748b !important",
                    cursor: "not-allowed",
                  },
                }}
              >
                {uploadMutation.isPending ? "Uploading..." : "Upload"}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Dialog>
  );
}

export default function UploadMediaModal() {
  const [open, setOpen] = React.useState(false);

  return (
    <Box>
      <Button
        className="custom-secondary-btn-admin-side"
        onClick={() => setOpen(true)}
        startIcon={<AddIcon />}
      >
        Add Media
      </Button>
      <SimpleDialog open={open} onClose={() => setOpen(false)} />
    </Box>
  );
}
