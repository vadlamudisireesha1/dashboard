import React from "react";
import { Box, Typography, Stack } from "@mui/material";
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
    link: "/vegetable-pickles",
  },
  {
    label: "Non Veg Pickles",
    icon: <Drumstick size={22} />,
    color: "#FF4C4C",
    bg: "#ffecec",
    count: 32,
    subtitle: "Most loved spicy picks",
    link: "/nonveg-pickles",
  },
  {
    label: "Delicious Powders",
    icon: <Soup size={22} />,
    color: "#F6C137",
    bg: "#fff7dd",
    count: 67,
    subtitle: "Daily spice essentials",
    link: "/delicious-powders",
  },
  {
    label: "Millets Ready to Cook",
    icon: <CookingPot size={22} />,
    color: "#34C759",
    bg: "#eafff2",
    count: 149,
    subtitle: "Easy cooking options",
    link: "/millets-ready-to-cook",
  },
  {
    label: "Ready to Eat",
    icon: <Utensils size={22} />,
    color: "#FFB545",
    bg: "#fff3dd",
    count: 86,
    subtitle: "Instant tasty food",
    link: "/ready-to-eat",
  },
  {
    label: "Organic Millets",
    icon: <Sprout size={22} />,
    color: "#22C55E",
    bg: "#e8ffe8",
    count: 143,
    subtitle: "100% pure millet variety",
    link: "/organic-millets",
  },
];

export default function ProductCards() {
  return (
    <Stack
      direction="row"
      spacing={3}
      sx={{
        width: "100%",
        justifyContent: "center",
        mt: 3,
      }}>
      {categories.map((cat, index) => (
        <Link
          key={index}
          to={cat.link}
          style={{ textDecoration: "none", color: "inherit" }}>
          <Box
            sx={{
              width: "15%",
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
              flexDirection: "column",
              minWidth: "190px",
              minHeight: "130px",
              background: cat.bg,
              borderRadius: "18px",
              padding: "18px",
              boxShadow: "0px 4px 20px rgba(0,0,0,0.06)",
              transition: "0.3s",
              cursor: "pointer",

              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0px 8px 30px rgba(0,0,0,0.15)",
              },
            }}>
            {/* ICON + NUMBER */}
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

            {/* TITLE */}
            <Typography fontSize={15} fontWeight={700} sx={{ mt: 1 }}>
              {cat.label}
            </Typography>

            {/* SUBTITLE */}
            {/* <Typography fontSize={13} sx={{ opacity: 0.6, mt: 0.5 }}>
              {cat.subtitle}
            </Typography> */}

            {/* VIEW LINK (Optional, you can remove this now) */}
            <Typography
              sx={{
                marginTop: "8px",
                color: cat.color,
                fontWeight: 700,
                fontSize: "14px",
              }}>
              View →
            </Typography>
          </Box>
        </Link>
      ))}
    </Stack>
  );
}
