import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

function DeliciousPowders() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4 }}>
      <Button variant="contained" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <Typography variant="h4" fontWeight={700} sx={{ mt: 2 }}>
        Delicious Powders
      </Typography>

      <Typography sx={{ mt: 2 }}>
        • Total: 67 items
        <br />• Sambar, Rasam, Chicken Masala, Garam Masala
      </Typography>
    </Box>
  );
}

export default DeliciousPowders;
