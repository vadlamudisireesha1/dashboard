import React from "react";
import { Card, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";

export default function GraphGauge({ totalValue }) {
  // just normalize it to a range so the arc looks nice
  const maxValue = Math.max(totalValue, 1);
  const percent = Math.min(100, Math.round((totalValue / maxValue) * 100));

  const data = [
    {
      name: "Stock Value",
      value: percent,
      fill: "#16A34A",
    },
  ];

  return (
    <Card sx={{ p: 2.5, borderRadius: 3, height: 360 }}>
      <Typography fontWeight={900} mb={1.5}>
        Stock Value Meter
      </Typography>

      <Typography variant="h6" fontWeight={800} mb={2}>
        ₹{totalValue.toLocaleString("en-IN")}
      </Typography>

      <ResponsiveContainer width="100%" height="80%">
        <RadialBarChart
          innerRadius="60%"
          outerRadius="100%"
          data={data}
          startAngle={180}
          endAngle={0}>
          <RadialBar background dataKey="value" cornerRadius={10} />
          <Legend />
        </RadialBarChart>
      </ResponsiveContainer>
    </Card>
  );
}
