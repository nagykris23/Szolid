const API_URL = "http://localhost:3000";

export async function getProductsByCategory(category) {
    try {
        const categoryMap = {
            "parfüm": "parfum",
            "parfum": "parfum",
            "dezodor": "dezodor"
        };
        const mappedCategory = categoryMap[category.toLowerCase()] || category;
        const res = await fetch(`${API_URL}/api/products?category=${encodeURIComponent(mappedCategory)}`);
        
        if (!res.ok) {
            throw new Error(`HTTP hiba: ${res.status}`);
        }
        
        return await res.json();
    } catch (error) {
        console.error("Termékek betöltési hiba:", error);
        throw error;
    }
}

export async function getProductById(id) {
    try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        
        if (!res.ok) {
            throw new Error(`HTTP hiba: ${res.status}`);
        }
        
        return await res.json();
    } catch (error) {
        console.error("Termék betöltési hiba:", error);
        throw error;
    }
}

export async function getAllProducts() {
    try {
        const res = await fetch(`${API_URL}/api/products`);
        
        if (!res.ok) {
            throw new Error(`HTTP hiba: ${res.status}`);
        }
        
        return await res.json();
    } catch (error) {
        console.error("Termékek betöltési hiba:", error);
        throw error;
    }
}

