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

  // Flatten export rows
  const convertDataForExport = () => {
    return pickles
      .map((item) =>
        Object.entries(item.weights).map(([gram, { units, price }]) => ({
          Name: item.name,
          Gram: `${gram}g`,
          Units: units,
          Price: price,
          Total: units * price,
        }))
      )
      .flat();
  };

  // Download Excel
  const handleDownloadExcel = () => {
    const exportData = convertDataForExport();
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = {
      SheetNames: ["Products"],
      Sheets: { Products: worksheet },
    };

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      `${data.title}.xlsx`
    );
  };

  // Download PDF
  const handleDownloadPDF = () => {
    const exportData = convertDataForExport();
    const doc = new jsPDF();

    doc.text(`${data.title} Report`, 14, 10);

    const columns = ["Name", "Gram", "Units", "Price", "Total"];
    const rows = exportData.map((r) => [
      r.Name,
      r.Gram,
      r.Units,
      r.Price,
      r.Total,
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 20,
    });

    doc.save(`${data.title}.pdf`);
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
      {/* Back Button */}
      <Button variant="contained" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      {/* Header */}
      <Box sx={styles.headerWrapper}>
        <Typography variant="h4" fontWeight={700}>
          {data.title}{" "}
          <span style={{ fontSize: "22px", opacity: 0.7 }}>
            ({pickles.length} Products / {getCategoryTotalUnits()} Units)
          </span>
        </Typography>

        {/* Download + Toggle */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Download Button */}
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={() => setShowDownloadMenu((prev) => !prev)}
              sx={styles.downloadBtn}>
              <Download size={26} />
            </IconButton>

            {/* Dropdown */}
            {showDownloadMenu && (
              <Box sx={styles.downloadMenu}>
                <Box
                  sx={styles.downloadMenuItem}
                  onClick={() => {
                    setShowDownloadMenu(false);
                    handleDownloadPDF();
                  }}>
                  Download PDF
                </Box>

                <Box
                  sx={styles.downloadMenuItem}
                  onClick={() => {
                    setShowDownloadMenu(false);
                    handleDownloadExcel();
                  }}>
                  Download Excel
                </Box>
              </Box>
            )}
          </Box>

          {/* Grid / List View Toggle */}
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(e, v) => v && setView(v)}
            sx={styles.toggleButtons}>
            <ToggleButton value="grid">
              <Grid3X3 size={20} />
            </ToggleButton>
            <ToggleButton value="list">
              <List size={20} />
            </ToggleButton>
          </ToggleButtonGroup>
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
