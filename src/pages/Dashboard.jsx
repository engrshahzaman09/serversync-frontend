 
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllServers, getAllDeployments } from "../services/api";

export default function Dashboard() {
  const [servers, setServers] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [serversRes, deploymentsRes] = await Promise.all([
        getAllServers(),
        getAllDeployments(),
      ]);
      setServers(serversRes.data);
      setDeployments(deploymentsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getStatusColor = (status) => {
    if (status === "ONLINE") return "#22c55e";
    if (status === "OFFLINE") return "#ef4444";
    return "#f59e0b";
  };

  const getDeploymentColor = (status) => {
    if (status === "SUCCESS") return "#22c55e";
    if (status === "FAILED") return "#ef4444";
    return "#f59e0b";
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>⚙️ ServerSync</h2>
        <div style={styles.navRight}>
          <span style={styles.userInfo}>👤 {username} ({role})</span>
          <button style={styles.navBtn} onClick={() => navigate("/servers")}>Servers</button>
          <button style={styles.navBtn} onClick={() => navigate("/deployments")}>Deployments</button>
          <button style={styles.navBtn} onClick={() => navigate("/scripts")}>Scripts</button>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <h1 style={styles.heading}>Dashboard</h1>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>{servers.length}</h3>
            <p style={styles.statLabel}>Total Servers</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={{ ...styles.statNumber, color: "#22c55e" }}>
              {servers.filter((s) => s.status === "ONLINE").length}
            </h3>
            <p style={styles.statLabel}>Online</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={{ ...styles.statNumber, color: "#ef4444" }}>
              {servers.filter((s) => s.status === "OFFLINE").length}
            </h3>
            <p style={styles.statLabel}>Offline</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>{deployments.length}</h3>
            <p style={styles.statLabel}>Deployments</p>
          </div>
        </div>

        {/* Servers Table */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Servers</h2>
          {loading ? (
            <p style={styles.loading}>Loading...</p>
          ) : servers.length === 0 ? (
            <p style={styles.empty}>No servers added yet.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>IP Address</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {servers.map((server) => (
                  <tr key={server.id}>
                    <td style={styles.td}>{server.name}</td>
                    <td style={styles.td}>{server.ipAddress}</td>
                    <td style={styles.td}>
                      <span style={{ color: getStatusColor(server.status) }}>
                        ● {server.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Deployments Table */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Recent Deployments</h2>
          {loading ? (
            <p style={styles.loading}>Loading...</p>
          ) : deployments.length === 0 ? (
            <p style={styles.empty}>No deployments yet.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Project</th>
                  <th style={styles.th}>Branch</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {deployments.map((d) => (
                  <tr key={d.id}>
                    <td style={styles.td}>{d.projectName}</td>
                    <td style={styles.td}>{d.branch}</td>
                    <td style={styles.td}>
                      <span style={{ color: getDeploymentColor(d.status) }}>
                        ● {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#0f172a" },
  navbar: {
    backgroundColor: "#1e293b",
    padding: "16px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { color: "#38bdf8", margin: 0 },
  navRight: { display: "flex", alignItems: "center", gap: "12px" },
  userInfo: { color: "#94a3b8", fontSize: "14px" },
  navBtn: {
    padding: "8px 16px",
    backgroundColor: "#334155",
    color: "#f1f5f9",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  content: { padding: "32px" },
  heading: { color: "#f1f5f9", marginBottom: "24px" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "32px",
  },
  statCard: {
    backgroundColor: "#1e293b",
    padding: "24px",
    borderRadius: "12px",
    textAlign: "center",
  },
  statNumber: { color: "#38bdf8", fontSize: "36px", margin: 0 },
  statLabel: { color: "#94a3b8", margin: "8px 0 0 0" },
  section: {
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
  },
  sectionTitle: { color: "#f1f5f9", marginTop: 0 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    color: "#94a3b8",
    textAlign: "left",
    padding: "12px",
    borderBottom: "1px solid #334155",
  },
  td: {
    color: "#f1f5f9",
    padding: "12px",
    borderBottom: "1px solid #1e293b",
  },
  loading: { color: "#94a3b8" },
  empty: { color: "#94a3b8" },
};