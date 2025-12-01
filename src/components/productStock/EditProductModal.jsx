import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  alpha,
} from "@mui/material";
import { Trash2 } from "lucide-react";

export default function EditProductModal({
  open,
  onClose,
  form,
  setForm,
  onSave,
  onDelete,
}) {
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const nameError = !form.name?.trim();
  const skuError = !form.sku?.trim();

  const isFormValid = !nameError && !skuError;

  const textFieldSx = {
    mt: 1,
    mb: 2.5,
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      backgroundColor: "rgba(248,250,252,0.92)",
      fontWeight: "500",
      transition:
        "border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
      "& fieldset": {
        borderColor: "rgba(148,163,184,0.6)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(30,64,175,0.9)",
        border: "1px solid black",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#111827",
        boxShadow: "0 0 0 1px rgba(15,23,42,0.2)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#6b7280",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#111827",
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          background:
            "radial-gradient(circle at top, rgba(255,255,255,0.98), rgba(248,250,252,0.94))",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(148,163,184,0.35)",
          boxShadow:
            "0 26px 70px rgba(15,23,42,0.45), 0 0 0 1px rgba(255,255,255,0.8) inset",
        },
      }}>
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 800,
          fontSize: "1.6rem",
          pb: 1.5,
          borderBottom: "1px solid rgba(226,232,240,0.8)",
          background:
            "linear-gradient(120deg, rgba(15,23,42,0.96), rgba(30,64,175,0.92))",
          WebkitBackgroundClip: "text",
          color: "transparent",
          mb: 3,
        }}>
        Edit Details
      </DialogTitle>

      <DialogContent sx={{ px: 4, pt: 3, pb: 2.5 }}>
        {/* Product Name */}
        <TextField
          fullWidth
          label="Product Name"
          required
          error={nameError}
          helperText={nameError ? "Product name is required" : ""}
          value={form.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          sx={textFieldSx}
        />

        {/* SKU */}
        <TextField
          fullWidth
          label="SKU"
          required
          error={skuError}
          helperText={
            skuError
              ? "SKU is required (Example: SVBFPLVEG-000008)"
              : "Example: SVBFPLVEG-000008"
          }
          value={form.sku || ""}
          onChange={(e) => handleChange("sku", e.target.value)}
          sx={textFieldSx}
        />

        {/* Background Color */}
        <Typography fontWeight={700} gutterBottom sx={{ mt: 1 }}>
          Background Color
        </Typography>
        <Box
          sx={{
            mb: 3,
            borderRadius: "16px",
            background: "rgba(248,250,252,0.9)",
            border: "1px solid rgba(209,213,219,0.9)",
            p: 1,
          }}>
          <input
            type="color"
            value={form.bgColor}
            onChange={(e) => handleChange("bgColor", e.target.value)}
            style={{
              width: "100%",
              height: "52px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              background: "transparent",
            }}
          />
        </Box>

        {/* Weight Table */}
        <Typography fontWeight={700} gutterBottom>
          Weight Table
        </Typography>

        <Stack spacing={2}>
          {/* Header */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "100px 1fr 1fr",
              gap: 1.5,
              pb: 1,
              borderBottom: "1px solid rgba(226,232,240,0.9)",
              color: "#6b7280",
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}>
            <Box>Gram</Box>
            <Box>Units</Box>
            <Box>Price</Box>
          </Box>

          {/* Rows */}
          {Object.entries(form.weights).map(([gram, obj]) => (
            <Box
              key={gram}
              sx={{
                display: "grid",
                gridTemplateColumns: "100px 1fr 1fr",
                gap: 1.5,
                alignItems: "center",
              }}>
              <Typography fontWeight={600} sx={{ color: "#0f172a" }}>
                {gram}g
              </Typography>

              <TextField
                size="small"
                type="number"
                value={obj.units}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    weights: {
                      ...prev.weights,
                      [gram]: {
                        ...obj,
                        units: Number(e.target.value) || 0,
                      },
                    },
                  }))
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "rgba(249,250,251,0.96)",
                    "& fieldset": {
                      borderColor: "rgba(209,213,219,0.9)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(156,163,175,1)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#111827",
                    },
                  },
                }}
              />

              <TextField
                size="small"
                type="number"
                value={obj.price}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    weights: {
                      ...prev.weights,
                      [gram]: {
                        ...obj,
                        price: Number(e.target.value) || 0,
                      },
                    },
                  }))
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "rgba(249,250,251,0.96)",
                    "& fieldset": {
                      borderColor: "rgba(209,213,219,0.9)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(156,163,175,1)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#111827",
                    },
                  },
                }}
              />
            </Box>
          ))}
        </Stack>

        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<Trash2 size={20} />}
          onClick={onDelete}
          sx={{
            mt: 4,
            py: 1.4,
            borderRadius: "999px",
            borderWidth: 1.5,
            textTransform: "none",
            fontWeight: 600,
            borderColor: alpha("#dc2626", 0.6),
            color: "#b91c1c",
            backgroundColor: "rgba(254,242,242,0.9)",
            "&:hover": {
              borderColor: "#b91c1c",
              backgroundColor: "rgba(254,226,226,1)",
            },
          }}>
          Delete Product
        </Button>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 3, pt: 1.5, gap: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            borderRadius: "999px",
            px: 3,
            py: 0.8,
            color: "#6b7280",
          }}>
          Cancel
        </Button>

        {/* Save disabled if form is invalid */}
        <Button
          variant="contained"
          onClick={onSave}
          disabled={!isFormValid}
          sx={{
            textTransform: "none",
            borderRadius: "999px",
            px: 3.4,
            py: 0.9,
            fontWeight: 600,
            background: "linear-gradient(135deg, #0f172a, #111827, #020617)",
            boxShadow: "0 16px 30px rgba(15,23,42,0.45)",
            opacity: isFormValid ? 1 : 0.6,
            cursor: isFormValid ? "pointer" : "not-allowed",
            "&:hover": {
              background: "linear-gradient(135deg,#020617,#0b1120,#020617)",
            },
          }}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
