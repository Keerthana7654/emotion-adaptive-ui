// Central API config — change BASE_URL if your backend port changes
export const BASE_URL = "http://localhost:3005";

export function authHeaders(token) {
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}
