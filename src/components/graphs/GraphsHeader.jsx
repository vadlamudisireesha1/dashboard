// src/components/graphs/GraphsHeader.jsx
import React from "react";
import { calculateStockValue, getTotalUnits } from "./graphUtils";

export default function GraphsHeader({ items }) {
  const totalProducts = items.length;
  const totalUnits = getTotalUnits(items);
  const totalValue = calculateStockValue(items);

  const cardStyle = {
    flex: 1,
    minWidth: 200,
    background: "#ffffff",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
  };

  const labelStyle = { fontSize: 12, color: "#64748b", marginBottom: 4 };
  const valueStyle = { fontSize: 22, fontWeight: 800, color: "#0f172a" };

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        flexWrap: "wrap",
        marginBottom: 24,
      }}>
      <div style={cardStyle}>
        <div style={labelStyle}>Products</div>
        <div style={valueStyle}>{totalProducts}</div>
      </div>

      <div style={cardStyle}>
        <div style={labelStyle}>Total Units</div>
        <div style={valueStyle}>{totalUnits}</div>
      </div>

      <div style={cardStyle}>
        <div style={labelStyle}>Stock Value</div>
        <div style={valueStyle}>₹ {totalValue.toLocaleString("en-IN")}</div>
      </div>
    </div>
  );
}
