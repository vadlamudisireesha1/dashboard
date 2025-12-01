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
          borderRadius: 4,
          border: "1px dashed rgba(148,163,184,0.7)",
          bgcolor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(16px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition:
            "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, background 0.2s ease",
          boxShadow: "0 14px 30px rgba(15,23,42,0.08)",
          "&:hover": {
            borderColor: "#0f172a",
            bgcolor: "rgba(255,255,255,0.95)",
            boxShadow: "0 20px 40px rgba(15,23,42,0.16)",
            transform: "translateY(-3px)",
          },
        }}>
        <PlusCircle size={44} color="#64748b" />
        <Typography mt={1} fontWeight={600} color="text.secondary">
          Add New
        </Typography>
      </Box>
    );
  }

  const cardBase = {
    borderRadius: 4,
    bgcolor: "rgba(255,255,255,0.88)",
    border: "1px solid rgba(226,232,240,0.9)",
    overflow: "visible",
    position: "relative",
    backdropFilter: "blur(18px)",
    transition:
      "box-shadow 0.22s ease, transform 0.22s ease, border-color 0.22s ease, background 0.22s ease",
    boxShadow: "0 16px 36px rgba(15,23,42,0.12)",
    "&:hover": {
      boxShadow: "0 22px 50px rgba(15,23,42,0.2)",
      transform: "translateY(-4px)",
      borderColor: "rgba(148,163,184,0.9)",
      background: "rgba(255,255,255,0.96)",
    },
    ...(opened && {
      zIndex: 50,
      boxShadow: "0 26px 60px rgba(15,23,42,0.35)",
      borderColor: "rgba(15,23,42,0.9)",
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
            borderBottom: "1px solid rgba(241,245,249,1)",
            background:
              "linear-gradient(135deg, rgba(248,250,252,0.95), rgba(239,246,255,0.95))",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
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
                  color: "#0f172a",
                  letterSpacing: "-0.01em",
                }}>
                {item.name}
              </Typography>
              {item.sku && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64748b",
                    display: "block",
                    mt: 0.3,
                  }}>
                  SKU: {item.sku}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.1 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "999px",
                  bgcolor: dotColorValue,
                  boxShadow: `0 0 8px ${dotColorValue}`,
                }}
              />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(index);
                }}
                sx={{
                  bgcolor: "rgba(15,23,42,0.02)",
                  "&:hover": {
                    bgcolor: "rgba(15,23,42,0.06)",
                  },
                }}>
                <Edit size={16} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* TOTAL UNITS */}
        <Box
          sx={{
            textAlign: "center",
            py: 2.6,
            bgcolor: "rgba(248,250,252,0.9)",
          }}>
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
            pt: 1.1,
            pb: 1.2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            "&:hover": {
              bgcolor: "rgba(248,250,252,0.95)",
            },
          }}
          onClick={onToggle}>
          <Typography fontWeight={600} color="text.secondary">
            Total Value
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography fontWeight={900} sx={{ color: "#0f172a" }}>
              ₹{formattedValue}
            </Typography>

            <IconButton size="small" sx={{ p: 0.4 }}>
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
              borderRadius: 3,
              bgcolor: "rgba(255,255,255,0.98)",
              border: "1px solid rgba(226,232,240,0.95)",
              boxShadow: "0 22px 55px rgba(15,23,42,0.4)",
              zIndex: 40,
              backdropFilter: "blur(18px)",
            }}>
            {/* TITLE */}
            <Box
              sx={{
                p: 1.4,
                px: 2,
                fontWeight: 700,
                borderBottom: "1px solid rgba(226,232,240,0.95)",
                bgcolor: "rgba(248,250,252,0.96)",
                fontSize: "1rem",
                color: "#0f172a",
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
                bgcolor: "rgba(248,250,252,0.95)",
                borderBottom: "1px solid rgba(226,232,240,0.95)",
                fontWeight: 700,
                fontSize: "0.85rem",
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
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
                  borderBottom: "1px dashed rgba(226,232,240,0.9)",
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
                bgcolor: "#020617",
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
      <Box sx={{ ...cardBase, mb: 2, p: 2.1 }}>
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
                color: "#0f172a",
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
              color: "#0f172a",
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
              }}
              sx={{
                bgcolor: "rgba(15,23,42,0.02)",
                "&:hover": {
                  bgcolor: "rgba(15,23,42,0.06)",
                },
              }}>
              <Edit size={16} />
            </IconButton>

            <IconButton size="small" sx={{ p: 0.4 }}>
              {opened ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </IconButton>
          </Box>
        </Box>

        {/* LIST DROPDOWN */}
        <Collapse in={opened} timeout={250}>
          <Box
            sx={{
              mt: 1,
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid rgba(226,232,240,0.96)",
              bgcolor: "rgba(255,255,255,0.98)",
              backdropFilter: "blur(16px)",
            }}>
            {/* HEADER ROW (no name here) */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                p: 1.2,
                bgcolor: "rgba(238,242,255,0.96)",
                borderBottom: "1px solid rgba(226,232,240,0.96)",
                fontWeight: 600,
                fontSize: "0.85rem",
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
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
                  borderBottom: "1px dashed rgba(226,232,240,0.9)",
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
                bgcolor: "#020617",
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
