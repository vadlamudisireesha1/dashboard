// SalesLineGraph.jsx
import React, { useState, useMemo } from "react";
import Avatar from "@mui/material/Avatar";
import { alpha } from "@mui/material/styles";

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
import {
  CATEGORY_KEYS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  filterItemsByCategory,
  buildFullDateSpan,
  buildLastNDaysSpan,
  filterItemsByDateRange,
  getAvailableDates,
  dateKey,
} from "./graphUtils";
import { Calendar, TrendingUp } from "lucide-react";

export default function SalesLineGraph({ items }) {
  const [category, setCategory] = useState("all");
  const [range, setRange] = useState("30");
  const [customOpen, setCustomOpen] = useState(false);

  const [tmpMode, setTmpMode] = useState("range");
  const [tmpFrom, setTmpFrom] = useState("");
  const [tmpTo, setTmpTo] = useState("");
  const [tmpDate, setTmpDate] = useState("");
  const [committedCustom, setCommittedCustom] = useState(null);

  const availableDates = useMemo(() => getAvailableDates(items), [items]);
  const minAvailable = availableDates[0] || "";
  const maxAvailable = availableDates[availableDates.length - 1] || "";

  const categoryFilteredItems = useMemo(
    () => filterItemsByCategory(items || [], category),
    [items, category]
  );

  const trimmedItems = useMemo(() => {
    if (range === "custom" && committedCustom) {
      if (committedCustom.mode === "single") {
        return filterItemsByDateRange(categoryFilteredItems, {
          date: committedCustom.date,
        });
      } else {
        return filterItemsByDateRange(categoryFilteredItems, {
          from: committedCustom.from,
          to: committedCustom.to,
        });
      }
    }
    return categoryFilteredItems;
  }, [range, committedCustom, categoryFilteredItems]);

  const buildDates = (trimmed) => {
    if (range === "custom" && committedCustom) {
      if (committedCustom.mode === "single" && committedCustom.date)
        return [committedCustom.date];
      if (
        committedCustom.mode === "range" &&
        committedCustom.from &&
        committedCustom.to
      ) {
        const span = buildFullDateSpan(trimmed || []);
        return span.filter(
          (d) => d >= committedCustom.from && d <= committedCustom.to
        );
      }
    }
    if (range === "all") return buildFullDateSpan(categoryFilteredItems);
    if (["7", "15", "30", "90"].includes(range))
      return buildLastNDaysSpan(categoryFilteredItems, Number(range));
    return buildFullDateSpan(categoryFilteredItems);
  };

  const data = useMemo(() => {
    const dates = buildDates(trimmedItems);
    if (!dates || !dates.length) return [];
    return dates.map((date) => {
      const units = (trimmedItems || []).reduce((sum, item) => {
        const entry = (item.salesHistory || []).find(
          (s) => dateKey(s?.date) === date
        );
        return sum + Number(entry?.unitsSold || 0);
      }, 0);
      return { date, units };
    });
  }, [trimmedItems, range, committedCustom, categoryFilteredItems]);

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

  const currentColor = category === "all" ? "#0098FF" : CATEGORY_COLORS[category];

  if (!data || data.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          No daily sales data for the selected filters
        </Typography>
        <Typography variant="body2">
          Try a broader date range or a different category.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, position: "relative" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "center",
          mb: 2.5,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontSize: 24,
              fontWeight: 900,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TrendingUp size={22} /> Daily Sales Trend
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: 14 }}>
            Visualize sales movement over selected days.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FormControl size="small">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{
                minWidth: 140,
                "& .MuiSelect-select": {
                  transition: "transform 0.12s ease",
                },
                "&:hover": { transform: "translateY(-2px)" },
                "&:active": { transform: "scale(0.99)" },
              }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {CATEGORY_KEYS.map((key) => (
                <MenuItem key={key} value={key}>
                  {CATEGORY_LABELS[key]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
    {/* <-- small change: ensure clicking the Custom toggle toggles popup even when already selected */}
    <ToggleButton
      value="custom"
      onClick={(e) => {
        e.stopPropagation();
        // if the toggle is already selected, ToggleButtonGroup won't fire onChange,
        // so toggle the popup manually
        if (range === "custom") {
          setCustomOpen((s) => !s);
        }
      }}
    >
      <Calendar size={16} />
      &nbsp;Custom
    </ToggleButton>
  </ToggleButtonGroup>
</Box>

        </Box>
      </Box>

      {/* Custom popup: stopPropagation on root so clicks don't bubble up to header */}
      <Fade in={customOpen}>
  <Paper
    elevation={4}
    sx={{
      position: "absolute",
      right: 30,
      top: 120,
      p: 2.5,
      borderRadius: 3,
      width: 320,
      zIndex: 9999,
      pointerEvents: "auto",
    }}
    onClick={(e) => e.stopPropagation()}
  >
    <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 2 }}>
      <Calendar size={16} />{" "}
      Custom Date
    </Typography>

    {/* RANGE ONLY - keeps availableDates restrictions */}
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
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
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
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
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


      <Box sx={{ width: "100%", height: 380, mt: 2 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="units"
              name="Units Sold"
              stroke={currentColor}
              strokeWidth={3}
              dot={true}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
