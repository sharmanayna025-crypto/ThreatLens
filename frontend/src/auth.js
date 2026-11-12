import axios from "axios";
import { API_BASE_URL } from "./config";

const TOKEN_KEY = "token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// True only if a token exists AND its "exp" claim is still in the future.
export function isTokenValid() {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
    return !json.exp || json.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

// Render's free tier sleeps when idle. Hitting /health early starts the wake-up
// while the user is still typing. Errors are expected (and ignored) while it boots.
export function warmUpServer() {
  axios.get(`${API_BASE_URL}/health`, { timeout: 60000 }).catch(() => {});
}
