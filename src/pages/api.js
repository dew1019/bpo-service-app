// src/api.js
// Normalize base URL (no trailing slash)
export const API_URL = (
    process.env.REACT_APP_API_URL ||
    'https://hearty-happiness-production.up.railway.app'
).replace(/\/+$/, '');

async function jsonFetch(url, options) {
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
        ...options,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const msg = data?.message || `HTTP ${res.status}`;
        console.error('Request error:', res.status, msg, url);
        throw new Error(msg);
    }
    return data;
}

export function postClientSignature(token, signature) {
    return jsonFetch(`${API_URL}/api/sign/${token}`, {
        method: 'POST',
        body: JSON.stringify({ signature }),
    });
}

export function postDirectorSignature(token, signature) {
    return jsonFetch(`${API_URL}/api/sign-director/${token}`, {
        method: 'POST',
        body: JSON.stringify({ signature }),
    });
}
