// src/components/graphs/SalesLineGraph.jsx
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  CATEGORY_KEYS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  filterItemsByCategory,
  getSalesTrend,
} from "./graphUtils";

export default function SalesLineGraph({ items }) {
  const [openFilters, setOpenFilters] = useState(true);
  const [category, setCategory] = useState("all");
  const [range, setRange] = useState(30);
  const [smooth, setSmooth] = useState(true);

  const filtered = filterItemsByCategory(items, category);
  const data = getSalesTrend(filtered, range);

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
        <h2
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
          📊 Sales Trend Over Time
        </h2>

        <button
          onClick={() => setOpenFilters((p) => !p)}
          style={{
            padding: "6px 12px",
            background: "#f1f5f9",
            borderRadius: 50,
            border: "1px solid #e2e8f0",
            cursor: "pointer",
            fontSize: 12,
          }}>
          {openFilters ? "Hide Filters ▲" : "Show Filters ▼"}
        </button>
      </div>

      {openFilters && (
        <div
          style={{
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
            marginBottom: 16,
          }}>
          {/* Category */}
          <div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Category</div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                padding: "8px 14px",
                borderRadius: 50,
                border: "1px solid #e2e8f0",
              }}>
              <option value="all">All</option>
              {CATEGORY_KEYS.map((key) => (
                <option key={key} value={key}>
                  {CATEGORY_LABELS[key]}
                </option>
              ))}
            </select>
          </div>

          {/* Range */}
          <div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Date Range</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[7, 30, 90].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 50,
                    border: "1px solid #e2e8f0",
                    background: range === r ? "#0ea5e9" : "#f1f5f9",
                    color: range === r ? "white" : "#0f172a",
                    fontSize: 12,
                  }}>
                  {r} days
                </button>
              ))}
            </div>
          </div>

          {/* Line Style */}
          <div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Line Style</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => setSmooth(true)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 50,
                  border: "1px solid #e2e8f0",
                  background: smooth ? "#0ea5e9" : "#f1f5f9",
                  color: smooth ? "white" : "#0f172a",
                  fontSize: 12,
                }}>
                Smooth
              </button>
              <button
                onClick={() => setSmooth(false)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 50,
                  border: "1px solid #e2e8f0",
                  background: !smooth ? "#0ea5e9" : "#f1f5f9",
                  color: !smooth ? "white" : "#0f172a",
                  fontSize: 12,
                }}>
                Straight
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line
              type={smooth ? "monotone" : "linear"}
              dataKey="units"
              stroke={CATEGORY_COLORS[category] || "#0ea5e9"}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
              animationDuration={1100}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
