// src/components/graphs/PieChartGraph.jsx
import React, { useState } from "react";
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
  const distribution = getCategoryDistribution(items);

  const [activeSlice, setActiveSlice] = useState(null);

  const totalUnits = distribution.reduce((sum, d) => sum + (d.value || 0), 0);

  const resetPie = () => setActiveSlice(null);

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 28,
        padding: "30px 30px 0px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}>
        <h2
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
          🥧 Stock Distribution
        </h2>

        <button
          onClick={resetPie}
          style={{
            padding: "6px 14px",
            borderRadius: 50,
            background: "#f1f5f9",
            border: "1px solid #e2e8f0",
            fontSize: 12,
            cursor: "pointer",
          }}>
          Reset
        </button>
      </div>

      <p
        style={{
          margin: "0 0 18px 0",
          color: "#64748b",
          fontSize: 14,
        }}>
        How stock is divided across product categories.
      </p>

      {/* FIXED BIGGER DONUT AREA (NO BLACK BORDER) */}
      <div
        style={{
          width: "100%",
          height: 310, // Increased height
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 10px",
        }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={distribution}
              dataKey="value"
              nameKey="name"
              innerRadius={75} // bigger donut
              outerRadius={120} // bigger outer radius
              paddingAngle={3}
              labelLine={false}>
              {distribution.map((entry, index) => {
                const isActive = activeSlice && activeSlice.name === entry.name;

                return (
                  <Cell
                    key={index}
                    fill={entry.color}
                    style={{
                      cursor: "pointer",
                      transition: "0.25s",
                      filter: isActive
                        ? "brightness(1.25) drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
                        : "brightness(1)",
                    }}
                    onMouseEnter={() => setActiveSlice(entry)}
                    onMouseLeave={() => setActiveSlice(null)}
                    onClick={() => setActiveSlice(entry)}
                  />
                );
              })}
            </Pie>

            <Tooltip />

            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                marginTop: 12,
                fontSize: 13,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* DETAILS SECTION - BIGGER FONT + LESS EMPTY SPACE */}
      <div
        style={{
          marginTop: 16,
          padding: "14px 0 22px",
          borderTop: "1px dashed #e5e7eb",
          fontSize: 14,
          color: "#374151",
          minHeight: 70,
        }}>
        {activeSlice ? (
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>
              {activeSlice.name}
            </div>
            <div>
              Units:{" "}
              <strong style={{ fontSize: 15 }}>
                {activeSlice.value.toLocaleString("en-IN")}
              </strong>
            </div>
            <div>
              Percentage:{" "}
              <strong style={{ fontSize: 15 }}>
                {((activeSlice.value / totalUnits) * 100).toFixed(1)}%
              </strong>
            </div>
          </div>
        ) : (
          <span style={{ color: "#9ca3af" }}>
            Hover or click a slice to view category details.
          </span>
        )}
      </div>
    </div>
  );
}
