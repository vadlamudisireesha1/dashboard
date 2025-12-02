// src/components/productStock/StockHeader.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Download, Grid3X3, List, History as HistoryIcon, Plus } from "lucide-react";

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
  onAdd, // <-- required for Add button
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
          backgroundColor: "#ec2727ff",
          color: "white",
          "&:hover": {
            backgroundColor: "#d8491dff",
          },
        }}>
        ← HOME
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
        
        {/* LEFT SECTION */}
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
            <Typography variant="h6" color="text.secondary" fontWeight={700}>
              Products :
              <Typography
                component="span"
                fontWeight={700}
                variant="h5"
                sx={{ paddingLeft: "6px", color: "blue" }}>
                {productCount}
              </Typography>
            </Typography>

            <Typography variant="h6" color="text.secondary" fontWeight={800}>
              Units :
              <Typography
                component="span"
                fontWeight={700}
                variant="h5"
                sx={{ paddingLeft: "6px", color: "#ee8f3bff" }}>
                {totalUnits}
              </Typography>
            </Typography>

            <Typography
              variant="h6"
              fontWeight={800}
              color="text.secondary">
              Total Value :
              <Typography
                component="span"
                variant="h6"
                fontWeight={800}
                sx={{ color: "#16a34a", paddingLeft: "8px" }}>
                ₹{" "}
                {pickles
                  .reduce((sum, item) => sum + getTotalValue(item.weights), 0)
                  .toLocaleString("en-IN")}
              </Typography>
            </Typography>
          </Box>
        </Box>

        {/* RIGHT SECTION — Add + History + Download + View */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          
          {/* ADD BUTTON */}
          <Button
            variant="outlined"
            startIcon={<Plus size={20} />}
            onClick={onAdd} // <-- SAME as Add New card
            sx={{
              borderRadius: 3,
              fontWeight: 600,
              minWidth: "auto",
              padding: "8px 12px",
              border: "1.5px solid #cbd5e1",
              color: "#475569",
              "& .MuiButton-startIcon": { margin: 0 },
              "&:hover": {
                borderColor: "#0f766e",
                bgcolor: "#f0fdfa",
              },
            }}
          />

          {/* HISTORY BUTTON */}
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
              "& .MuiButton-startIcon": { margin: 0 },
              "&:hover": {
                borderColor: "#0f766e",
                bgcolor: "#f0fdfa",
              },
            }}
          />

          {/* DOWNLOAD */}
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

          {/* GRID / LIST SWITCH */}
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
