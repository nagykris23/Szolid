import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Parfumok from "./pages/Parfumok";
import Dezodorok from "./pages/Dezodorok";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Basket from "./pages/Basket";
import Checkout from "./pages/Checkout";
import ProtectedRoute from "./components/ProtectedRoute";
import Toast from "./components/Toast";
import Rolunk from "./pages/Rolunk";
import Kollekcio from "./pages/Kollekcio";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navigation />
        <Toast />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/parfumok" element={<Parfumok />} />
          <Route path="/dezodorok" element={<Dezodorok />} />
          <Route path="/termek/:id" element={<ProductDetails />} />
          <Route path="/kollekciok" element={<Kollekcio />} />
          <Route path="/rolunk" element={<Rolunk />} />
          <Route
            path="/kosar"
            element={
              <ProtectedRoute>
                <Basket />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/fizetes"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
