// src/components/graphs/StockSpeedometerGraph.jsx
import React from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { calculateStockValue } from "./graphUtils";

export default function StockSpeedometerGraph({ items }) {
  const totalValue = calculateStockValue(items);
  const safeMax = totalValue * 1.3 || 1000;

  const data = [
    {
      name: "Stock Value",
      value: totalValue,
      fill: "#22c55e",
    },
  ];

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 24,
        padding: 24,
        boxShadow: "0 10px 26px rgba(15,23,42,0.08)",
        height: "100%",
      }}>
      <h2
        style={{
          margin: 0,
          fontSize: 20,
          fontWeight: 800,
          color: "#0f172a",
          marginBottom: 8,
        }}>
        Stock Value Meter
      </h2>
      <p style={{ margin: 0, color: "#64748b", marginBottom: 12 }}>
        ₹ {totalValue.toLocaleString("en-IN")}
      </p>

      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <RadialBarChart
            startAngle={180}
            endAngle={0}
            innerRadius="70%"
            outerRadius="100%"
            data={data}>
            <RadialBar
              minAngle={15}
              dataKey="value"
              clockWise
              cornerRadius={999}
              fill="#22c55e"
              background={{ fill: "#e5e7eb" }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: -24,
          fontSize: 12,
          color: "#6b7280",
        }}>
        Approx. capacity: ₹ {Math.round(safeMax).toLocaleString("en-IN")}
      </div>
    </div>
  );
}
