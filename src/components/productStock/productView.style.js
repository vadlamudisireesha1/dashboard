export const styles = {
  headerWrapper: {
    display: "flex",
    justifyContent: "space-between",
    mt: 3,
    mb: 3,
  },

  downloadBtn: {
    bgcolor: "white",
    borderRadius: 3,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    "&:hover": { bgcolor: "#2e7d32", color: "white" },
  },

  downloadMenu: {
    position: "absolute",
    top: "50px",
    right: 0,
    bgcolor: "white",
    borderRadius: 2,
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
    width: 160,
    zIndex: 20,
    p: 1,
  },

  downloadMenuItem: {
    p: 1,
    borderRadius: 1,
    cursor: "pointer",
    "&:hover": { bgcolor: "#2e7d32", color: "white" },
  },

  toggleButtons: {
    bgcolor: "white",
    borderRadius: 3,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    "& .MuiToggleButton-root": {
      border: "none",
      borderRadius: 3,
      py: 1.5,
      "&.Mui-selected": { bgcolor: "#2e7d32", color: "white" },
    },
  },

  gridCardBox: {
    p: 2,
    borderRadius: "18px",
    minHeight: "150px",
    position: "relative",
    boxShadow: "0px 8px 25px rgba(0,0,0,0.08)",
    transition: "0.25s ease",
  },

  listCardBox: {
    background: "rgba(255,255,255,0.8)",
    borderRadius: "18px",
    boxShadow: "0px 8px 25px rgba(0,0,0,0.08)",
    p: 2,
    mb: 2,
    transition: "0.25s ease",
  },
};
