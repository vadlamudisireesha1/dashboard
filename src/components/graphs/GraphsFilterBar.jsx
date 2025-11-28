import React from "react";
import { CATEGORY_KEYS, CATEGORY_LABELS } from "./graphUtils";

export default function GraphsFilterBar({ category, setCategory }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "center",
        marginBottom: "20px",
        flexWrap: "wrap",
      }}>
      <span style={{ fontWeight: 600 }}>Global Filter:</span>

      {/* Category dropdown */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{
          padding: "8px 14px",
          borderRadius: "10px",
          border: "1px solid #e2e8f0",
          minWidth: "180px",
        }}>
        <option value="all">All Categories</option>
        {CATEGORY_KEYS.map((key) => (
          <option key={key} value={key}>
            {CATEGORY_LABELS[key]}
          </option>
        ))}
      </select>
    </div>
  );
}
