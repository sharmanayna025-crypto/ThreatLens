import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ThreatLensLogo from "../components/ThreatLensLogo";
import { API_BASE_URL } from "../config";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/auth/register`, form);

      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error("REGISTRATION ERROR:", err);

      if (err.response?.data) {
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : "Registration failed. Please try again."
        );
      } else {
        setError("Unable to connect to the server.");
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
              display: "flex",
              justifyContent: "center",
              marginBottom: "18px",
            }}
          >
            <ThreatLensLogo size={52} />
          </div>

          <h1
            style={{
              margin: 0,
              color: "white",
              fontSize: "28px",
            }}
          >
            Create Account
          </h1>

          <p
            style={{
              color: "#9ca3af",
              marginTop: "8px",
            }}
          >
            Join ThreatLens Security Platform
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.35)",
              color: "#fca5a5",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "18px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "rgba(34,197,94,0.12)",
              border: "1px solid rgba(34,197,94,0.35)",
              color: "#86efac",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "18px",
              fontSize: "14px",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                color: "#d1d5db",
                marginBottom: "7px",
                fontSize: "14px",
              }}
            >
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid #374151",
                background: "#0f172a",
                color: "white",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                color: "#d1d5db",
                marginBottom: "7px",
                fontSize: "14px",
              }}
            >
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid #374151",
                background: "#0f172a",
                color: "white",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                color: "#d1d5db",
                marginBottom: "7px",
                fontSize: "14px",
              }}
            >
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid #374151",
                background: "#0f172a",
                color: "white",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "8px",
              background: loading ? "#475569" : "#2563eb",
              color: "white",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating Account..." : "Create Account"}
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
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              border: "none",
              background: "none",
              color: "#60a5fa",
              cursor: "pointer",
              fontWeight: "600",
              padding: 0,
            }}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
