import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Simulations() {
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [simulations, setSimulations] = useState([]);

  const [sourceId, setSourceId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [attackType, setAttackType] = useState("PORT_SCAN");

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const [assetResponse, simulationResponse] =
        await Promise.all([
          axios.get(
            "https://threalens-backend.onrender.com/api/network/assets",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          axios.get(
            "https://threalens-backend.onrender.com/api/simulations",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

      setAssets(assetResponse.data);
      setSimulations(simulationResponse.data);
    } catch (err) {
      console.error("Simulation page load error:", err);

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        setError(
          "Your session has expired. Please log in again."
        );
      } else {
        setError("Unable to load simulation data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async () => {
    setError("");
    setResult(null);

    if (!sourceId || !destinationId) {
      setError(
        "Please select both a source and destination asset."
      );
      return;
    }

    if (sourceId === destinationId) {
      setError(
        "Source and destination assets must be different."
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError(
        "Your session has expired. Please log in again."
      );
      return;
    }

    setRunning(true);

    try {
      const response = await axios.post(
        "https://threalens-backend.onrender.com/api/simulations",
        {
          sourceAssetId: Number(sourceId),
          destinationAssetId: Number(destinationId),
          attackType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setResult(response.data);

      const historyResponse = await axios.get(
        "https://threalens-backend.onrender.com/api/simulations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSimulations(historyResponse.data);
    } catch (err) {
      console.error("Simulation error:", err);

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
        setError(
          `Simulation failed (${
            err.response?.status || "Network Error"
          }).`
        );
      }
    } finally {
      setRunning(false);
    }
  };

  const getRiskColor = (level) => {
    if (level === "CRITICAL") return "#ef4444";
    if (level === "HIGH") return "#f97316";
    if (level === "MEDIUM") return "#eab308";
    return "#22c55e";
  };

  const getRiskClass = (level) => {
    if (level === "CRITICAL") return "critical";
    if (level === "HIGH") return "high";
    if (level === "MEDIUM") return "medium";
    return "low";
  };

  const getAsset = (id) =>
    assets.find(
      (asset) => Number(asset.id) === Number(id)
    );

  const getAttackLabel = (type) => {
    switch (type) {
      case "PORT_SCAN":
        return "Port Scan";
      case "BRUTE_FORCE":
        return "Brute Force";
      case "MALWARE":
        return "Malware";
      case "DDoS":
        return "DDoS";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Loading Attack Simulation</h2>
        <p>
          Preparing network assets and simulation history.
        </p>
      </div>
    );
  }

  if (error && assets.length === 0) {
    return (
      <div className="dashboard-error">
        <h2>Simulation Console Unavailable</h2>
        <p>{error}</p>

        <button onClick={loadData}>
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

          <button
            className="nav-item"
            onClick={() => navigate("/risk")}
          >
            <span>◈</span>
            Risk Analysis
          </button>

          <button className="nav-item active">
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

        <header className="topbar">

          <div>
            <h1>Attack Simulation</h1>

            <p>
              Model potential attack scenarios and evaluate
              their security impact
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
            SIMULATION CONFIGURATION
        =================================================== */}

        <section className="threat-section">

          <div className="section-header">

            <div>
              <h2>Simulation Console</h2>

              <p>
                Define an attack path between network assets
              </p>
            </div>

            <span className="threat-count">
              {assets.length} assets available
            </span>

          </div>

          <div
            style={{
              padding: "26px",
            }}
          >

            {/* FLOW SUMMARY */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(0, 1fr) 90px minmax(0, 1fr)",
                alignItems: "center",
                gap: "15px",
                marginBottom: "24px",
              }}
            >

              <div
                style={{
                  padding: "15px",
                  borderRadius: "11px",
                  background: "#101927",
                  border: "1px solid #223149",
                }}
              >

                <div
                  style={{
                    color: "#65738a",
                    fontSize: "9px",
                    fontWeight: 750,
                    letterSpacing: "0.07em",
                    marginBottom: "7px",
                  }}
                >
                  SOURCE
                </div>

                <div
                  style={{
                    color: "#eef5ff",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  {getAsset(sourceId)?.name ||
                    "Select source asset"}
                </div>

                {getAsset(sourceId) && (
                  <div
                    style={{
                      marginTop: "4px",
                      color: "#6f7c94",
                      fontSize: "10px",
                    }}
                  >
                    {getAsset(sourceId).ipAddress}
                  </div>
                )}

              </div>

              <div
                style={{
                  textAlign: "center",
                  color: "#4d5e76",
                }}
              >

                <div
                  style={{
                    fontSize: "22px",
                    color: "#3b82f6",
                  }}
                >
                  →
                </div>

                <div
                  style={{
                    marginTop: "3px",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                  }}
                >
                  ATTACK PATH
                </div>

              </div>

              <div
                style={{
                  padding: "15px",
                  borderRadius: "11px",
                  background: "#101927",
                  border: "1px solid #223149",
                }}
              >

                <div
                  style={{
                    color: "#65738a",
                    fontSize: "9px",
                    fontWeight: 750,
                    letterSpacing: "0.07em",
                    marginBottom: "7px",
                  }}
                >
                  DESTINATION
                </div>

                <div
                  style={{
                    color: "#eef5ff",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  {getAsset(destinationId)?.name ||
                    "Select destination"}
                </div>

                {getAsset(destinationId) && (
                  <div
                    style={{
                      marginTop: "4px",
                      color: "#6f7c94",
                      fontSize: "10px",
                    }}
                  >
                    {getAsset(destinationId).ipAddress}
                  </div>
                )}

              </div>

            </div>

            {/* FORM */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, minmax(0, 1fr))",
                gap: "18px",
              }}
            >

              {/* SOURCE */}

              <div>

                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#b6c2d4",
                    fontSize: "11px",
                    fontWeight: 650,
                  }}
                >
                  Source Asset
                </label>

                <select
                  value={sourceId}
                  onChange={(e) =>
                    setSourceId(e.target.value)
                  }
                  style={{
                    width: "100%",
                    background: "#111a2a",
                    color: "#e6edf7",
                    border: "1px solid #26354b",
                    borderRadius: "8px",
                    padding: "12px",
                    fontSize: "12px",
                  }}
                >

                  <option value="">
                    Select source
                  </option>

                  {assets.map((asset) => (
                    <option
                      key={asset.id}
                      value={asset.id}
                    >
                      {asset.name} — {asset.ipAddress}
                    </option>
                  ))}

                </select>

              </div>

              {/* DESTINATION */}

              <div>

                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#b6c2d4",
                    fontSize: "11px",
                    fontWeight: 650,
                  }}
                >
                  Destination Asset
                </label>

                <select
                  value={destinationId}
                  onChange={(e) =>
                    setDestinationId(e.target.value)
                  }
                  style={{
                    width: "100%",
                    background: "#111a2a",
                    color: "#e6edf7",
                    border: "1px solid #26354b",
                    borderRadius: "8px",
                    padding: "12px",
                    fontSize: "12px",
                  }}
                >

                  <option value="">
                    Select destination
                  </option>

                  {assets.map((asset) => (
                    <option
                      key={asset.id}
                      value={asset.id}
                    >
                      {asset.name} — {asset.ipAddress}
                    </option>
                  ))}

                </select>

              </div>

              {/* ATTACK */}

              <div>

                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#b6c2d4",
                    fontSize: "11px",
                    fontWeight: 650,
                  }}
                >
                  Attack Technique
                </label>

                <select
                  value={attackType}
                  onChange={(e) =>
                    setAttackType(e.target.value)
                  }
                  style={{
                    width: "100%",
                    background: "#111a2a",
                    color: "#e6edf7",
                    border: "1px solid #26354b",
                    borderRadius: "8px",
                    padding: "12px",
                    fontSize: "12px",
                  }}
                >

                  <option value="PORT_SCAN">
                    Port Scan
                  </option>

                  <option value="BRUTE_FORCE">
                    Brute Force
                  </option>

                  <option value="MALWARE">
                    Malware
                  </option>

                  <option value="DDoS">
                    DDoS
                  </option>

                </select>

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div
                style={{
                  marginTop: "18px",
                  padding: "11px 13px",
                  borderRadius: "8px",
                  background:
                    "rgba(127, 29, 29, 0.22)",
                  border:
                    "1px solid rgba(239, 68, 68, 0.16)",
                  color: "#fca5a5",
                  fontSize: "11px",
                }}
              >
                {error}
              </div>
            )}

            {/* ACTION */}

            <div
              style={{
                marginTop: "22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >

              <div
                style={{
                  color: "#59677e",
                  fontSize: "10px",
                  lineHeight: 1.5,
                }}
              >
                Simulation is risk-based and does not send
                real attack traffic.
              </div>

              <button
                onClick={runSimulation}
                disabled={running}
                style={{
                  padding: "12px 20px",
                  borderRadius: "8px",
                  border:
                    "1px solid rgba(96,165,250,0.25)",
                  background:
                    running
                      ? "#1f3d6b"
                      : "linear-gradient(135deg,#2563eb,#3b82f6)",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: running
                    ? "wait"
                    : "pointer",
                  boxShadow:
                    "0 8px 20px rgba(37,99,235,0.18)",
                }}
              >
                {running
                  ? "Running Simulation..."
                  : "Run Simulation →"}
              </button>

            </div>

          </div>

        </section>

        {/* ===================================================
            SIMULATION RESULT
        =================================================== */}

        {result && (
          <section className="threat-section">

            <div className="section-header">

              <div>
                <h2>Simulation Result</h2>

                <p>
                  Risk assessment generated by the simulation engine
                </p>
              </div>

              <span
                className={`severity-badge ${getRiskClass(
                  result.riskLevel
                )}`}
              >
                {result.riskLevel}
              </span>

            </div>

            <div
              style={{
                padding: "24px",
              }}
            >

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "180px minmax(0,1fr)",
                  gap: "24px",
                  alignItems: "center",
                }}
              >

                {/* SCORE */}

                <div
                  style={{
                    padding: "20px",
                    borderRadius: "12px",
                    background: "#0b1320",
                    border:
                      `1px solid ${getRiskColor(
                        result.riskLevel
                      )}35`,
                    textAlign: "center",
                  }}
                >

                  <div
                    style={{
                      color: getRiskColor(
                        result.riskLevel
                      ),
                      fontSize: "48px",
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    {result.riskScore}
                  </div>

                  <div
                    style={{
                      marginTop: "8px",
                      color: "#64748b",
                      fontSize: "9px",
                      fontWeight: 700,
                    }}
                  >
                    RISK SCORE / 100
                  </div>

                </div>

                {/* DETAILS */}

                <div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(3,minmax(0,1fr))",
                      gap: "12px",
                      marginBottom: "20px",
                    }}
                  >

                    {[
                      [
                        "ATTACK",
                        getAttackLabel(
                          result.attackType
                        ),
                      ],
                      [
                        "SOURCE",
                        result.sourceAsset?.name ||
                          getAsset(
                            result.sourceAssetId
                          )?.name ||
                          "Unknown",
                      ],
                      [
                        "DESTINATION",
                        result.targetAsset?.name ||
                          result.destinationAsset?.name ||
                          getAsset(
                            result.destinationAssetId
                          )?.name ||
                          "Unknown",
                      ],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          background: "#101927",
                          border:
                            "1px solid #1d2a3f",
                        }}
                      >

                        <div
                          style={{
                            color: "#65738a",
                            fontSize: "8px",
                            fontWeight: 750,
                            letterSpacing:
                              "0.07em",
                          }}
                        >
                          {label}
                        </div>

                        <div
                          style={{
                            marginTop: "6px",
                            color: "#dce6f5",
                            fontSize: "11px",
                            fontWeight: 650,
                          }}
                        >
                          {value}
                        </div>

                      </div>
                    ))}

                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        color: "#aebbd0",
                        fontSize: "10px",
                        fontWeight: 650,
                      }}
                    >
                      Predicted attack risk
                    </span>

                    <span
                      style={{
                        color: getRiskColor(
                          result.riskLevel
                        ),
                        fontSize: "10px",
                        fontWeight: 750,
                      }}
                    >
                      {result.riskLevel}
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
                        width: `${result.riskScore}%`,
                        height: "100%",
                        borderRadius: "999px",
                        background:
                          getRiskColor(
                            result.riskLevel
                          ),
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
                      fontSize: "8px",
                    }}
                  >
                    <span>LOW</span>
                    <span>MEDIUM</span>
                    <span>HIGH</span>
                    <span>CRITICAL</span>
                  </div>

                </div>

              </div>

              <div
                style={{
                  marginTop: "20px",
                  padding: "11px 13px",
                  borderRadius: "8px",
                  background: "#0a111e",
                  border: "1px solid #172337",
                  color: "#718097",
                  fontSize: "10px",
                }}
              >
                Simulation completed successfully. A corresponding
                security threat has been added to ThreatLens.
              </div>

            </div>

          </section>
        )}

        {/* ===================================================
            SIMULATION HISTORY
        =================================================== */}

        <section className="threat-section">

          <div className="section-header">

            <div>
              <h2>Simulation History</h2>

              <p>
                Previously executed attack simulations
              </p>
            </div>

            <span className="threat-count">
              {simulations.length} total
            </span>

          </div>

          {simulations.length === 0 ? (

            <div className="empty-state">
              No simulations have been executed yet.
            </div>

          ) : (

            <div
              style={{
                overflowX: "auto",
              }}
            >

              {/* HEADER */}

              <div
                style={{
                  minWidth: "760px",
                  display: "grid",
                  gridTemplateColumns:
                    "1.1fr 1.8fr 100px 110px 120px",
                  gap: "16px",
                  padding:
                    "11px 24px",
                  background: "#0a111e",
                  borderBottom:
                    "1px solid #172337",
                  color: "#526178",
                  fontSize: "8px",
                  fontWeight: 750,
                  letterSpacing: "0.08em",
                }}
              >

                <span>ATTACK</span>
                <span>ATTACK PATH</span>
                <span>SCORE</span>
                <span>RISK</span>
                <span>STATUS</span>

              </div>

              {/* ROWS */}

              {simulations.map((simulation) => (

                <div
                  key={simulation.id}
                  style={{
                    minWidth: "760px",
                    display: "grid",
                    gridTemplateColumns:
                      "1.1fr 1.8fr 100px 110px 120px",
                    gap: "16px",
                    alignItems: "center",
                    padding:
                      "15px 24px",
                    borderBottom:
                      "1px solid #151f30",
                  }}
                >

                  {/* ATTACK */}

                  <div>

                    <div
                      style={{
                        color: "#dce6f5",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {getAttackLabel(
                        simulation.attackType
                      )}
                    </div>

                    <div
                      style={{
                        marginTop: "4px",
                        color: "#59677e",
                        fontSize: "9px",
                      }}
                    >
                      Simulation #{simulation.id}
                    </div>

                  </div>

                  {/* PATH */}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      color: "#8f9db2",
                      fontSize: "10px",
                    }}
                  >

                    <span
                      style={{
                        color: "#cbd5e1",
                      }}
                    >
                      {simulation.sourceAsset?.name ||
                        "Unknown"}
                    </span>

                    <span
                      style={{
                        color: "#3b82f6",
                        fontSize: "15px",
                      }}
                    >
                      →
                    </span>

                    <span
                      style={{
                        color: "#cbd5e1",
                      }}
                    >
                      {simulation.targetAsset?.name ||
                        simulation.destinationAsset?.name ||
                        "Unknown"}
                    </span>

                  </div>

                  {/* SCORE */}

                  <div
                    style={{
                      color: getRiskColor(
                        simulation.riskLevel
                      ),
                      fontSize: "14px",
                      fontWeight: 800,
                    }}
                  >
                    {simulation.riskScore}
                  </div>

                  {/* RISK */}

                  <div>
                    <span
                      className={`severity-badge ${getRiskClass(
                        simulation.riskLevel
                      )}`}
                    >
                      {simulation.riskLevel}
                    </span>
                  </div>

                  {/* STATUS */}

                  <div>
                    <span className="status-badge">
                      {simulation.status ||
                        "COMPLETED"}
                    </span>
                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Simulations;
