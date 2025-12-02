import React, { useState } from "react";
import {
  Package,
  Boxes,
  CircleDollarSign,
  Filter,
  BarChart3,
} from "lucide-react";

import {
  Box,
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Fade,
} from "@mui/material";

import {
  calculateStockValue,
  getTotalUnits,
  CATEGORY_KEYS,
  CATEGORY_LABELS,
} from "./graphUtils";

// ==========================================================
// GLOSSY CARD COMPONENT
// ==========================================================
function StatCard({ label, value, accent, Icon }) {
  const [hover, setHover] = useState(false);

  return (
    <Paper
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 220,
        p: 2.5,
        borderRadius: 4,
        position: "relative",
        background: accent.background,
        transition: "0.25s ease",
        transform: hover ? "translateY(-4px)" : "translateY(0px)",
        boxShadow: hover
          ? "0 18px 28px rgba(0,0,0,0.16)"
          : "0 10px 20px rgba(0,0,0,0.10)",
        border: "1px solid rgba(255,255,255,0.6)",
        // ❌ no zIndex here – cards must stay under the header popup
      }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography
            sx={{
              fontSize: 12,
              color: accent.labelColor,
              fontWeight: 600,
              letterSpacing: ".05em",
            }}>
            {label}
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 28,
              fontWeight: 800,
              color: accent.valueColor,
            }}>
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: accent.iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Icon size={20} color={accent.iconColor} strokeWidth={2.2} />
        </Box>
      </Box>
    </Paper>
  );
}

// MAIN HEADER COMPONENT

export default function GraphsHeader({
  items,
  category,
  setCategory,
  date,
  setDate,
}) {
  const totalProducts = items.length;
  const totalUnits = getTotalUnits(items);
  const totalValue = calculateStockValue(items);

  const [open, setOpen] = useState(false);

  const [tmpCategory, setTmpCategory] = useState(category);
  const [tmpDate, setTmpDate] = useState(date);

  const applyFilter = () => {
    setCategory(tmpCategory);
    setDate(tmpDate);
    setOpen(false);
  };

  const cancelFilter = () => {
    setTmpCategory(category);
    setTmpDate(date);
    setOpen(false);
  };

  return (
    <Box>
      {/* ========================================================
                         HEADER BAR
      ======================================================== */}
      <Paper
        elevation={3}
        sx={{
          p: 2.5,
          borderRadius: 4,
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.45)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          mb: 3,
          gap: 2,
          zIndex: 50,
        }}>
        {/* ---------------- LEFT: Title ---------------- */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: 3,
              background: "linear-gradient(135deg, #4f46e5, #22c55e, #0ea5e9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 18px rgba(0,0,0,0.2)",
            }}>
            <BarChart3 size={26} color="#fff" />
          </Box>

          <Box>
            <Typography
              sx={{ fontSize: 30, fontWeight: 900, color: "#0f172a" }}>
              Stock Analytics Dashboard
            </Typography>

            <Typography sx={{ color: "#6b7280", fontSize: 14 }}>
              Track stock, sales and category performance in one clean view.
            </Typography>
          </Box>
        </Box>

        {/* ---------------- RIGHT: Filter Button ---------------- */}
        <Box sx={{ position: "relative" }}>
          <Button
            onClick={() => setOpen(!open)}
            variant="outlined"
            sx={{
              color: "gray",
              px: 2.5,
              py: 1,
              borderRadius: "999px",
              fontWeight: 700,
              background: "rgba(255,255,255,0.95)",
              borderColor: "rgba(200,200,200,0.8)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.10)",
            }}
            startIcon={<Filter size={16} />}>
            <Typography fontWeight={700}>Filter</Typography>
          </Button>

          {/* filter popUp */}
          <Fade in={open}>
            <Paper
              elevation={6}
              sx={{
                position: "absolute",
                right: 0,
                top: 55,
                width: 300,
                p: 2,
                borderRadius: 3,
                background: "white",
                boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
                border: "1px solid #e2e8f0",
                zIndex: 2000, // ✅ inside header's stacking context, still above everything in it
              }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1 }}>
                Filter Options
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                  mb: 2,
                }}>
                {/* DATE */}
                <TextField
                  type="date"
                  label="Date"
                  size="small"
                  value={tmpDate}
                  onChange={(e) => setTmpDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />

                {/* CATEGORY */}
                <FormControl size="small">
                  <Select
                    value={tmpCategory}
                    onChange={(e) => setTmpCategory(e.target.value)}>
                    <MenuItem value="all">All Categories</MenuItem>
                    {CATEGORY_KEYS.map((k) => (
                      <MenuItem key={k} value={k}>
                        {CATEGORY_LABELS[k]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="outlined" onClick={cancelFilter}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={applyFilter}>
                  Apply
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Box>
      </Paper>
      {/* // SUMMARY CARDS */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {/* PRODUCTS */}
        <StatCard
          label="Products"
          value={totalProducts}
          Icon={Package}
          accent={{
            background:
              "linear-gradient(135deg, #E4ECFF 0%, #C3D4FF 40%, #9AB7FF 100%)",
            labelColor: "#2347C5",
            valueColor: "#0A1A3B",
            iconBg: "rgba(35,71,197,0.22)",
            iconColor: "#2347C5",
          }}
        />

        {/* TOTAL UNITS */}
        <StatCard
          label="Total Units"
          value={totalUnits}
          Icon={Boxes}
          accent={{
            background:
              "linear-gradient(135deg, #D9FFE8 0%, #B9F5DA 40%, #9AE6C7 100%)",
            labelColor: "#0B815A",
            valueColor: "#073B2A",
            iconBg: "rgba(11,129,90,0.22)",
            iconColor: "#0B815A",
          }}
        />

        {/* STOCK VALUE */}
        <StatCard
          label="Stock Value"
          value={`₹ ${totalValue.toLocaleString("en-IN")}`}
          Icon={CircleDollarSign}
          accent={{
            background:
              "linear-gradient(135deg, #FFEBD6 0%, #FFD3A8 40%, #FFC48D 100%)",
            labelColor: "#C05621",
            valueColor: "#7A3410",
            iconBg: "rgba(192,86,33,0.22)",
            iconColor: "#C05621",
          }}
        />
      </Box>
    </Box>
  );
}
