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

    /* -----------------------------
     LOGO + WATERMARK IMAGES
  ------------------------------ */
    const logo = "/pickleImage.jpg";
    const watermark = "/pickleImage.jpg";

    // Load images
    const logoImg = new Image();
    logoImg.src = logo;

    const watermarkImg = new Image();
    watermarkImg.src = watermark;

    /* -----------------------------
      TOTAL UNITS & VALUE
  ------------------------------ */
    const totalUnits = getCategoryTotalUnits();
    const totalValue = pickles.reduce(
      (s, i) => s + getTotalValue(i.weights),
      0
    );

    /* -----------------------------
      FORMAT DATA
  ------------------------------ */
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
        bg: serialNo % 2 === 0 ? "#FFFFFF" : "#FAFAFA", // VERY light grey
      });
    });

    // logo &  watermark
    const addBranding = () => {
      // Watermark (big, faint)
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

      // Logo top-right
      doc.addImage(logoImg, "PNG", pageWidth - 40, 8, 30, 30);

      // Page number
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
    // pdf title

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
    // pdf format

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
        fillColor: "#E5E7EB", // Light grey
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
              ? [250, 250, 250] // almost white
              : [255, 255, 255];
        }
      },
      willDrawPage: addBranding,
      margin: { top: 42, bottom: 14, left: 14, right: 14 },
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

          {/* Right – Download + Toggle  */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Download Button  */}
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
                border: "1px solid grey",
                "& .MuiToggleButton-root": {
                  border: "none",
                  px: 3,
                  py: 1.5,
                  "&.Mui-selected": {
                    bgcolor: "#42961A",
                    color: "white",
                    border: "none",
                    "&:hover": { bgcolor: "" },
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
