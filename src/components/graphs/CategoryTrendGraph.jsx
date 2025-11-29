// src/components/graphs/CategoryTrendGraph.jsx
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  CATEGORY_KEYS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  getCategorySalesTrend,
} from "./graphUtils";

export default function CategoryTrendGraph({ items }) {
  const [selected, setSelected] = useState(new Set(CATEGORY_KEYS));
  const [range, setRange] = useState("all");

  const data = getCategorySalesTrend(items);

  const getDisplayedData = () => {
    if (range === "all") return data;
    const n = Number(range);
    if (!data || data.length <= n) return data;
    return data.slice(data.length - n);
  };

  const displayedData = getDisplayedData();

  const toggleCategory = (key) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: 28,
        padding: 28,
        boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
      }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
            📈 Multi-Category Sales Comparison
          </h2>
          <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
            Compare trends across all product groups.
          </p>
        </div>

        {/* Date Range Filters */}
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "30", "60", "90"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                padding: "6px 14px",
                borderRadius: 50,
                border: "1px solid #e2e8f0",
                cursor: "pointer",
                background: range === r ? "#0ea5e9" : "#f1f5f9",
                color: range === r ? "white" : "#0f172a",
                fontSize: 12,
              }}>
              {r === "all" ? "All" : `Last ${r} days`}
            </button>
          ))}
        </div>
      </div>

      {/* Category Chips */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 14,
        }}>
        {CATEGORY_KEYS.map((key) => (
          <div
            key={key}
            onClick={() => toggleCategory(key)}
            style={{
              padding: "6px 12px",
              borderRadius: 50,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: selected.has(key) ? "#e0f2fe" : "#f8fafc",
              border: "1px solid #e2e8f0",
              fontSize: 12,
            }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 99,
                background: CATEGORY_COLORS[key],
              }}
            />
            {CATEGORY_LABELS[key]}
          </div>
        ))}
      </div>

      {/* Graph */}
      <div style={{ width: "100%", height: 360 }}>
        <ResponsiveContainer>
          <LineChart data={displayedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />

            {CATEGORY_KEYS.filter((k) => selected.has(k)).map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={CATEGORY_LABELS[key]}
                stroke={CATEGORY_COLORS[key]}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
                animationDuration={1200}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
