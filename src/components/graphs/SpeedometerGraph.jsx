import React from "react";
import { Gauge } from "lucide-react";
import { calculateStockValue } from "./graphUtils";

export default function StockSpeedometerGraph({ items }) {
  const totalValue = calculateStockValue(items);
  const maxValue = totalValue * 1.3 || 1000;
  const percentage = (totalValue / maxValue) * 100;

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 28,
        padding: "28px 30px 20px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
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
        <Gauge size={18} strokeWidth={2.2} />
        <span>Stock Value Meter</span>
      </h2>

      <p
        style={{
          margin: "6px 0 18px 0",
          color: "#64748b",
          fontSize: 13,
        }}>
        Current stock worth:{" "}
        <strong>₹ {totalValue.toLocaleString("en-IN")}</strong>
      </p>

      {/* Gauge Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 210,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
        }}>
        {/* Background Arc */}
        <svg width="220" height="120">
          <path
            d="M 10 110 A 100 100 0 0 1 210 110"
            stroke="#e5e7eb"
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
          />

          {/* Foreground Animated Arc */}
          <path
            d="M 10 110 A 100 100 0 0 1 210 110"
            stroke="url(#grad)"
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="314"
            strokeDashoffset={314 - (314 * percentage) / 100}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />

          {/* Gradient */}
          <defs>
            <linearGradient id="grad">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>
        </svg>

        {/* Needle */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            width: 4,
            height: 80,
            background: "#0f172a",
            transformOrigin: "bottom",
            transform: `translateX(-50%) rotate(${percentage * 1.8 - 90}deg)`,
            borderRadius: 2,
            transition: "0.8s ease",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
          }}></div>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: 8,
          fontSize: 12,
          color: "#6b7280",
        }}>
        Max Capacity:{" "}
        <strong>₹ {Math.round(maxValue).toLocaleString("en-IN")}</strong>
      </div>
    </div>
  );
}
