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

  const data = getCategorySalesTrend(items);

  const toggleCategory = (key) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 24,
        padding: 24,
        boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
        marginBottom: 32,
      }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
          flexWrap: "wrap",
          gap: 12,
        }}>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 800,
              color: "#0f172a",
            }}>
            Multi-Category Sales Comparison
          </h2>
          <p style={{ margin: 0, color: "#64748b", marginTop: 4 }}>
            Compare daily units sold for each category side by side.
          </p>
        </div>

        {/* Comparison checkboxes */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
          }}>
          {CATEGORY_KEYS.map((key) => (
            <label
              key={key}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 999,
                background: selected.has(key) ? "#e0f2fe" : "#f1f5f9",
                cursor: "pointer",
                fontSize: 12,
              }}>
              <input
                type="checkbox"
                checked={selected.has(key)}
                onChange={() => toggleCategory(key)}
                style={{ cursor: "pointer" }}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: CATEGORY_COLORS[key],
                }}
              />
              {CATEGORY_LABELS[key]}
            </label>
          ))}
        </div>
      </div>

      <div style={{ width: "100%", height: 360 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />

            {CATEGORY_KEYS.filter((k) => selected.has(k)).map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={CATEGORY_LABELS[key]}
                stroke={CATEGORY_COLORS[key]}
                strokeWidth={2.4}
                dot={false}
                activeDot={{ r: 4 }}
                animationDuration={800}
                animationEasing="ease-out"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
