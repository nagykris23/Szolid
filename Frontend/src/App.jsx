import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Parfumok from "./pages/Parfumok";
import ProductDetails from "./pages/ProductDetails"; 
import "./App.css";

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/parfumok" element={<Parfumok />} />
        <Route path="/termek/:id" element={<ProductDetails />} />
      </Routes>
    </>
  );
}

export default App;