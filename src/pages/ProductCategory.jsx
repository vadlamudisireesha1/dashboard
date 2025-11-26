import React, { useState, useEffect } from "react";
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
  Stack,
  alpha,
  ToggleButtonGroup,
} from "@mui/material";

import {
  Palette,
  Edit,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Grid as GridIcon,
  List as ListIcon,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

// JSON imports
import nonvegData from "../data/nonveg.json";
import vegetableData from "../data/vegetable.json";
import powdersData from "../data/powders.json";
import milletsData from "../data/millets.json";
import readytoeatData from "../data/readytoeat.json";
import organicData from "../data/organic.json";

const USER_ROLE = "admin";

// pick JSON based on slug
const getDataForType = (slug) => {
  switch ((slug || "").toLowerCase()) {
    case "nonveg":
      return nonvegData;
    case "vegetable":
      return vegetableData;
    case "powders":
      return powdersData;
    case "millets":
      return milletsData;
    case "readytoeat":
      return readytoeatData;
    case "organic":
      return organicData;
    default:
      return powdersData;
  }
};

export default function ProductCategory() {
  const navigate = useNavigate();
  const { type } = useParams();

  const data = getDataForType(type);

  const [pickles, setPickles] = useState(data.items || []);
  const [expanded, setExpanded] = useState(null);
  const [view, setView] = useState("grid");

  useEffect(() => {
    setPickles(getDataForType(type).items || []);
    setExpanded(null);
  }, [type]);

  // TOTAL UNITS OF ENTIRE CATEGORY
  const getCategoryTotalUnits = () => {
    let total = 0;
    pickles.forEach((item) => {
      Object.values(item.weights).forEach((w) => {
        total += Number(w.units || 0);
      });
    });
    return total;
  };

  // TOTAL UNITS
  const getTotalUnits = (weights) =>
    Object.values(weights).reduce((sum, w) => sum + Number(w.units), 0);

  // TOTAL VALUE
  const getTotalValue = (weights) =>
    Object.values(weights).reduce(
      (sum, w) => sum + Number(w.units) * Number(w.price),
      0
    );

  const dotColor = (units) => {
    if (units < 10) return "red";
    if (units < 30) return "orange";
    return "green";
  };

  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({
    name: "",
    bgColor: "#ffffff",
    weights: {
      250: { units: 0, price: 0 },
      500: { units: 0, price: 0 },
      750: { units: 0, price: 0 },
      1000: { units: 0, price: 0 },
    },
  });

  // open edit
  const handleEdit = (index) => {
    setEditIndex(index);
    setForm(JSON.parse(JSON.stringify(pickles[index])));
    setOpen(true);
  };

  // open add
  const handleAdd = () => {
    setEditIndex(pickles.length);
    setForm({
      name: "",
      bgColor: "#ffffff",
      weights: {
        250: { units: 0, price: 0 },
        500: { units: 0, price: 0 },
        750: { units: 0, price: 0 },
        1000: { units: 0, price: 0 },
      },
    });
    setOpen(true);
  };

  // save edit/add
  const handleSave = () => {
    const updated = [...pickles];
    if (editIndex < pickles.length) updated[editIndex] = form;
    else updated.push(form);
    setPickles(updated);
    setOpen(false);
  };

  // delete item
  const handleDelete = () => {
    const filtered = pickles.filter((_, i) => i !== editIndex);
    setPickles(filtered);
    setOpen(false);
  };

  return (
    <Box sx={{ p: 4, background: "#fffbf5ff", minHeight: "100vh" }}>
      <Button variant="contained" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      {/* Title + view */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 3,
          mb: 3,
        }}>
        <Typography variant="h4" fontWeight={700}>
          {data.title}{" "}
          <span style={{ fontSize: "22px", fontWeight: 600, opacity: 0.7 }}>
            ({pickles.length} Products / {getCategoryTotalUnits()} Units)
          </span>
        </Typography>

        <ToggleButtonGroup
          exclusive
          value={view}
          onChange={(e, v) => v && setView(v)}
          sx={{ background: "#fff", borderRadius: "12px" }}>
          <ToggleButton value="grid">
            <GridIcon size={18} />
          </ToggleButton>
          <ToggleButton value="list">
            <ListIcon size={18} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* GRID VIEW (unchanged) */}
      {view === "grid" && (
        <Grid container spacing={3}>
          {pickles.map((item, index) => {
            const totalUnits = getTotalUnits(item.weights);
            const totalValue = getTotalValue(item.weights);
            const opened = expanded === index;

            return (
              <Grid item key={index} sx={{ width: "260px" }}>
                <Box
                  sx={{
                    p: 2,
                    background: item.bgColor,
                    borderRadius: "18px",
                    minHeight: "150px",
                    position: "relative",
                    boxShadow: "0px 8px 25px rgba(0,0,0,0.08)",
                    transition: "0.25s ease",
                  }}>
                  {USER_ROLE === "admin" && (
                    <IconButton
                      size="small"
                      sx={{ position: "absolute", top: 10, right: 10 }}
                      onClick={() => handleEdit(index)}>
                      <Edit size={18} />
                    </IconButton>
                  )}

                  {/* TOP ROW  */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 2.5,
                      background:
                        "linear-gradient(135deg, #f8fff8 0%, #f0fdf4 100%)",
                      borderRadius: "16px",
                      border: "1px solid #bbf7d087",
                    }}>
                    <Typography
                      sx={{ fontSize: 40, fontWeight: 800, color: "#166534" }}>
                      {totalUnits}
                    </Typography>

                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Typography
                        sx={{
                          fontSize: 26,
                          fontWeight: 700,
                          color: "#0b0b0bff",
                        }}>
                        ₹{totalValue.toLocaleString("en-IN")}
                      </Typography>
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          bgcolor: dotColor(totalUnits),
                          boxShadow:
                            "0 0 10px 3px " + dotColor(totalUnits) + "60",
                        }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ borderBottom: "1px solid #ddd", my: 1 }} />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography fontSize={16} fontWeight={700}>
                      {item.name}
                    </Typography>
                    {/* EXPAND BUTTON */}
                    <Box
                      sx={{
                        textAlign: "center",
                        cursor: "pointer",
                        mb: 1,
                      }}
                      onClick={() => setExpanded(opened ? null : index)}>
                      {opened ? <ChevronUp /> : <ChevronDown />}
                    </Box>
                  </Box>

                  <Box sx={{ borderBottom: "1px solid #ddd", my: 1 }} />

                  {/* EXPANDED SECTION   */}
                  <Collapse in={opened}>
                    <Box sx={{ mt: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          fontWeight: 700,
                          borderBottom: "1px solid #ccc",
                          mb: 1,
                          pb: 1,
                          fontSize: "14px",
                        }}>
                        <Box sx={{ width: "60px" }}>Gram</Box>
                        <Box sx={{ width: "60px" }}>Units</Box>
                        <Box sx={{ width: "60px" }}>Price</Box>
                        <Box sx={{ width: "60px" }}>Total</Box>
                      </Box>

                      {Object.entries(item.weights).map(([gram, obj], i) => (
                        <Box
                          key={i}
                          sx={{
                            display: "flex",
                            mb: 1,
                            fontWeight: 600,
                            fontSize: "14px",
                          }}>
                          <Box sx={{ width: "60px" }}>{gram}g</Box>
                          <Box sx={{ width: "60px" }}>{obj.units}</Box>
                          <Box sx={{ width: "60px" }}>₹{obj.price}</Box>
                          <Box sx={{ width: "60px" }}>
                            ₹{obj.units * obj.price}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Collapse>
                </Box>
              </Grid>
            );
          })}

          {/* ADD NEW */}
          <Grid item sx={{ width: "260px" }}>
            <Box
              onClick={handleAdd}
              sx={{
                width: "240px",
                minHeight: "180px",
                border: "2px dashed #c7c7c7",
                borderRadius: "18px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}>
              <Plus size={40} />
              <Typography mt={1}>Add New</Typography>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* LIST VIEW (restored) */}
      {view === "list" && (
        <Box sx={{ mt: 2 }}>
          {pickles.map((item, index) => {
            const totalUnits = getTotalUnits(item.weights);
            const totalValue = getTotalValue(item.weights);
            const opened = expanded === index;

            return (
              <Box
                key={index}
                sx={{
                  background: "rgba(255,255,255,0.8)",
                  borderRadius: "18px",
                  boxShadow: "0px 8px 25px rgba(0,0,0,0.08)",
                  p: 2,
                  mb: 2,
                  transition: "0.25s ease",
                }}>
                {/* HEADER ROW */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    pb: 1,
                  }}>
                  <Typography
                    sx={{
                      width: "90px",
                      fontSize: "34px",
                      fontWeight: 800,
                    }}>
                    {totalUnits}
                  </Typography>

                  <Typography
                    sx={{
                      minWidth: "90px",
                      fontSize: "18px",
                      fontWeight: 700,
                    }}>
                    ₹{totalValue}
                  </Typography>

                  <Typography
                    sx={{
                      flex: 1,
                      fontSize: "18px",
                      fontWeight: 700,
                    }}>
                    {item.name}
                  </Typography>

                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      backgroundColor: dotColor(totalUnits),
                    }}
                  />

                  {USER_ROLE === "admin" && (
                    <IconButton onClick={() => handleEdit(index)}>
                      <Edit size={18} />
                    </IconButton>
                  )}

                  <IconButton
                    onClick={() => setExpanded(opened ? null : index)}>
                    {opened ? <ChevronUp /> : <ChevronDown />}
                  </IconButton>
                </Box>

                {/* EXPANDED TABLE */}
                <Collapse in={opened}>
                  <Box sx={{ mt: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        fontWeight: 700,
                        borderBottom: "1px solid #ccc",
                        mb: 1,
                        pb: 1,
                        fontSize: "14px",
                      }}>
                      <Box sx={{ width: "80px" }}>Gram</Box>
                      <Box sx={{ width: "80px" }}>Units</Box>
                      <Box sx={{ width: "80px" }}>Price</Box>
                      <Box sx={{ width: "80px" }}>Total</Box>
                    </Box>

                    {Object.entries(item.weights).map(([gram, obj]) => (
                      <Box
                        key={gram}
                        sx={{
                          display: "flex",
                          mb: 1,
                          fontWeight: 600,
                          fontSize: "14px",
                        }}>
                        <Box sx={{ width: "80px" }}>{gram}g</Box>
                        <Box sx={{ width: "80px" }}>{obj.units}</Box>
                        <Box sx={{ width: "80px" }}>₹{obj.price}</Box>
                        <Box sx={{ width: "80px" }}>
                          ₹{obj.units * obj.price}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Collapse>
              </Box>
            );
          })}

          {/* ADD NEW IN LIST VIEW */}
          <Box
            onClick={handleAdd}
            sx={{
              mt: 2,
              borderRadius: "18px",
              border: "2px dashed #c7c7c7",
              padding: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              background: "rgba(255,255,255,0.6)",
            }}>
            <Plus size={28} style={{ marginRight: 8 }} />
            <Typography fontWeight={600}>Add New Product</Typography>
          </Box>
        </Box>
      )}

      {/* EDIT MODAL  */}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
            m: { xs: 2, sm: 3 },
          },
        }}>
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 800,
            fontSize: "1.5rem",
            color: "#1a1a1a",
          }}>
          Edit Details
        </DialogTitle>

        <DialogContent sx={{ px: { xs: 3, sm: 4 }, pt: 2 }}>
          {/* Product Name */}
          <TextField
            fullWidth
            label="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            variant="filled"
            InputProps={{ disableUnderline: true }}
            sx={{
              mb: 3,
              "& .MuiFilledInput-root": {
                background: "white",
                borderRadius: "14px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                fontSize: "1.1rem",
                fontWeight: 500,
                "&:hover": { background: "#f8fff8" },
                "&.Mui-focused": {
                  background: "white",
                  boxShadow: "0 0 0 3px rgba(46, 125, 50, 0.2)",
                },
              },
              "& .MuiInputLabel-root": {
                fontWeight: 600,
                color: "#444",
                "&.Mui-focused": { color: "#2e7d32" },
              },
            }}
          />

          {/* Background Color */}
          <Typography fontWeight={700} gutterBottom color="text.primary">
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
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
          </Box>

          {/* Weight Table */}
          <Typography fontWeight={700} gutterBottom color="text.primary">
            Weight Table (Style B)
          </Typography>

          <Stack spacing={2}>
            {/* Header */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "80px 1fr 1fr",
                  sm: "100px 1fr 1fr",
                },
                gap: 1.5,
                fontWeight: 700,
                color: "#2e7d32",
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
                  gridTemplateColumns: {
                    xs: "80px 1fr 1fr",
                    sm: "100px 1fr 1fr",
                  },
                  gap: 1.5,
                  alignItems: "center",
                }}>
                <Typography fontWeight={600} color="#1a1a1a">
                  {gram}g
                </Typography>

                <TextField
                  size="small"
                  type="number"
                  value={obj.units}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      weights: {
                        ...form.weights,
                        [gram]: { ...obj, units: Number(e.target.value) || 0 },
                      },
                    })
                  }
                  InputProps={{
                    sx: { borderRadius: "10px", background: "white" },
                  }}
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
                        [gram]: { ...obj, price: Number(e.target.value) || 0 },
                      },
                    })
                  }
                  InputProps={{
                    sx: { borderRadius: "10px", background: "white" },
                  }}
                />
              </Box>
            ))}
          </Stack>

          {/* Delete Button */}
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<Trash2 size={20} />}
            onClick={handleDelete}
            sx={{
              mt: 4,
              py: 1.5,
              borderRadius: "12px",
              borderWidth: 2,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { borderWidth: 2, bgcolor: alpha("#d32f2f", 0.08) },
            }}>
            Delete Product
          </Button>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 4, gap: 2 }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{ px: 4, py: 1.2, fontWeight: 600, borderRadius: "12px" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              px: 5,
              py: 1.4,
              fontWeight: 700,
              borderRadius: "12px",
              bgcolor: "#2e7d32",
              "&:hover": { bgcolor: "#1b5e20" },
              boxShadow: "0 6px 16px rgba(46, 125, 50, 0.3)",
            }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
