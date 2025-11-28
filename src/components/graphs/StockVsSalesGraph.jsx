// src/components/graphs/StockVsSalesBarChart.jsx
import React from "react";
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
import { getStockVsSalesByCategory } from "./graphUtils";

export default function StockVsSalesBarChart({ items }) {
  const data = getStockVsSalesByCategory(items);

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 24,
        padding: 24,
        boxShadow: "0 10px 26px rgba(15,23,42,0.08)",
        marginTop: 24,
      }}>
      <h2
        style={{
          margin: 0,
          fontSize: 20,
          fontWeight: 800,
          color: "#0f172a",
          marginBottom: 8,
        }}>
        Stock vs Sales by Category
      </h2>
      <p style={{ margin: 0, color: "#64748b", marginBottom: 16 }}>
        Compare remaining stock units with total units sold.
      </p>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="stock" name="Stock Units" fill="#3b82f6" />
            <Bar dataKey="sold" name="Sold Units" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
