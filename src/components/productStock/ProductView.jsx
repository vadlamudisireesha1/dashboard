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
                minHeight: "180px",
                border: "2px dashed #c7c7c7",
                borderRadius: "18px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}>
              <Typography fontSize={40}>+</Typography>
              <Typography>Add New</Typography>
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
              border: "2px dashed #c7c7c7",
              padding: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              background: "rgba(255,255,255,0.6)",
            }}>
            <Typography fontSize={28} mr={1}>
              +
            </Typography>
            <Typography fontWeight={600}>Add New Product</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
