import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductCards from "./components/productCards/ProductCards";

import VegetablePickles from "./pages/VegetablePickles";
import NonVegPickles from "./pages/NonVegPickles";
import DeliciousPowders from "./pages/DeliciousPowders";
import MilletsReadytoCook from "./pages/MilletsReadytoCook";
import ReadytoEat from "./pages/ReadytoEat";
import OrganicMillets from "./pages/OrganicMillets";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<ProductCards />} />

        {/* Product Category Pages */}
        <Route path="/vegetable-pickles" element={<VegetablePickles />} />
        <Route path="/nonveg-pickles" element={<NonVegPickles />} />
        <Route path="/delicious-powders" element={<DeliciousPowders />} />
        <Route path="/millets-ready-to-cook" element={<MilletsReadytoCook />} />
        <Route path="/ready-to-eat" element={<ReadytoEat />} />
        <Route path="/organic-millets" element={<OrganicMillets />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
