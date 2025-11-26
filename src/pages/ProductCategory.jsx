import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Download, Grid3X3, List } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
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

// Styles
import { styles } from "../components/productCategory/productView.style";

const USER_ROLE = "admin";

// Pick correct JSON based on slug
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

export default function ProductCategory() {
  const navigate = useNavigate();
  const { type } = useParams();

  const data = getDataForType(type);

  const [pickles, setPickles] = useState(data.items || []);
  const [expanded, setExpanded] = useState(null);
  const [view, setView] = useState("grid");
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  useEffect(() => {
    setPickles(getDataForType(type).items || []);
    setExpanded(null);
  }, [type]);

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

  // 1. Date & Time
  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString("en-IN");
    const time = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date, time };
  };

  // 2. Export Data
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

  // 3. Excel Download
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
  //
  const handleDownloadPDF = () => {
    const exportData = convertDataForExport();
    const { date, time } = getCurrentDateTime();

    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const logoUrl =
      "https://thepickls.com/cdn/shop/files/the_pickls.png?v=1704872288";
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.src = logoUrl + "&width=400";

    const totalUnits = getCategoryTotalUnits();
    const totalValue = pickles.reduce(
      (s, i) => s + getTotalValue(i.weights),
      0
    );

    const colors = [
      [34, 197, 94], // Green
      [59, 130, 246], // Blue
      [168, 85, 247], // Purple
      [251, 146, 60], // Orange
    ];

    // Table rows
    const tableRows = [];
    let currentProduct = null;
    let serialNo = 0;
    let colorIdx = 0;

    exportData.forEach((row, i) => {
      if (row.Name !== currentProduct) {
        currentProduct = row.Name;
        serialNo++;
        colorIdx = (serialNo - 1) % 4;
      }
      const isFirst = exportData.findIndex((r) => r.Name === row.Name) === i;

      tableRows.push({
        sno: isFirst ? serialNo : "",
        name: row.Name,
        gram: row.Gram,
        units: row.Units,
        price: `₹${row.Price}`,
        total: `₹${row.Total.toLocaleString("en-IN")}`,
        color: colors[colorIdx],
      });
    });

    // Function to add background + logo on every page
    const addBranding = () => {
      // 1. Light full-page watermark (center)
      if (logoImg.complete && logoImg.naturalWidth !== 0) {
        doc.setGState(new doc.GState({ opacity: 0.04 }));
        doc.addImage(
          logoImg,
          "PNG",
          pageWidth / 2 - 45,
          pageHeight / 2 - 45,
          90,
          90
        ); // center
        doc.setGState(new doc.GState({ opacity: 1 }));
      }

      // 2. Clear logo in top-right corner — with proper margin (not touching edge)
      if (logoImg.complete && logoImg.naturalWidth !== 0) {
        doc.addImage(logoImg, "PNG", pageWidth - 58, 10, 38, 38); // 20mm from right, 10mm from top
      }

      // 3. Page number bottom-right
      const pageCount = doc.internal.getNumberOfPages();
      const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(
        `Page ${currentPage} of ${pageCount}`,
        pageWidth - 35,
        pageHeight - 10
      );
    };

    // Add branding on first page
    addBranding();

    // Title (thoda left shift so logo ke saath clash na ho)
    doc.setFontSize(19);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(31, 41, 55);
    doc.text(`${data.title} Stock Report`, 14, 22);

    // Date & Time
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${date} | ${time}`, 14, 30);

    // Summary
    doc.setFontSize(10.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(34, 197, 94);
    doc.text(
      `Products: ${
        pickles.length
      } • Units: ${totalUnits} • Value: ₹${totalValue.toLocaleString("en-IN")}`,
      14,
      38
    );

    // Table
    autoTable(doc, {
      head: [
        ["S.No.", "Product Name", "Weight", "Units", "Price", "Total Value"],
      ],
      body: tableRows.map((r) => [
        r.sno,
        r.name,
        r.gram,
        r.units,
        r.price,
        r.total,
      ]),
      startY: 46,
      theme: "grid",
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 10.5,
        halign: "center",
        cellPadding: 7,
      },
      styles: {
        fontSize: 10.2,
        cellPadding: 7,
        lineColor: [200, 200, 200],
        lineWidth: 0.3,
      },
      alternateRowStyles: { fillColor: [250, 252, 255] },
      columnStyles: {
        0: {
          cellWidth: 16,
          halign: "center",
          fontStyle: "bold",
          textColor: [0, 0, 0],
        },
        1: { cellWidth: 70 },
        2: { cellWidth: 25, halign: "center" },
        3: { cellWidth: 22, halign: "center" },
        4: { cellWidth: 25, halign: "right" },
        5: {
          cellWidth: 40,
          halign: "right",
          fontStyle: "bold",
          textColor: [34, 197, 94],
        },
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 1) {
          data.cell.styles.textColor = tableRows[data.row.index].color;
          data.cell.styles.fontStyle = "bold";
        }
        if (
          data.section === "body" &&
          data.column.index === 0 &&
          !data.cell.text[0]
        ) {
          data.cell.text = [""];
        }
      },
      margin: { top: 46, bottom: 40, left: 14, right: 14 },
      willDrawPage: () => {
        addBranding();
      },
    });

    doc.save(`${data.title}_Stock_${date.replace(/\//g, "-")}.pdf`);
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

  // Modal states
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({
    name: "",
    bgColor: "#ffffff",
    weights: {
      250: { units: 0, price: 0 },
      500: { units: 0, price: 0 },
      750: { units: 0, price: 0 },
      1000: { units: 0, price: 0 },
    },
  });

  const handleEdit = (index) => {
    setEditIndex(index);
    setForm(JSON.parse(JSON.stringify(pickles[index])));
    setOpen(true);
  };

  const handleAdd = () => {
    setEditIndex(pickles.length);
    setForm({
      name: "",
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
    if (editIndex < pickles.length) updated[editIndex] = form;
    else updated.push(form);
    setPickles(updated);
    setOpen(false);
  };

  const handleDelete = () => {
    setPickles(pickles.filter((_, i) => i !== editIndex));
    setOpen(false);
  };

  return (
    <Box sx={{ p: 4, background: "#fffbf5ff", minHeight: "100vh" }}>
      {/* Header */}
      {/* PREMIUM TITLE SECTION – DHENKI MACHI BUT 100% SAFE */}
      <Box sx={{ mb: 4 }}>
        {/* Back Button */}
        <Button
          variant="text"
          onClick={() => navigate(-1)}
          sx={{
            mb: 2,
            color: "#64748b",
            fontWeight: 600,
            backgroundColor: "blue",
            color: "white",
          }}>
          ← Back
        </Button>

        {/* Main Header – Clean & Classy */}
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
              sx={{
                color: "#1e293b",
                letterSpacing: "-0.5px",
              }}>
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

          {/* Right – Download + Toggle (YOUR ORIGINAL FUNCTIONALITY – NO CHANGE) */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Download Button – Just Better Look */}
            <Box sx={{ position: "relative" }}>
              <Button
                variant="outlined"
                startIcon={<Download size={22} />}
                onClick={() => setShowDownloadMenu((prev) => !prev)}
                sx={{
                  borderRadius: 3,
                  fontWeight: 600,
                  border: "1.5px solid #cbd5e1",
                  color: "#475569",
                  px: 3,
                  py: 1.2,
                  "&:hover": {
                    borderColor: "#6366f1",
                    bgcolor: "#f8fafc",
                  },
                }}>
                Export
              </Button>

              {/* Your Original Dropdown – No Logic Changed */}
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

            {/* Your Original Toggle – Just Styled Better */}
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(e, v) => v && setView(v)}
              sx={{
                bgcolor: "#f8fafc",
                borderRadius: 3,
                overflow: "hidden",
                "& .MuiToggleButton-root": {
                  border: "none",
                  px: 3,
                  py: 1.5,
                  "&.Mui-selected": {
                    bgcolor: "#4f46e5",
                    color: "white",
                    "&:hover": { bgcolor: "#4338ca" },
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

      {/* Main View (Grid + List) */}
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

      {/* Modal */}
      <EditProductModal
        open={open}
        onClose={() => setOpen(false)}
        form={form}
        setForm={setForm}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </Box>
  );
}
