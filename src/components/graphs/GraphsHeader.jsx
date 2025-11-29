// src/components/graphs/GraphsHeader.jsx
import React, { useState } from "react";
import { calculateStockValue, getTotalUnits } from "./graphUtils";

function StatCard({ label, value, accent, icon }) {
  const [hovered, setHovered] = useState(false);

  const baseStyle = {
    flex: 1,
    minWidth: 220,
    borderRadius: 24,
    padding: 20,
    background: accent.background,
    border: "1px solid rgba(255,255,255,0.7)",
    boxShadow: hovered
      ? "0 24px 40px rgba(15,23,42,0.25)"
      : "0 14px 30px rgba(15,23,42,0.14)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    transition: "transform 0.18s ease-out, box-shadow 0.18s ease-out",
    transform: hovered ? "translateY(-4px) scale(1.01)" : "translateY(0)",
  };

  const labelStyle = {
    fontSize: 12,
    color: accent.labelColor,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  };

  const valueStyle = {
    fontSize: 26,
    fontWeight: 800,
    color: accent.valueColor,
  };

  const iconWrapStyle = {
    width: 32,
    height: 32,
    borderRadius: 999,
    background: accent.iconBg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  };

  return (
    <div
      style={baseStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={labelStyle}>{label}</div>
          <div style={valueStyle}>{value}</div>
        </div>
        <div style={iconWrapStyle}>{icon}</div>
      </div>
    </div>
  );
}

export default function GraphsHeader({ items }) {
  const totalProducts = items.length;
  const totalUnits = getTotalUnits(items);
  const totalValue = calculateStockValue(items);

  const cards = [
    {
      label: "Products",
      value: totalProducts,
      accent: {
        background:
          "linear-gradient(135deg, #eff6ff 0%, #dbeafe 40%, #e0f2fe 100%)",
        labelColor: "#1d4ed8",
        valueColor: "#0f172a",
        iconBg: "rgba(59,130,246,0.15)",
      },
      icon: "📦",
    },
    {
      label: "Total Units",
      value: totalUnits,
      accent: {
        background:
          "linear-gradient(135deg, #ecfdf5 0%, #bbf7d0 40%, #dcfce7 100%)",
        labelColor: "#047857",
        valueColor: "#022c22",
        iconBg: "rgba(16,185,129,0.18)",
      },
      icon: "📈",
    },
    {
      label: "Stock Value",
      value: `₹ ${totalValue.toLocaleString("en-IN")}`,
      accent: {
        background:
          "linear-gradient(135deg, #fff7ed 0%, #fed7aa 40%, #ffedd5 100%)",
        labelColor: "#c2410c",
        valueColor: "#431407",
        iconBg: "rgba(249,115,22,0.18)",
      },
      icon: "💰",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: 18,
        flexWrap: "wrap",
      }}>
      {cards.map((card) => (
        <StatCard
          key={card.label}
          label={card.label}
          value={card.value}
          accent={card.accent}
          icon={card.icon}
        />
      ))}
    </div>
  );
}
