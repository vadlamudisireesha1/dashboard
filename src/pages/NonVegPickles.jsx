import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

function NonVegPickles() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4 }}>
      <Button variant="contained" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <Typography variant="h4" fontWeight={700} sx={{ mt: 2 }}>
        Non Veg Pickles
      </Typography>

      <Typography sx={{ mt: 2, fontSize: "18px" }}>
        Static Data:
        <br />• Total Products: 32
        <br />• Popular: Chicken, Mutton, Fish Pickles
      </Typography>
    </Box>
  );
}

export default NonVegPickles;
