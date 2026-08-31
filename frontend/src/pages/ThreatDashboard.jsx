import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";


function ThreatDashboard() {
  const navigate = useNavigate();

  const [threats, setThreats] = useState([]);
  const [assets, setAssets] = useState([]);
  const [risk, setRisk] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [threatResponse, assetResponse, riskResponse] =
        await Promise.all([
          axios.get(
            `${API_BASE_URL}/api/threats`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          axios.get(
            `${API_BASE_URL}/api/network/assets`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          axios.get(
            `${API_BASE_URL}/api/risk`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

      setThreats(threatResponse.data);
      setAssets(assetResponse.data);
      setRisk(riskResponse.data);

    } catch (err) {
      console.error("Dashboard error:", err);

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        setError(
          "Your session has expired. Please log in again."
        );
      } else {
        setError(
          `Unable to load dashboard data (${
            err.response?.status || "Network Error"
          }).`
        );
      }

    } finally {
      setLoading(false);
    }
  };

  const criticalCount = threats.filter(
    (threat) => threat.severity === "CRITICAL"
  ).length;

  const highCount = threats.filter(
    (threat) => threat.severity === "HIGH"
  ).length;

  const mediumCount = threats.filter(
    (threat) => threat.severity === "MEDIUM"
  ).length;

  const openCount = threats.filter(
    (threat) => threat.status === "OPEN"
  ).length;

  const highRiskCount =
    criticalCount + highCount;

  const highRiskPercentage =
    threats.length > 0
      ? Math.round(
          (highRiskCount / threats.length) * 100
        )
      : 0;

  const getSeverityClass = (severity) => {
    if (severity === "CRITICAL") return "critical";
    if (severity === "HIGH") return "high";
    if (severity === "MEDIUM") return "medium";
    return "low";
  };

  const getRiskColor = (level) => {
    if (level === "CRITICAL") return "#ef4444";
    if (level === "HIGH") return "#f97316";
    if (level === "MEDIUM") return "#eab308";
    return "#22c55e";
  };

  const getAssetRiskColor = (level) => {
    if (level === "CRITICAL") return "#ef4444";
    if (level === "HIGH") return "#f97316";
    if (level === "MEDIUM") return "#eab308";
    if (level === "LOW") return "#22c55e";
    return "#64748b";
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Loading ThreatLens</h2>
        <p>
          Collecting current network security data.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Dashboard Unavailable</h2>

        <p>{error}</p>

        <button onClick={loadDashboardData}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="threat-dashboard">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">T</div>
          <span>ThreatLens</span>
        </div>

        <nav>

          <button
            className="nav-item active"
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

          <button
            className="nav-item"
            onClick={() => navigate("/threats")}
          >
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

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="main-content">

        {/* TOPBAR */}

        <header className="topbar">

          <div>
            <h1>Security Dashboard</h1>

            <p>
              Real-time network threat monitoring
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

        {/* ===================================================
            TOP STATISTICS
        =================================================== */}

        <section className="stats-grid">

          <div className="stat-card critical-card">

            <div>
              <span>CRITICAL THREATS</span>

              <strong>
                {criticalCount}
              </strong>
            </div>

            <div className="stat-icon">
              !
            </div>

          </div>

          <div className="stat-card high-card">

            <div>
              <span>HIGH RISK</span>

              <strong>
                {highCount}
              </strong>
            </div>

            <div className="stat-icon">
              ⚠
            </div>

          </div>

          <div className="stat-card medium-card">

            <div>
              <span>MEDIUM RISK</span>

              <strong>
                {mediumCount}
              </strong>
            </div>

            <div className="stat-icon">
              ◐
            </div>

          </div>

          <div className="stat-card open-card">

            <div>
              <span>OPEN INCIDENTS</span>

              <strong>
                {openCount}
              </strong>
            </div>

            <div className="stat-icon">
              ◉
            </div>

          </div>

        </section>

        {/* ===================================================
            SECURITY POSTURE
        =================================================== */}

        {risk && (
          <section
            className="threat-section"
            style={{
              marginBottom: "24px",
            }}
          >

            <div className="section-header">

              <div>
                <h2>Security Posture</h2>

                <p>
                  Current network-wide risk assessment
                </p>
              </div>

              <button
                onClick={() => navigate("/risk")}
                style={{
                  padding: "7px 11px",
                  borderRadius: "7px",
                  border: "1px solid #26354b",
                  background: "#111a2a",
                  color: "#aebbd0",
                  fontSize: "10px",
                  fontWeight: 650,
                  cursor: "pointer",
                }}
              >
                View Risk Analysis →
              </button>

            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "180px minmax(0, 1fr) 170px",
                gap: "24px",
                alignItems: "center",
                padding: "24px",
              }}
            >

              {/* SCORE */}

              <div
                style={{
                  padding: "18px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(145deg, #111a2a, #0b1320)",
                  border:
                    `1px solid ${getRiskColor(
                      risk.riskLevel
                    )}35`,
                  textAlign: "center",
                }}
              >

                <div
                  style={{
                    color: getRiskColor(
                      risk.riskLevel
                    ),
                    fontSize: "42px",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {risk.overallRiskScore}
                </div>

                <div
                  style={{
                    marginTop: "7px",
                    color: "#65738a",
                    fontSize: "9px",
                    letterSpacing: "0.06em",
                    fontWeight: 700,
                  }}
                >
                  RISK SCORE / 100
                </div>

              </div>

              {/* METER */}

              <div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >

                  <span
                    style={{
                      color: "#cbd5e1",
                      fontSize: "11px",
                      fontWeight: 650,
                    }}
                  >
                    Current exposure
                  </span>

                  <span
                    style={{
                      color: getRiskColor(
                        risk.riskLevel
                      ),
                      fontSize: "10px",
                      fontWeight: 750,
                    }}
                  >
                    {risk.riskLevel}
                  </span>

                </div>

                <div
                  style={{
                    width: "100%",
                    height: "10px",
                    borderRadius: "999px",
                    background: "#182234",
                    overflow: "hidden",
                  }}
                >

                  <div
                    style={{
                      width: `${risk.overallRiskScore}%`,
                      height: "100%",
                      background:
                        getRiskColor(
                          risk.riskLevel
                        ),
                      borderRadius: "999px",
                    }}
                  />

                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    marginTop: "7px",
                    color: "#4f5d73",
                    fontSize: "9px",
                  }}
                >
                  <span>LOW</span>
                  <span>MEDIUM</span>
                  <span>HIGH</span>
                  <span>CRITICAL</span>
                </div>

              </div>

              {/* HIGH-RISK EXPOSURE */}

              <div
                style={{
                  padding: "16px",
                  borderRadius: "11px",
                  background:
                    "rgba(127, 29, 29, 0.12)",
                  border:
                    "1px solid rgba(239,68,68,0.15)",
                }}
              >

                <div
                  style={{
                    color: "#f87171",
                    fontSize: "25px",
                    fontWeight: 800,
                  }}
                >
                  {highRiskPercentage}%
                </div>

                <div
                  style={{
                    marginTop: "5px",
                    color: "#8290a7",
                    fontSize: "10px",
                  }}
                >
                  of threats are high or
                  critical risk
                </div>

              </div>

            </div>

          </section>
        )}

        {/* ===================================================
            NETWORK OVERVIEW
        =================================================== */}

        <section className="threat-section">

          <div className="section-header">

            <div>
              <h2>Network Overview</h2>

              <p>
                Current infrastructure monitored by ThreatLens
              </p>
            </div>

            <span className="threat-count">
              {assets.length} assets
            </span>

          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
              padding: "24px",
            }}
          >

            {assets.length === 0 ? (

              <div className="empty-state">
                No network assets found.
              </div>

            ) : (

              assets.map((asset) => {

                const riskColor =
                  getAssetRiskColor(
                    asset.riskLevel
                  );

                return (
                  <div
                    key={asset.id}
                    style={{
                      padding: "18px",
                      borderRadius: "11px",
                      background:
                        "linear-gradient(145deg, #111a2a, #0c1422)",
                      border:
                        "1px solid #1d2a3f",
                      borderTop:
                        `2px solid ${riskColor}`,
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >

                      <span
                        style={{
                          color: "#6f7c94",
                          fontSize: "9px",
                          fontWeight: 700,
                          letterSpacing: "0.07em",
                        }}
                      >
                        {asset.deviceType}
                      </span>

                      <span
                        style={{
                          color: riskColor,
                          fontSize: "9px",
                          fontWeight: 750,
                        }}
                      >
                        {asset.riskLevel}
                      </span>

                    </div>

                    <div
                      style={{
                        color: "#eef5ff",
                        fontSize: "17px",
                        fontWeight: 700,
                        lineHeight: 1.15,
                      }}
                    >
                      {asset.name}
                    </div>

                    <div
                      style={{
                        marginTop: "7px",
                        color: "#748198",
                        fontSize: "10px",
                      }}
                    >
                      {asset.ipAddress}
                    </div>

                    <div
                      style={{
                        marginTop: "11px",
                        color: "#4f5d73",
                        fontSize: "9px",
                      }}
                    >
                      {asset.operatingSystem ||
                        "Operating system unavailable"}
                    </div>

                  </div>
                );
              })
            )}

          </div>

        </section>

        {/* ===================================================
            RECENT THREATS
        =================================================== */}

        <section className="threat-section">

          <div className="section-header">

            <div>
              <h2>Recent Threat Activity</h2>

              <p>
                Latest security events detected across
                the network
              </p>
            </div>

            <button
              onClick={() => navigate("/threats")}
              style={{
                padding: "7px 11px",
                borderRadius: "7px",
                border: "1px solid #26354b",
                background: "#111a2a",
                color: "#aebbd0",
                fontSize: "10px",
                fontWeight: 650,
                cursor: "pointer",
              }}
            >
              View All Threats →
            </button>

          </div>

          <div className="threat-list">

            {threats.length === 0 ? (

              <div className="empty-state">
                No threats detected.
              </div>

            ) : (

              threats.slice(0, 8).map((threat) => (

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

                  <div className="status-badge">
                    {threat.status}
                  </div>

                </div>

              ))
            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default ThreatDashboard;
