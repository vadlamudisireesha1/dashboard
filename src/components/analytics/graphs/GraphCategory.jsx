import React from "react";
import { Card, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#60A5FA",
  "#F97373",
  "#FBBF24",
  "#4ADE80",
  "#A855F7",
  "#F97316",
];

export default function GraphCategory({ data }) {
  return (
    <Card sx={{ p: 2.5, borderRadius: 3, height: 360 }}>
      <Typography fontWeight={900} mb={1.5}>
        Stock Distribution by Category
      </Typography>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            label>
            {data.map((entry, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
