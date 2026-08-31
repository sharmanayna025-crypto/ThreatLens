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

const API_URL =
  `${API_BASE_URL}/api/network/connections/graph`;

function NetworkMap() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadGraph = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found.");
        return;
      }

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const graphNodes = response.data.nodes.map((node, index) => ({
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
          label: (
            <div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  marginBottom: "6px",
                }}
              >
                {node.label}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#9ca3af",
                }}
              >
                {node.ipAddress}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  marginTop: "5px",
                  color: "#d1d5db",
                }}
              >
                {node.deviceType}
              </div>

              <div
                style={{
                  marginTop: "8px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  color: getRiskColor(node.riskLevel),
                }}
              >
                RISK: {node.riskLevel}
              </div>
            </div>
          ),
        },
      }));

      const graphEdges = response.data.edges.map((edge) => ({
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

  useEffect(() => {
    loadGraph();
  }, []);

  function getRiskColor(riskLevel) {
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
  }

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

  if (error) {
    return (
      <div
        style={{
          height: "100vh",
          background: "#020617",
          color: "#ef4444",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "15px",
        }}
      >
        <h2>Network Map Error</h2>

        <p>{error}</p>

        <button
          onClick={loadGraph}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#020617",
      }}
    >
      {/* Header */}

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

      {/* Refresh */}

      <button
        onClick={loadGraph}
        style={{
          position: "absolute",
          zIndex: 10,
          top: 20,
          right: 20,
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

      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        attributionPosition="bottom-left"
      >
        <Background gap={20} />

        <Controls />

        <MiniMap
          nodeColor={(node) => {
            const risk = node.data?.riskLevel;

            return getRiskColor(risk);
          }}
        />
      </ReactFlow>

      {/* Legend */}

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
    </div>
  );
}

export default NetworkMap;