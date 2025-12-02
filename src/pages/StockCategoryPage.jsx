// src/pages/StockCategoryPage.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

// Data
import nonvegData from "../data/nonveg.json";
import vegetableData from "../data/vegetable.json";
import powdersData from "../data/powders.json";
import milletsData from "../data/millets.json";
import readytoeatData from "../data/readytoeat.json";
import organicData from "../data/organic.json";

// Components
import StockHeader from "../components/productStock/StockHeader";
import ProductView from "../components/productStock/ProductView";
import EditProductModal from "../components/productStock/EditProductModal";
import HistoryModal from "../components/productStock/HistoryModal";

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
  const historyStorageKey = useMemo(
    () => `stock_history_${type || "default"}`,
    [type]
  );

  const [pickles, setPickles] = useState(data.items || []);
  const [expanded, setExpanded] = useState(null);
  const [view, setView] = useState("grid");

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

  const [historyOpen, setHistoryOpen] = useState(false);
  const historyRef = useRef(null); // talk to HistoryModal

  // load items when category changes
  useEffect(() => {
    setPickles(getDataForType(type).items || []);
    setExpanded(null);
  }, [type]);

  const getTotalUnits = (weights) =>
    Object.values(weights).reduce((s, w) => s + Number(w.units), 0);

  const getTotalValue = (weights) =>
    Object.values(weights).reduce(
      (s, w) => s + Number(w.units) * Number(w.price),
      0
    );

  const dotColor = (units) =>
    units < 10 ? "red" : units < 30 ? "orange" : "green";

  const getCategoryTotalUnits = () =>
    pickles.reduce((sum, item) => sum + getTotalUnits(item.weights), 0);

  /* ========= EDIT / ADD / DELETE ========= */

  const handleEdit = (index) => {
    setEditIndex(index);
    const product = pickles[index];

    setForm({
      name: product.name,
      sku: product.sku || "",
      bgColor: product.bgColor || "#ffffff",
      weights: product.weights,
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

    if (editIndex < pickles.length) {
      const previous = pickles[editIndex];

      // log history INSIDE HistoryModal (via ref)
      historyRef.current?.addEntry("edited", previous, form);

      updated[editIndex] = form;
    } else {
      historyRef.current?.addEntry("created", null, form);
      updated.push(form);
    }

    setPickles(updated);
    setOpen(false);
  };

  const handleDelete = () => {
    if (editIndex == null) return;
    const previous = pickles[editIndex];

    historyRef.current?.addEntry("deleted", previous, null);

    setPickles(pickles.filter((_, i) => i !== editIndex));
    setOpen(false);
  };

  /* ========= RENDER ========= */

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",

        background:
          "linear-gradient(135deg, #f4f7fb 0%, #ffffff 60%, #eef2f7 100%)",

        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}>
      <StockHeader
        title={data.title}
        productCount={pickles.length}
        totalUnits={getCategoryTotalUnits()}
        view={view}
        onChangeView={setView}
        onBack={() => navigate(-1)}
        onAdd={handleAdd}
        pickles={pickles}
        data={data}
        getTotalUnits={getTotalUnits}
        getTotalValue={getTotalValue}
        onOpenHistory={() => setHistoryOpen(true)}
      />

      <ProductView
        pickles={pickles}
        view={view}
        expanded={expanded}
        onToggleExpand={(idx) => setExpanded(idx === expanded ? null : idx)}
        onEdit={handleEdit}
        onAdd={handleAdd}
        getTotalUnits={getTotalUnits}
        getTotalValue={getTotalValue}
        dotColor={dotColor}
      />

      <EditProductModal
        open={open}
        onClose={() => setOpen(false)}
        form={form}
        setForm={setForm}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      <HistoryModal
        ref={historyRef}
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        storageKey={historyStorageKey}
      />
    </Box>
  );
}
