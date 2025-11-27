import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";

import FilterBar from "../components/analytics/FilterBar";

import GraphSalesTrend from "../components/analytics/graphs/GraphSalesTrend";
import GraphCategoryDistribution from "../components/analytics/graphs/GraphCategoryDistribution";
import GraphTopProducts from "../components/analytics/graphs/GraphTopProducts";
import GraphStockValueGauge from "../components/analytics/graphs/GraphStockValueGauge";
import AnalyticsHeader from "../components/analytics/";

import {
  mergeAllCategories,
  getSalesTrend,
  getCategoryDistribution,
  getTopProducts,
  calculateStockValue,
} from "../components/analytics/analyticsUtils";

import nonveg from "../data/nonveg.json";
import vegetable from "../data/vegetable.json";
import powders from "../data/powders.json";
import millets from "../data/millets.json";
import readytoeat from "../data/readytoeat.json";
import organic from "../data/organic.json";

export default function AnalyticsPage() {
  const allItems = mergeAllCategories(
    nonveg,
    vegetable,
    powders,
    millets,
    readytoeat,
    organic
  );

  const [filter, setFilter] = useState({
    category: "all",
    range: 30,
  });

  const [filtered, setFiltered] = useState(allItems);

  useEffect(() => {
    let items = allItems;

    if (filter.category !== "all") {
      items = allItems.filter((i) => i.category === filter.category);
    }

    setFiltered(items);
  }, [filter]);

  return (
    <>
      <AnalyticsHeader
        totalProducts={filtered.length}
        totalUnits={filtered.reduce(
          (s, i) => s + i.weights.reduce((a, w) => a + w.units, 0),
          0
        )}
        totalValue={calculateStockValue(filtered)}
      />
      <FilterBar filter={filter} setFilter={setFilter} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <GraphSalesTrend data={getSalesTrend(filtered, filter.range)} />
        </Grid>

        <Grid item xs={12} md={6}>
          <GraphCategoryDistribution data={getCategoryDistribution(filtered)} />
        </Grid>

        <Grid item xs={12} md={6}>
          <GraphTopProducts data={getTopProducts(filtered)} />
        </Grid>

        <Grid item xs={12} md={6}>
          <GraphStockValueGauge totalValue={calculateStockValue(filtered)} />
        </Grid>
      </Grid>
    </>
  );
}
