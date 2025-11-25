import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Stack,
} from "@mui/material";

const ICON_OPTIONS = [
  "carrot",
  "drumstick",
  "soup",
  "cookingpot",
  "utensils",
  "sprout",

  "snack",
  "curry",
  "spicy",
  "sweets",
];

export default function AddNewProductModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({
    label: "",
    icon: "carrot",
    color: "#4C8BF5",
    bg: "#eaf2ff",
    count: 0,
    slug: "",
  });

  React.useEffect(() => {
    if (!open) {
      setForm({
        label: "",
        icon: "carrot",
        color: "#4C8BF5",
        bg: "#eaf2ff",
        count: 0,
        slug: "",
      });
    }
  }, [open]);

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    if (!form.label || !form.slug) {
      // if slug empty, auto-generate from label
      setForm((s) => ({
        ...s,
        slug:
          (s.slug && s.slug.trim()) ||
          s.label
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, ""),
      }));
    }

    onAdd({
      label: form.label,
      icon: form.icon,
      color: form.color,
      bg: form.bg,
      count: Number(form.count || 0),
      slug: form.slug || form.label.toLowerCase().replace(/\s+/g, "-"),
    });

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 360,
          p: 3,
          borderRadius: 2,
          bgcolor: "white",
          mx: "auto",
          mt: "8%",
          boxShadow: "0 12px 50px rgba(0,0,0,0.12)",
        }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Add New Product
        </Typography>

        <TextField
          fullWidth
          label="Label"
          name="label"
          value={form.label}
          onChange={handleChange}
          sx={{ mt: 1 }}
        />

        <TextField
          fullWidth
          select
          label="Icon"
          name="icon"
          value={form.icon}
          onChange={handleChange}
          sx={{ mt: 2 }}>
          {ICON_OPTIONS.map((i) => (
            <MenuItem key={i} value={i}>
              {i}
            </MenuItem>
          ))}
        </TextField>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Color (hex)"
            name="color"
            value={form.color}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Background (hex)"
            name="bg"
            value={form.bg}
            onChange={handleChange}
          />
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Count"
            type="number"
            name="count"
            value={form.count}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Slug (optional)"
            name="slug"
            value={form.slug}
            onChange={handleChange}
          />
        </Stack>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleSubmit}
          disabled={!form.label}>
          Add Product
        </Button>
      </Box>
    </Modal>
  );
}
