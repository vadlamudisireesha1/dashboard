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

  /* ADD NEW CARD */
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
          transition: "0.25s",
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "#f1f5f9",
          },
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
    transition: "0.25s",
    "&:hover": {
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.16)",
    },
    ...(opened && {
      zIndex: 50,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    }),
  };

  /* GRID VIEW */
  if (view === "grid") {
    return (
      <Box sx={cardBase}>
        {/* HEADER */}
        <Box
          sx={{
            p: 2,
            pb: 1.5,
            borderBottom: "1px solid #f1f5f9",
            background: "linear-gradient(90deg,#f8fafc,#eef2ff)",
          }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Box sx={{ maxWidth: "70%" }}>
              <Typography
                fontWeight={700}
                sx={{
                  pr: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: "#1e293b",
                }}>
                {item.name}
              </Typography>
              {item.sku && (
                <Typography
                  variant="caption"
                  sx={{ color: "#64748b", display: "block", mt: 0.3 }}>
                  SKU: {item.sku}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: dotColorValue,
                  boxShadow: `0 0 6px ${dotColorValue}`,
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

        {/* TOTAL VALUE ROW */}
        <Box
          sx={{
            p: 2,
            pt: 1,
            pb: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            "&:hover": { bgcolor: "#f8fafc" },
          }}
          onClick={onToggle}>
          <Typography fontWeight={600} color="text.secondary">
            Total Value
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography fontWeight={900}>₹{formattedValue}</Typography>

            <IconButton size="small" sx={{ p: 0 }}>
              {opened ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </IconButton>
          </Box>
        </Box>

        {/* GRID DROPDOWN */}
        <Collapse in={opened} timeout={250}>
          <Box
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              mt: 1,
              borderRadius: 2,
              bgcolor: "white",
              border: "1px solid #e2e8f0",
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              zIndex: 40,
            }}>
            {/* TITLE */}
            <Box
              sx={{
                p: 1.4,
                px: 2,
                fontWeight: 700,
                borderBottom: "1px solid #e2e8f0",
                bgcolor: "#f8fafc",
                fontSize: "1rem",
                color: "#1e293b",
              }}>
              {item.name}
              {item.sku && (
                <Typography
                  variant="caption"
                  sx={{ color: "#64748b", display: "block", mt: 0.3 }}>
                  SKU: {item.sku}
                </Typography>
              )}
            </Box>

            {/* HEADER ROW */}
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
            {Object.entries(item.weights).map(([gram, data], i) => (
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
                bgcolor: "#1e293b",
                color: "white",
                fontWeight: 700,
              }}>
              <span>Total</span>
              <span>
                {Object.values(item.weights).reduce((s, w) => s + w.units, 0)}{" "}
                pcs
              </span>
              <span></span>
              <span style={{ color: "#4ade80" }}>
                ₹
                {Object.values(item.weights)
                  .reduce((s, w) => s + w.units * w.price, 0)
                  .toLocaleString("en-IN")}
              </span>
            </Box>
          </Box>
        </Collapse>
      </Box>
    );
  }

  /* LIST VIEW (no name inside dropdown) */
  if (view === "list") {
    return (
      <Box sx={{ ...cardBase, mb: 2, p: 2 }}>
        {/* TOP ROW */}
        <Box
          onClick={onToggle}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            px: 1,
            py: 1,
          }}>
          <Box sx={{ flex: 3, minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
              {item.name}
            </Typography>
            {item.sku && (
              <Typography
                variant="caption"
                sx={{ color: "#64748b", display: "block", mt: 0.2 }}>
                SKU: {item.sku}
              </Typography>
            )}
          </Box>

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

          <Typography
            sx={{
              flex: 1.5,
              textAlign: "right",
              fontWeight: 700,
            }}>
            ₹{formattedValue}
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
              <Edit size={16} />
            </IconButton>

            <IconButton size="small" sx={{ p: 0 }}>
              {opened ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </IconButton>
          </Box>
        </Box>

        {/* LIST DROPDOWN */}
        <Collapse in={opened} timeout={250}>
          <Box
            sx={{
              mt: 1,
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              bgcolor: "white",
            }}>
            {/* HEADER ROW (no name here) */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                p: 1.2,
                bgcolor: "#eef2ff",
                borderBottom: "1px solid #e2e8f0",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}>
              <span>Weight</span>
              <span>Units</span>
              <span>Price</span>
              <span>Total</span>
            </Box>

            {/* DATA ROWS */}
            {Object.entries(item.weights).map(([gram, data], i) => (
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
                bgcolor: "#1e293b",
                color: "white",
                fontWeight: 700,
              }}>
              <span>Total</span>
              <span>
                {Object.values(item.weights).reduce((s, w) => s + w.units, 0)}{" "}
                pcs
              </span>
              <span></span>
              <span style={{ color: "#4ade80" }}>
                ₹
                {Object.values(item.weights)
                  .reduce((s, w) => s + w.units * w.price, 0)
                  .toLocaleString("en-IN")}
              </span>
            </Box>
          </Box>
        </Collapse>
      </Box>
    );
  }

  return null;
}
