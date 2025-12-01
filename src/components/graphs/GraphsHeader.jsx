import React, { useState } from "react";
import {
  Package,
  Boxes,
  CircleDollarSign,
  Filter,
  BarChart3,
} from "lucide-react";
import {
  calculateStockValue,
  getTotalUnits,
  CATEGORY_KEYS,
  CATEGORY_LABELS,
} from "./graphUtils";

function StatCard({ label, value, accent, Icon }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        minWidth: 220,
        borderRadius: 24,
        padding: 20,
        background: accent.background,
        border: "1px solid rgba(255,255,255,0.7)",
        boxShadow: hovered
          ? "0 24px 40px rgba(15,23,42,0.25)"
          : "0 14px 30px rgba(15,23,42,0.14)",
        transform: hovered ? "translateY(-2px)" : "translateY(0px)",
        transition: "all 0.2s ease",
        zIndex: 1, // prevents overlap above dropdown
      }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div
            style={{
              fontSize: 12,
              color: accent.labelColor,
              letterSpacing: ".05em",
            }}>
            {label}
          </div>
          <div
            style={{ fontSize: 28, fontWeight: 800, color: accent.valueColor }}>
            {value}
          </div>
        </div>

        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: accent.iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Icon size={18} color={accent.iconColor} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
}

export default function GraphsHeader({
  items,
  category,
  setCategory,
  date,
  setDate,
}) {
  const totalProducts = items.length;
  const totalUnits = getTotalUnits(items);
  const totalValue = calculateStockValue(items);

  const [open, setOpen] = useState(false);

  // local temporary values
  const [tmpCategory, setTmpCategory] = useState(category);
  const [tmpDate, setTmpDate] = useState(date);

  // APPLY FILTER
  const applyFilter = () => {
    setCategory(tmpCategory);
    setDate(tmpDate);
    setOpen(false);
  };

  // CANCEL FILTER
  const cancelFilter = () => {
    setTmpCategory(category);
    setTmpDate(date);
    setOpen(false);
  };

  return (
    <div>
      {/* HEADER BAR */}
      <div
        style={{
          padding: 20,
          borderRadius: 18,
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.45)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 8px 24px rgba(15,23,42,.15)",
          marginBottom: 20,
          position: "relative",
          zIndex: 10,
        }}>
        {/* LEFT TITLE */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 14,
              background: "linear-gradient(135deg,#4f46e5,#22c55e,#0ea5e9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 28px rgba(15,23,42,.28)",
            }}>
            <BarChart3 size={22} color="#fff" />
          </div>

          <div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900 }}>
              Stock Analytics Dashboard
            </h1>
            <p style={{ margin: 0, color: "#6b7280", marginTop: 4 }}>
              Track stock, sales and category performance in one clean view.
            </p>
          </div>
        </div>

        {/* RIGHT FILTER BUTTON */}
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setOpen(!open)}
            style={{
              background: "rgba(255,255,255,0.95)",
              padding: "10px 16px",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              border: "1px solid rgba(255,255,255,.75)",
              fontWeight: 600,
              transition: ".25s",
              boxShadow: "0 6px 18px rgba(15,23,42,.12)",
            }}>
            <Filter size={16} />
            Filter
          </div>

          {/* DROPDOWN */}
          {open && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 52,
                width: 320,
                padding: 18,
                background: "rgba(255,255,255,0.98)",
                backdropFilter: "blur(14px)",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,.7)",
                boxShadow: "0 12px 32px rgba(15,23,42,.15)",
                zIndex: 999,
              }}>
              {/* FILTER GRID */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  columnGap: 12,
                  marginBottom: 12,
                }}>
                {/* DATE */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label
                    style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={tmpDate}
                    onChange={(e) => setTmpDate(e.target.value)}
                    style={{
                      padding: "9px 12px",
                      borderRadius: 8,
                      border: "1px solid #d4d4d8",
                      background: "#f8fafc",
                    }}
                  />
                </div>

                {/* CATEGORY */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      marginBottom: 4,
                    }}>
                    Category
                  </label>
                  <select
                    value={tmpCategory}
                    onChange={(e) => setTmpCategory(e.target.value)}
                    style={{
                      padding: "9px 12px",
                      borderRadius: 8,
                      border: "1px solid #d4d4d8",
                      background: "#f8fafc",
                    }}>
                    <option value="all">All</option>
                    {CATEGORY_KEYS.map((key) => (
                      <option key={key} value={key}>
                        {CATEGORY_LABELS[key]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* BUTTONS */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  marginTop: 8,
                }}>
                <button
                  onClick={cancelFilter}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1px solid #d4d4d8",
                    background: "#ffffff",
                    cursor: "pointer",
                  }}>
                  Cancel
                </button>

                <button
                  onClick={applyFilter}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 8,
                    background: "#2563eb",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                  }}>
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SUMMARY CARDS */}
      {/* SUMMARY CARDS */}
      <div
        style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 20 }}>
        <StatCard
          label="Products"
          value={totalProducts}
          Icon={Package}
          accent={{
            background: "linear-gradient(135deg,#eff6ff,#dbeafe,#e0f2fe)",
            labelColor: "#1d4ed8",
            valueColor: "#0f172a",
            iconBg: "rgba(59,130,246,.15)",
            iconColor: "#1d4ed8",
          }}
        />

        <StatCard
          label="Total Units"
          value={totalUnits}
          Icon={Boxes}
          accent={{
            background: "linear-gradient(135deg,#ecfdf5,#bbf7d0,#dcfce7)",
            labelColor: "#047857",
            valueColor: "#022c22",
            iconBg: "rgba(16,185,129,.18)",
            iconColor: "#047857",
          }}
        />

        <StatCard
          label="Stock Value"
          value={`₹ ${totalValue.toLocaleString("en-IN")}`}
          Icon={CircleDollarSign}
          accent={{
            background: "linear-gradient(135deg,#fff7ed,#fed7aa,#ffedd5)",
            labelColor: "#c2410c",
            valueColor: "#431407",
            iconBg: "rgba(249,115,22,.18)",
            iconColor: "#c2410c",
          }}
        />
      </div>
    </div>
  );
}
