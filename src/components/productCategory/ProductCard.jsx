import React from "react";
import { Box, Typography, IconButton, Collapse } from "@mui/material";
import { Edit, ChevronDown, ChevronUp, PlusCircle } from "lucide-react";

const StyledDetailRow = ({ label, value }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.35 }}>
    <Typography variant="body2" color="text.secondary" fontWeight={500}>
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={700} color="text.primary">
      {value}
    </Typography>
  </Box>
);

export default function ProductCard({
  item,
  index,
  view = "grid",
  opened, // This must be controlled by parent using item.id
  totalUnits,
  totalValue,
  onEdit,
  onToggle, // Must pass item.id or index properly
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
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "#f1f5f9",
          },
        }}>
        <PlusCircle size={44} color="#64748b" />
        <Typography
          variant="subtitle1"
          fontWeight={600}
          color="text.secondary"
          mt={1}>
          Add New Product
        </Typography>
      </Box>
    );
  }

  // COMMON STYLES
  const cardBase = {
    borderRadius: 3,
    bgcolor: "white",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  };

  // GRID VIEW
  if (view === "grid") {
    return (
      <Box sx={cardBase}>
        {/* Fixed Height Header - No Jumping */}
        <Box sx={{ p: 2, pb: 1.5, borderBottom: "1px solid #f1f5f9" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Typography
              variant="subtitle1"
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

        {/* Total Units - Big & Clean */}
        <Box sx={{ textAlign: "center", py: 2.5, bgcolor: "#f8fafc" }}>
          <Typography variant="h3" fontWeight={900} color={dotColorValue}>
            {totalUnits}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Total Units
          </Typography>
        </Box>

        {/* Value + Count */}
        <Box sx={{ p: 2, pt: 1.5 }}>
          <StyledDetailRow label="Total Value" value={`₹${formattedValue}`} />
          <StyledDetailRow
            label="Variants"
            value={Object.keys(item.weights || {}).length}
          />
        </Box>

        {/* Toggle Bar - Clean */}
        <Box
          onClick={onToggle}
          sx={{
            bgcolor: opened ? "#ecfdf5" : "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            p: 1.5,
            textAlign: "center",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            color: opened ? "success.main" : "text.secondary",
            fontWeight: 600,
            fontSize: "0.875rem",
          }}>
          {opened ? "Hide" : "View"} Breakdown
          {opened ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Box>

        {/* Collapse - Max 4 rows, then scroll */}
        <Collapse in={opened}>
          <Box
            sx={{
              maxHeight: "180px",
              overflowY: "auto",
              bgcolor: "#fdfdfd",
              borderTop: opened ? "1px solid #e2e8f0" : "none",
            }}>
            <Box sx={{ p: 2 }}>
              {Object.entries(item.weights || {}).map(([gram, data], i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1,
                    borderBottom:
                      i < Object.keys(item.weights).length - 1
                        ? "1px dashed #e2e8f0"
                        : "none",
                  }}>
                  <Typography fontWeight={600} fontSize="0.95rem">
                    {gram}g
                  </Typography>
                  <Typography fontWeight={500} color="text.secondary">
                    {data.units} pcs
                  </Typography>
                  <Typography fontWeight={600}>₹{data.price}</Typography>
                  <Typography fontWeight={700} color="success.main">
                    ₹{(data.units * data.price).toLocaleString("en-IN")}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Collapse>
      </Box>
    );
  }

  // LIST VIEW - Super Clean
  return (
    <Box sx={{ ...cardBase, mb: 1.5 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          cursor: "pointer",
          backgroundColor: opened ? "#f0fdf4" : "transparent",
        }}
        onClick={onToggle}>
        <Typography sx={{ flex: 3, fontWeight: 600, fontSize: "1rem" }}>
          {item.name}
        </Typography>
        <Typography
          sx={{
            flex: 1,
            textAlign: "center",
            fontWeight: 800,
            fontSize: "1.3rem",
            color: dotColorValue,
          }}>
          {totalUnits}
        </Typography>
        <Typography sx={{ flex: 1.5, textAlign: "right", fontWeight: 700 }}>
          ₹{formattedValue}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
            <Edit size={16} />
          </IconButton>
          {opened ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </Box>
      </Box>

      <Collapse in={opened}>
        <Box sx={{ borderTop: "1px dashed #d0d7de", bgcolor: "#fafafa" }}>
          <Box sx={{ p: 2 }}>
            {Object.entries(item.weights || {}).map(([gram, data], i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 0.9,
                  fontSize: "0.95rem",
                  borderBottom:
                    i < Object.keys(item.weights).length - 1
                      ? "1px solid #e2e8f0"
                      : "none",
                }}>
                <span>
                  <strong>{gram}g</strong> — {data.units} units @ ₹{data.price}
                </span>
                <strong style={{ color: "#16a34a" }}>
                  ₹{(data.units * data.price).toLocaleString("en-IN")}
                </strong>
              </Box>
            ))}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}
