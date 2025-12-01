import React from "react";
import { Box } from "@mui/material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function DownloadFiles({
  pickles,
  data,
  getTotalUnits,
  getTotalValue,
  onClose,
}) {
  if (!pickles || pickles.length === 0) return null;

  /* -----------------------------
      CLEAN HELPERS
  ------------------------------ */

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

  /* -----------------------------
      EXCEL EXPORT
  ------------------------------ */
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

    onClose();
  };

  /* -----------------------------
      PDF EXPORT
  ------------------------------ */
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

    const totalUnits = pickles.reduce(
      (sum, item) => sum + getTotalUnits(item.weights),
      0
    );

    const totalValue = pickles.reduce(
      (s, item) => s + getTotalValue(item.weights),
      0
    );

    /* Build table data */
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

    /* Branding */
    const addBranding = () => {
      // Watermark
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

      // Logo
      doc.addImage(logoImg, "PNG", pageWidth - 40, 8, 30, 30);

      // Page number
      const pageCount = doc.internal.getNumberOfPages();
      const currPage = doc.internal.getCurrentPageInfo().pageNumber;

      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(
        `Page ${currPage} of ${pageCount}`,
        pageWidth - 30,
        pageHeight - 8
      );
    };

    addBranding();

    /* Title */
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

    /* Table */
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
        fontWeight: "bold",
        halign: "center",
        fontSize: 10,
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
        lineColor: [200, 200, 200],
        lineWidth: 0.3,
      },
      alternateRowStyles: {
        fillColor: "#FFFFFF",
      },
      didParseCell: (d) => {
        if (d.section === "body") {
          d.cell.styles.fillColor =
            tableRows[d.row.index].bg === "#FAFAFA"
              ? [250, 250, 250]
              : [255, 255, 255];
        }
      },
      willDrawPage: addBranding,
      margin: { top: 42, bottom: 14, left: 14, right: 14 },
    });

    doc.save(`${data.title}_Stock_${date.replace(/\//g, "-")}.pdf`);

    onClose();
  };

  /* -----------------------------
      RETURN UI
  ------------------------------ */

  return (
    <Box
      sx={{
        position: "absolute",
        top: "100%",
        right: 0,
        mt: 1.5,
        bgcolor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(18px)",
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid rgba(148,163,184,0.4)",
        boxShadow: "0 22px 55px rgba(15,23,42,0.28)",
        zIndex: 50,
        minWidth: 200,
      }}>
      {/* PDF */}
      <Box
        sx={{
          px: 3,
          py: 2.4,
          cursor: "pointer",
          fontWeight: 600,
          color: "#0f172a",
          fontSize: "0.95rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "background 0.18s ease, transform 0.1s ease",
          "&:hover": {
            bgcolor: "rgba(250,250,250,0.95)",
          },
          "&:active": { transform: "scale(0.99)" },
        }}
        onClick={handleDownloadPDF}>
        Download PDF
      </Box>

      {/* EXCEL */}
      <Box
        sx={{
          px: 3,
          py: 2.4,
          cursor: "pointer",
          borderTop: "1px solid rgba(226,232,240,0.7)",
          fontWeight: 600,
          color: "#0f172a",
          fontSize: "0.95rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "background 0.18s ease, transform 0.1s ease",
          "&:hover": {
            bgcolor: "rgba(239,246,255,0.9)",
          },
          "&:active": { transform: "scale(0.99)" },
        }}
        onClick={handleDownloadExcel}>
        Download Excel
      </Box>
    </Box>
  );
}
