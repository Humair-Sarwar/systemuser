import * as React from "react";
import {
  Dialog,
  DialogTitle,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";

function SimpleDialog(props) {
  const { onClose, open, imageUrl } = props;

  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "24px",
          border: "1px solid #f1f5f9",
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
          overflow: "hidden",
        },
      }}
      sx={{ zIndex: "55510 !important" }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 1.75,
          borderBottom: "1px solid #f1f5f9",
          bgcolor: "#ffffff",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "10px",
              bgcolor: "#0f172a",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PhotoOutlinedIcon sx={{ fontSize: 18 }} />
          </Box>
          <DialogTitle sx={{ p: 0, fontSize: "15px", fontWeight: 800, color: "#0f172a" }}>
            View Image
          </DialogTitle>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            width: 32,
            height: 32,
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

      {/* Image Container */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8fafc",
        }}
      >
        <img
          src={imageUrl}
          alt="Media View"
          style={{
            maxWidth: "100%",
            maxHeight: "70vh",
            borderRadius: "14px",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
            objectFit: "contain",
          }}
        />
      </Box>
    </Dialog>
  );
}

export default function MediaImageView({ src }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Box>
      <Tooltip describeChild title="View" arrow>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          size="small"
          sx={{
            position: "absolute",
            bottom: 6,
            right: 6,
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
        >
          <VisibilityOutlinedIcon sx={{ fontSize: "15px" }} />
        </IconButton>
      </Tooltip>

      <SimpleDialog
        open={open}
        onClose={(e) => {
          e.stopPropagation();
          setOpen(false);
        }}
        imageUrl={src}
      />
    </Box>
  );
}
