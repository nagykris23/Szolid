const API_URL = "http://localhost:3000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}


export async function getAllOrders() {
  const res = await fetch(`${API_URL}/api/orders`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Nem sikerült betölteni a rendeléseket");
  return res.json();
}

export async function deleteOrder(id) {
  const res = await fetch(`${API_URL}/api/orders/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Törlés sikertelen");
  return res.json();
}

export async function updateOrderStatus(id, status) {
  const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Státusz frissítés sikertelen");
  return res.json();
}


export async function adminCreateProduct(data) {
  const res = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Termék létrehozás sikertelen");
  return res.json();
}

export async function adminUpdateProduct(id, data) {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Termék frissítés sikertelen");
  return res.json();
}

export async function adminDeleteProduct(id) {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Termék törlés sikertelen");
  return res.json();
}
