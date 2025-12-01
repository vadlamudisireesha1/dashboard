import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  TextField,
  Fade,
} from "@mui/material";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, Calendar } from "lucide-react";
import { getStockVsSalesByCategory } from "./graphUtils";

const HIGHLIGHT_BLUE = "#0098FF";

export default function StockVsSalesGraph({ items }) {
  const [range, setRange] = useState("all");
  const [customOpen, setCustomOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // NOTE: no date in this data, so range does NOT change numbers.
  const baseData = getStockVsSalesByCategory(items);
  const filteredData = baseData || [];

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

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3.5,
        borderRadius: 4,
        background: "white",
        boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
        position: "relative",
      }}>
      {/* HEADER */}
      <Typography
        variant="h6"
        sx={{
          fontSize: 22,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}>
        <BarChart3 size={20} />
        Stock vs Sales Comparison
      </Typography>
      <Typography sx={{ color: "#64748b", fontSize: 13, mb: 1 }}>
        Compare total stock units vs total units sold for each category.
      </Typography>

      {/* FILTER ROW (UI ONLY, same style as other graphs) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
          flexWrap: "wrap",
          mt: 1,
          mb: 2,
        }}>
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
            gap: "11px",
            "& .MuiToggleButton-root": {
              height: 32,
              px: 1.2,
              borderRadius: "999px",
              border: "1px solid #dce1e8 !important",
              background: "white",
              textTransform: "none",
              fontSize: "13px",
              color: "#0f172a",
              "&.Mui-selected": {
                background: HIGHLIGHT_BLUE + " !important",
                color: "white !important",
                borderColor: HIGHLIGHT_BLUE + " !important",
              },
              "&:hover": {
                background: "#f1f5f9",
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
            height: 32,
            px: 2,
            borderRadius: "999px",
            border: "1px solid #dce1e8",
            background: range === "custom" ? HIGHLIGHT_BLUE : "white",
            color: range === "custom" ? "white" : "#0f172a",
            fontSize: "13px",
            textTransform: "none",
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&:hover": {
              background: range === "custom" ? "#0284c7" : "#f1f5f9",
            },
          }}>
          <Calendar size={16} />
          Custom
        </Button>
      </Box>

      <Fade in={customOpen}>
        <Paper
          elevation={4}
          sx={{
            position: "absolute",
            right: 28,
            top: 110,
            p: 2.2,
            borderRadius: 3,
            width: 280,
            boxShadow: "0 16px 40px rgba(15,23,42,0.18)",
            border: "1px solid #e2e8f0",
            background: "rgba(255,255,255,0.98)",
            backdropFilter: "blur(10px)",
            zIndex: 20,
          }}>
          <Typography
            sx={{ fontSize: 14, fontWeight: 600, mb: 1.5, color: "#0f172a" }}>
            Custom Date Range
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
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
                background: HIGHLIGHT_BLUE,
                "&:hover": { background: "#0284c7" },
              }}>
              Apply
            </Button>
          </Box>
        </Paper>
      </Fade>

      {/* CHART */}
      <Box sx={{ width: "100%", height: 320, mt: 1 }}>
        <ResponsiveContainer>
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar
              dataKey="stock"
              name="Stock Units"
              fill="#0ea5e9"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="sold"
              name="Sold Units"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
