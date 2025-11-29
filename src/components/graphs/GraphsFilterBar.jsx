import React from "react";
import { Filter } from "lucide-react";
import { CATEGORY_KEYS, CATEGORY_LABELS } from "./graphUtils";

export default function GraphsFilterBar({ category, setCategory }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(10px)",
        borderRadius: 20,
        padding: "14px 18px",
        boxShadow: "0 8px 32px rgba(15,23,42,0.10)",
        display: "flex",
        gap: 16,
        alignItems: "center",
        flexWrap: "wrap",
        border: "1px solid rgba(255,255,255,0.7)",
      }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontWeight: 600,
          color: "#334155",
          fontSize: 13,
        }}>
        <Filter size={16} strokeWidth={2} />
        <span>Global Filter</span>
      </div>

      <div
        style={{
          position: "relative",
        }}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "9px 32px 9px 14px",
            borderRadius: 999,
            border: "1px solid #e2e8f0",
            background: "#f8fafc",
            fontSize: 14,
            cursor: "pointer",
            outline: "none",
            boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
            appearance: "none",
          }}>
          <option value="all">All Categories</option>
          {CATEGORY_KEYS.map((key) => (
            <option key={key} value={key}>
              {CATEGORY_LABELS[key]}
            </option>
          ))}
        </select>
        {/* fake arrow */}
        <span
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            fontSize: 10,
            color: "#94a3b8",
          }}>
          ▼
        </span>
      </div>

      <span
        style={{
          marginLeft: "auto",
          fontSize: 12,
          color: "#94a3b8",
        }}>
        Applies across all graphs.
      </span>
    </div>
  );
}
