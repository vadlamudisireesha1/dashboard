import React, { useMemo, useState } from "react";
import { Box, Grid, Typography, Select, MenuItem } from "@mui/material";

import GraphSales from "./graphs/GraphSales";
import GraphCategory from "./graphs/GraphCategory";
import GraphGauge from "./graphs/GraphGauge";

import {
  mergeAllItems,
  filterByCategory,
  getCategoryDistribution,
  getSalesTrend,
  getTotalStockValue,
  getTotalUnits,
} from "./analyticUtils";

// JSON data imports
import nonveg from "../../data/nonveg.json";
import vegetable from "../../data/vegetable.json";
import powders from "../../data/powders.json";
import millets from "../../data/millets.json";
import readytoeat from "../../data/readytoeat.json";
import organic from "../../data/organic.json";

export default function AnalyticsDashboard() {
  // merge all items from all categories
  const allItems = useMemo(
    () =>
      mergeAllItems(nonveg, vegetable, powders, millets, readytoeat, organic),
    []
  );

  const [filter, setFilter] = useState({
    category: "all",
    range: 30,
  });

  const filteredItems = useMemo(
    () => filterByCategory(allItems, filter.category),
    [allItems, filter.category]
  );

  const totalValue = useMemo(
    () => getTotalStockValue(filteredItems),
    [filteredItems]
  );

  const totalUnits = useMemo(
    () => getTotalUnits(filteredItems),
    [filteredItems]
  );

  const salesTrend = useMemo(
    () => getSalesTrend(filteredItems, Number(filter.range)),
    [filteredItems, filter.range]
  );

  const categoryData = useMemo(
    () => getCategoryDistribution(filteredItems),
    [filteredItems]
  );

  // if no items or no sales data, we still show clean UI
  const hasData = filteredItems.length > 0;

  return (
    <Box sx={{ px: 4, pb: 5, pt: 4, background: "#fffbf5ff" }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          fontWeight={900}
          sx={{ color: "#1e293b", letterSpacing: "-0.5px" }}>
          📊 Stock Analytics
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            mt: 2,
            flexWrap: "wrap",
          }}>
          <Box
            sx={{
              bgcolor: "#f1f5f9",
              px: 3,
              py: 1.5,
              borderRadius: 2,
              minWidth: 160,
            }}>
            <Typography sx={{ fontSize: "0.85rem", color: "#64748b" }}>
              Products (filtered)
            </Typography>
            <Typography
              sx={{ fontWeight: 800, fontSize: "1.3rem", color: "#0f172a" }}>
              {filteredItems.length}
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: "#ecfdf5",
              px: 3,
              py: 1.5,
              borderRadius: 2,
              minWidth: 160,
            }}>
            <Typography sx={{ fontSize: "0.85rem", color: "#166534" }}>
              Total Units
            </Typography>
            <Typography
              sx={{ fontWeight: 800, fontSize: "1.3rem", color: "#15803d" }}>
              {totalUnits}
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: "#fef3c7",
              px: 3,
              py: 1.5,
              borderRadius: 2,
              minWidth: 180,
            }}>
            <Typography sx={{ fontSize: "0.85rem", color: "#92400e" }}>
              Stock Value
            </Typography>
            <Typography
              sx={{ fontWeight: 800, fontSize: "1.3rem", color: "#b45309" }}>
              ₹{totalValue.toLocaleString("en-IN")}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          alignItems: "center",
        }}>
        <Select
          size="small"
          value={filter.category}
          onChange={(e) =>
            setFilter((f) => ({ ...f, category: e.target.value }))
          }>
          <MenuItem value="all">All Categories</MenuItem>
          <MenuItem value="vegetable">Vegetable</MenuItem>
          <MenuItem value="nonveg">Non Veg</MenuItem>
          <MenuItem value="powders">Powders</MenuItem>
          <MenuItem value="millets">Millets</MenuItem>
          <MenuItem value="readytoeat">Ready to Eat</MenuItem>
          <MenuItem value="organic">Organic</MenuItem>
        </Select>

        <Select
          size="small"
          value={String(filter.range)}
          onChange={(e) =>
            setFilter((f) => ({ ...f, range: Number(e.target.value) }))
          }>
          <MenuItem value={7}>Last 7 days</MenuItem>
          <MenuItem value={30}>Last 30 days</MenuItem>
          <MenuItem value={90}>Last 90 days</MenuItem>
        </Select>
      </Box>

      {!hasData ? (
        <Typography color="text.secondary">
          No data available for this filter.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <GraphSales data={salesTrend} />
          </Grid>

          <Grid item xs={12} md={6}>
            <GraphCategory data={categoryData} />
          </Grid>

          <Grid item xs={12} md={6}>
            <GraphGauge totalValue={totalValue} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
