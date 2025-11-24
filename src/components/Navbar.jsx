import React from "react";
import { Box, TextField, InputAdornment, Button } from "@mui/material";
import { Search } from "lucide-react";

export default function Navbar() {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#3E9517",
        display: "flex",
        alignItems: "center",
        padding: "20px",
        gap: 3,
      }}
    >
      {/* LOGO */}
      <Box
        component="img"
        src="/The_Pickls_logo.webp"
        alt="logo"
        sx={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          objectFit: "contain",
        }}
      />

      {/* SEARCH BAR */}
      <Box sx={{ width: "70%" }}>
        <TextField
          placeholder="I'm looking for..."
          variant="outlined"
          fullWidth
          sx={{
            backgroundColor: "white",
            borderRadius: "50px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px",
              paddingLeft: "20px",
              paddingRight: "20px",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ color: "black", pr: 2 }}>
                <Search size={20} style={{ marginRight: "8px" }} />
                <span style={{ fontSize: "16px" }}>Search</span>
              </InputAdornment>
            ),
          }}
        />
      </Box>
       
      {/* RIGHT SIDE BUTTON */}
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
        }}
      >
        Login
      </Button>
    </Box>
  );
}