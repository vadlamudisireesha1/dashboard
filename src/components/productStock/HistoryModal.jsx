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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit History</DialogTitle>

      <DialogContent dividers>
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
                pb: 1.5,
                borderBottom: "1px solid #e5e7eb",
              }}>
              <Typography fontWeight={700}>
                {entry.productName || "Unnamed Product"}
              </Typography>

              {entry.sku && (
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  SKU: {entry.sku}
                </Typography>
              )}

              <Typography variant="body2" sx={{ mt: 0.5, color: "#6b7280" }}>
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

      <DialogActions>
        <Button
          onClick={() => {
            // optional clear history button (can remove if not needed)
            // persistHistory([]);
            onClose();
          }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default HistoryModal;
