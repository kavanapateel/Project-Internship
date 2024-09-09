import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CloseIcon from "@mui/icons-material/Close";

export default function AdminMenu() {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleDialogOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Admin Panel" arrow placement="right">
        <IconButton onClick={handleDialogOpen}>
          <AdminPanelSettingsIcon htmlColor="#F1F1F1" fontSize="large" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
          <DialogActions sx={{ maxWidth: "20%", backgroundColor: "#1976d2" }}>
            <Tooltip title="Close" arrow placement="right">
              <IconButton onClick={handleClose}>
                <CloseIcon htmlColor="#F1F1F1" />
              </IconButton>
            </Tooltip>
          </DialogActions>
          <DialogContent sx={{ maxWidth: 250 }}>
            <Button fullWidth component="a" href="/register-product">
              Register Product
            </Button>
            <Button fullWidth component="a" href="/view-products">
              View Products
            </Button>
            <Button fullWidth component="a" href="/products/checkpoints">
              View Checkpoints Data
            </Button>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
}
