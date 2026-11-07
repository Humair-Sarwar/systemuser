import * as React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Tooltip } from "@mui/material";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "24px",
    border: "1px solid #f1f5f9",
    boxShadow: "0 24px 60px rgba(15, 23, 42, 0.16)",
    overflow: "hidden",
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(3),
    backgroundColor: "#f8fafc",
  },
}));

export default function PreviewImage({ list }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Preview Image" arrow>
        <Box
          onClick={handleClickOpen}
          sx={{
            height: "42px",
            width: "42px",
            border: "1.5px solid #e2e8f0",
            borderRadius: "12px",
            overflow: "hidden",
            cursor: "pointer",
            bgcolor: "#f8fafc",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: "#0f172a",
              transform: "scale(1.04)",
            },
          }}
        >
          <img
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
            }}
            src={
              list?.media
                ? `${import.meta.env.VITE_BASE_URL}/storage/${list.media.media_path}`
                : "/empty-image.jpg"
            }
            alt=""
          />
        </Box>
      </Tooltip>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
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
            <DialogTitle
              sx={{ m: 0, p: 0, fontSize: "15px", fontWeight: 800, color: "#0f172a" }}
              id="customized-dialog-title"
            >
              Preview Image
            </DialogTitle>
          </Box>
          <IconButton
            aria-label="close"
            onClick={handleClose}
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
        <DialogContent>
          <Box sx={{ width: { xs: "280px", sm: "380px" } }}>
            <img
              style={{
                width: "100%",
                height: "220px",
                objectFit: "contain",
                borderRadius: "14px",
              }}
              src={
                list?.media
                  ? `${import.meta.env.VITE_BASE_URL}/storage/${list.media.media_path}`
                  : "/empty-image.jpg"
              }
              alt=""
            />
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}
