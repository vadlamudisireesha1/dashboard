// src/components/graphs/PieChartGraph.jsx
import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart as PieChartIcon, RefreshCw } from "lucide-react";
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
        padding: "28px 28px 0px",
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
          marginBottom: 10,
          alignItems: "center",
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
          <PieChartIcon size={18} strokeWidth={2.2} />
          <span>Stock Distribution</span>
        </h2>

        <button
          onClick={resetPie}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#f1f5f9",
            border: "1px solid #e2e8f0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "0.2s",
          }}>
          <RefreshCw size={15} strokeWidth={2} />
        </button>
      </div>

      {/* DESCRIPTION */}
      <p
        style={{
          margin: "0 0 14px 0",
          color: "#64748b",
          fontSize: 13,
        }}>
        How stock is divided across product categories.
      </p>

      {/* DONUT – smaller height, no overlap */}
      <div
        style={{
          width: "100%",
          height: 210,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={distribution}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={105}
              paddingAngle={2}
              label={false} // remove labels on arcs to avoid clutter
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
                        ? "brightness(1.22) drop-shadow(0 4px 8px rgba(0,0,0,0.18))"
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
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* CUSTOM LEGEND (no overlap, clean row) */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 10,
          fontSize: 12,
          color: "#374151",
          marginTop: 4,
          marginBottom: 10,
        }}>
        {distribution.map((entry) => (
          <div
            key={entry.name}
            style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "999px",
                background: entry.color,
              }}
            />
            <span>{entry.name}</span>
          </div>
        ))}
      </div>

      {/* DETAILS SECTION */}
      <div
        style={{
          marginTop: 8,
          paddingTop: 10,
          borderTop: "1px dashed #e5e7eb",
          fontSize: 14,
          color: "#374151",
          minHeight: 56,
        }}>
        {activeSlice ? (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "14px",
              background: "rgba(255, 255, 255, 0.75)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              // boxShadow: "0 6px 18px rgba(15, 23, 42, 0.12)",
              minWidth: "180px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              animation: "fadeIn 0.25s ease",
            }}>
            {/* TITLE ROW */}
            <div
              style={{
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                fontSize: "14px",
                color: "#111827",
              }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: activeSlice.color,
                  display: "inline-block",
                  marginRight: "8px",
                }}
              />
              {activeSlice.name}
            </div>

            {/* UNITS */}
            <div
              style={{
                fontSize: "13px",
                color: "#334155",
                display: "flex",
                marginTop: "2px",
                gap: "12px",
                fontSize: "20px",
              }}>
              Units:
              <strong style={{ color: "#111827" }}>
                {activeSlice.value.toLocaleString("en-IN")}
              </strong>
            </div>

            {/* PERCENTAGE */}
            <div
              style={{
                fontSize: "13px",
                color: "#334155",
                display: "flex",
                gap: "12px",
                fontSize: "20px",
              }}>
              Percentage:
              <strong style={{ color: "#111827" }}>
                {((activeSlice.value / totalUnits) * 100).toFixed(1)}%
              </strong>
            </div>
          </div>
        ) : (
          <span
            style={{
              color: "#9ca3af",
              fontSize: "13px",
            }}>
            Hover or click a slice to view category details.
          </span>
        )}
      </div>
    </div>
  );
}
