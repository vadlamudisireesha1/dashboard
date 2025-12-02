// StockVsSalesGraph.jsx
import React, { useState, useMemo } from "react";

import { Box, Paper, Typography, ToggleButtonGroup, ToggleButton, Button, TextField, Fade } from "@mui/material";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from "recharts";
import { BarChart3, Calendar } from "lucide-react";
import { getStockVsSalesByCategory, filterItemsByDateRange, getAvailableDates } from "./graphUtils";

export default function StockVsSalesGraph({ items }) {
  const [range, setRange] = useState("all");
  const [customOpen, setCustomOpen] = useState(false);

  const [tmpMode, setTmpMode] = useState("range");
  const [tmpFrom, setTmpFrom] = useState("");
  const [tmpTo, setTmpTo] = useState("");
  const [tmpDate, setTmpDate] = useState("");
  const [committedCustom, setCommittedCustom] = useState(null);

  const availableDates = useMemo(() => getAvailableDates(items), [items]);
  const minAvailable = availableDates[0] || "";
  const maxAvailable = availableDates[availableDates.length - 1] || "";

  const trimmedItems = useMemo(() => {
    if (range === "custom" && committedCustom) {
      if (committedCustom.mode === "single") {
        return filterItemsByDateRange(items || [], { date: committedCustom.date });
      } else {
        return filterItemsByDateRange(items || [], { from: committedCustom.from, to: committedCustom.to });
      }
    }
    return items;
  }, [range, committedCustom, items]);

  const baseData = useMemo(() => getStockVsSalesByCategory(trimmedItems || []), [trimmedItems]);
  const filteredData = baseData || [];

  const applyCustomRange = () => {
    if (tmpMode === "single" && tmpDate) {
      setCommittedCustom({ mode: "single", date: tmpDate });
      setCustomOpen(false);
      return;
    }
    if (tmpMode === "range" && tmpFrom && tmpTo) {
      setCommittedCustom({ mode: "range", from: tmpFrom, to: tmpTo });
      setCustomOpen(false);
    }
  };

  const cancelCustom = () => {
    setTmpFrom("");
    setTmpTo("");
    setTmpDate("");
    setTmpMode("range");
    setCustomOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3.5, borderRadius: 4, background: "white", boxShadow: "0 12px 40px rgba(0,0,0,0.06)", position: "relative" }}>
      <Typography variant="h6" sx={{ fontSize: 22, fontWeight: 800, display: "flex", alignItems: "center", gap: 1 }}>
        <BarChart3 size={20} /> Stock vs Sales Comparison
      </Typography>
      <Typography sx={{ color: "#64748b", fontSize: 13, mb: 1 }}>Compare total stock units vs total units sold for each category.</Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, flexWrap: "wrap", mt: 1, mb: 2 }}>
        <Box sx={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap", marginLeft: "auto" }}>
  <ToggleButtonGroup
    exclusive
    value={range}
    onChange={(_, v) => {
      if (!v) return;
      setRange(v);
      if (v === "custom") {
        setCustomOpen(true);
        setCommittedCustom(null);
      } else {
        setCustomOpen(false);
        setCommittedCustom(null);
      }
    }}
    onClick={(e) => e.stopPropagation()}
    sx={{
      display: "flex",
      gap: 1.25,
      "& .MuiToggleButton-root": {
        borderRadius: "10px",
        px: 1.6,
        py: 0.6,
        minWidth: 56,
        textTransform: "none",
        fontWeight: 600,
        transition: "background 180ms ease, transform 140ms ease, color 140ms",
        "&:hover": { transform: "translateY(-3px)" },
        "&.Mui-selected": {
          // selected toggle style (soft blue glow + slightly darker bg)
          background: "linear-gradient(180deg, rgba(94,166,238,0.14), rgba(94,166,238,0.10))",
          color: "rgb(13,60,97)",
          boxShadow: "0 4px 12px rgba(94,166,238,0.12)",
        },
        "&:active": { transform: "scale(0.985)" },
      },
    }}
  >
    <ToggleButton value="all">All</ToggleButton>
    <ToggleButton value="7">7d</ToggleButton>
    <ToggleButton value="15">15d</ToggleButton>
    <ToggleButton value="30">30d</ToggleButton>
    <ToggleButton value="custom"><Calendar size={16} />&nbsp;Custom</ToggleButton>
  </ToggleButtonGroup>
</Box>


         
      </Box>
{/* open custom */}
      <Fade in={customOpen}>
  <Paper
    elevation={4}
    sx={{
      position: "absolute",
      right: 28,
      top: 110,
      p: 2.2,
      borderRadius: 3,
      width: 320,
      zIndex: 9999,
      pointerEvents: "auto",
    }}
    onClick={(e) => e.stopPropagation()}
  >
    <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1.5 }}>
      Custom Date
    </Typography>

    {/* RANGE ONLY (single-date and toggle removed) */}
    <Box sx={{ display: "flex", gap: 1 }}>
      <TextField
        type="date"
        label="From"
        size="small"
        value={tmpFrom}
        onChange={(e) => setTmpFrom(e.target.value)}
        InputLabelProps={{ shrink: true }}
        inputProps={
          availableDates.length
            ? { min: availableDates[0], max: availableDates[availableDates.length - 1] }
            : {}
        }
        sx={{ flex: 1 }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      />

      <TextField
        type="date"
        label="To"
        size="small"
        value={tmpTo}
        onChange={(e) => setTmpTo(e.target.value)}
        InputLabelProps={{ shrink: true }}
        inputProps={
          availableDates.length
            ? { min: availableDates[0], max: availableDates[availableDates.length - 1] }
            : {}
        }
        sx={{ flex: 1 }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      />
    </Box>

    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
      <Button
        variant="outlined"
        onClick={(e) => { e.stopPropagation(); cancelCustom(); }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        Cancel
      </Button>

      <Button
        variant="contained"
        onClick={(e) => { e.stopPropagation(); applyCustomRange(); }}
        onMouseDown={(e) => e.stopPropagation()}
        disabled={
          !(
            tmpFrom &&
            tmpTo &&
            tmpFrom <= tmpTo &&
            availableDates.length &&
            tmpFrom >= availableDates[0] &&
            tmpTo <= availableDates[availableDates.length - 1]
          )
        }
      >
        Apply
      </Button>
    </Box>
  </Paper>
</Fade>


      <Box sx={{ width: "100%", height: 320, mt: 1 }}>
        <ResponsiveContainer>
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="stock" name="Stock Units" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
            <Bar dataKey="sold" name="Sold Units" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
