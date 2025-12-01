import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
import { BarChart3 } from "lucide-react";

import GraphsHeader from "../components/graphs/GraphsHeader";
import CategoryTrendGraph from "../components/graphs/CategoryTrendGraph";
import SalesLineGraph from "../components/graphs/SalesLineGraph";
import PieChartGraph from "../components/graphs/PieChartGraph";
import StockSpeedometerGraph from "../components/graphs/SpeedometerGraph";
import StockVsSalesBarChart from "../components/graphs/StockVsSalesGraph";
import GraphsFilterBar from "../components/graphs/GraphsFilterBar";

import {
  mergeAllCategories,
  filterItemsByCategory,
} from "../components/graphs/graphUtils";

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

  const [globalCategory, setGlobalCategory] = useState("all");
  const filteredItems = filterItemsByCategory(allItems, globalCategory);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 4,
        pb: 13,
        px: { xs: 2, md: 4 },
        background:
          "linear-gradient(180deg, #f9fafb 0%, #eef2ff 35%, #e0f2fe 100%)",
      }}>
      <Box
        sx={{
          maxWidth: "1400px",
          mx: "auto",
        }}>
        {/* Title Row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            gap: 2,
            mb: 2,
          }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              background: "linear-gradient(135deg, #4f46e5, #22c55e, #0ea5e9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 30px rgba(15,23,42,0.3)",
            }}>
            <BarChart3 size={22} color="#ffffff" strokeWidth={2.2} />
          </div>

          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 30,
                fontWeight: 900,
                color: "#020617",
                letterSpacing: "0.02em",
              }}>
              Stock Analytics Dashboard
            </h1>
            <p
              style={{
                margin: 0,
                marginTop: 4,
                color: "#6b7280",
                fontSize: 14,
              }}>
              Track stock, sales and category performance in one clean, visual
              view.
            </p>
          </div>
        </Box>

        {/* Global Filter Bar */}
        <Box sx={{ mb: 3 }}>
          <GraphsFilterBar
            category={globalCategory}
            setCategory={setGlobalCategory}
          />
        </Box>

        {/* Top summary cards */}
        <Box sx={{ mb: 4 }}>
          <GraphsHeader items={filteredItems} />
        </Box>

        {/* 1. Multi-Category Sales */}
        <Box sx={{ mb: 4 }}>
          <CategoryTrendGraph items={filteredItems} />
        </Box>

        {/* 2. Stock vs Sales */}
        <Box sx={{ mb: 4 }}>
          <StockVsSalesBarChart items={filteredItems} />
        </Box>

        {/* 3. Sales Trend */}
        <Box sx={{ mb: 4 }}>
          <SalesLineGraph items={filteredItems} />
        </Box>

        {/* 4. Pie + Meter */}
        <Grid container spacing={4} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <PieChartGraph items={filteredItems} />
          </Grid>
          <Grid item xs={12} md={6}>
            <StockSpeedometerGraph items={filteredItems} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
