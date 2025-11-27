import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { Download, Grid3X3, List, History } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Data
import nonvegData from "../data/nonveg.json";
import vegetableData from "../data/vegetable.json";
import powdersData from "../data/powders.json";
import milletsData from "../data/millets.json";
import readytoeatData from "../data/readytoeat.json";
import organicData from "../data/organic.json";

// Components
import ProductView from "../components/productCategory/ProductView";
import EditProductModal from "../components/productCategory/EditProductModal";

const getDataForType = (slug) => {
  switch ((slug || "").toLowerCase()) {
    case "nonveg":
      return nonvegData;
    case "vegetable":
      return vegetableData;
    case "powders":
      return powdersData;
    case "millets":
      return milletsData;
    case "readytoeat":
      return readytoeatData;
    case "organic":
      return organicData;
    default:
      return powdersData;
  }
};

export default function StockCategoryPage() {
  const navigate = useNavigate();
  const { type } = useParams();

  const data = getDataForType(type);
  const historyStorageKey = useMemo(
    () => `stock_history_${type || "default"}`,
    [type]
  );

  const [pickles, setPickles] = useState(data.items || []);
  const [expanded, setExpanded] = useState(null);
  const [view, setView] = useState("grid");
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  // modal state
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    bgColor: "#ffffff",
    weights: {
      250: { units: 0, price: 0 },
      500: { units: 0, price: 0 },
      750: { units: 0, price: 0 },
      1000: { units: 0, price: 0 },
    },
  });

  // history
  const [editHistory, setEditHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  // load data on type change
  useEffect(() => {
    setPickles(getDataForType(type).items || []);
    setExpanded(null);
  }, [type]);

  // load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(historyStorageKey);
      if (stored) setEditHistory(JSON.parse(stored));
    } catch (err) {
      console.error("Failed to load history", err);
    }
  }, [historyStorageKey]);

  const persistHistory = (history) => {
    setEditHistory(history);
    try {
      localStorage.setItem(historyStorageKey, JSON.stringify(history));
    } catch (err) {
      console.error("Failed to save history", err);
    }
  };

  // Category total units
  const getCategoryTotalUnits = () => {
    let total = 0;
    pickles.forEach((item) => {
      Object.values(item.weights).forEach((w) => {
        total += Number(w.units || 0);
      });
    });
    return total;
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString("en-IN");
    const time = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date, time };
  };

  const convertDataForExport = () => {
    return pickles
      .map((item) =>
        Object.entries(item.weights || {}).map(([gram, { units, price }]) => ({
          Name: item.name,
          Gram: `${gram}g`,
          Units: units,
          Price: price,
          Total: units * price,
        }))
      )
      .flat();
  };

  // Excel Download
  const handleDownloadExcel = () => {
    const exportData = convertDataForExport();
    const { date } = getCurrentDateTime();

    const rows = exportData.map((row, i) => ({
      "S.No.": i + 1,
      Product: row.Name,
      Weight: row.Gram,
      Units: row.Units,
      Price: row.Price,
      "Total Value": row.Total,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 8 },
      { wch: 35 },
      { wch: 12 },
      { wch: 10 },
      { wch: 12 },
      { wch: 18 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock");
    XLSX.writeFile(wb, `${data.title}_Stock_${date.replace(/\//g, "-")}.xlsx`);
  };

  // Helpers
  const getTotalUnits = (weights) =>
    Object.values(weights).reduce((sum, w) => sum + Number(w.units), 0);

  const getTotalValue = (weights) =>
    Object.values(weights).reduce(
      (sum, w) => sum + Number(w.units) * Number(w.price),
      0
    );

  const dotColor = (units) => {
    if (units < 10) return "red";
    if (units < 30) return "orange";
    return "green";
  };

  // PDF Download
  const handleDownloadPDF = () => {
    const exportData = convertDataForExport();
    const { date, time } = getCurrentDateTime();

    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const logo = "/pickleImage.jpg";
    const watermark = "/pickleImage.jpg";

    const logoImg = new Image();
    logoImg.src = logo;

    const watermarkImg = new Image();
    watermarkImg.src = watermark;

    const totalUnits = getCategoryTotalUnits();
    const totalValue = pickles.reduce(
      (s, i) => s + getTotalValue(i.weights),
      0
    );

    const tableRows = [];
    let currentProduct = null;
    let serialNo = 0;

    exportData.forEach((row, i) => {
      if (row.Name !== currentProduct) {
        currentProduct = row.Name;
        serialNo++;
      }

      const isTitleRow = exportData.findIndex((r) => r.Name === row.Name) === i;

      tableRows.push({
        sno: isTitleRow ? serialNo : "",
        name: row.Name,
        gram: row.Gram,
        units: row.Units,
        price: `₹${row.Price}`,
        total: `₹${row.Total.toLocaleString("en-IN")}`,
        bg: serialNo % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
      });
    });

    const addBranding = () => {
      doc.setGState(new doc.GState({ opacity: 0.06 }));
      doc.addImage(
        watermarkImg,
        "PNG",
        pageWidth / 2 - 50,
        pageHeight / 2 - 50,
        100,
        100
      );
      doc.setGState(new doc.GState({ opacity: 1 }));

      doc.addImage(logoImg, "PNG", pageWidth - 40, 8, 30, 30);

      const pageCount = doc.internal.getNumberOfPages();
      const currentPage = doc.internal.getCurrentPageInfo().pageNumber;

      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(
        `Page ${currentPage} of ${pageCount}`,
        pageWidth - 30,
        pageHeight - 8
      );
    };

    addBranding();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`${data.title} Stock Report`, 14, 18);

    doc.setFontSize(10);
    doc.setTextColor(90);
    doc.text(`Generated: ${date} | ${time}`, 14, 26);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(50);
    doc.text(
      `Products: ${
        pickles.length
      }  |  Units: ${totalUnits}  |  Value: ₹${totalValue.toLocaleString(
        "en-IN"
      )}`,
      14,
      34
    );

    autoTable(doc, {
      startY: 42,
      head: [["S.No", "Product Name", "Weight", "Units", "Price", "Total"]],
      body: tableRows.map((r) => [
        r.sno,
        r.name,
        r.gram,
        r.units,
        r.price,
        r.total,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: "#E5E7EB",
        textColor: "#000000",
        fontStyle: "bold",
        halign: "center",
        fontSize: 10,
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
        lineColor: [200, 200, 200],
        lineWidth: 0.3,
        textColor: "#000000",
      },
      alternateRowStyles: {
        fillColor: "#FFFFFF",
      },
      didParseCell: (data) => {
        if (data.section === "body") {
          data.cell.styles.fillColor =
            tableRows[data.row.index].bg === "#FAFAFA"
              ? [250, 250, 250]
              : [255, 255, 255];
        }
      },
      willDrawPage: addBranding,
      margin: { top: 42, bottom: 14, left: 14, right: 14 },
    });

    doc.save(`${data.title}_Stock_${date.replace(/\//g, "-")}.pdf`);
  };

  /* ========= HISTORY HELPERS ========= */

  const buildHistoryEntry = (action, previousItem, nextItem) => {
    const now = new Date();
    const changes = [];

    if (action === "edited" && previousItem && nextItem) {
      if (previousItem.name !== nextItem.name) {
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

      const allGrams = new Set([
        ...Object.keys(previousItem.weights || {}),
        ...Object.keys(nextItem.weights || {}),
      ]);

      allGrams.forEach((gram) => {
        const prevW = previousItem.weights?.[gram] || { units: 0, price: 0 };
        const nextW = nextItem.weights?.[gram] || { units: 0, price: 0 };

        if (prevW.units !== nextW.units) {
          changes.push({
            label: `${gram}g units`,
            from: prevW.units,
            to: nextW.units,
          });
        }
        if (prevW.price !== nextW.price) {
          changes.push({
            label: `${gram}g price`,
            from: prevW.price,
            to: nextW.price,
          });
        }
      });
    }

    const base = {
      action,
      timestamp: now.toISOString(),
      productName: (nextItem || previousItem)?.name || "",
      sku: (nextItem || previousItem)?.sku || "",
      changes,
    };

    return base;
  };

  /* ========= MODAL / CRUD ========= */

  const handleEdit = (index) => {
    setEditIndex(index);
    const existing = pickles[index];
    setForm({
      name: existing.name || "",
      sku: existing.sku || "",
      bgColor: existing.bgColor || "#ffffff",
      weights: existing.weights || {
        250: { units: 0, price: 0 },
        500: { units: 0, price: 0 },
        750: { units: 0, price: 0 },
        1000: { units: 0, price: 0 },
      },
    });
    setOpen(true);
  };

  const handleAdd = () => {
    setEditIndex(pickles.length);
    setForm({
      name: "",
      sku: "",
      bgColor: "#ffffff",
      weights: {
        250: { units: 0, price: 0 },
        500: { units: 0, price: 0 },
        750: { units: 0, price: 0 },
        1000: { units: 0, price: 0 },
      },
    });
    setOpen(true);
  };

  const handleSave = () => {
    const updated = [...pickles];
    const isEdit = editIndex < pickles.length;

    if (isEdit) {
      const previous = pickles[editIndex];
      const historyEntry = buildHistoryEntry("edited", previous, form);
      if (historyEntry.changes.length > 0) {
        persistHistory([historyEntry, ...editHistory]);
      }
      updated[editIndex] = form;
    } else {
      const historyEntry = buildHistoryEntry("created", null, form);
      persistHistory([historyEntry, ...editHistory]);
      updated.push(form);
    }

    setPickles(updated);
    setOpen(false);
  };

  const handleDelete = () => {
    if (editIndex == null) return;
    const previous = pickles[editIndex];
    const historyEntry = buildHistoryEntry("deleted", previous, null);
    persistHistory([historyEntry, ...editHistory]);

    setPickles(pickles.filter((_, i) => i !== editIndex));
    setOpen(false);
  };

  /* ========= RENDER ========= */

  return (
    <Box sx={{ p: 4, background: "#fffbf5ff", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        {/* Back Button */}
        <Button
          variant="text"
          onClick={() => navigate(-1)}
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
          {/* Left – Title + Stats */}
          <Box>
            <Typography
              variant="h3"
              fontWeight={900}
              sx={{ color: "#1e293b", letterSpacing: "-0.5px" }}>
              {data.title}
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
                {pickles.length} Products
              </Typography>
              <Typography variant="h6" color="#16a34a" fontWeight={800}>
                {getCategoryTotalUnits()} Units
              </Typography>
            </Box>
          </Box>

          {/* Right – History + Download + Toggle */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* History Button */}
            <Button
              variant="outlined"
              startIcon={<History size={20} />}
              onClick={() => setHistoryOpen(true)}
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

            {/* Download Button */}
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
                  "& .MuiButton-startIcon": {
                    margin: 0,
                  },
                  "&:hover": {
                    borderColor: "#42961A",
                    bgcolor: "#f8fafc",
                  },
                }}
              />

              {showDownloadMenu && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    mt: 1,
                    bgcolor: "white",
                    borderRadius: 2,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    overflow: "hidden",
                    zIndex: 10,
                    minWidth: 180,
                    border: "1px solid #e2e8f0",
                  }}>
                  <Box
                    sx={{
                      px: 3,
                      py: 2.5,
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#fef3c7" },
                      fontWeight: 600,
                      color: "#92400e",
                    }}
                    onClick={() => {
                      setShowDownloadMenu(false);
                      handleDownloadPDF();
                    }}>
                    Download PDF
                  </Box>
                  <Box
                    sx={{
                      px: 3,
                      py: 2.5,
                      cursor: "pointer",
                      borderTop: "1px solid #e2e8f0",
                      "&:hover": { bgcolor: "#ecfdf5" },
                      fontWeight: 600,
                      color: "#166534",
                    }}
                    onClick={() => {
                      setShowDownloadMenu(false);
                      handleDownloadExcel();
                    }}>
                    Download Excel
                  </Box>
                </Box>
              )}
            </Box>

            {/* View Toggle */}
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(e, v) => v && setView(v)}
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

      {/* Main View */}
      <ProductView
        pickles={pickles}
        view={view}
        expanded={expanded}
        onToggleExpand={(idx) => setExpanded(expanded === idx ? null : idx)}
        onEdit={handleEdit}
        onAdd={handleAdd}
        getTotalUnits={getTotalUnits}
        getTotalValue={getTotalValue}
        dotColor={dotColor}
      />

      {/* Edit Modal */}
      <EditProductModal
        open={open}
        onClose={() => setOpen(false)}
        form={form}
        setForm={setForm}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      {/* History Modal */}
      <Dialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        fullWidth
        maxWidth="md">
        <DialogTitle>Edit History</DialogTitle>
        <DialogContent dividers>
          {editHistory.length === 0 && (
            <Typography color="text.secondary">
              No edits recorded yet.
            </Typography>
          )}

          {editHistory.map((entry, idx) => {
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
          <Button onClick={() => setHistoryOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
