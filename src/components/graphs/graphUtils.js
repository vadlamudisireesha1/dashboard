// src/components/graphs/graphUtils.js
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

export function filterItemsByCategory(items, category) {
  if (!category || category === "all") return items;
  return (items || []).filter((i) => i.category === category);
}

export function calculateStockValue(items) {
  let total = 0;
  (items || []).forEach((item) => {
    (item.weights || []).forEach((w) => {
      total += Number(w.units || 0) * Number(w.price || 0);
    });
  });
  return total;
}

export function getTotalUnits(items) {
  return (items || []).reduce(
    (sum, item) =>
      sum + (item.weights || []).reduce((s, w) => s + Number(w.units || 0), 0),
    0
  );
}

/* ----------------- DATE NORMALIZATION HELPERS ----------------- */
/** Returns YYYY-MM-DD for a date-like input (string with or without time). */
export function dateKey(d) {
  if (!d) return "";
  // if already YYYY-MM-DD or contains 'T', split and return first part
  if (typeof d === "string") return d.split("T")[0];
  // fallback to toISOString
  try {
    return new Date(d).toISOString().split("T")[0];
  } catch (e) {
    return "";
  }
}

// returns sorted unique YYYY-MM-DD dates present in salesHistory
export function getAvailableDates(items) {
  const set = new Set();
  (items || []).forEach((it) => {
    (it.salesHistory || []).forEach((s) => {
      const k = dateKey(s?.date);
      if (k) set.add(k);
    });
  });
  const arr = Array.from(set);
  arr.sort();
  return arr;
}

/**
 * filterItemsByDateRange(items, { date, from, to })
 * Trims each item's salesHistory to entries inside the requested window.
 * Uses dateKey() consistently.
 */
export function filterItemsByDateRange(items, { date, from, to }) {
  if (!date && !from && !to) return items;
  const d = dateKey(date);
  const f = dateKey(from);
  const t = dateKey(to);

  return (items || []).map((item) => {
    const sales = (item.salesHistory || []).filter((s) => {
      const sd = dateKey(s?.date);
      if (!sd) return false;
      if (d) return sd === d;
      if (f && t) return sd >= f && sd <= t;
      if (f && !t) return sd >= f;
      if (!f && t) return sd <= t;
      return true;
    });
    return { ...item, salesHistory: sales };
  });
}

/**
 * getSalesTotals(items)
 * Aggregates productsCount/totalUnits/totalRevenue from items' salesHistory.
 * Expects items to already be trimmed if using date filters.
 */
export function getSalesTotals(items) {
  let productsCount = 0;
  let totalUnits = 0;
  let totalRevenue = 0;

  (items || []).forEach((item) => {
    const sales = item.salesHistory || [];
    if (sales.length) productsCount++;
    sales.forEach((s) => {
      const u = Number(s.unitsSold || 0);
      totalUnits += u;
      if (s.revenue != null) {
        totalRevenue += Number(s.revenue || 0);
      } else {
        const weights = item.weights || [];
        let avg = 0;
        if (Array.isArray(weights) && weights.length) {
          avg = weights.reduce((a, b) => a + Number(b.price || 0), 0) / weights.length;
        }
        totalRevenue += u * (avg || 0);
      }
    });
  });

  return { productsCount, totalUnits, totalRevenue };
}

/* ----------------- DATE SPAN HELPERS ----------------- */
export function buildFullDateSpan(items) {
  const dates = [];
  (items || []).forEach((item) => {
    (item.salesHistory || []).forEach((s) => {
      const k = dateKey(s?.date);
      if (k) dates.push(k);
    });
  });
  if (!dates.length) return [];
  dates.sort();
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

/* ----------------- CHART HELPERS (USE dateKey everywhere) ----------------- */
export function getCategorySalesTrend(items) {
  const dates = buildFullDateSpan(items);
  if (!dates.length) return [];
  const trend = dates.map((date) => {
    const row = { date };
    CATEGORY_KEYS.forEach((c) => (row[c] = 0));
    return row;
  });

  (items || []).forEach((item) => {
    (item.salesHistory || []).forEach((s) => {
      const sd = dateKey(s?.date);
      const idx = dates.indexOf(sd);
      if (idx === -1) return;
      const catKey = item.category;
      if (!CATEGORY_KEYS.includes(catKey)) return;
      trend[idx][catKey] += Number(s.unitsSold || 0);
    });
  });

  return trend;
}

export function getSalesTrend(items, rangeDays = 30) {
  const dates = buildLastNDaysSpan(items, rangeDays);
  if (!dates.length) return [];
  return dates.map((date) => {
    const units = (items || []).reduce((sum, item) => {
      const entry = (item.salesHistory || []).find((s) => dateKey(s?.date) === date);
      return sum + Number(entry?.unitsSold || 0);
    }, 0);
    return { date, units };
  });
}

export function getCategoryDistribution(items) {
  const totals = {};
  CATEGORY_KEYS.forEach((c) => (totals[c] = 0));
  (items || []).forEach((item) => {
    const cat = item.category;
    if (!CATEGORY_KEYS.includes(cat)) return;
    const units = (item.weights || []).reduce((s, w) => s + Number(w.units || 0), 0);
    totals[cat] += units;
  });
  return CATEGORY_KEYS.map((key) => ({
    key,
    name: CATEGORY_LABELS[key],
    value: totals[key],
    color: CATEGORY_COLORS[key],
  }));
}

export function getStockVsSalesByCategory(items) {
  const data = {};
  CATEGORY_KEYS.forEach((c) => (data[c] = { stock: 0, sold: 0 }));
  (items || []).forEach((item) => {
    const cat = item.category;
    if (!CATEGORY_KEYS.includes(cat)) return;
    const stockUnits = (item.weights || []).reduce((s, w) => s + Number(w.units || 0), 0);
    data[cat].stock += stockUnits;
    const soldUnits = (item.salesHistory || []).reduce((s, h) => s + Number(h.unitsSold || 0), 0);
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
