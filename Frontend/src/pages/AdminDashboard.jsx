import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllOrders, deleteOrder, updateOrderStatus, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from "../api/admin";
import { getAllProducts } from "../api/products";
import "./AdminDashboard.css";

const API_URL = "http://localhost:3000";
const IMAGE_BASE = `${API_URL}/images/`;
function imgUrl(u) { if (!u) return ""; if (u.startsWith("http")) return u; return IMAGE_BASE + u; }

const STATUS_LABELS = {
  pending: "Folyamatban", processing: "Feldolgozás", shipped: "Elküldve",
  delivered: "Kézbesítve", cancelled: "Törölve",
};
const STATUS_COLORS = {
  pending: "#f59e0b", processing: "#3b82f6", shipped: "#8b5cf6",
  delivered: "#10b981", cancelled: "#ef4444",
};

const EMPTY_PRODUCT = { name: "", description: "", price: "", stock_quantity: "", category_id: "1", image_url: "" };

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("orders");


  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [editOrderId, setEditOrderId] = useState(null);
  const [editOrderStatus, setEditOrderStatus] = useState("");


  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  getAllOrders()
    .then(setOrders)
    .catch((err) => { setOrders([]); setOrdersError(err.message || "Nem sikerült betölteni a rendeléseket."); })
    .finally(() => setOrdersLoading(false));
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) navigate("/");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (tab === "orders") {
      setOrdersLoading(true);
      getAllOrders()
        .then(setOrders)
        .catch(() => setOrders([]))
        .finally(() => setOrdersLoading(false));
    }
    if (tab === "products") {
      setProductsLoading(true);
      getAllProducts()
        .then(setProducts)
        .catch(() => setProducts([]))
        .finally(() => setProductsLoading(false));
    }
  }, [tab]);

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Biztosan törlöd a rendelést?")) return;
    await deleteOrder(id);
    setOrders((prev) => prev.filter((o) => o.order_id !== id));
  };

  const handleSaveOrderStatus = async (id) => {
    await updateOrderStatus(id, editOrderStatus);
    setOrders((prev) => prev.map((o) => o.order_id === id ? { ...o, status: editOrderStatus } : o));
    setEditOrderId(null);
  };


  const openCreateModal = () => {
    setEditProduct(null);
    setProductForm(EMPTY_PRODUCT);
    setFormError("");
    setShowProductModal(true);
  };
  const openEditModal = (p) => {
    setEditProduct(p);
    setProductForm({
      name: p.name, description: p.description, price: p.price,
      stock_quantity: p.stock_quantity, category_id: p.category_id || "1", image_url: p.image_url || ""
    });
    setFormError("");
    setShowProductModal(true);
  };

  const handleFormChange = (e) => setProductForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFormSubmit = async () => {
    setFormError("");
    if (!productForm.name || !productForm.description || !productForm.price || !productForm.category_id) {
      setFormError("Kérlek töltsd ki az összes kötelező mezőt!"); return;
    }
    setFormLoading(true);
    try {
      const payload = { ...productForm, price: Number(productForm.price), stock_quantity: Number(productForm.stock_quantity) };
      if (editProduct) {
        const updated = await adminUpdateProduct(editProduct.product_id, payload);
        setProducts((prev) => prev.map((p) => p.product_id === editProduct.product_id ? updated : p));
      } else {
        const created = await adminCreateProduct(payload);
        setProducts((prev) => [...prev, created]);
      }
      setShowProductModal(false);
    } catch (err) {
      setFormError(err.message || "Hiba történt");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Biztosan törlöd a terméket?")) return;
    await adminDeleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.product_id !== id));
  };

  if (loading) return <div className="admin-loading">Betöltés...</div>;
  if (!user || user.role !== "admin") return null;

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="brand-logo">OXI</span>
          <span className="brand-sub">Admin Panel</span>
        </div>
        <nav className="admin-nav">
          <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>
            <span className="nav-icon">📦</span> Rendelések
          </button>
          <button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}>
            <span className="nav-icon">🧴</span> Termékek
          </button>
        </nav>
        <button className="admin-back-btn" onClick={() => navigate("/")}>← Vissza a weboldalra</button>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <h1>{tab === "orders" ? "Rendelések kezelése" : "Termékek kezelése"}</h1>
          <span className="admin-user-tag">👤 {user.name}</span>
        </div>

        {tab === "orders" && (
          <div className="admin-section">
            <div className="section-header">
              <span className="section-count">{orders.length} rendelés</span>
            </div>
            {ordersLoading ? (
              <div className="admin-loading-inner">Rendelések betöltése...</div>
            ) : ordersError ? (
              <div className="admin-empty" style={{ color: "#ef4444" }}>⚠️ {ordersError}</div>
            ) : orders.length === 0 ? (
              <div className="admin-empty">Nincsenek rendelések.</div>
            ) : (
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#ID</th>
                      <th>Vásárló</th>
                      <th>Dátum</th>
                      <th>Összeg</th>
                      <th>Státusz</th>
                      <th>Fizetés</th>
                      <th>Műveletek</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.order_id}>
                        <td><span className="order-id">#{o.order_id}</span></td>
                        <td>{o.user_name}</td>
                        <td>{new Date(o.order_date).toLocaleDateString("hu-HU")}</td>
                        <td><strong>{Number(o.total_amount).toLocaleString("hu-HU")} Ft</strong></td>
                        <td>
                          {editOrderId === o.order_id ? (
                            <select value={editOrderStatus} onChange={(e) => setEditOrderStatus(e.target.value)} className="status-select">
                              {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                            </select>
                          ) : (
                            <span className="status-badge" style={{ background: STATUS_COLORS[o.status] + "20", color: STATUS_COLORS[o.status], borderColor: STATUS_COLORS[o.status] }}>
                              {STATUS_LABELS[o.status] || o.status}
                            </span>
                          )}
                        </td>
                        <td>
                          <span className={`payment-badge ${o.payment_status}`}>
                            {o.payment_status === "paid" ? "✓ Fizetve" : o.payment_status === "paid" ? "Nem fizetve" : "Visszatérítve"}
                          </span>
                        </td>
                        <td>
                          <div className="action-btns">
                            {editOrderId === o.order_id ? (
                              <>
                                <button className="btn-save" onClick={() => handleSaveOrderStatus(o.order_id)}>Mentés</button>
                                <button className="btn-cancel" onClick={() => setEditOrderId(null)}>Mégse</button>
                              </>
                            ) : (
                              <>
                                <button className="btn-edit" onClick={() => { setEditOrderId(o.order_id); setEditOrderStatus(o.status); }}>Szerkesztés</button>
                                <button className="btn-delete" onClick={() => handleDeleteOrder(o.order_id)}>Törlés</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}


        {tab === "products" && (
          <div className="admin-section">
            <div className="section-header">
              <span className="section-count">{products.length} termék</span>
              <button className="btn-new" onClick={openCreateModal}>+ Új termék</button>
            </div>
            {productsLoading ? (
              <div className="admin-loading-inner">Termékek betöltése...</div>
            ) : (
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Kép</th>
                      <th>#ID</th>
                      <th>Név</th>
                      <th>Kategória</th>
                      <th>Ár</th>
                      <th>Készlet</th>
                      <th>Műveletek</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.product_id}>
                        <td>
                          <div className="prod-thumb">
                            {p.image_url ? <img src={imgUrl(p.image_url)} alt={p.name} /> : <span>📦</span>}
                          </div>
                        </td>
                        <td><span className="order-id">#{p.product_id}</span></td>
                        <td><strong>{p.name}</strong></td>
                        <td><span className="cat-tag">{p.category_name}</span></td>
                        <td>{Number(p.price).toLocaleString("hu-HU")} Ft</td>
                        <td>
                          <span className={`stock-badge ${p.stock_quantity > 5 ? "in-stock" : p.stock_quantity > 0 ? "low-stock" : "out-stock"}`}>
                            {p.stock_quantity} db
                          </span>
                        </td>
                        <td>
                          <div className="action-btns">
                            <button className="btn-edit" onClick={() => openEditModal(p)}>Szerkesztés</button>
                            <button className="btn-delete" onClick={() => handleDeleteProduct(p.product_id)}>Törlés</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>


      {showProductModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target.classList.contains("modal-overlay")) setShowProductModal(false); }}>
          <div className="modal-box">
            <div className="modal-header">
              <h2>{editProduct ? "Termék szerkesztése" : "Új termék hozzáadása"}</h2>
              <button className="modal-close" onClick={() => setShowProductModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {formError && <div className="form-error">{formError}</div>}
              <div className="form-grid">
                <div className="form-group full">
                  <label>Név *</label>
                  <input name="name" value={productForm.name} onChange={handleFormChange} placeholder="Termék neve" />
                </div>
                <div className="form-group full">
                  <label>Leírás *</label>
                  <textarea name="description" value={productForm.description} onChange={handleFormChange} placeholder="Termék leírása" rows={3} />
                </div>
                <div className="form-group">
                  <label>Ár (Ft) *</label>
                  <input name="price" type="number" value={productForm.price} onChange={handleFormChange} placeholder="4500" />
                </div>
                <div className="form-group">
                  <label>Készlet (db)</label>
                  <input name="stock_quantity" type="number" value={productForm.stock_quantity} onChange={handleFormChange} placeholder="10" />
                </div>
                <div className="form-group">
                  <label>Kategória *</label>
                  <select name="category_id" value={productForm.category_id} onChange={handleFormChange}>
                    <option value="1">parfum</option>
                    <option value="2">dezodor</option>
                    <option value="3">csomag</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Kép URL / fájlnév</label>
                  <input name="image_url" value={productForm.image_url} onChange={handleFormChange} placeholder="angel.jpg" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowProductModal(false)}>Mégse</button>
              <button className="btn-save" onClick={handleFormSubmit} disabled={formLoading}>
                {formLoading ? "Mentés..." : editProduct ? "Mentés" : "Létrehozás"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
