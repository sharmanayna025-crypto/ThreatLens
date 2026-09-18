import { useEffect, useState } from "react";
import axios from "axios";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react";
import { API_BASE_URL } from "../config";

import "@xyflow/react/dist/style.css";

const ASSETS_API = `${API_BASE_URL}/api/network/assets`;
const GRAPH_API = `${API_BASE_URL}/api/network/connections/graph`;

function NetworkMap() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    ipAddress: "",
    macAddress: "",
    deviceType: "",
    operatingSystem: "",
    status: "ONLINE",
    riskLevel: "LOW",
  });

  const getToken = () => localStorage.getItem("token");

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toUpperCase()) {
      case "CRITICAL":
        return "#ef4444";
      case "HIGH":
        return "#f97316";
      case "MEDIUM":
        return "#eab308";
      case "LOW":
        return "#22c55e";
      default:
        return "#64748b";
    }
  };

  const loadGraph = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("No authentication token found.");
        return;
      }

      const response = await axios.get(GRAPH_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const graphNodes = (response.data.nodes || []).map((node, index) => ({
        id: String(node.id),

        position: {
          x: (index % 3) * 350,
          y: Math.floor(index / 3) * 250,
        },

        style: {
          width: 230,
          padding: 15,
          borderRadius: 12,
          border: `2px solid ${getRiskColor(node.riskLevel)}`,
          background: "#111827",
          color: "#ffffff",
          boxShadow: `0 0 15px ${getRiskColor(node.riskLevel)}55`,
        },

        data: {
          riskLevel: node.riskLevel,

          label: (
            <div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  marginBottom: "6px",
                }}
              >
                {node.label || node.name}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#9ca3af",
                }}
              >
                {node.ipAddress || "No IP address"}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  marginTop: "5px",
                  color: "#d1d5db",
                }}
              >
                {node.deviceType || "Unknown device"}
              </div>

              <div
                style={{
                  marginTop: "8px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  color: getRiskColor(node.riskLevel),
                }}
              >
                RISK: {node.riskLevel || "UNKNOWN"}
              </div>
            </div>
          ),
        },
      }));

      const graphEdges = (response.data.edges || []).map((edge) => ({
        id: String(edge.id),
        source: String(edge.source),
        target: String(edge.target),

        label:
          edge.protocol && edge.port
            ? `${edge.protocol}:${edge.port}`
            : edge.protocol || edge.connectionType || "",

        animated: true,

        style: {
          strokeWidth: 2,
        },

        labelStyle: {
          fontWeight: "bold",
          fontSize: 12,
        },
      }));

      setNodes(graphNodes);
      setEdges(graphEdges);
    } catch (err) {
      console.error("GRAPH ERROR:", err);

      setError(
        `Unable to load network graph (${
          err.response?.status || "Network Error"
        })`
      );
    } finally {
      setLoading(false);
    }
  };

  const createAsset = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const token = getToken();

      await axios.post(ASSETS_API, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setForm({
        name: "",
        ipAddress: "",
        macAddress: "",
        deviceType: "",
        operatingSystem: "",
        status: "ONLINE",
        riskLevel: "LOW",
      });

      setShowForm(false);

      await loadGraph();
    } catch (err) {
      console.error("CREATE ASSET ERROR:", err);

      setError(
        `Unable to create asset (${
          err.response?.status || "Network Error"
        })`
      );
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadGraph();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          background: "#020617",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
        }}
      >
        Loading network topology...
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#020617",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          top: 20,
          left: 20,
          background: "#0f172a",
          border: "1px solid #334155",
          borderRadius: "12px",
          padding: "15px 20px",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          Network Topology
        </div>

        <div
          style={{
            marginTop: "5px",
            fontSize: "12px",
            color: "#94a3b8",
          }}
        >
          Live infrastructure visualization
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          zIndex: 10,
          top: 20,
          right: 20,
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#2563eb",
            color: "#ffffff",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + Add Asset
        </button>

        <button
          onClick={loadGraph}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "1px solid #334155",
            background: "#0f172a",
            color: "#ffffff",
            cursor: "pointer",
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div
          style={{
            position: "absolute",
            zIndex: 20,
            top: 80,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#450a0a",
            border: "1px solid #ef4444",
            color: "#fecaca",
            padding: "10px 16px",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        attributionPosition="bottom-left"
      >
        <Background gap={20} />
        <Controls />

        <MiniMap
          nodeColor={(node) =>
            getRiskColor(node.data?.riskLevel)
          }
        />
      </ReactFlow>

      <div
        style={{
          position: "absolute",
          zIndex: 10,
          bottom: 20,
          left: 20,
          background: "#0f172a",
          border: "1px solid #334155",
          borderRadius: "12px",
          padding: "15px",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          Risk Level
        </div>

        {[
          ["LOW", "#22c55e"],
          ["MEDIUM", "#eab308"],
          ["HIGH", "#f97316"],
          ["CRITICAL", "#ef4444"],
        ].map(([label, color]) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "6px",
              fontSize: "12px",
            }}
          >
            <span
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: color,
              }}
            />

            {label}
          </div>
        ))}
      </div>

      {showForm && (
        <div
          style={{
            position: "absolute",
            zIndex: 30,
            top: 80,
            right: 20,
            width: "360px",
            background: "#0f172a",
            border: "1px solid #334155",
            borderRadius: "14px",
            padding: "20px",
            color: "#ffffff",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ margin: 0 }}>Add Network Asset</h2>

            <button
              onClick={() => setShowForm(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          <form onSubmit={createAsset}>
            {[
              ["name", "Name", true],
              ["ipAddress", "IP Address", true],
              ["macAddress", "MAC Address", false],
              ["deviceType", "Device Type", false],
              ["operatingSystem", "Operating System", false],
            ].map(([field, label, required]) => (
              <div key={field} style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "13px",
                    color: "#cbd5e1",
                  }}
                >
                  {label}
                </label>

                <input
                  type="text"
                  value={form[field]}
                  required={required}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [field]: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #334155",
                    background: "#020617",
                    color: "#ffffff",
                    outline: "none",
                  }}
                />
              </div>
            ))}

            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "13px",
                  color: "#cbd5e1",
                }}
              >
                Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  background: "#020617",
                  color: "#ffffff",
                }}
              >
                <option value="ONLINE">ONLINE</option>
                <option value="OFFLINE">OFFLINE</option>
                <option value="UNKNOWN">UNKNOWN</option>
              </select>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "13px",
                  color: "#cbd5e1",
                }}
              >
                Risk Level
              </label>

              <select
                value={form.riskLevel}
                onChange={(e) =>
                  setForm({
                    ...form,
                    riskLevel: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  background: "#020617",
                  color: "#ffffff",
                }}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: "8px",
                border: "none",
                background: "#2563eb",
                color: "#ffffff",
                cursor: saving ? "not-allowed" : "pointer",
                fontWeight: "bold",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Saving..." : "Save Asset"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default NetworkMap;