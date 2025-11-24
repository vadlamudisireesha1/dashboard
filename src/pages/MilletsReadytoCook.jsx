import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

function MilletsReadytoCook() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4 }}>
      <Button variant="contained" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <Typography variant="h4" fontWeight={700} sx={{ mt: 2 }}>
        Millets Ready to Cook
      </Typography>

      <Typography sx={{ mt: 2 }}>
        • 149 Products
        <br />• Millet upma mix, dosa mix, pongal mix and more
      </Typography>
    </Box>
  );
}

export default MilletsReadytoCook;
