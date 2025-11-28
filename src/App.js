import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import ProductCards from "./components/productCards/ProductCards";
import StockCategoryPage from "./pages/StockCategoryPage";
import GraphsDashboardPage from "./pages/GraphDashboardpage";
function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* HOME PAGE → Category cards + Analytics */}
        <Route
          path="/"
          element={
            <>
              <ProductCards />
              <GraphsDashboardPage />
            </>
          }
        />

        {/* CATEGORY PAGE → Stock details */}
        <Route path="/category/:type" element={<StockCategoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
