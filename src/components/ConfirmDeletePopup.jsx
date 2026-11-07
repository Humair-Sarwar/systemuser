import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

export default function ConfirmDeletePopup({
  title,
  description,
  handleDeleteAllSltBrands,
  singleImageDelRec,
  selectedBrandIds,
  showSltDelBtn,
  showDelBtn,
  handleDeleteBrand,
  handleDeleteImage,
  singleBrandDelRec,
  showMediaDelBtn,
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  };
  const handleTargetSingleBrandDel = () => {
    handleDeleteBrand(singleBrandDelRec);
    setOpen(false);
  };

  const handleTargetImageDel = (e) => {
    e.stopPropagation();
    handleDeleteImage(singleImageDelRec);
    setOpen(false);
  };

  return (
    <>
      {showSltDelBtn && (
        <Box
          onClick={handleClickOpen}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            ml: 1,
            px: 1.5,
            py: 0.6,
            borderRadius: "999px",
            bgcolor: "#fef2f2",
            border: "1px solid #fecaca",
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "#fee2e2",
              borderColor: "#fca5a5",
            },
          }}
        >
          <DeleteOutlineRoundedIcon sx={{ fontSize: 16, color: "#ef4444" }} />
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#dc2626",
            }}
          >
            Delete Selected ({selectedBrandIds.length})
          </Typography>
        </Box>
      )}
      {showDelBtn && (
        <Tooltip title="Delete" arrow>
          <IconButton
            onClick={handleClickOpen}
            size="small"
            sx={{
              width: 32,
              height: 32,
              borderRadius: "10px",
              color: "#ef4444",
              ml: 0.75,
              bgcolor: "#fef2f2",
              border: "1px solid #fee2e2",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "#ef4444",
                color: "#ffffff",
                borderColor: "#ef4444",
              },
            }}
          >
            <DeleteOutlineRoundedIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>
      )}
      {showMediaDelBtn && (
        <Tooltip describeChild title="Delete" arrow>
          <IconButton
            size="small"
            onClick={handleClickOpen}
            sx={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 26,
              height: 26,
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(6px)",
              color: "#ef4444",
              boxShadow: "0 2px 8px rgba(15,23,42,0.12)",
              "&:hover": {
                backgroundColor: "#ef4444",
                color: "#fff",
              },
              padding: "2px",
            }}
          >
            <DeleteForeverRoundedIcon sx={{ fontSize: "15px" }} />
          </IconButton>
        </Tooltip>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="confirm-delete-popup-target"
        sx={{ zIndex: "55510 !important" }}
      >
        <Box sx={{ textAlign: "center", mt: 0.5 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "18px",
              bgcolor: "#fef2f2",
              border: "1px solid #fee2e2",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ef4444",
              mb: 1,
            }}
          >
            <WarningAmberRoundedIcon sx={{ fontSize: 28 }} />
          </Box>
        </Box>
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            textAlign: "center",
            fontWeight: 800,
            fontSize: "18px",
            color: "#0f172a",
            pb: 0.5,
            pt: 1,
          }}
        >
          {`Delete ${title}`}
        </DialogTitle>
        <DialogContent sx={{ pb: 2.5 }}>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              textAlign: "center",
              fontSize: "13.5px",
              color: "#64748b",
              fontWeight: 500,
            }}
          >
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center", gap: 1.25, p: 0 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderRadius: "999px",
              py: 1,
              borderColor: "#e2e8f0",
              backgroundColor: "#f8fafc",
              color: "#475569",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "13px",
              "&:hover": {
                bgcolor: "#f1f5f9",
                borderColor: "#cbd5e1",
                color: "#0f172a",
              },
            }}
            fullWidth
          >
            Cancel
          </Button>
          {showSltDelBtn ? (
            <Button
              onClick={() => handleDeleteAllSltBrands()}
              autoFocus
              variant="contained"
              sx={{
                borderRadius: "999px",
                py: 1,
                bgcolor: "#ef4444",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "13px",
                boxShadow: "0 6px 16px rgba(239, 68, 68, 0.25)",
                "&:hover": { bgcolor: "#dc2626" },
              }}
              fullWidth
            >
              Delete ({selectedBrandIds.length})
            </Button>
          ) : (
            ""
          )}
          {showDelBtn && (
            <Button
              onClick={handleTargetSingleBrandDel}
              autoFocus
              variant="contained"
              sx={{
                borderRadius: "999px",
                py: 1,
                bgcolor: "#ef4444",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "13px",
                boxShadow: "0 6px 16px rgba(239, 68, 68, 0.25)",
                "&:hover": { bgcolor: "#dc2626" },
              }}
              fullWidth
            >
              Delete {selectedBrandIds && `(${selectedBrandIds.length})`}
            </Button>
          )}
          {showMediaDelBtn && (
            <Button
              onClick={handleTargetImageDel}
              autoFocus
              variant="contained"
              sx={{
                borderRadius: "999px",
                py: 1,
                bgcolor: "#ef4444",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "13px",
                boxShadow: "0 6px 16px rgba(239, 68, 68, 0.25)",
                "&:hover": { bgcolor: "#dc2626" },
              }}
              fullWidth
            >
              Delete
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
