import { useEffect, useState } from "react";
import axios from "axios";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

function NetworkMap() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log("TOKEN EXISTS:", !!token);

    if (!token) {
      setError("No authentication token found.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:8080/api/network/connections/graph", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("GRAPH RESPONSE:", response.data);

        const graphNodes = response.data.nodes.map((node, index) => ({
          id: String(node.id),
          data: {
            label: `${node.label}\n${node.ipAddress}`,
          },
          position: {
            x: (index % 2) * 350,
            y: Math.floor(index / 2) * 250,
          },
        }));

        const graphEdges = response.data.edges.map((edge) => ({
          id: String(edge.id),
          source: String(edge.source),
          target: String(edge.target),
          label: `${edge.protocol}:${edge.port}`,
        }));

        setNodes(graphNodes);
        setEdges(graphEdges);
      })
      .catch((err) => {
        console.error("GRAPH ERROR:", err);
        console.error("STATUS:", err.response?.status);
        console.error("DATA:", err.response?.data);

        setError(
          `Unable to load network graph (${err.response?.status || "Network Error"})`
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: "30px" }}>Loading network graph...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: "30px", color: "red" }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default NetworkMap;
