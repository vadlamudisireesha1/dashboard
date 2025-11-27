/* ==========================================
   ANALYTICS HELPERS – SINGLE UTILS FILE
   Works with JSON:
   { items: [ { category, weights[], salesHistory[] } ] }
========================================== */

// For colors / labels (also used by line chart)
export const CATEGORY_CONFIG = [
  { key: "vegetable", label: "Vegetable", color: "#60A5FA" },
  { key: "nonveg", label: "Non Veg", color: "#F97373" },
  { key: "powders", label: "Powders", color: "#FBBF24" },
  { key: "millets", label: "Millets", color: "#4ADE80" },
  { key: "readytoeat", label: "Ready to Eat", color: "#A855F7" },
  { key: "organic", label: "Organic", color: "#F97316" },
];

// merge all items from category JSON files
export const mergeAllItems = (...categoryFiles) => {
  const items = [];
  categoryFiles.forEach((file) => {
    if (file && Array.isArray(file.items)) {
      items.push(...file.items);
    }
  });
  return items;
};

export const filterByCategory = (items, category) => {
  if (category === "all") return items;
  return items.filter((item) => item.category === category);
};

export const getTotalUnits = (items) => {
  return items.reduce((sum, item) => {
    const units =
      item.weights?.reduce((s, w) => s + Number(w.units || 0), 0) || 0;
    return sum + units;
  }, 0);
};

export const getTotalStockValue = (items) => {
  return items.reduce((sum, item) => {
    const value =
      item.weights?.reduce(
        (s, w) => s + Number(w.units || 0) * Number(w.price || 0),
        0
      ) || 0;
    return sum + value;
  }, 0);
};

// Pie chart data (ALWAYS uses ALL items, no filter)
export const getCategoryDistribution = (allItems) => {
  const bucket = {};

  allItems.forEach((item) => {
    const cat = item.category || "unknown";
    const units =
      item.weights?.reduce((s, w) => s + Number(w.units || 0), 0) || 0;

    if (!bucket[cat]) bucket[cat] = 0;
    bucket[cat] += units;
  });

  return Object.entries(bucket).map(([key, value]) => {
    const cfg = CATEGORY_CONFIG.find((c) => c.key === key);
    return {
      key,
      name: cfg?.label || key,
      value,
    };
  });
};

/**
 * Sales trend line data
 *
 * - If categoryFilter === "all":
 *    returns objects like:
 *    { date, vegetable: 10, nonveg: 5, ... }
 *    → used for MULTI line chart
 *
 * - Else:
 *    returns objects like:
 *    { date, units: 12 }
 *    → used for single line chart
 */
export const getSalesTrend = (allItems, categoryFilter, rangeDays = 30) => {
  const daily = {};

  allItems.forEach((item) => {
    const cat = item.category || "unknown";

    (item.salesHistory || []).forEach((sale) => {
      if (!sale.date) return;

      if (!daily[sale.date]) {
        daily[sale.date] = { date: sale.date };
      }

      const units = Number(sale.unitsSold || 0);

      if (categoryFilter === "all") {
        // multi-series: accumulate per category key
        if (!daily[sale.date][cat]) daily[sale.date][cat] = 0;
        daily[sale.date][cat] += units;
      } else {
        // single-series: only selected category
        if (cat !== categoryFilter) return;
        if (!daily[sale.date].units) daily[sale.date].units = 0;
        daily[sale.date].units += units;
      }
    });
  });

  let result = Object.values(daily).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  if (rangeDays && result.length > rangeDays) {
    result = result.slice(result.length - rangeDays);
  }

  return result;
};
