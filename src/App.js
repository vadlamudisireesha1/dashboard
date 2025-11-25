// src/App.js
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductCards from "./components/productCards/ProductCards";
import ProductCategory from "./pages/ProductCategory";

import Navbar from "./components/navbar/Navbar";
import GraphView from "./components/graphs/GraphView";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <ProductCards />
              <GraphView />
            </>
          }
        />

        {/* single dynamic category route used for all categories */}
        <Route path="/category/:type" element={<ProductCategory />} />

        {/* keep existing other routes if you want (optional) */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
