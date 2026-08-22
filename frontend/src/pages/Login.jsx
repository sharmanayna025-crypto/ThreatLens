import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        {
          email,
          password,
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      const token = response.data.token;

      if (!token) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      console.error("STATUS:", err.response?.status);
      console.error("DATA:", err.response?.data);

      if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError(
          err.response?.data?.message ||
          "Unable to connect to the server."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
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
          <div
            style={{
              width: "52px",
              height: "52px",
              margin: "0 auto 15px",
              borderRadius: "12px",
              background: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            T
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

          <input
            type="password"
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
