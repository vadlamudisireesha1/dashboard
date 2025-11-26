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
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.98)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
        },
      }}>
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 800,
          fontSize: "1.5rem",
        }}>
        Edit Details
      </DialogTitle>

      <DialogContent sx={{ px: 4, pt: 2 }}>
        <TextField
          fullWidth
          label="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          sx={{ mb: 3 }}
        />

        <Typography fontWeight={700} gutterBottom>
          Background Color
        </Typography>
        <Box sx={{ mb: 3 }}>
          <input
            type="color"
            value={form.bgColor}
            onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
            style={{
              width: "100%",
              height: "56px",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
            }}
          />
        </Box>

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
              borderBottom: "2px solid #e0e0e0",
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
              <Typography fontWeight={600}>{gram}g</Typography>

              <TextField
                size="small"
                type="number"
                value={obj.units}
                onChange={(e) =>
                  setForm({
                    ...form,
                    weights: {
                      ...form.weights,
                      [gram]: {
                        ...obj,
                        units: Number(e.target.value) || 0,
                      },
                    },
                  })
                }
              />

              <TextField
                size="small"
                type="number"
                value={obj.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    weights: {
                      ...form.weights,
                      [gram]: {
                        ...obj,
                        price: Number(e.target.value) || 0,
                      },
                    },
                  })
                }
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
            py: 1.5,
            borderRadius: "12px",
            borderWidth: 2,
            "&:hover": { bgcolor: alpha("#d32f2f", 0.08) },
          }}>
          Delete Product
        </Button>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSave}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
