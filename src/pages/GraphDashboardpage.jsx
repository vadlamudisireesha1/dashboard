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
    <Box sx={{ p: 4, background: "#fefcf7", minHeight: "100vh" }}>
      <h1
        style={{
          marginTop: 0,
          marginBottom: 12,
          fontSize: 26,
          fontWeight: 900,
          color: "#0f172a",
        }}>
        📊 Stock Analytics
      </h1>

      <GraphsHeader items={allItems} />

      <CategoryTrendGraph items={allItems} />

      <SalesLineGraph items={allItems} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <PieChartGraph items={allItems} />
        </Grid>

        <Grid item xs={12} md={6}>
          <StockSpeedometerGraph items={allItems} />
        </Grid>
      </Grid>

      <StockVsSalesBarChart items={allItems} />
    </Box>
  );
}
