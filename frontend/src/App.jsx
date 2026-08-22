import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import ThreatDashboard from "./pages/ThreatDashboard";
import NetworkMap from "./pages/NetworkMap";
import Threats from "./pages/Threats";
import RiskAnalysis from "./pages/RiskAnalysis";
import Simulations from "./pages/Simulations";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ThreatDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/network"
          element={
            <ProtectedRoute>
              <NetworkMap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/threats"
          element={
            <ProtectedRoute>
              <Threats />
            </ProtectedRoute>
          }
        />

        <Route
          path="/risk"
          element={
            <ProtectedRoute>
              <RiskAnalysis />
            </ProtectedRoute>
          }
        />

        <Route
          path="/simulations"
          element={
            <ProtectedRoute>
              <Simulations />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
