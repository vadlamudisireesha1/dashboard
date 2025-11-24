import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

function VegetablePickles() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4 }}>
      <Button variant="contained" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <Typography variant="h4" fontWeight={700} sx={{ mt: 2 }}>
        Vegetable Pickles
      </Typography>

      <Typography sx={{ mt: 2, fontSize: "18px" }}>
        Here is some static data about Vegetable Pickles...
        <br />• Item Count: 248
        <br />• Category: Fresh veggie assortments
        <br />• Best Sellers: Mango, Lemon, Gongura
      </Typography>
    </Box>
  );
}

export default VegetablePickles;
