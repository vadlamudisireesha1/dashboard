// src/pages/GraphDashboardpage.jsx
import React from "react";
import { Box, Grid } from "@mui/material";

import GraphsHeader from "../components/graphs/GraphsHeader";
import CategoryTrendGraph from "../components/graphs/CategoryTrendGraph";
import SalesLineGraph from "../components/graphs/SalesLineGraph";
import PieChartGraph from "../components/graphs/PieChartGraph";
import StockSpeedometerGraph from "../components/graphs/SpeedometerGraph";
import StockVsSalesBarChart from "../components/graphs/StockVsSalesGraph";

import { mergeAllCategories } from "../components/graphs/graphUtils";

// JSON files
import nonveg from "../data/nonveg.json";
import vegetable from "../data/vegetable.json";
import powders from "../data/powders.json";
import millets from "../data/millets.json";
import readytoeat from "../data/readytoeat.json";
import organic from "../data/organic.json";

export default function GraphDashboardpage() {
  const allItems = mergeAllCategories(
    vegetable,
    nonveg,
    powders,
    millets,
    readytoeat,
    organic
  );

  return (
    <Box
      sx={{
        p: 4,
        background: "#f8fafc",
        minHeight: "100vh",
      }}>
      {/* Page Title */}
      <h1
        style={{
          marginTop: 0,
          marginBottom: 22,
          fontSize: 30,
          fontWeight: 900,
          color: "#0f172a",
        }}>
        📊 Stock Analytics Dashboard
      </h1>

      {/* Summary Header Cards */}
      <Box sx={{ mb: 4 }}>
        <GraphsHeader items={allItems} />
      </Box>

      {/* 1. Multi Category Sales */}
      <Box sx={{ mb: 4 }}>
        <CategoryTrendGraph items={allItems} />
      </Box>

      {/* 2. Stock vs Sales */}
      <Box sx={{ mb: 4 }}>
        <StockVsSalesBarChart items={allItems} />
      </Box>

      {/* 3. Sales Trend */}
      <Box sx={{ mb: 4 }}>
        <SalesLineGraph items={allItems} />
      </Box>

      {/* 4. Pie Chart + Speedometer (50% each) */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <PieChartGraph items={allItems} />
        </Grid>

        <Grid item xs={12} md={6}>
          <StockSpeedometerGraph items={allItems} />
        </Grid>
      </Grid>
    </Box>
  );
}
