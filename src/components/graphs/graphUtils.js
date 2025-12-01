// src/components/graphs/graphUtils.js

// -------------------------------------------------------
// CATEGORY CONSTANTS
// -------------------------------------------------------
export const CATEGORY_KEYS = [
  "vegetable",
  "nonveg",
  "powders",
  "millets",
  "readytoeat",
  "organic",
];

export const CATEGORY_LABELS = {
  vegetable: "Vegetable Pickles",
  nonveg: "Non Veg Pickles",
  powders: "Delicious Powders",
  millets: "Millets Ready to Cook",
  readytoeat: "Ready to Eat",
  organic: "Organic Millets",
};

export const CATEGORY_COLORS = {
  vegetable: "#1e88e5",
  nonveg: "#e53935",
  powders: "#f9a825",
  millets: "#00c853",
  readytoeat: "#8e24aa",
  organic: "#2e7d32",
};

// -------------------------------------------------------
// MERGE ALL CATEGORY JSON FILES
// -------------------------------------------------------
export function mergeAllCategories(...jsonFiles) {
  const all = [];

  jsonFiles.forEach((cat) => {
    if (!cat || !cat.items) return;

    cat.items.forEach((item) => {
      all.push({
        ...item,
        category: (item.category || "").toLowerCase(),
        weights: item.weights || [],
        salesHistory: item.salesHistory || [],
      });
    });
  });

  return all;
}

// -------------------------------------------------------
// BASIC HELPERS
// -------------------------------------------------------
export function getTotalUnits(items) {
  return items.reduce(
    (sum, item) =>
      sum + item.weights.reduce((s, w) => s + Number(w.units || 0), 0),
    0
  );
}

export function calculateStockValue(items) {
  let total = 0;
  items.forEach((item) => {
    item.weights.forEach((w) => {
      total += Number(w.units || 0) * Number(w.price || 0);
    });
  });
  return total;
}

export function filterItemsByCategory(items, category) {
  if (!category || category === "all") return items;
  return items.filter((i) => i.category === category);
}

// -------------------------------------------------------
// DATE RANGE HELPERS
// -------------------------------------------------------
export function buildFullDateSpan(items) {
  const dates = [];

  items.forEach((item) => {
    (item.salesHistory || []).forEach((s) => {
      if (s.date) dates.push(s.date);
    });
  });

  if (!dates.length) return [];

  dates.sort(); // ascending
  const start = new Date(dates[0]);
  const end = new Date(dates[dates.length - 1]);

  const result = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    result.push(d.toISOString().split("T")[0]);
  }
  return result;
}

export function buildLastNDaysSpan(items, rangeDays = 30) {
  const full = buildFullDateSpan(items);
  if (!full.length) return [];
  if (full.length <= rangeDays) return full;
  return full.slice(full.length - rangeDays);
}

// -------------------------------------------------------
// MULTI-CATEGORY SALES TREND (for CategoryTrendGraph)
// -------------------------------------------------------
export function getCategorySalesTrend(items) {
  const dates = buildFullDateSpan(items);
  if (!dates.length) return [];

  const trend = dates.map((date) => {
    const row = { date };
    CATEGORY_KEYS.forEach((c) => {
      row[c] = 0;
    });
    return row;
  });

  items.forEach((item) => {
    (item.salesHistory || []).forEach((s) => {
      const idx = dates.indexOf(s.date);
      if (idx === -1) return;
      const catKey = item.category;
      if (!CATEGORY_KEYS.includes(catKey)) return;
      trend[idx][catKey] += Number(s.unitsSold || 0);
    });
  });

  return trend;
}

// -------------------------------------------------------
// SINGLE SERIES SALES TREND (for SalesLineGraph)
// -------------------------------------------------------
export function getSalesTrend(items, rangeDays = 30) {
  const dates = buildLastNDaysSpan(items, rangeDays);
  if (!dates.length) return [];

  return dates.map((date) => {
    const units = items.reduce((sum, item) => {
      const entry = (item.salesHistory || []).find((s) => s.date === date);
      return sum + Number(entry?.unitsSold || 0);
    }, 0);

    return { date, units };
  });
}

// -------------------------------------------------------
// CATEGORY DISTRIBUTION (for PieChartGraph)
// -------------------------------------------------------
export function getCategoryDistribution(items) {
  const totals = {};
  CATEGORY_KEYS.forEach((c) => (totals[c] = 0));

  items.forEach((item) => {
    const cat = item.category;
    if (!CATEGORY_KEYS.includes(cat)) return;
    const units = item.weights.reduce((s, w) => s + Number(w.units || 0), 0);
    totals[cat] += units;
  });

  return CATEGORY_KEYS.map((key) => ({
    key,
    name: CATEGORY_LABELS[key],
    value: totals[key],
    color: CATEGORY_COLORS[key],
  }));
}

// -------------------------------------------------------
// STOCK vs SALES by CATEGORY (for StockVsSalesBarChart)
// -------------------------------------------------------
export function getStockVsSalesByCategory(items) {
  const data = {};

  CATEGORY_KEYS.forEach((c) => {
    data[c] = { stock: 0, sold: 0 };
  });

  items.forEach((item) => {
    const cat = item.category;
    if (!CATEGORY_KEYS.includes(cat)) return;

    const stockUnits = item.weights.reduce(
      (s, w) => s + Number(w.units || 0),
      0
    );
    data[cat].stock += stockUnits;

    const soldUnits = (item.salesHistory || []).reduce(
      (s, h) => s + Number(h.unitsSold || 0),
      0
    );
    data[cat].sold += soldUnits;
  });

  return CATEGORY_KEYS.map((key) => ({
    key,
    name: CATEGORY_LABELS[key],
    stock: data[key].stock,
    sold: data[key].sold,
    color: CATEGORY_COLORS[key],
  }));
}
