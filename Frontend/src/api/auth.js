const API_URL = "http://localhost:3000";

export async function loginUser(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
        console.error("Login error:", data);
        throw new Error(data.message || "Login hiba");
    }

    return data;
}

export async function registerUser(name, email, password) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
        console.error("Register error:", data);
        throw new Error(data.message || "Regisztrációs hiba");
    }

    return data;
}
