const API_BASE = '/api';
const SESSION_KEY = 'laptech-session';
async function handleResponse(response) {
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || response.statusText);
    }
    return response.json();
}
function getAuthHeaders() {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw)
        return {};
    try {
        const parsed = JSON.parse(raw);
        if (!parsed.currentUser?.id)
            return {};
        return { Authorization: `Bearer ${parsed.currentUser.id}` };
    }
    catch {
        return {};
    }
}
export async function initDb() {
    try {
        await fetch(`${API_BASE}/status`);
    }
    catch (error) {
        console.warn('API не доступен', error);
    }
}
export async function getAllProducts() {
    return handleResponse(await fetch(`${API_BASE}/products`));
}
export async function getProductById(id) {
    return handleResponse(await fetch(`${API_BASE}/products/${id}`));
}
export async function createUser(user) {
    return handleResponse(await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    }));
}
export async function loginUser(email, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    const payload = await handleResponse(response);
    return payload.user;
}
export async function saveOrder(order) {
    return handleResponse(await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(order),
    }));
}
export async function getAllOrders() {
    return handleResponse(await fetch(`${API_BASE}/orders`, {
        headers: getAuthHeaders(),
    }));
}
export async function saveProduct(product) {
    return handleResponse(await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(product),
    }));
}
export async function deleteProduct(id) {
    await handleResponse(await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    }));
}
