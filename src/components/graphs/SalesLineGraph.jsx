import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  TextField,
  Fade,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Calendar, TrendingUp, ListFilter } from "lucide-react";

import {
  CATEGORY_KEYS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  filterItemsByCategory,
  buildFullDateSpan,
} from "./graphUtils";

const HIGHLIGHT_BLUE = "#0098FF";

export default function SalesLineGraph({ items }) {
  const [category, setCategory] = useState("all");
  const [range, setRange] = useState("all");
  const [customOpen, setCustomOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ---------- DATA BUILD ----------
  const baseData = useMemo(() => {
    const filtered = filterItemsByCategory(items, category);
    if (!filtered?.length) return [];

    const dates = buildFullDateSpan(filtered);
    return dates.map((date) => {
      const units = filtered.reduce((sum, item) => {
        const entry = item.salesHistory?.find((s) => s.date === date);
        return sum + Number(entry?.unitsSold || 0);
      }, 0);

      return { date, units };
    });
  }, [items, category]);

  const filteredData = useMemo(() => {
    if (!baseData.length) return [];

    if (range === "all") return baseData;

    if (["7", "15", "30"].includes(range)) {
      const n = Number(range);
      return baseData.slice(-n);
    }

    if (range === "custom" && fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      return baseData.filter((d) => {
        const date = new Date(d.date);
        return date >= from && date <= to;
      });
    }

    return baseData;
  }, [baseData, range, fromDate, toDate]);

  const applyCustomRange = () => {
    if (fromDate && toDate) {
      setRange("custom");
      setCustomOpen(false);
    }
  };

  const cancelCustom = () => {
    setFromDate("");
    setToDate("");
    setCustomOpen(false);
  };

  const currentColor =
    category === "all" ? HIGHLIGHT_BLUE : CATEGORY_COLORS[category];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 4,
        background: "linear-gradient(180deg,#ffffff,#f8fbff)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
        position: "relative",
        border: "1px solid #eef3f8",
      }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "center",
          mb: 2.5,
          gap: 2,
        }}>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontSize: 24,
              fontWeight: 900,
              display: "flex",
              alignItems: "center",
              gap: 1,
              letterSpacing: "-0.5px",
            }}>
            <TrendingUp size={22} />
            Daily Sales Trend
          </Typography>

          <Typography sx={{ color: "#64748b", fontSize: 14 }}>
            Visualize sales movement over selected days.
          </Typography>
        </Box>

        {/* SELECTED CATEGORY WITH DROPDOWN */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            background: "rgba(0,152,255,0.08)",
            px: 1.5,
            py: 1,
            borderRadius: "14px",
            border: "1px solid rgba(0,152,255,0.2)",
          }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#475569" }}>
            Selected:
          </Typography>

          <FormControl size="small">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{
                minWidth: 140,
                borderRadius: "10px",
                background: "#ffffff",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "transparent",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#cbd5e1",
                },
                fontSize: 14,
                fontWeight: 500,
                px: 0.5,
              }}>
              <MenuItem value="all">All Categories</MenuItem>
              {CATEGORY_KEYS.map((key) => (
                <MenuItem key={key} value={key}>
                  {CATEGORY_LABELS[key]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* FILTER CONTROLS */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}>
        {/* RANGE BUTTONS */}
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            alignItems: "center",
            flexWrap: "wrap",
            ml: "auto",
          }}>
          <ToggleButtonGroup
            exclusive
            value={range}
            onChange={(_, v) => v && (setRange(v), setCustomOpen(false))}
            sx={{
              display: "flex",
              gap: "10px",
              "& .MuiToggleButton-root": {
                height: 34,
                px: 1.2,
                borderRadius: "999px",
                border: "1px solid #d5e0ec !important",
                background: "white",
                textTransform: "none",
                fontSize: 13,
                "&.Mui-selected": {
                  background: HIGHLIGHT_BLUE + " !important",
                  color: "white",
                  borderColor: HIGHLIGHT_BLUE + " !important",
                },
              },
            }}>
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="7">Last 7 days</ToggleButton>
            <ToggleButton value="15">Last 15 days</ToggleButton>
            <ToggleButton value="30">Last 30 days</ToggleButton>
          </ToggleButtonGroup>

          <Button
            onClick={() => setCustomOpen((p) => !p)}
            sx={{
              height: 34,
              px: 2,
              display: "flex",
              gap: "4px",
              borderRadius: "999px",
              border: "1px solid #d5e0ec",
              background: range === "custom" ? HIGHLIGHT_BLUE : "white",
              color: range === "custom" ? "white" : "#0f172a",
              fontSize: 13,
              "&:hover": {
                background: range === "custom" ? "#0284c7" : "#f1f5f9",
              },
            }}>
            <Calendar size={16} />
            Custom
          </Button>
        </Box>
      </Box>

      {/* CUSTOM DATE POPUP */}
      <Fade in={customOpen}>
        <Paper
          elevation={4}
          sx={{
            position: "absolute",
            right: 30,
            top: 120,
            p: 2.5,
            borderRadius: 3,
            width: 290,
            boxShadow: "0 18px 45px rgba(15,23,42,0.18)",
            border: "1px solid #e2e8f0",
            background: "white",
            backdropFilter: "blur(10px)",
            zIndex: 30,
          }}>
          <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 2 }}>
            Custom Date Range
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="From"
              type="date"
              size="small"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="To"
              type="date"
              size="small"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
            }}>
            <Button
              variant="outlined"
              onClick={cancelCustom}
              sx={{ borderRadius: 2, fontSize: 13 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={applyCustomRange}
              sx={{
                borderRadius: 2,
                background: HIGHLIGHT_BLUE,
                fontSize: 13,
                "&:hover": { background: "#0284c7" },
              }}>
              Apply
            </Button>
          </Box>
        </Paper>
      </Fade>

      {/* CHART */}
      <Box sx={{ width: "100%", height: 380, mt: 2 }}>
        <ResponsiveContainer>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 13 }} />
            <Line
              type="monotone"
              dataKey="units"
              name="Units Sold"
              stroke={currentColor}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
