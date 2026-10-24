export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:9090";

export async function apiFetch(path, options = {}) {
  return fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  });
}