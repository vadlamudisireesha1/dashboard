// src/components/graphs/PieChartGraph.jsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getCategoryDistribution } from "./graphUtils";

export default function PieChartGraph({ items }) {
  const data = getCategoryDistribution(items);

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
        Stock Distribution
      </h2>
      <p style={{ margin: 0, color: "#64748b", marginBottom: 16 }}>
        How total units are spread across categories.
      </p>

      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
