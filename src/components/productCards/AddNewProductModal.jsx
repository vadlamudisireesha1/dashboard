import React, { useState, useEffect } from "react";
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
  const defaultForm = {
    label: "",
    icon: "carrot",
    color: "#4C8BF5",
    bg: "#eaf2ff",
    count: 0,
    slug: "",
  };

  const [form, setForm] = useState(defaultForm);

  // Reset form whenever modal closes
  useEffect(() => {
    if (!open) setForm(defaultForm);
  }, [open]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const generateSlug = (label) =>
    label
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const handleSubmit = () => {
    if (!form.label) return;

    const finalSlug = form.slug
      ? generateSlug(form.slug)
      : generateSlug(form.label);

    onAdd({
      ...form,
      slug: finalSlug,
      count: Number(form.count || 0),
    });

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 380,
          p: 3,
          borderRadius: 3,
          bgcolor: "white",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
        }}>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 700, fontFamily: "var(--heading-font)" }}>
          Add New Product
        </Typography>

        {/* LABEL */}
        <TextField
          fullWidth
          label="Product Label"
          name="label"
          value={form.label}
          onChange={handleChange}
        />

        {/* ICON */}
        <TextField
          fullWidth
          select
          label="Icon"
          name="icon"
          value={form.icon}
          onChange={handleChange}
          sx={{ mt: 2 }}>
          {ICON_OPTIONS.map((icon) => (
            <MenuItem key={icon} value={icon}>
              {icon}
            </MenuItem>
          ))}
        </TextField>

        {/* COLORS */}
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Text Color"
            name="color"
            value={form.color}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Background Color"
            name="bg"
            value={form.bg}
            onChange={handleChange}
          />
        </Stack>

        {/* COUNT + SLUG */}
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

        {/* BUTTON */}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3, py: 1.2, fontWeight: 700 }}
          onClick={handleSubmit}
          disabled={!form.label}>
          Add Product
        </Button>
      </Box>
    </Modal>
  );
}
