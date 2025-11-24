import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

function ReadytoEat() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4 }}>
      <Button variant="contained" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <Typography variant="h4" fontWeight={700} sx={{ mt: 2 }}>
        Ready to Eat
      </Typography>

      <Typography sx={{ mt: 2 }}>
        • 86 quick foods
        <br />• Chapati rolls, millet laddus, snacks, etc.
      </Typography>
    </Box>
  );
}

export default ReadytoEat;
