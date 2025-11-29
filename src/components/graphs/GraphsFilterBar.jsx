// src/components/graphs/GraphsFilterBar.jsx
import React from "react";
import { CATEGORY_KEYS, CATEGORY_LABELS } from "./graphUtils";

export default function GraphsFilterBar({ category, setCategory }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(10px)",
        borderRadius: 20,
        padding: "16px 20px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        display: "flex",
        gap: 16,
        alignItems: "center",
        flexWrap: "wrap",
        border: "1px solid rgba(255,255,255,0.6)",
      }}>
      <span style={{ fontWeight: 600, color: "#334155" }}>Global Filter</span>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{
          padding: "10px 14px",
          borderRadius: 50,
          border: "1px solid #e2e8f0",
          background: "#f8fafc",
          fontSize: 14,
          cursor: "pointer",
          outline: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
        <option value="all">All Categories</option>
        {CATEGORY_KEYS.map((key) => (
          <option key={key} value={key}>
            {CATEGORY_LABELS[key]}
          </option>
        ))}
      </select>

      <span style={{ marginLeft: "auto", fontSize: 12, color: "#94a3b8" }}>
        Applies across all graphs.
      </span>
    </div>
  );
}
