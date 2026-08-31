import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import ThreatLensLogo from "../components/ThreatLensLogo";


function Threats() {
  const navigate = useNavigate();

  const [threats, setThreats] = useState([]);
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadThreats = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/api/threats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setThreats(response.data);
    } catch (err) {
      console.error("Threat loading error:", err);

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        setError(
          "Your session has expired. Please log in again."
        );
      } else {
        setError("Unable to load threats.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThreats();
  }, []);

  const updateThreatStatus = async (threatId, newStatus) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in again.");
      return;
    }

    setUpdatingId(threatId);
    setError("");

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/threats/${threatId}/status`,
        null,
        {
          params: {
            status: newStatus,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setThreats((currentThreats) =>
        currentThreats.map((threat) =>
          threat.id === threatId
            ? response.data
            : threat
        )
      );
    } catch (err) {
      console.error("Status update error:", err);

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        setError(
          "Your session has expired. Please log in again."
        );
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Unable to update threat status.");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredThreats = threats.filter((threat) => {
    const severityMatches =
      severityFilter === "ALL" ||
      threat.severity === severityFilter;

    const statusMatches =
      statusFilter === "ALL" ||
      threat.status === statusFilter;

    return severityMatches && statusMatches;
  });

  const getSeverityClass = (severity) => {
    if (severity === "CRITICAL") return "critical";
    if (severity === "HIGH") return "high";
    if (severity === "MEDIUM") return "medium";
    return "low";
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Loading Threats</h2>
        <p>Fetching detected security events.</p>
      </div>
    );
  }

  if (error && threats.length === 0) {
    return (
      <div className="dashboard-error">
        <h2>Threats Unavailable</h2>
        <p>{error}</p>

        <button onClick={loadThreats}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="threat-dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <ThreatLensLogo size={40} />

        <nav>

          <button
            className="nav-item"
            onClick={() => navigate("/dashboard")}
          >
            <span>▣</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/network")}
          >
            <span>⌁</span>
            Network Map
          </button>

          <button className="nav-item active">
            <span>⚠</span>
            Threats
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/risk")}
          >
            <span>◈</span>
            Risk Analysis
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/simulations")}
          >
            <span>◉</span>
            Simulations
          </button>

        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot"></span>
            System Online
          </div>
        </div>

      </aside>

      {/* MAIN */}

      <main className="main-content">

        <header className="topbar">

          <div>
            <h1>Threat Detections</h1>

            <p>
              Monitor and investigate detected security threats
            </p>
          </div>

          <div className="user-info">

            <div className="user-avatar">
              TS
            </div>

            <div>
              <strong>Security Analyst</strong>
              <span>Administrator</span>
            </div>

          </div>

        </header>

        {/* FILTERS */}

        <section className="threat-section">

          <div className="section-header">

            <div>
              <h2>All Threats</h2>

              <p>
                {filteredThreats.length} threats matching current filters
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >

              <select
                value={severityFilter}
                onChange={(e) =>
                  setSeverityFilter(e.target.value)
                }
                style={{
                  background: "#111a2a",
                  color: "#dbe7f8",
                  border: "1px solid #26354b",
                  borderRadius: "7px",
                  padding: "8px 10px",
                  fontSize: "11px",
                }}
              >
                <option value="ALL">All Severity</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                style={{
                  background: "#111a2a",
                  color: "#dbe7f8",
                  border: "1px solid #26354b",
                  borderRadius: "7px",
                  padding: "8px 10px",
                  fontSize: "11px",
                }}
              >
                <option value="ALL">All Status</option>
                <option value="OPEN">Open</option>
                <option value="INVESTIGATING">
                  Investigating
                </option>
                <option value="RESOLVED">
                  Resolved
                </option>
              </select>

            </div>

          </div>

          {error && threats.length > 0 && (
            <div
              style={{
                margin: "14px 22px 0",
                padding: "10px 12px",
                borderRadius: "8px",
                background: "rgba(127, 29, 29, 0.28)",
                border: "1px solid rgba(239, 68, 68, 0.18)",
                color: "#fca5a5",
                fontSize: "11px",
              }}
            >
              {error}
            </div>
          )}

          {/* THREAT LIST */}

          <div className="threat-list">

            {filteredThreats.length === 0 ? (

              <div className="empty-state">
                No threats match the selected filters.
              </div>

            ) : (

              filteredThreats.map((threat) => (

                <div
                  className="threat-row"
                  key={threat.id}
                >

                  <div className="threat-indicator">

                    <span
                      className={`severity-dot ${getSeverityClass(
                        threat.severity
                      )}`}
                    />

                  </div>

                  <div className="threat-info">

                    <strong>
                      {threat.threatType}
                    </strong>

                    <span>
                      {threat.description}
                    </span>

                  </div>

                  <div className="asset-path">

                    <span>
                      {threat.sourceAsset?.name ||
                        "Unknown"}
                    </span>

                    <b>→</b>

                    <span>
                      {threat.destinationAsset?.name ||
                        "Unknown"}
                    </span>

                  </div>

                  <div
                    className={`severity-badge ${getSeverityClass(
                      threat.severity
                    )}`}
                  >
                    {threat.severity}
                  </div>

                  {/* STATUS CONTROL */}

                  <select
                    value={threat.status}
                    disabled={updatingId === threat.id}
                    onChange={(e) =>
                      updateThreatStatus(
                        threat.id,
                        e.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "7px 8px",
                      borderRadius: "7px",
                      border:
                        "1px solid #26354b",
                      background:
                        threat.status === "RESOLVED"
                          ? "rgba(20, 83, 45, 0.35)"
                          : threat.status === "INVESTIGATING"
                          ? "rgba(113, 63, 18, 0.30)"
                          : "#111a2a",
                      color:
                        threat.status === "RESOLVED"
                          ? "#4ade80"
                          : threat.status === "INVESTIGATING"
                          ? "#facc15"
                          : "#cbd5e1",
                      fontSize: "10px",
                      fontWeight: 700,
                      cursor:
                        updatingId === threat.id
                          ? "wait"
                          : "pointer",
                      outline: "none",
                    }}
                  >
                    <option value="OPEN">
                      OPEN
                    </option>

                    <option value="INVESTIGATING">
                      INVESTIGATING
                    </option>

                    <option value="RESOLVED">
                      RESOLVED
                    </option>
                  </select>

                </div>

              ))

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Threats;
