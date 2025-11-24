import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

export default function Dashboard() {
    const monthlySales = [
        { month: "Jan", sales: 12000 },
        { month: "Feb", sales: 15000 },
        { month: "Mar", sales: 14000 },
        { month: "Apr", sales: 18000 },
        { month: "May", sales: 21000 },
        { month: "Jun", sales: 25000 },
    ];

    const categorySales = [
        { name: "Vegetable Pickles", value: 35, color: "#FF6B6B" },
        { name: "Non Veg Pickles", value: 22, color: "#4ECDC4" },
        { name: "Delicious Powders", value: 18, color: "#556EE6" },
        { name: "Millets Ready to Cook", value: 12, color: "#FFA502" },
        { name: "Ready to Eat", value: 8, color: "#2ED573" },
        { name: "Organic Millets", value: 14, color: "#A55EEA" },
    ];

    return (
        <div style={{ padding: "24px" }}>
            <Typography variant="h5" style={{ fontWeight: "bold", marginBottom: "20px" }}>
                📊 Analytics Overview
            </Typography>

            <Grid container spacing={5}>

                {/* Category Sales Chart */}
                <Grid item xs={12} md={6}>
                    <Card elevation={4} style={{ padding: "16px", borderRadius: "16px" }}>
                        <Typography variant="h6" style={{ marginBottom: "12px", fontWeight: 900 }}>
                            Category Sales
                        </Typography>
                        <PieChart width={700} height={400}>
                            <Pie data={categorySales} dataKey="value" nameKey="name" outerRadius={150}>
                                {categorySales.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />

                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>

                    </Card>
                </Grid>

                {/* Monthly Sales Chart */}
                <Grid item xs={12} md={6}>
                    <Card elevation={4} style={{ padding: "16px", borderRadius: "16px" }}>
                        <Typography variant="h6" style={{ marginBottom: "12px", fontWeight: 900 }}>
                            Monthly Sales
                        </Typography>
                        <LineChart width={700} height={400} data={monthlySales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="sales" stroke="blue" strokeWidth={2} />
                        </LineChart>
                    </Card>
                </Grid>


            </Grid>
        </div>
    );
}
