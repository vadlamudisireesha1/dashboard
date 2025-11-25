// src/pages/NonVegPickles.jsx
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
  Collapse,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Edit,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Grid as GridIcon,
  List as ListIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ROLE -> admin or user
const USER_ROLE = "admin"; // change to "user" to hide edit buttons

export default function NonVegPickles() {
  const navigate = useNavigate();

  // popup states
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // new states for list/grid and expansion
  const [view, setView] = useState("grid"); // "grid" or "list"
  const [expanded, setExpanded] = useState(null);

  // data
  const [pickles, setPickles] = useState([
    {
      name: "Chicken Boneless Pickle",
      bgColor: "#ffffff",
      weights: {
        "250 gm": 20,
        "500 gm": 24,
        "750 gm": 15,
        "1000 gm": 10,
      },
    },
    {
      name: "Gongura Chicken Boneless Pickle",
      bgColor: "#ffffff",
      weights: {
        "250 gm": 14,
        "500 gm": 18,
        "750 gm": 9,
        "1000 gm": 6,
      },
    },
    {
      name: "Mutton Pickle (Bone)",
      bgColor: "#ffffff",
      weights: {
        "250 gm": 16,
        "500 gm": 12,
        "750 gm": 10,
        "1000 gm": 8,
      },
    },
    {
      name: "Gongura Mutton Pickle (Bone)",
      bgColor: "#ffffff",
      weights: {
        "250 gm": 10,
        "500 gm": 10,
        "750 gm": 5,
        "1000 gm": 4,
      },
    },
    {
      name: "Prawns Pickle",
      bgColor: "#ffffff",
      weights: {
        "250 gm": 18,
        "500 gm": 22,
        "750 gm": 14,
        "1000 gm": 9,
      },
    },
  ]);

  // form state for popup (edit/add)
  const [form, setForm] = useState({
    name: "",
    bgColor: "#ffffff",
    weights: {
      "250 gm": "",
      "500 gm": "",
      "750 gm": "",
      "1000 gm": "",
    },
  });

  // helpers
  const totalUnits = (weights) =>
    Object.values(weights).reduce((acc, v) => acc + Number(v), 0);

  const getDotColor = (total) => {
    if (total < 10) return "red";
    if (total < 30) return "orange";
    return "green";
  };

  // edit / add handlers
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
      bgColor: "#ffffff",
      weights: {
        "250 gm": 0,
        "500 gm": 0,
        "750 gm": 0,
        "1000 gm": 0,
      },
    });
    setOpen(true);
  };

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: "2040px",
        margin: "0 auto",
        minHeight: "100vh",

        /* Premium smooth background - kept as you had it */
        background: "linear-gradient(180deg, #FFF7EC 0%, #FFF1DA 100%)",
        backgroundSize: "100% 100%",
        position: "relative",
        overflow: "hidden",
      }}>
      {/* Back */}
      <Button variant="contained" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      {/* Title + View Toggle */}
      <Box
        sx={{ display: "flex", justifyContent: "space-between", mt: 3, mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Non Veg Pickles
        </Typography>

        {/* VIEW SWITCH BUTTONS (keeps UI minimal) */}
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(e, v) => v && setView(v)}
          sx={{
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
          }}>
          <ToggleButton value="grid">
            <GridIcon size={18} />
          </ToggleButton>
          <ToggleButton value="list">
            <ListIcon size={18} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* GRID MODE: KEEP YOUR ORIGINAL CARD STYLES EXACTLY */}
      {view === "grid" && (
        <Grid container spacing={3} sx={{ flexWrap: "wrap" }}>
          {pickles.map((item, index) => {
            const total = totalUnits(item.weights);

            return (
              <Grid item key={index} sx={{ width: "260px" }}>
                <Box
                  sx={{
                    width: "240px",
                    background: item.bgColor,
                    borderRadius: "18px",
                    p: 2,
                    boxShadow: "0px 8px 25px rgba(0,0,0,0.08)",
                    border: "1px solid rgba(255,255,255,0.4)",
                    backdropFilter: "blur(6px)",
                    transition: "0.25s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0px 12px 30px rgba(0,0,0,0.15)",
                    },
                    minHeight: "260px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                  }}>
                  {/* Edit Button (admin only) - unchanged */}
                  {USER_ROLE === "admin" && (
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(index)}
                      sx={{ position: "absolute", top: 10, right: 10 }}>
                      <Edit size={18} />
                    </IconButton>
                  )}

                  {/* Total Units + status dot */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                    }}>
                    <Typography fontSize={40} fontWeight={700}>
                      {total}
                    </Typography>

                    <Box
                      sx={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        backgroundColor: getDotColor(total),
                        boxShadow: `0px 0px 8px ${getDotColor(total)}99`,
                      }}
                    />
                  </Box>

                  <Box sx={{ borderBottom: "1px solid #ddd", my: 1 }} />

                  {/* Title */}
                  <Typography
                    fontSize={16}
                    fontWeight={700}
                    sx={{ wordWrap: "break-word", lineHeight: 1.3 }}>
                    {item.name}
                  </Typography>

                  <Box sx={{ borderBottom: "1px solid #ddd", my: 1 }} />

                  {/* Weight Units (kept your highlighted badge style) */}
                  {Object.entries(item.weights).map(([w, u], i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "14px",
                        mb: "4px",
                      }}>
                      <Box sx={{ width: "70px", fontWeight: 500 }}>{w}</Box>
                      <Box sx={{ mx: 1 }}>:</Box>
                      <Box
                        sx={{
                          background: "#EEF2FF",
                          color: "#1E3A8A",
                          padding: "2px 10px",
                          borderRadius: "8px",
                          fontWeight: 700,
                          minWidth: "32px",
                          textAlign: "center",
                          boxShadow: "0px 2px 6px rgba(0,0,0,0.12)",
                        }}>
                        {u}
                      </Box>
                      <Box sx={{ ml: 1 }}>units</Box>
                    </Box>
                  ))}
                </Box>
              </Grid>
            );
          })}

          {/* Add New Pickle (kept your card look) */}
          <Grid item sx={{ width: "260px" }}>
            <Box
              onClick={handleAddNew}
              sx={{
                width: "270px",
                height: "290px",
                background: "rgba(255,255,255,0.6)",
                borderRadius: "18px",
                border: "2px dashed #c7c7c7",
                boxShadow: "0px 6px 20px rgba(0,0,0,0.06)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                transition: "0.25s ease",
                cursor: "pointer",
                "&:hover": {
                  background: "rgba(255,255,255,0.8)",
                  border: "2px dashed #b3b3b3",
                  transform: "translateY(-5px)",
                },
              }}>
              <Plus size={40} />
              <Typography mt={1}>Add New Pickle</Typography>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* LIST MODE: rack / stack view (uses same colors & simple clean layout) */}
      {view === "list" && (
        <Box sx={{ mt: 2 }}>
          {pickles.map((item, index) => {
            const total = totalUnits(item.weights);
            const isExpanded = expanded === index;

            return (
              <Box
                key={index}
                sx={{
                  background: "#fff",
                  borderRadius: "14px",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
                  p: 2,
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                }}>
                {/* top row */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {/* total */}
                  <Typography
                    sx={{ width: "90px", fontSize: 30, fontWeight: 700 }}>
                    {total}
                  </Typography>

                  {/* title */}
                  <Typography sx={{ flex: 1, fontWeight: 700 }}>
                    {item.name}
                  </Typography>

                  {/* dot */}
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: getDotColor(total),
                      mr: 2,
                      boxShadow: `0px 0px 8px ${getDotColor(total)}99`,
                    }}
                  />

                  {/* edit (admin only) */}
                  {USER_ROLE === "admin" && (
                    <IconButton onClick={() => handleEdit(index)}>
                      <Edit size={18} />
                    </IconButton>
                  )}

                  {/* expand */}
                  <IconButton
                    onClick={() => setExpanded(isExpanded ? null : index)}>
                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                  </IconButton>
                </Box>

                {/* expanded area */}
                <Collapse in={isExpanded}>
                  <Box sx={{ mt: 2, pl: 1 }}>
                    {Object.entries(item.weights).map(([w, u]) => (
                      <Box
                        key={w}
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Box sx={{ width: "100px", fontWeight: 600 }}>{w}</Box>
                        <Box sx={{ mx: 1 }}>:</Box>
                        <Box
                          sx={{
                            background: "#EEF2FF",
                            color: "#1E3A8A",
                            padding: "4px 12px",
                            borderRadius: "8px",
                            fontWeight: 700,
                            minWidth: "36px",
                            textAlign: "center",
                            boxShadow: "0px 2px 6px rgba(0,0,0,0.12)",
                          }}>
                          {u}
                        </Box>
                        <Box sx={{ ml: 1 }}>units</Box>
                      </Box>
                    ))}
                  </Box>
                </Collapse>
              </Box>
            );
          })}
        </Box>
      )}

      {/* EDIT POPUP - KEEP EXACTLY AS BEFORE */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "18px",
            p: 2,
            background: "#F6FFF4", // soft green background
            width: "360px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            border: "1px solid #d8efd2",
          },
        }}>
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: "20px",
            textAlign: "center",
            pb: 1,
            color: "#3A6F47",
          }}>
          🥒 Edit Pickle
        </DialogTitle>

        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {/* NAME INPUT */}
          <TextField
            label="Pickle Name"
            variant="outlined"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                background: "#fff",
              },
            }}
          />

          {/* COLOR PICKER */}
          <Typography sx={{ fontWeight: 600, color: "#3A6F47", mt: 1 }}>
            Card Background Color
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                border: "1px solid #bbb",
                background: form.bgColor,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            />

            <input
              type="color"
              value={form.bgColor}
              onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
              style={{
                width: "60px",
                height: "40px",
                padding: 0,
                border: "1px solid #ccc",
                borderRadius: "8px",
                cursor: "pointer",
                background: "transparent",
              }}
            />
          </Box>

          {/* WEIGHTS */}
          <Typography sx={{ fontWeight: 600, color: "#3A6F47" }}>
            Weight Units
          </Typography>

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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  background: "#fff",
                },
              }}
            />
          ))}

          {/* DELETE */}
          <Button
            variant="outlined"
            color="error"
            startIcon={<Trash2 />}
            onClick={() => {
              const filtered = pickles.filter((_, i) => i !== editIndex);
              setPickles(filtered);
              setOpen(false);
            }}
            sx={{
              mt: 1,
              borderRadius: "12px",
              fontWeight: 600,
              borderWidth: "2px",
              "&:hover": { borderWidth: "2px", background: "#FFEEEE" },
            }}>
            Delete Pickle
          </Button>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{ borderRadius: "10px", fontWeight: 600, color: "#3A6F47" }}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              borderRadius: "12px",
              background: "#4C8E5A",
              "&:hover": { background: "#3A6F47" },
              fontWeight: 600,
            }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
