// src/utils/getClientId.js
export function getClientId() {
  const key = "stoxtrack_client_id";
  let id = localStorage.getItem(key);
  if (!id) {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      id = crypto.randomUUID();
    } else {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    }
    localStorage.setItem(key, id);
  }
  return id;
}
