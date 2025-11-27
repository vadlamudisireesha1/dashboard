import React from "react";
import { Box, Typography, IconButton, Collapse } from "@mui/material";
import { Edit, ChevronDown, ChevronUp, PlusCircle } from "lucide-react";

export default function ProductCard({
  item,
  index,
  view = "grid",
  opened,
  totalUnits,
  totalValue,
  onEdit,
  onToggle,
  dotColor,
  isAddNew = false,
}) {
  const dotColorValue = dotColor(totalUnits);
  const formattedValue = totalValue.toLocaleString("en-IN");

  if (isAddNew) {
    return (
      <Box
        onClick={onToggle}
        sx={{
          height: "100%",
          border: "2px dashed #cbd5e1",
          borderRadius: 3,
          bgcolor: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": { borderColor: "primary.main", bgcolor: "#f1f5f9" },
        }}>
        <PlusCircle size={44} color="#64748b" />
        <Typography mt={1} fontWeight={600} color="text.secondary">
          Add New Product
        </Typography>
      </Box>
    );
  }

  const cardBase = {
    borderRadius: 3,
    bgcolor: "white",
    border: "1px solid #e2e8f0",
    overflow: "visible",
    position: "relative",
  };

  if (view === "grid") {
    return (
      <Box sx={cardBase}>
        {/* HEADER */}
        <Box sx={{ p: 2, pb: 1.5, borderBottom: "1px solid #f1f5f9" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Typography
              fontWeight={700}
              sx={{
                pr: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "70%",
              }}>
              {item.name}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: dotColorValue,
                }}
              />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(index);
                }}>
                <Edit size={15} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* TOTAL UNITS */}
        <Box sx={{ textAlign: "center", py: 2.5, bgcolor: "#f8fafc" }}>
          <Typography variant="h3" fontWeight={900} color={dotColorValue}>
            {totalUnits}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Total Units
          </Typography>
        </Box>

        {/* TOTAL VALUE + CHEVRON */}
        <Box
          sx={{
            p: 2,
            pt: 1,
            pb: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}>
          <Typography fontWeight={600} color="text.secondary">
            Total Value
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography fontWeight={900}>₹{formattedValue}</Typography>

            <IconButton
              sx={{ p: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}>
              {opened ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </IconButton>
          </Box>
        </Box>

        {/* FLOATING DROPDOWN BELOW CARD */}
        <Collapse in={opened}>
          <Box
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              mt: 1,
              borderRadius: 2,
              boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
              bgcolor: "white",
              border: "1px solid #e2e8f0",
              zIndex: 20,
            }}>
            {/* HEADING ROW */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                p: 1.2,
                bgcolor: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
                fontWeight: 700,
                fontSize: "0.85rem",
              }}>
              <span>Weight</span>
              <span>Units</span>
              <span>Price</span>
              <span>Total</span>
            </Box>

            {/* DATA ROWS */}
            {/* DATA ROWS */}
            <Box sx={{ maxHeight: "200px", overflowY: "auto" }}>
              {Object.entries(item.weights || {}).map(([gram, data], i) => (
                <Box
                  key={i}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    p: 1.2,
                    borderBottom: "1px dashed #e2e8f0",
                    fontSize: "0.9rem",
                  }}>
                  <span>{gram}g</span>
                  <span>{data.units} pcs</span>
                  <span>₹{data.price}</span>
                  <span style={{ fontWeight: 700, color: "#16a34a" }}>
                    ₹{(data.units * data.price).toLocaleString("en-IN")}
                  </span>
                </Box>
              ))}

              {/* TOTAL ROW */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  p: 1.2,
                  bgcolor: "#606d90ff",
                  borderTop: "2px solid #e2e8f0",
                  fontWeight: 700,
                  fontSize: "0.92rem",
                }}>
                <span>Total</span>

                <span>
                  {Object.values(item.weights || {}).reduce(
                    (sum, w) => sum + w.units,
                    0
                  )}{" "}
                  pcs
                </span>

                <span></span>

                <span style={{ color: "#16a34a" }}>
                  ₹
                  {Object.values(item.weights || {})
                    .reduce((sum, w) => sum + w.units * w.price, 0)
                    .toLocaleString("en-IN")}
                </span>
              </Box>
            </Box>
          </Box>
        </Collapse>
      </Box>
    );
  }

  return null;
}
