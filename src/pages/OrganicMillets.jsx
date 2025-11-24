import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

function OrganicMillets() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4 }}>
      <Button variant="contained" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <Typography variant="h4" fontWeight={700} sx={{ mt: 2 }}>
        Organic Millets
      </Typography>

      <Typography sx={{ mt: 2 }}>
        • Total: 143
        <br />• Kodo, Barnyard, Little, Foxtail millets
      </Typography>
    </Box>
  );
}

export default OrganicMillets;
