// src/components/productStock/HistoryModal.jsx
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

const HistoryModal = forwardRef(function HistoryModal(
  { open, onClose, storageKey },
  ref
) {
  const [history, setHistory] = useState([]);

  /* ---------- LOAD FROM LOCAL STORAGE ---------- */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load history", err);
    }
  }, [storageKey]);

  /* ---------- INTERNAL HELPERS ---------- */

  const persistHistory = (nextHistory) => {
    setHistory(nextHistory);
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextHistory));
    } catch (err) {
      console.error("Failed to save history", err);
    }
  };

  const buildHistoryEntry = (action, previousItem, nextItem) => {
    const now = new Date();
    const changes = [];

    if (action === "edited" && previousItem && nextItem) {
      if ((previousItem.name || "") !== (nextItem.name || "")) {
        changes.push({
          label: "Name",
          from: previousItem.name || "",
          to: nextItem.name || "",
        });
      }

      if ((previousItem.sku || "") !== (nextItem.sku || "")) {
        changes.push({
          label: "SKU",
          from: previousItem.sku || "",
          to: nextItem.sku || "",
        });
      }

      const grams = Object.keys({
        ...(previousItem.weights || {}),
        ...(nextItem.weights || {}),
      });

      grams.forEach((g) => {
        const prev = previousItem.weights?.[g] || { units: 0, price: 0 };
        const next = nextItem.weights?.[g] || { units: 0, price: 0 };

        if (prev.units !== next.units) {
          changes.push({
            label: `${g}g units`,
            from: prev.units,
            to: next.units,
          });
        }
        if (prev.price !== next.price) {
          changes.push({
            label: `${g}g price`,
            from: prev.price,
            to: next.price,
          });
        }
      });
    }

    return {
      action,
      timestamp: now.toISOString(),
      productName: (nextItem || previousItem)?.name || "",
      sku: (nextItem || previousItem)?.sku || "",
      changes,
    };
  };

  /* ---------- API EXPOSED TO PARENT VIA REF ---------- */

  useImperativeHandle(ref, () => ({
    addEntry(action, previousItem, nextItem) {
      const entry = buildHistoryEntry(action, previousItem, nextItem);

      // If edited but no actual change, don't log
      if (action === "edited" && entry.changes.length === 0) return;

      const nextHistory = [entry, ...history];
      persistHistory(nextHistory);
    },
    clearHistory() {
      persistHistory([]);
    },
  }));

  /* ---------- UI RENDER ---------- */

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: "24px",
          background:
            "radial-gradient(circle at top, rgba(255,255,255,0.98), rgba(248,250,252,0.94))",
          backdropFilter: "blur(22px)",
          border: "1px solid rgba(148,163,184,0.4)",
          boxShadow: "0 26px 70px rgba(15,23,42,0.45)",
        },
      }}>
      <DialogTitle
        sx={{
          fontWeight: 800,
          fontSize: "1.4rem",
          pb: 1.5,
          borderBottom: "1px solid rgba(226,232,240,0.9)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        Edit History
        <Typography
          variant="caption"
          sx={{ color: "#6b7280", fontWeight: 500 }}>
          {history.length} entr{history.length === 1 ? "y" : "ies"}
        </Typography>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          px: 3.5,
          py: 2.5,
          background: "transparent",
        }}>
        {history.length === 0 && (
          <Typography color="text.secondary">No edits recorded yet.</Typography>
        )}

        {history.map((entry, idx) => {
          const date = new Date(entry.timestamp);
          return (
            <Box
              key={idx}
              sx={{
                mb: 2.5,
                p: 1.8,
                borderRadius: 3,
                border: "1px solid rgba(226,232,240,0.9)",
                background: "rgba(255,255,255,0.9)",
                boxShadow: "0 12px 30px rgba(15,23,42,0.12)",
                transition:
                  "box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease",
                "&:hover": {
                  boxShadow: "0 18px 40px rgba(15,23,42,0.18)",
                  transform: "translateY(-2px)",
                  borderColor: "rgba(148,163,184,0.9)",
                },
              }}>
              <Typography fontWeight={700} sx={{ color: "#0f172a" }}>
                {entry.productName || "Unnamed Product"}
              </Typography>

              {entry.sku && (
                <Typography
                  variant="caption"
                  sx={{ color: "#64748b", display: "block", mt: 0.3 }}>
                  SKU: {entry.sku}
                </Typography>
              )}

              <Typography variant="body2" sx={{ mt: 0.8, color: "#6b7280" }}>
                Action:{" "}
                <strong style={{ textTransform: "capitalize" }}>
                  {entry.action}
                </strong>{" "}
                •{" "}
                {date.toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </Typography>

              {entry.changes && entry.changes.length > 0 && (
                <Box sx={{ mt: 1.2, pl: 1.5 }}>
                  {entry.changes.map((c, i) => (
                    <Typography
                      key={i}
                      variant="body2"
                      sx={{ color: "#374151" }}>
                      {c.label}:{" "}
                      <span style={{ color: "#9ca3af" }}>{c.from}</span> →{" "}
                      <span style={{ fontWeight: 600 }}>{c.to}</span>
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          );
        })}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 1.8 }}>
        <Button
          onClick={onClose}
          sx={{
            ml: "auto",
            textTransform: "none",
            borderRadius: "999px",
            px: 3,
            py: 0.8,
            color: "#6b7280",
          }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default HistoryModal;
