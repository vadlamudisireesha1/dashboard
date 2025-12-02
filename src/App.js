import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import ProductCards from "./components/productCards/ProductCards";
import StockCategoryPage from "./pages/StockCategoryPage";
import GraphsDashboardPage from "./pages/GraphDashboardpage";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",

    h1: { fontFamily: "Alata, sans-serif" },
    h2: { fontFamily: "Alata, sans-serif" },
    h3: { fontFamily: "Alata, sans-serif" },
    h4: { fontFamily: "Alata, sans-serif" },
    h5: { fontFamily: "Alata, sans-serif" },
    h6: { fontFamily: "Alata, sans-serif" },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <ProductCards />
                <GraphsDashboardPage />
              </>
            }
          />
          <Route path="/category/:type" element={<StockCategoryPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
