import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NonVegPickles() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [pickles, setPickles] = useState([
    {
      name: "Chicken Boneless Pickle",
      weights: {
        "250 gm": 20,
        "500 gm": 24,
        "750 gm": 15,
        "1000 gm": 10,
      },
    },
    {
      name: "Gongura Chicken Boneless Pickle",
      weights: {
        "250 gm": 14,
        "500 gm": 18,
        "750 gm": 9,
        "1000 gm": 6,
      },
    },
    {
      name: "Mutton Pickle (Bone)",
      weights: {
        "250 gm": 16,
        "500 gm": 12,
        "750 gm": 10,
        "1000 gm": 8,
      },
    },
    {
      name: "Gongura Mutton Pickle (Bone)",
      weights: {
        "250 gm": 10,
        "500 gm": 10,
        "750 gm": 5,
        "1000 gm": 4,
      },
    },
    {
      name: "Prawns Pickle",
      weights: {
        "250 gm": 18,
        "500 gm": 22,
        "750 gm": 14,
        "1000 gm": 9,
      },
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    weights: {
      "250 gm": "",
      "500 gm": "",
      "750 gm": "",
      "1000 gm": "",
    },
  });

  const handleEdit = (index) => {
    setEditIndex(index);
    setForm(JSON.parse(JSON.stringify(pickles[index])));
    setOpen(true);
  };

  const handleSave = () => {
    const updated = [...pickles];
    updated[editIndex] = form;
    setPickles(updated);
    setOpen(false);
  };

  const handleAddNew = () => {
    setEditIndex(pickles.length);
    setForm({
      name: "",
      weights: {
        "250 gm": 0,
        "500 gm": 0,
        "750 gm": 0,
        "1000 gm": 0,
      },
    });
    setOpen(true);
  };

  const totalUnits = (weightObj) =>
    Object.values(weightObj).reduce((acc, num) => acc + Number(num), 0);

  return (
    <Box sx={{ p: 4, maxWidth: "1400px", margin: "0 auto" }}>
      <Button variant="contained" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <Typography variant="h4" fontWeight={700} sx={{ mt: 3, mb: 3 }}>
        Non Veg Pickles
      </Typography>

      {/* ENSURE GRID TAKES FULL WIDTH */}
      <Grid
        container
        spacing={3}
        sx={{
          display: "flex",
          flexWrap: "wrap",
        }}>
        {pickles.map((item, index) => (
          <Grid item key={index} sx={{ width: "260px" }}>
            <Box
              sx={{
                width: "240px",
                background: "#fff",
                borderRadius: "14px",
                p: 2,
                boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
                minHeight: "260px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}>
              {/* Edit Button */}
              <IconButton
                size="small"
                onClick={() => handleEdit(index)}
                sx={{ position: "absolute", top: 10, right: 10 }}>
                <Edit size={18} />
              </IconButton>

              {/* Total Units */}
              <Typography fontSize={40} fontWeight={700}>
                {totalUnits(item.weights)}
              </Typography>

              <Box sx={{ borderBottom: "1px solid #ddd", my: 1 }} />

              {/* Title (wraps but does NOT stretch card) */}
              <Typography
                fontSize={16}
                fontWeight={700}
                sx={{ wordWrap: "break-word", lineHeight: 1.3 }}>
                {item.name}
              </Typography>

              <Box sx={{ borderBottom: "1px solid #ddd", my: 1 }} />

              {/* Weight Units */}
              {Object.entries(item.weights).map(([w, u], i) => (
                <Typography key={i} fontSize={14}>
                  {w}: {u} units
                </Typography>
              ))}
            </Box>
          </Grid>
        ))}

        {/* Add New Pickle */}
        <Grid item sx={{ width: "260px" }}>
          <Box
            onClick={handleAddNew}
            sx={{
              width: "240px",
              height: "260px",
              background: "#f5f5f5",
              borderRadius: "14px",
              p: 2,
              cursor: "pointer",
              border: "2px dashed #bbb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              "&:hover": { background: "#e9e9e9" },
            }}>
            <Plus size={40} />
            <Typography mt={1}>Add New Pickle</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* EDIT POPUP */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Pickle</DialogTitle>

        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {Object.keys(form.weights).map((key) => (
            <TextField
              key={key}
              label={key}
              type="number"
              value={form.weights[key]}
              onChange={(e) =>
                setForm({
                  ...form,
                  weights: { ...form.weights, [key]: e.target.value },
                })
              }
            />
          ))}

          <Button
            variant="outlined"
            color="error"
            startIcon={<Trash2 />}
            onClick={() => {
              const filtered = pickles.filter((_, i) => i !== editIndex);
              setPickles(filtered);
              setOpen(false);
            }}>
            Delete Pickle
          </Button>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
