import React, { useState } from "react";
import { Filter } from "lucide-react";
import { CATEGORY_KEYS, CATEGORY_LABELS } from "./graphUtils";

export default function GraphsFilterBar({
  category,
  setCategory,
  date,
  setDate,
  smallMode,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* FILTER BUTTON */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(10px)",
          borderRadius: 999,
          padding: smallMode ? "8px 14px" : "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          border: "1px solid rgba(255,255,255,0.7)",
          boxShadow: open
            ? "0 6px 20px rgba(15,23,42,0.18)"
            : "0 8px 24px rgba(15,23,42,0.12)",
          fontWeight: 600,
          color: "#334155",
          fontSize: smallMode ? 13 : 14,
          transition: "0.25s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 10px 22px rgba(15,23,42,0.25)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,23,42,0.12)";
          e.currentTarget.style.transform = "translateY(0px)";
        }}>
        <Filter size={16} strokeWidth={2} />
        {!smallMode && <span>Filter</span>}
      </div>

      {/* DROPDOWN PANEL */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          right: 0,
          width: 260,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          borderRadius: 16,
          padding: open ? "16px 18px" : "0px 18px",
          overflow: "hidden",
          border: open
            ? "1px solid rgba(255,255,255,0.7)"
            : "1px solid transparent",
          boxShadow: open
            ? "0 12px 32px rgba(15,23,42,0.15)"
            : "0 0 0 rgba(0,0,0,0)",
          zIndex: 50,
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0px)" : "translateY(-10px)",
          pointerEvents: open ? "auto" : "none",
          transition: "all 0.25s ease",
        }}>
        {/* DATE SELECTOR */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>
            Select Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
              fontSize: 14,
              outline: "none",
              cursor: "pointer",
            }}
          />
        </div>

        {/* CATEGORY DROPDOWN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
              fontSize: 14,
              cursor: "pointer",
              outline: "none",
              appearance: "none",
            }}>
            <option value="all">All Categories</option>
            {CATEGORY_KEYS.map((key) => (
              <option key={key} value={key}>
                {CATEGORY_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
