// src/components/productCards/ProductCards.jsx
import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import {
  Carrot,
  Drumstick,
  Soup,
  CookingPot,
  Utensils,
  Sprout,
} from "lucide-react";

const categories = [
  {
    label: "Vegetable Pickles",
    icon: <Carrot size={22} />,
    color: "#4C8BF5",
    bg: "#eaf2ff",
    count: 248,
    subtitle: "Fresh veggie assortments",
    slug: "vegetable",
  },
  {
    label: "Non Veg Pickles",
    icon: <Drumstick size={22} />,
    color: "#FF4C4C",
    bg: "#ffecec",
    count: 32,
    subtitle: "Most loved spicy picks",
    slug: "nonveg",
  },
  {
    label: "Delicious Powders",
    icon: <Soup size={22} />,
    color: "#F6C137",
    bg: "#fff7dd",
    count: 67,
    subtitle: "Daily spice essentials",
    slug: "powders",
  },
  {
    label: "Millets Ready to Cook",
    icon: <CookingPot size={22} />,
    color: "#34C759",
    bg: "#eafff2",
    count: 149,
    subtitle: "Easy cooking options",
    slug: "millets",
  },
  {
    label: "Ready to Eat",
    icon: <Utensils size={22} />,
    color: "#FFB545",
    bg: "#fff3dd",
    count: 86,
    subtitle: "Instant tasty food",
    slug: "readytoeat",
  },
  {
    label: "Organic Millets",
    icon: <Sprout size={22} />,
    color: "#22C55E",
    bg: "#e8ffe8",
    count: 143,
    subtitle: "100% pure millet variety",
    slug: "organic",
  },
];

export default function ProductCards() {
  return (
    <Grid
      container
      spacing={3}
      sx={{
        width: "100%",
        justifyContent: "center",
        mt: 3,
        px: 2,
      }}>
      {categories.map((cat, index) => (
        <Grid
          item
          key={index}
          xs={12} // FULL width on mobile
          sm={6} // 2 per row on small screens
          md={4} // 3 per row on tablets / small laptops
          lg={2} // 6 per row on large screens (your original design)
          sx={{ display: "flex", justifyContent: "center" }}>
          <Link
            to={`/category/${cat.slug}`}
            style={{ textDecoration: "none", color: "inherit" }}>
            <Box
              sx={{
                width: "190px",
                minHeight: "130px",
                background: cat.bg,
                borderRadius: "18px",
                padding: "18px",
                boxShadow: "0px 4px 20px rgba(0,0,0,0.06)",
                transition: "0.3s",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",

                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0px 8px 30px rgba(0,0,0,0.15)",
                },
              }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: `${cat.color}22`,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: cat.color,
                  }}>
                  {cat.icon}
                </Box>

                <Typography fontSize={35} fontWeight={700}>
                  {cat.count}
                </Typography>
              </Box>

              <Typography fontSize={15} fontWeight={700} sx={{ mt: 1 }}>
                {cat.label}
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  color: cat.color,
                  fontWeight: 700,
                  fontSize: "14px",
                }}>
                View →
              </Typography>
            </Box>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}
