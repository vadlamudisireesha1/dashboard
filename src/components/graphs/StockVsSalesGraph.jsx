import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { getStockVsSalesByCategory } from "./graphUtils";

export default function StockVsSalesBarChart({ items }) {
  const [sortBy, setSortBy] = useState("name"); // name | stock | sold
  const [sortDir, setSortDir] = useState("desc"); // asc | desc

  const rawData = getStockVsSalesByCategory(items);

  const sortedData = [...rawData].sort((a, b) => {
    if (sortBy === "name") {
      return sortDir === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    const diff = (a[sortBy] || 0) - (b[sortBy] || 0);
    return sortDir === "asc" ? diff : -diff;
  });

  return (
    <div
      style={{
        background: "white",
        borderRadius: 28,
        padding: 28,
        boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
      }}>
      {/* Header + Sort Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
        }}>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
            <BarChart3 size={18} strokeWidth={2.2} />
            <span>Stock vs Sales by Category</span>
          </h2>
          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: 13,
              marginTop: 4,
            }}>
            Compare how much you still have in stock vs total sold units.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}>
          <span style={{ fontSize: 12, color: "#6b7280" }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: 50,
              border: "1px solid #e2e8f0",
              fontSize: 12,
            }}>
            <option value="name">Category Name</option>
            <option value="stock">Stock Units</option>
            <option value="sold">Sold Units</option>
          </select>

          <button
            onClick={() =>
              setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            style={{
              padding: "6px 12px",
              borderRadius: 50,
              border: "1px solid #e2e8f0",
              fontSize: 12,
              cursor: "pointer",
              background: "#f1f5f9",
            }}>
            {sortDir === "asc" ? "↑ Asc" : "↓ Desc"}
          </button>
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar
              dataKey="stock"
              name="Stock Units"
              fill="#3b82f6"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="sold"
              name="Sold Units"
              fill="#f97316"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
