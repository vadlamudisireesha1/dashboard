import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import ProductCard from "./ProductCard";

export default function ProductView({
  pickles,
  view,
  expanded,
  onToggleExpand,
  onEdit,
  onAdd,
  getTotalUnits,
  getTotalValue,
  dotColor,
}) {
  return (
    <Box sx={{ mt: 3, minHeight: "100vh" }}>
      {/* GRID VIEW */}
      {view === "grid" && (
        <Grid container spacing={3}>
          {pickles.map((item, index) => (
            <Grid key={index} item sx={{ width: "260px" }}>
              <ProductCard
                item={item}
                index={index}
                view={view}
                opened={expanded === index}
                totalUnits={getTotalUnits(item.weights)}
                totalValue={getTotalValue(item.weights)}
                onEdit={onEdit}
                onToggle={() => onToggleExpand(index)}
                dotColor={dotColor}
              />
            </Grid>
          ))}

          {/* Add New */}
          <Grid item sx={{ width: "260px" }}>
            <Box
              onClick={onAdd}
              sx={{
                width: "240px",
                minHeight: "235px",
                borderRadius: "18px",
                border: "1px dashed rgba(148,163,184,0.8)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 16px 34px rgba(15,23,42,0.14)",
                transition:
                  "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, background 0.2s ease",
                "&:hover": {
                  borderColor: "#0f172a",
                  background: "rgba(255,255,255,0.98)",
                  boxShadow: "0 22px 50px rgba(15,23,42,0.24)",
                  transform: "translateY(-3px)",
                },
              }}>
              <Typography fontSize={40}>+</Typography>
              <Typography fontWeight={600} color="text.secondary">
                Add New
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* LIST VIEW */}
      {view === "list" && (
        <Box sx={{ mt: 2 }}>
          {pickles.map((item, index) => (
            <ProductCard
              key={index}
              item={item}
              index={index}
              view={view}
              opened={expanded === index}
              totalUnits={getTotalUnits(item.weights)}
              totalValue={getTotalValue(item.weights)}
              onEdit={onEdit}
              onToggle={() => onToggleExpand(index)}
              dotColor={dotColor}
            />
          ))}

          {/* Add new - list */}
          <Box
            onClick={onAdd}
            sx={{
              mt: 2,
              borderRadius: "18px",
              border: "1px dashed rgba(148,163,184,0.8)",
              padding: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 16px 34px rgba(15,23,42,0.14)",
              transition:
                "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, background 0.2s ease",
              "&:hover": {
                borderColor: "#0f172a",
                background: "rgba(255,255,255,0.98)",
                boxShadow: "0 22px 50px rgba(15,23,42,0.24)",
                transform: "translateY(-3px)",
              },
            }}>
            <Typography fontSize={28} mr={1}>
              +
            </Typography>
            <Typography fontWeight={600} color="text.secondary">
              Add New
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
