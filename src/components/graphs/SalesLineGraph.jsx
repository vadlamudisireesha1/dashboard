// src/components/graphs/SalesLineGraph.jsx
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

  const filtered = filterItemsByCategory(items, category);
  const data = getSalesTrend(filtered, range);

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 24,
        padding: 24,
        boxShadow: "0 10px 26px rgba(15,23,42,0.08)",
        marginBottom: 32,
      }}>
      {/* Title + filter toggle */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 800,
              color: "#0f172a",
            }}>
            Sales Trend
          </h2>
          <p style={{ margin: 0, color: "#64748b", marginTop: 4 }}>
            View overall units sold over time.
          </p>
        </div>

        <button
          onClick={() => setOpenFilters((prev) => !prev)}
          style={{
            border: "none",
            background: "#f1f5f9",
            borderRadius: 999,
            padding: "6px 12px",
            cursor: "pointer",
            fontSize: 12,
          }}>
          ⚙ Filters {openFilters ? "▲" : "▼"}
        </button>
      </div>

      {/* Collapsible filters */}
      {openFilters && (
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 14,
          }}>
          {/* Category filter */}
          <div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
              Category
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                padding: "7px 12px",
                borderRadius: 999,
                border: "1px solid #e2e8f0",
                fontSize: 13,
              }}>
              <option value="all">All categories</option>
              {CATEGORY_KEYS.map((key) => (
                <option key={key} value={key}>
                  {CATEGORY_LABELS[key]}
                </option>
              ))}
            </select>
          </div>

          {/* Range filter */}
          <div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
              Date Range
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[7, 30, 90].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                    cursor: "pointer",
                    background: range === r ? "#0ea5e9" : "#f8fafc",
                    color: range === r ? "#ffffff" : "#0f172a",
                  }}>
                  Last {r} days
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="units"
              stroke={CATEGORY_COLORS[category] || "#0f766e"}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
