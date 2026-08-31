import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";


function RiskAnalysis() {
  const navigate = useNavigate();

  const [risk, setRisk] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRiskData();
  }, []);

  const loadRiskData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in again.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/risk`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRisk(response.data);
    } catch (err) {
      console.error("Risk API error:", err);

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        setError(
          "Your session has expired. Please log in again."
        );
      } else {
        setError("Unable to load risk analysis.");
      }
    }
  };

  const getRiskClass = (level) => {
    if (level === "CRITICAL") return "critical";
    if (level === "HIGH") return "high";
    if (level === "MEDIUM") return "medium";
    return "low";
  };

  const getRiskColor = (level) => {
    if (level === "CRITICAL") return "#ef4444";
    if (level === "HIGH") return "#f97316";
    if (level === "MEDIUM") return "#eab308";
    return "#22c55e";
  };

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Risk Analysis Unavailable</h2>
        <p>{error}</p>

        <button
          onClick={loadRiskData}
          style={{
            marginTop: "18px",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "650",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!risk) {
    return (
      <div className="dashboard-loading">
        <h2>Loading Risk Analysis</h2>
        <p>Calculating current network security posture.</p>
      </div>
    );
  }

  const severityData = [
    {
      label: "Critical",
      count: risk.criticalThreats,
      description: "Most severe security events",
      color: "#ef4444",
    },
    {
      label: "High",
      count: risk.highThreats,
      description: "High priority security events",
      color: "#f97316",
    },
    {
      label: "Medium",
      count: risk.mediumThreats,
      description: "Moderate security events",
      color: "#eab308",
    },
    {
      label: "Low",
      count: risk.lowThreats,
      description: "Low priority security events",
      color: "#22c55e",
    },
  ];

  const highRiskThreats =
    risk.criticalThreats + risk.highThreats;

  const highRiskPercentage =
    risk.totalThreats > 0
      ? Math.round(
          (highRiskThreats / risk.totalThreats) * 100
        )
      : 0;

  return (
    <div className="threat-dashboard">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">T</div>
          <span>ThreatLens</span>
        </div>

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

          <button
            className="nav-item"
            onClick={() => navigate("/threats")}
          >
            <span>⚠</span>
            Threats
          </button>

          <button className="nav-item active">
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

      {/* ================= MAIN ================= */}

      <main className="main-content">

        {/* TOPBAR */}

        <header className="topbar">

          <div>
            <h1>Risk Analysis</h1>

            <p>
              Assess current network security risk
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

        {/* ================= RISK STATISTICS ================= */}

        <section className="stats-grid">

          <div className="stat-card">

            <div>
              <span>OVERALL RISK SCORE</span>

              <strong>
                {risk.overallRiskScore}/100
              </strong>
            </div>

            <div className="stat-icon">
              ◈
            </div>

          </div>

          <div
            className="stat-card"
            style={{
              borderTop: `2px solid ${getRiskColor(
                risk.riskLevel
              )}`,
            }}
          >

            <div>
              <span>RISK LEVEL</span>

              <strong
                className={getRiskClass(risk.riskLevel)}
              >
                {risk.riskLevel}
              </strong>
            </div>

            <div className="stat-icon">
              ⚠
            </div>

          </div>

          <div className="stat-card">

            <div>
              <span>CRITICAL THREATS</span>

              <strong>
                {risk.criticalThreats}
              </strong>
            </div>

            <div className="stat-icon">
              !
            </div>

          </div>

          <div className="stat-card">

            <div>
              <span>HIGH THREATS</span>

              <strong>
                {risk.highThreats}
              </strong>
            </div>

            <div className="stat-icon">
              ⚠
            </div>

          </div>

        </section>

        {/* ================= RISK METER ================= */}

        <section className="threat-section">

          <div className="section-header">

            <div>
              <h2>Network Risk Assessment</h2>

              <p>
                Risk calculated by the ThreatLens risk engine
              </p>
            </div>

            <span className="threat-count">
              {risk.totalThreats} detected events
            </span>

          </div>

          <div
            style={{
              padding: "30px 28px 34px",
            }}
          >

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: "20px",
                marginBottom: "18px",
              }}
            >

              <div>

                <div
                  style={{
                    fontSize: "62px",
                    lineHeight: 1,
                    fontWeight: "800",
                    letterSpacing: "-0.05em",
                    color: "#f8fbff",
                  }}
                >
                  {risk.overallRiskScore}
                </div>

                <div
                  style={{
                    marginTop: "8px",
                    color: "#748198",
                    fontSize: "11px",
                  }}
                >
                  Overall Risk Score / 100
                </div>

              </div>

              <div
                style={{
                  padding: "9px 13px",
                  borderRadius: "8px",
                  background: `${getRiskColor(
                    risk.riskLevel
                  )}18`,
                  border: `1px solid ${getRiskColor(
                    risk.riskLevel
                  )}30`,
                  color: getRiskColor(risk.riskLevel),
                  fontSize: "11px",
                  fontWeight: "750",
                  letterSpacing: "0.05em",
                }}
              >
                {risk.riskLevel} RISK
              </div>

            </div>

            <div
              style={{
                width: "100%",
                height: "14px",
                background: "#182234",
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >

              <div
                style={{
                  width: `${risk.overallRiskScore}%`,
                  height: "100%",
                  background: getRiskColor(risk.riskLevel),
                  borderRadius: "999px",
                  transition: "width 0.6s ease",
                  boxShadow:
                    `0 0 16px ${getRiskColor(
                      risk.riskLevel
                    )}55`,
                }}
              />

            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "8px",
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

        </section>

        {/* ================= SEVERITY BREAKDOWN ================= */}

        <section className="threat-section">

          <div className="section-header">

            <div>
              <h2>Threat Severity Breakdown</h2>

              <p>
                Distribution of detected security events
              </p>
            </div>

            <span className="threat-count">
              {risk.totalThreats} total threats
            </span>

          </div>

          {/* SEVERITY CARDS */}

          <div
            style={{
              padding: "24px",
              display: "grid",
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
              gap: "16px",
            }}
          >

            {severityData.map((item) => {

              const percentage =
                risk.totalThreats > 0
                  ? Math.round(
                      (item.count /
                        risk.totalThreats) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={item.label}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    padding: "20px",
                    borderRadius: "12px",
                    background:
                      "linear-gradient(145deg, #111a2a, #0c1422)",
                    border: "1px solid #1d2a3f",
                  }}
                >

                  {/* TOP ACCENT */}

                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "3px",
                      background: item.color,
                    }}
                  />

                  {/* CARD HEADER */}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                      marginBottom: "18px",
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "9px",
                      }}
                    >

                      <span
                        style={{
                          width: "9px",
                          height: "9px",
                          borderRadius: "50%",
                          background: item.color,
                          boxShadow:
                            `0 0 10px ${item.color}66`,
                        }}
                      />

                      <span
                        style={{
                          color: "#e6edf7",
                          fontSize: "13px",
                          fontWeight: "700",
                        }}
                      >
                        {item.label}
                      </span>

                    </div>

                    <span
                      style={{
                        color: item.color,
                        fontSize: "11px",
                        fontWeight: "750",
                      }}
                    >
                      {percentage}%
                    </span>

                  </div>

                  {/* COUNT */}

                  <div
                    style={{
                      color: "#f8fbff",
                      fontSize: "36px",
                      lineHeight: 1,
                      fontWeight: "800",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {item.count}
                  </div>

                  {/* DESCRIPTION */}

                  <div
                    style={{
                      minHeight: "31px",
                      marginTop: "10px",
                      color: "#748198",
                      fontSize: "10px",
                      lineHeight: 1.4,
                    }}
                  >
                    {item.description}
                  </div>

                  {/* PROGRESS */}

                  <div
                    style={{
                      width: "100%",
                      height: "7px",
                      marginTop: "18px",
                      background: "#1a2435",
                      borderRadius: "999px",
                      overflow: "hidden",
                    }}
                  >

                    <div
                      style={{
                        width: `${percentage}%`,
                        height: "100%",
                        background: item.color,
                        borderRadius: "999px",
                        transition:
                          "width 0.5s ease",
                      }}
                    />

                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "8px",
                      color: "#59677e",
                      fontSize: "9px",
                    }}
                  >

                    <span>
                      Threat share
                    </span>

                    <span>
                      {item.count} of{" "}
                      {risk.totalThreats}
                    </span>

                  </div>

                </div>
              );
            })}

          </div>

          {/* OVERALL DISTRIBUTION */}

          <div
            style={{
              margin: "0 24px 24px",
              padding: "18px",
              borderRadius: "10px",
              background: "#0a111e",
              border: "1px solid #172337",
            }}
          >

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
                marginBottom: "12px",
              }}
            >

              <div>

                <span
                  style={{
                    display: "block",
                    color: "#cbd5e1",
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "0.04em",
                  }}
                >
                  OVERALL THREAT DISTRIBUTION
                </span>

                <span
                  style={{
                    display: "block",
                    marginTop: "4px",
                    color: "#64748b",
                    fontSize: "10px",
                  }}
                >
                  Current severity composition across
                  the network
                </span>

              </div>

              <strong
                style={{
                  color: "#e6edf7",
                  fontSize: "13px",
                  whiteSpace: "nowrap",
                }}
              >
                {risk.totalThreats} events
              </strong>

            </div>

            <div
              style={{
                display: "flex",
                width: "100%",
                height: "10px",
                borderRadius: "999px",
                overflow: "hidden",
                background: "#172033",
              }}
            >

              {severityData.map((item) => {

                const percentage =
                  risk.totalThreats > 0
                    ? (item.count /
                        risk.totalThreats) *
                      100
                    : 0;

                return (
                  <div
                    key={item.label}
                    style={{
                      width: `${percentage}%`,
                      minWidth:
                        item.count > 0
                          ? "3px"
                          : "0",
                      background: item.color,
                      transition:
                        "width 0.5s ease",
                    }}
                  />
                );
              })}

            </div>

          </div>

        </section>

        {/* ================= HIGH RISK EXPOSURE ================= */}

        <section className="threat-section">

          <div className="section-header">

            <div>
              <h2>High-Risk Exposure</h2>

              <p>
                Critical and high-severity events requiring
                priority attention
              </p>
            </div>

            <span
              className="severity-badge critical"
            >
              {highRiskPercentage}% HIGH RISK
            </span>

          </div>

          <div
            style={{
              padding: "24px",
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1fr) 180px",
              gap: "24px",
              alignItems: "center",
            }}
          >

            <div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "9px",
                }}
              >

                <span
                  style={{
                    color: "#cbd5e1",
                    fontSize: "11px",
                    fontWeight: "650",
                  }}
                >
                  Critical + High threats
                </span>

                <strong
                  style={{
                    color: "#f8fbff",
                    fontSize: "11px",
                  }}
                >
                  {highRiskThreats} /{" "}
                  {risk.totalThreats}
                </strong>

              </div>

              <div
                style={{
                  width: "100%",
                  height: "10px",
                  background: "#1a2435",
                  borderRadius: "999px",
                  overflow: "hidden",
                }}
              >

                <div
                  style={{
                    width: `${highRiskPercentage}%`,
                    height: "100%",
                    background:
                      "linear-gradient(90deg, #f97316, #ef4444)",
                    borderRadius: "999px",
                    transition:
                      "width 0.5s ease",
                  }}
                />

              </div>

            </div>

            <div
              style={{
                padding: "15px",
                borderRadius: "10px",
                background:
                  "rgba(127, 29, 29, 0.16)",
                border:
                  "1px solid rgba(239, 68, 68, 0.16)",
                textAlign: "center",
              }}
            >

              <div
                style={{
                  color: "#f87171",
                  fontSize: "28px",
                  fontWeight: "800",
                }}
              >
                {highRiskPercentage}%
              </div>

              <div
                style={{
                  marginTop: "4px",
                  color: "#8794a9",
                  fontSize: "9px",
                }}
              >
                of all detected threats
              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default RiskAnalysis;