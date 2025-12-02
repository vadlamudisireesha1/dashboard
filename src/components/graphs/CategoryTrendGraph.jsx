import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  TextField,
  Fade,
  Chip,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { LineChart as LineChartIcon, Calendar } from "lucide-react";
import {
  CATEGORY_KEYS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  getCategorySalesTrend,
} from "./graphUtils";

const HIGHLIGHT_BLUE = "#0098FF";

export default function CategoryTrendGraph({ items }) {
  const [selected, setSelected] = useState(new Set(CATEGORY_KEYS));
  const [range, setRange] = useState("all");
  const [customOpen, setCustomOpen] = useState(false);

  // Custom date state
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const data = getCategorySalesTrend(items);

  // -------------------------------
  //     FILTERING LOGIC
  // -------------------------------
  const applyCustomRange = () => {
    if (!fromDate || !toDate) return;
    setRange("custom");
    setCustomOpen(false);
  };

  const cancelCustom = () => {
    setFromDate("");
    setToDate("");
    setCustomOpen(false);
  };

  const getDisplayedData = () => {
    if (range === "all") return data;

    // pre-set ranges
    if (["7", "15", "30"].includes(range)) {
      const n = Number(range);
      if (!data || data.length <= n) return data;
      return data.slice(data.length - n);
    }

    // custom range filtering
    if (range === "custom" && fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);

      return data.filter((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate >= from && entryDate <= to;
      });
    }

    return data;
  };

  const displayedData = getDisplayedData();

  // -------------------------------
  //   TOGGLE CATEGORY CHIP
  // -------------------------------
  const toggleCategory = (key) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        background: "white",
        borderRadius: 4,
        p: 3.5,
        boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
        position: "relative",
      }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}>
        <Box>
          <Typography
            variant="h6"
            sx={{
              m: 0,
              fontSize: 22,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}>
            <LineChartIcon size={18} strokeWidth={2.2} />
            Multi-Category Sales Comparison
          </Typography>
          <Typography sx={{ m: 0, color: "#64748b", fontSize: 13, mt: 0.5 }}>
            Compare trends across all product groups.
          </Typography>
        </Box>

        {/* FILTER BUTTONS ROW */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            ml: "auto",
            flexWrap: "wrap",
          }}>
          {/* RANGE BUTTONS */}
          <ToggleButtonGroup
            exclusive
            value={range}
            onChange={(_, v) => {
              if (v) {
                setRange(v);
                setCustomOpen(false);
              }
            }}
            sx={{
              display: "flex",
              gap: "8px",
              "& .MuiToggleButton-root": {
                height: 32,
                px: 1.5,
                borderRadius: "50px !important",
                border: "1px solid #dce1e8 !important",
                backgroundColor: "white",
                textTransform: "none",
                fontSize: "13px",
                color: "#0f172a",
                "&.Mui-selected": {
                  backgroundColor: `${HIGHLIGHT_BLUE} !important`,
                  color: "white !important",
                  borderColor: `${HIGHLIGHT_BLUE} !important`,
                },
                "&:hover": {
                  backgroundColor: "#f1f5f9",
                },
              },
            }}>
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="7">Last 7 days</ToggleButton>
            <ToggleButton value="15">Last 15 days</ToggleButton>
            <ToggleButton value="30">Last 30 days</ToggleButton>
          </ToggleButtonGroup>

          {/* CUSTOM BUTTON */}
          <Button
            onClick={() => {
              setCustomOpen((p) => !p);
              setRange("custom");
            }}
            sx={{
              height: 32,
              px: 1.5,
              borderRadius: "50px",
              border: "1px solid #dce1e8",
              backgroundColor: range === "custom" ? HIGHLIGHT_BLUE : "white",
              color: range === "custom" ? "white" : "#0f172a",
              fontSize: "13px",
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&:hover": {
                backgroundColor: range === "custom" ? "#0078d1" : "#f1f5f9",
              },
            }}>
            <Calendar size={16} />
            Custom
          </Button>
        </Box>
      </Box>

      {/* CUSTOM RANGE POPUP */}
      <Fade in={customOpen}>
        <Paper
          elevation={4}
          sx={{
            position: "absolute",
            right: 32,
            top: 90,
            p: 2.5,
            borderRadius: 3,
            backgroundColor: "rgba(255,255,255,0.98)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(230,230,230,0.7)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
            width: 280,
            zIndex: 30,
          }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1.5 }}>
            Select Date Range
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {/* From Date */}
            <TextField
              label="From"
              type="date"
              size="small"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#f8fafc",
                },
              }}
            />

            {/* To Date */}
            <TextField
              label="To"
              type="date"
              size="small"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#f8fafc",
                },
              }}
            />
          </Box>

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
            }}>
            <Button
              variant="outlined"
              onClick={cancelCustom}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontSize: 13,
              }}>
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={applyCustomRange}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontSize: 13,
                backgroundColor: HIGHLIGHT_BLUE,
                "&:hover": { backgroundColor: "#0078d1" },
              }}>
              Apply
            </Button>
          </Box>
        </Paper>
      </Fade>

      {/* Category Chips */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          mb: 2,
          mt: 1,
        }}>
        {CATEGORY_KEYS.map((key) => (
          <Chip
            key={key}
            clickable
            onClick={() => toggleCategory(key)}
            label={CATEGORY_LABELS[key]}
            variant="filled"
            sx={{
              borderRadius: "999px",
              px: 1.5,
              py: 0.25,
              backgroundColor: "#e5f3ff",
              color: "#0f172a",
              fontSize: 13,
              "&:hover": {
                backgroundColor: "#d7ecff",
              },
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              ".MuiChip-label": {
                display: "flex",
                alignItems: "center",
                gap: 0.75,
              },
            }}
            icon={
              <Box
                component="span"
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: CATEGORY_COLORS[key],
                }}
              />
            }
          />
        ))}
      </Box>

      {/* Graph */}
      <Box sx={{ width: "100%", height: 360 }}>
        <ResponsiveContainer>
          <LineChart data={displayedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />

            {CATEGORY_KEYS.filter((k) => selected.has(k)).map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={CATEGORY_LABELS[key]}
                stroke={CATEGORY_COLORS[key]}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
                animationDuration={1200}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
