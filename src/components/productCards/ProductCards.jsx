import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Grid, IconButton, Collapse } from "@mui/material";
import { Link } from "react-router-dom";

import categoryData from "../../data/productCards.json";
import AddNewProductModal from "./AddNewProductModal";

import {
  Carrot,
  Drumstick,
  Soup,
  CookingPot,
  Utensils,
  Sprout,
  Plus,
  Trash2,
  ChevronDown,
} from "lucide-react";
// IMPORT ALL CATEGORY JSON FILES (AUTO UPDATE COUNTS)
import nonvegData from "../../data/nonveg.json";
import vegetableData from "../../data/vegetable.json";
import powdersData from "../../data/powders.json";
import milletsData from "../../data/millets.json";
import readytoeatData from "../../data/readytoeat.json";
import organicData from "../../data/organic.json";

// ICON MAP
const iconMap = {
  carrot: <Carrot size={22} />,
  drumstick: <Drumstick size={22} />,
  soup: <Soup size={22} />,
  cookingpot: <CookingPot size={22} />,
  utensils: <Utensils size={22} />,
  sprout: <Sprout size={22} />,
  snack: <Utensils size={22} />,
  bowl: <Soup size={22} />,
  curry: <CookingPot size={22} />,
  spicy: <Sprout size={22} />,
  sweets: <Carrot size={22} />,
};

// Map slug → JSON data
const categoryMap = {
  nonveg: nonvegData,
  vegetable: vegetableData,
  powders: powdersData,
  millets: milletsData,
  readytoeat: readytoeatData,
  organic: organicData,
};

// Calculate total units dynamically
const getTotalUnits = (items = []) => {
  let total = 0;
  items.forEach((item) => {
    Object.values(item.weights).forEach((w) => {
      total += Number(w.units || 0);
    });
  });
  return total;
};

const LOCAL_KEY = "extraProducts_v1";

export default function ProductCards() {
  const initialProducts = useMemo(() => categoryData || [], []);
  const [customProducts, setCustomProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCustomProducts(parsed);
      } catch {}
    }
  }, []);

  const persist = (items) => {
    setCustomProducts(items);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
  };

  const handleAddProduct = (newProduct) => {
    const slugBase =
      newProduct.slug || newProduct.label.toLowerCase().replace(/\s+/g, "-");
    const product = {
      ...newProduct,
      id: Date.now(),
      slug: `${slugBase}-${Date.now()}`,
      isCustom: true,
    };

    const updated = [...customProducts, product];
    persist(updated);
    setExpanded(true);
  };

  const handleDelete = (id) => {
    persist(customProducts.filter((i) => i.id !== id));
  };

  return (
    <>
      <AddNewProductModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAdd={handleAddProduct}
      />

      {/* DEFAULT PRODUCTS */}
      <Grid container spacing={3} sx={{ mt: 3, px: 2 }}>
        {initialProducts.map((cat, i) => (
          <Grid item key={i} xs={12} sm={6} md={4} lg={2}>
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
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0px 8px 30px rgba(0,0,0,0.12)",
                  },
                }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "12px",
                      background: `${cat.color}22`,
                      color: cat.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    {iconMap[cat.icon]}
                  </Box>

                  {/* AUTO UPDATED COUNT */}
                  <Typography fontSize={35} fontWeight={700}>
                    {getTotalUnits(categoryMap[cat.slug]?.items)}
                  </Typography>
                </Box>

                <Typography sx={{ mt: 1 }} fontWeight={700}>
                  {cat.label}
                </Typography>

                <Typography sx={{ mt: 1, color: cat.color, fontWeight: 700 }}>
                  View →
                </Typography>
              </Box>
            </Link>
          </Grid>
        ))}
      </Grid>

      {/* SPACING BEFORE CUSTOM SECTION */}
      <Box sx={{ height: "25px" }} />

      {/* CUSTOM PRODUCTS SECTION */}
      <Collapse in={expanded} timeout={450} unmountOnExit>
        <Grid container spacing={3} sx={{ px: 2, mb: 3 }}>
          {customProducts.map((cat) => (
            <Grid key={cat.id} item xs={12} sm={6} md={4} lg={2}>
              <Box sx={{ position: "relative" }}>
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
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0px 8px 30px rgba(0,0,0,0.12)",
                    },
                  }}>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "12px",
                        background: `${cat.color}22`,
                        color: cat.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                      {iconMap[cat.icon]}
                    </Box>

                    <Typography fontSize={35} fontWeight={700}>
                      {cat.count}
                    </Typography>
                  </Box>

                  <Typography sx={{ mt: 1 }} fontWeight={700}>
                    {cat.label}
                  </Typography>
                </Box>

                {/* DELETE */}
                <IconButton
                  onClick={() => handleDelete(cat.id)}
                  size="small"
                  sx={{
                    position: "absolute",
                    right: -6,
                    top: -6,
                    bgcolor: "white",
                    border: "1px solid #eee",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  }}>
                  <Trash2 size={16} />
                </IconButton>
              </Box>
            </Grid>
          ))}

          {/* ADD NEW PRODUCT */}
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Box
              onClick={() => setOpenModal(true)}
              sx={{
                width: "190px",
                minHeight: "130px",
                background: "#f0f0f0",
                borderRadius: "18px",
                padding: "18px",
                border: "2px dashed #888",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0px 8px 30px rgba(0,0,0,0.12)",
                },
              }}>
              <Plus size={36} />
            </Box>
          </Grid>
        </Grid>
      </Collapse>

      {/* FINAL SEPARATOR */}
      <Box sx={{ width: "100%", position: "relative", mt: 1, mb: 4 }}>
        <Box sx={{ width: "100%", height: "1.5px", backgroundColor: "#ddd" }} />

        <Box
          onClick={() => setExpanded(!expanded)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          sx={{
            position: "absolute",
            left: "50%",
            top: "-14px",
            transform: "translateX(-50%)",
            background: "#fff",
            px: 2,
            py: "3px",
            borderRadius: "999px",
            border: "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            transition: "0.25s",
            "&:hover": {
              transform: "translateX(-50%) translateY(-3px)",
            },
          }}>
          {hover ? (
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
              {expanded ? "Show Less" : "Show More"}
            </Typography>
          ) : (
            <ChevronDown
              size={18}
              style={{
                transition: "0.3s",
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          )}
        </Box>
      </Box>
    </>
  );
}
