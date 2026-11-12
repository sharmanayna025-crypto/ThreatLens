import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./index.css";
import "./App.css";
import App from "./App.jsx";
import { clearToken } from "./auth";

// If the backend says the token is invalid/expired (401), drop it and send
// the user back to the login page instead of leaving a half-empty screen.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isAuthCall = url.includes("/auth/");

    if (error.response?.status === 401 && !isAuthCall) {
      clearToken();
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
