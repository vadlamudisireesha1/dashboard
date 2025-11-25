import React from "react";
import { Box, TextField, InputAdornment, Button } from "@mui/material";
import { Search } from "lucide-react";
import { UserRoundPen } from "lucide-react";

function Navbar() {
  return (
    <Box
      sx={{
        MaxWidth: "100%",
        backgroundColor: "#3b8917ef",
        display: "flex",
        alignItems: "center",
        padding: "10px",
        gap: 3,
      }}>
      {/* LOGO */}
      <Box
        component="img"
        src="/The_Pickls_logo.webp"
        alt="logo"
        sx={{
          width: 70,
          height: 70,
          borderRadius: "50%",
          objectFit: "contain",
        }}
      />

      <Button
        variant="contained"
        sx={{
          backgroundColor: "white",
          color: "#3E9517",
          fontWeight: 600,
          borderRadius: "30px",
          padding: "10px 35px",
          textTransform: "none",
          ml: "auto",
          mr: 6,
          "&:hover": {
            backgroundColor: "#e8e8e8",
          },
        }}>
        <UserRoundPen />
      </Button>
    </Box>
  );
}

export default Navbar;
