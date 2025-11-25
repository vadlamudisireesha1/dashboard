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

//  Load JSON instead of hardcoded array
import nonvegData from "../data/nonveg.json";

// ROLE -> admin or user
const USER_ROLE = "admin";

export default function NonVegPickles() {
  const navigate = useNavigate();

  // popup states
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // toggle state
  const [view, setView] = useState("grid");
  const [expanded, setExpanded] = useState(null);

  //  JUST THIS ONE CHANGE: load JSON data
  const [pickles, setPickles] = useState(nonvegData.items);

  // popup form state
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
  const totalUnits = (w) => Object.values(w).reduce((a, v) => a + Number(v), 0);

  const getDotColor = (total) => {
    if (total < 10) return "red";
    if (total < 30) return "orange";
    return "green";
  };

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
      weights: { "250 gm": 0, "500 gm": 0, "750 gm": 0, "1000 gm": 0 },
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

        // your exact background
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
          {nonvegData.title}
        </Typography>

        {/* VIEW SWITCH BUTTONS */}
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

      {/* ----------------------------------------------------
          GRID MODE  (Everything 100% same as your version)
      ---------------------------------------------------- */}
      {view === "grid" && (
        <Grid container spacing={3}>
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

                    // all   shadows + blur + hover
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
                  {/* Edit Icon */}
                  {USER_ROLE === "admin" && (
                    <IconButton
                      size="small"
                      sx={{ position: "absolute", top: 10, right: 10 }}
                      onClick={() => handleEdit(index)}>
                      <Edit size={18} />
                    </IconButton>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                    <Typography fontSize={40} fontWeight={700}>
                      {total}
                    </Typography>

                    <Box
                      sx={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: getDotColor(total),
                        boxShadow: `0px 0px 8px ${getDotColor(total)}99`,
                      }}
                    />
                  </Box>

                  <Box sx={{ borderBottom: "1px solid #ddd", my: 1 }} />

                  <Typography fontSize={16} fontWeight={700}>
                    {item.name}
                  </Typography>

                  <Box sx={{ borderBottom: "1px solid #ddd", my: 1 }} />

                  {Object.entries(item.weights).map(([w, u], i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: "4px",
                      }}>
                      <Box sx={{ width: "70px" }}>{w}</Box>
                      <Box sx={{ mx: 1 }}>:</Box>
                      <Box
                        sx={{
                          background: "#EEF2FF",
                          color: "#1E3A8A",
                          padding: "2px 10px",
                          borderRadius: "8px",
                          fontWeight: 700,
                          boxShadow: "0px 2px 6px rgba(0,0,0,0.12)",
                          minWidth: "32px",
                          textAlign: "center",
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

          {/* Add New Card */}
          <Grid item sx={{ width: "260px" }}>
            <Box
              onClick={handleAddNew}
              sx={{
                width: "270px",
                height: "290px",
                background: "rgba(255,255,255,0.6)",
                borderRadius: "18px",
                border: "2px dashed #c7c7c7",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                cursor: "pointer",
                transition: "0.25s ease",
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

      {/* ----------------------------------------------------
          LIST VIEW (also unchanged)
      ---------------------------------------------------- */}
      {/* ---- LIST VIEW (Styled Fancy Version B) ---- */}
      {view === "list" && (
        <Box sx={{ mt: 2 }}>
          {pickles.map((item, index) => {
            const total = totalUnits(item.weights);
            const isExpanded = expanded === index;

            return (
              <Box
                key={index}
                sx={{
                  background: "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(6px)",
                  borderRadius: "18px",
                  border: "1px solid rgba(255,255,255,0.5)",
                  boxShadow: "0px 8px 25px rgba(0,0,0,0.08)",
                  p: 2,
                  mb: 2,
                  transition: "0.25s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 12px 30px rgba(0,0,0,0.15)",
                  },
                }}>
                {/* TOP ROW */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    pb: 1,
                  }}>
                  {/* TOTAL NUMBER */}
                  <Typography
                    sx={{
                      width: "90px",
                      fontSize: "36px",
                      fontWeight: 800, // BIG + BOLD
                      color: "#1E293B",
                    }}>
                    {total}
                  </Typography>

                  {/* TITLE */}
                  <Typography
                    sx={{
                      flex: 1,
                      fontWeight: 700,
                      fontSize: "18px",
                      color: "#111",
                    }}>
                    {item.name}
                  </Typography>

                  {/* STATUS DOT */}
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: getDotColor(total),
                      boxShadow: `0px 0px 8px ${getDotColor(total)}99`,
                    }}
                  />

                  {/* ADMIN ONLY EDIT BUTTON */}
                  {USER_ROLE === "admin" && (
                    <IconButton onClick={() => handleEdit(index)}>
                      <Edit size={18} />
                    </IconButton>
                  )}

                  {/* EXPAND BUTTON */}
                  <IconButton
                    onClick={() => setExpanded(isExpanded ? null : index)}>
                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                  </IconButton>
                </Box>

                {/* EXPANDED SECTION */}
                <Collapse in={isExpanded}>
                  <Box sx={{ mt: 2, pl: 1 }}>
                    {Object.entries(item.weights).map(([w, u]) => (
                      <Box
                        key={w}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1.2,
                        }}>
                        {/* LABEL */}
                        <Box
                          sx={{
                            width: "100px",
                            fontWeight: 600,
                            color: "#1E293B",
                          }}>
                          {w}
                        </Box>

                        <Box sx={{ mx: 1 }}>:</Box>

                        {/* BLUE BADGE LIKE GRID VIEW */}
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

                        <Box sx={{ ml: 1, color: "#1F2937" }}>units</Box>
                      </Box>
                    ))}
                  </Box>
                </Collapse>
              </Box>
            );
          })}
        </Box>
      )}

      {/* ----------------------------------------------------
          POPUP (unchanged exact styling)
      ---------------------------------------------------- */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "18px",
            p: 2,
            background: "#F6FFF4",
            width: "360px",
          },
        }}>
        <DialogTitle sx={{ textAlign: "center" }}>Edit Pickle</DialogTitle>

        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Pickle Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Typography>Card Background Color</Typography>

          <input
            type="color"
            value={form.bgColor}
            onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
            style={{ width: "60px", height: "40px" }}
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
            Delete
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
