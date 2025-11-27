// src/components/productStock/StockHeader.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Download, Grid3X3, List, History as HistoryIcon } from "lucide-react";

import DownloadFiles from "./DownloadFiles";

export default function StockHeader({
  title,
  productCount,
  totalUnits,
  view,
  onChangeView,
  onBack,
  pickles,
  data,
  getTotalUnits,
  getTotalValue,
  onOpenHistory,
}) {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  return (
    <Box sx={{ mb: 4, position: "relative" }}>
      {/* Back Button */}
      <Button
        variant="text"
        onClick={onBack}
        sx={{
          mb: 2,
          fontWeight: 600,
          backgroundColor: "blue",
          color: "white",
          "&:hover": {
            backgroundColor: "#1d4ed8",
          },
        }}>
        ← Back
      </Button>

      {/* Main Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}>
        {/* Left — Title + Stats */}
        <Box>
          <Typography
            variant="h3"
            fontWeight={900}
            sx={{ color: "#1e293b", letterSpacing: "-0.5px" }}>
            {title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mt: 1.5,
              flexWrap: "wrap",
            }}>
            <Typography variant="h6" color="text.secondary" fontWeight={600}>
              {productCount} Products
            </Typography>

            <Typography variant="h6" color="#16a34a" fontWeight={800}>
              {totalUnits} Units
            </Typography>
          </Box>
        </Box>

        {/* Right — History + Download + Layout Toggle */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* History Button */}
          <Button
            variant="outlined"
            startIcon={<HistoryIcon size={20} />}
            onClick={onOpenHistory}
            sx={{
              borderRadius: 3,
              fontWeight: 600,
              minWidth: "auto",
              padding: "8px 12px",
              border: "1.5px solid #cbd5e1",
              color: "#475569",
              "& .MuiButton-startIcon": {
                margin: 0,
              },
              "&:hover": {
                borderColor: "#0f766e",
                bgcolor: "#f0fdfa",
              },
            }}
          />

          {/* Download Button + Dropdown */}
          <Box sx={{ position: "relative" }}>
            <Button
              variant="outlined"
              startIcon={<Download size={22} />}
              onClick={() => setShowDownloadMenu((prev) => !prev)}
              sx={{
                borderRadius: 3,
                fontWeight: 600,
                minWidth: "auto",
                padding: "8px 12px",
                border: "1.5px solid #cbd5e1",
                color: "#475569",
                "& .MuiButton-startIcon": { margin: 0 },
                "&:hover": {
                  borderColor: "#42961A",
                  bgcolor: "#f8fafc",
                },
              }}
            />

            {showDownloadMenu && (
              <DownloadFiles
                pickles={pickles}
                data={data}
                getTotalUnits={getTotalUnits}
                getTotalValue={getTotalValue}
                onClose={() => setShowDownloadMenu(false)}
              />
            )}
          </Box>

          {/* View Toggle */}
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(e, v) => v && onChangeView(v)}
            sx={{
              bgcolor: "#f8fafc",
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid grey",
              "& .MuiToggleButton-root": {
                border: "none",
                px: 3,
                py: 1.5,
                "&.Mui-selected": {
                  bgcolor: "#42961A",
                  color: "white",
                  border: "none",
                  "&:hover": { bgcolor: "#42961A" },
                },
              },
            }}>
            <ToggleButton value="grid">
              <Grid3X3 size={20} />
            </ToggleButton>
            <ToggleButton value="list">
              <List size={20} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
    </Box>
  );
}
