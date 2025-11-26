import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { UserRoundPen } from "lucide-react";

function Navbar() {
  return (
    <Box
      sx={{
        bgcolor: "rgba(255, 255, 255, 0.12)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.18)",
        position: "sticky",
        top: 0,
        zIndex: 1300,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
      }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: { xs: 2, sm: 4 },
          py: 2,
          maxWidth: "1400px",
          mx: "auto",
        }}>
        {/* Logo + Brand Name */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            component="img"
            src="/The_Pickls_logo.webp"
            alt="The Pickls"
            sx={{
              width: { xs: 44, sm: 52 },
              height: { xs: 44, sm: 52 },
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          />

          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "#1a3a1a",
              letterSpacing: "0.3px",
              display: { xs: "none", md: "block" }, // Hide text on very small screens
            }}>
            The Pickls
          </Typography>
        </Stack>

        {/* Center Title - Only visible on larger screens */}
        <Typography
          variant="h6"
          sx={{
            position: "absolute",
            left: 50,
            right: 50,
            textAlign: "center",
            fontWeight: 600,
            color: "#1e3a1e",
            pointerEvents: "none",
            display: { xs: "none", lg: "block" }, // Only show on large screens
          }}>
          Stock Inventory Management
        </Typography>

        {/* Profile Button */}
        <Button
          variant="contained"
          startIcon={<UserRoundPen size={19} />}
          sx={{
            bgcolor: "white",
            color: "#2e7d32",
            fontWeight: 600,
            fontSize: "0.95rem",
            textTransform: "none",
            borderRadius: "30px",
            px: 3,
            py: 1,
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.12)",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "white",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.18)",
              transform: "translateY(-2px)",
            },
          }}>
          Profile
        </Button>
      </Stack>
    </Box>
  );
}

export default Navbar;
