import { useNavigate } from "react-router-dom";
import ThreatLensLogo from "./ThreatLensLogo";
import { clearToken } from "../auth";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "▣", path: "/dashboard" },
  { key: "network", label: "Network Map", icon: "⌁", path: "/network" },
  { key: "threats", label: "Threats", icon: "⚠", path: "/threats" },
  { key: "risk", label: "Risk Analysis", icon: "◈", path: "/risk" },
  { key: "simulations", label: "Simulations", icon: "◉", path: "/simulations" },
];

function Sidebar({ active }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      <ThreatLensLogo size={40} />

      <nav>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`nav-item${item.key === active ? " active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="system-status">
          <span className="status-dot"></span>
          System Online
        </div>

        <button className="nav-item logout-btn" onClick={handleLogout}>
          <span>⎋</span>
          Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
