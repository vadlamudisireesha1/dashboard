// src/components/graphs/PieChartGraph.jsx
import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart as PieChartIcon, RefreshCw } from "lucide-react";
import {
  Button,
  Paper,
  Typography,
  Box,
  Fade,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  IconButton,
  alpha,
  Chip,
} from "@mui/material";
import { Calendar } from "lucide-react";
import {
  getCategoryDistribution,
  filterItemsByDateRange,
  getAvailableDates,
} from "./graphUtils";

// replace or import CATEGORY_COLORS if you use it for chips elsewhere
// import { CATEGORY_COLORS } from "../constants"; // if you have it

export default function PieChartGraph({ items }) {
  const [activeSlice, setActiveSlice] = useState(null);

  const [customOpen, setCustomOpen] = useState(false);
  const [tmpMode, setTmpMode] = useState("range");
  const [tmpFrom, setTmpFrom] = useState("");
  const [tmpTo, setTmpTo] = useState("");
  const [tmpDate, setTmpDate] = useState("");
  const [committedCustom, setCommittedCustom] = useState(null);

  const availableDates = useMemo(() => getAvailableDates(items), [items]);
  const minAvailable = availableDates[0] || "";
  const maxAvailable = availableDates[availableDates.length - 1] || "";

  const trimmed = useMemo(() => {
    if (committedCustom) {
      if (committedCustom.mode === "single") {
        return filterItemsByDateRange(items || [], { date: committedCustom.date });
      } else {
        return filterItemsByDateRange(items || [], { from: committedCustom.from, to: committedCustom.to });
      }
    }
    return items;
  }, [items, committedCustom]);

  const distribution = useMemo(() => getCategoryDistribution(trimmed || []), [trimmed]);
  const totalUnits = distribution.reduce((sum, d) => sum + (d.value || 0), 0);

  const resetPie = () => setActiveSlice(null);

  const applyCustom = () => {
    if (tmpMode === "single" && tmpDate) {
      setCommittedCustom({ mode: "single", date: tmpDate });
      setCustomOpen(false);
    } else if (tmpMode === "range" && tmpFrom && tmpTo) {
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

  // stopPropagation helper for inline handlers
  const stop = (e) => {
    e.stopPropagation();
    if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation && e.nativeEvent.stopImmediatePropagation();
  };

  return (
    <Paper
      onClick={stop}
      onMouseDown={stop}
      elevation={0}
      sx={{
        background: "#fff",
        borderRadius: 3.5,
        p: 3.5,
        boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PieChartIcon size={18} strokeWidth={2.2} />
          <Typography component="h2" sx={{ fontSize: 22, fontWeight: 800 }}>
            Stock Distribution
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            aria-label="reset"
            onClick={(e) => { stop(e); resetPie(); }}
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "transparent",
              border: "1px solid",
              borderColor: "divider",
              "&:hover": { transform: "translateY(-3px)" },
              transition: "transform 140ms ease, background 140ms",
            }}
          >
            <RefreshCw size={16} strokeWidth={2} />
          </IconButton>

          <Button
            variant="outlined"
            onClick={(e) => { stop(e); setCustomOpen((p) => !p); }}
            sx={{
              borderRadius: 2,
              px: 1.5,
              py: 0.6,
              textTransform: "none",
              minWidth: 92,
              display: "flex",
              gap: 1,
              alignItems: "center",
              transition: "transform .12s ease, background .12s ease",
              "&:hover": { transform: "translateY(-3px)" },
              "&:active": { transform: "scale(0.98)" },
            }}
          >
            <Calendar size={14} /> <Box component="span">Custom</Box>
          </Button>
        </Box>
      </Box>

      <Typography sx={{ color: "text.secondary", fontSize: 13, mb: 1 }}>
        How stock is divided across product categories.
      </Typography>

      {/* Chart area */}
      <Box sx={{ width: "100%", height: 220, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={distribution}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={105}
              paddingAngle={2}
              label={false}
              labelLine={false}
            >
              {distribution.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                  style={{ cursor: "pointer", transition: "transform 180ms ease, filter 160ms ease" }}
                  onMouseEnter={(e) => { stop(e); setActiveSlice(entry); }}
                  onMouseLeave={(e) => { stop(e); setActiveSlice(null); }}
                  onClick={(e) => { stop(e); setActiveSlice(entry); }}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Legend (responsive grid-like chips) */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 1.5,
          fontSize: 12,
          color: "text.primary",
          mt: 1,
          mb: 1,
        }}
      >
        {distribution.map((entry) => (
          <Chip
            key={entry.name}
            size="small"
            label={entry.name}
            avatar={
              <Box
                component="span"
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: entry.color,
                  display: "inline-block",
                }}
                aria-hidden
              />
            }
            sx={{
              borderRadius: 2,
              px: 1,
              py: 0.35,
              backgroundColor: activeSlice && activeSlice.name === entry.name ? alpha(entry.color, 0.12) : alpha("#f1f5f9", 0.9),
              color: activeSlice && activeSlice.name === entry.name ? entry.color : "text.primary",
              fontWeight: 600,
              fontSize: 13,
              transition: "transform 140ms ease, background 140ms ease, color 140ms ease",
              "&:hover": { transform: "translateY(-2px)" },
              "& .MuiChip-avatar": {
                marginLeft: 0,
                marginRight: 0.65,
                width: 10,
                height: 10,
              },
            }}
          />
        ))}
      </Box>

      {/* details area */}
      <Box sx={{ mt: 1, pt: 2, borderTop: "1px dashed", borderColor: "divider", fontSize: 14, color: "text.primary", minHeight: 56 }}>
        {activeSlice ? (
          <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.75)", minWidth: 220, display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: activeSlice.color }} />
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{activeSlice.name}</Typography>
            </Box>
            <Typography sx={{ fontSize: 15, color: "text.secondary", mt: 0.5 }}>
              Units: <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>{activeSlice.value.toLocaleString("en-IN")}</Box>
            </Typography>
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
              Percentage: <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>{totalUnits ? ((activeSlice.value / totalUnits) * 100).toFixed(1) : 0}%</Box>
            </Typography>
          </Box>
        ) : (
          <Typography sx={{ color: "text.disabled", fontSize: 13 }}>Hover or click a slice to view category details.</Typography>
        )}
      </Box>

      {/* Popup (absolute) */}
     <Fade in={customOpen}>
  <Paper
    elevation={6}
    sx={{
      position: "absolute",
      right: 28,
      top: 0,
      width: 340,
      p: 2,
      zIndex: 99999,
      pointerEvents: "auto",
      borderRadius: 2,
    }}
    onClick={stop}
    onMouseDown={stop}
  >
    <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 1 }}>
      Custom Date
    </Typography>

    {/* RANGE ONLY - WITH AVAILABLE DATES RESTRICTIONS */}
    <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
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
        onClick={stop}
        onMouseDown={stop}
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
        onClick={stop}
        onMouseDown={stop}
      />
    </Box>

    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
      <Button
        variant="outlined"
        onClick={(e) => {
          stop(e);
          cancelCustom();
        }}
        fullWidth
        onMouseDown={stop}
      >
        Cancel
      </Button>

      <Button
        variant="contained"
        fullWidth
        onClick={(e) => {
          stop(e);
          applyCustom();
        }}
        onMouseDown={stop}
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

    </Paper>
  );
}
