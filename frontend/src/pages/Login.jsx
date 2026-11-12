import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import ThreatLensLogo from "../components/ThreatLensLogo";
import { warmUpServer } from "../auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [waking, setWaking] = useState(false);

  useEffect(() => {
    warmUpServer();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // The backend may be asleep (Render free tier). Retry network failures
      // for up to ~1 minute instead of failing on the first attempt.
      const MAX_ATTEMPTS = 8;
      const RETRY_DELAY_MS = 8000;
      let response;

      for (let attempt = 1; ; attempt++) {
        try {
          response = await axios.post(`${API_BASE_URL}/auth/login`, {
            email,
            password,
          });
          break;
        } catch (err) {
          const noResponse = axios.isAxiosError(err) && !err.response;

          if (noResponse && attempt < MAX_ATTEMPTS) {
            setWaking(true);
            await new Promise((resolve) =>
              setTimeout(resolve, RETRY_DELAY_MS)
            );
            continue;
          }

          throw err;
        }
      }

      const token = response.data.token;

      if (!token) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      const serverMessage =
        typeof data === "string" ? data : data?.message;

      if (axios.isAxiosError(err) && !err.response) {
        setError(
          "Unable to reach the server. It may be waking up - please try again in a few seconds."
        );
      } else if (status === 401) {
        setError("Invalid email or password.");
      } else {
        setError(serverMessage || "Something went wrong. Please try again.");
      }
    } finally {
      setWaking(false);
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b1220",
        padding: "20px",
      }}
    >
      <div
        className="auth-card"
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#111827",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ margin: "0 auto 15px" }}>
            <ThreatLensLogo size={52} />
          </div>

          <h1
            style={{
              margin: 0,
              color: "white",
              fontSize: "28px",
            }}
          >
            ThreatLens
          </h1>

          <p
            style={{
              color: "#9ca3af",
              marginTop: "8px",
            }}
          >
            Network Threat Intelligence Platform
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label
            style={{
              display: "block",
              color: "#d1d5db",
              marginBottom: "8px",
            }}
          >
            Email
          </label>

          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid #374151",
              background: "#1f2937",
              color: "white",
              fontSize: "15px",
            }}
          />

          <label
            style={{
              display: "block",
              color: "#d1d5db",
              marginBottom: "8px",
            }}
          >
            Password
          </label>

          <div className="pw-field">
            <input
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid #374151",
              background: "#1f2937",
              color: "white",
              fontSize: "15px",
            }}
          />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {waking && (
            <div
              style={{
                background: "rgba(49,199,244,0.10)",
                border: "1px solid rgba(49,199,244,0.30)",
                color: "#8fe3fb",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              The server is waking up after a period of inactivity. This can
              take up to a minute - signing you in automatically...
            </div>
          )}

          {error && (
            <div
              style={{
                background: "#450a0a",
                color: "#fca5a5",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "8px",
              background: loading ? "#4b5563" : "#2563eb",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {waking ? "Waking up server..." : loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "22px",
            color: "#9ca3af",
            fontSize: "14px",
          }}
        >
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            style={{
              border: "none",
              background: "none",
              color: "#60a5fa",
              cursor: "pointer",
              fontWeight: "600",
              padding: 0,
            }}
          >
            Create one
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
