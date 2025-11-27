import React from "react";
import { Card, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function GraphSales({ data }) {
  return (
    <Card sx={{ p: 2.5, borderRadius: 3, height: 360 }}>
      <Typography fontWeight={900} mb={1.5}>
        Sales Trend (Units Sold)
      </Typography>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="units"
            stroke="#4F46E5"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
