import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDeployments, createDeployment, getAllServers } from "../services/api";

export default function Deployments() {
  const [deployments, setDeployments] = useState([]);
  const [servers, setServers] = useState([]);
  const [form, setForm] = useState({ projectName: "", repoUrl: "", branch: "main", serverId: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [depRes, serRes] = await Promise.all([getAllDeployments(), getAllServers()]);
      setDeployments(depRes.data);
      setServers(serRes.data);
    } catch (err) { console.error(err); }
  };

  const handleDeploy = async () => {
    if (!form.projectName || !form.repoUrl || !form.serverId) return alert("All fields required!");
    setLoading(true);
    try {
      await createDeployment({ ...form, serverId: parseInt(form.serverId) });
      setForm({ projectName: "", repoUrl: "", branch: "main", serverId: "" });
      fetchData();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getStatusColor = (status) => {
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
          <button style={styles.navBtn} onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button style={styles.navBtn} onClick={() => navigate("/servers")}>Servers</button>
          <button style={styles.navBtn} onClick={() => navigate("/scripts")}>Scripts</button>
          <button style={styles.logoutBtn} onClick={() => { localStorage.clear(); navigate("/"); }}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        <h1 style={styles.heading}>Deployments</h1>

        {/* Deploy Form */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🚀 New Deployment</h2>
          <div style={styles.formRow}>
            <input style={styles.input} placeholder="Project Name" value={form.projectName}
              onChange={(e) => setForm({ ...form, projectName: e.target.value })} />
            <input style={styles.input} placeholder="GitHub Repo URL" value={form.repoUrl}
              onChange={(e) => setForm({ ...form, repoUrl: e.target.value })} />
            <input style={styles.input} placeholder="Branch (e.g. main)" value={form.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })} />
            <select style={styles.input} value={form.serverId}
              onChange={(e) => setForm({ ...form, serverId: e.target.value })}>
              <option value="">Select Server</option>
              {servers.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.ipAddress})</option>
              ))}
            </select>
            <button style={styles.deployBtn} onClick={handleDeploy} disabled={loading}>
              {loading ? "Deploying..." : "🚀 Deploy"}
            </button>
          </div>
        </div>

        {/* Deployments List */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Deployment History ({deployments.length})</h2>
          {deployments.length === 0 ? (
            <p style={styles.empty}>No deployments yet.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Project</th>
                  <th style={styles.th}>Repo</th>
                  <th style={styles.th}>Branch</th>
                  <th style={styles.th}>Server</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Deployed By</th>
                </tr>
              </thead>
              <tbody>
                {deployments.map((d) => (
                  <tr key={d.id}>
                    <td style={styles.td}>{d.projectName}</td>
                    <td style={styles.td}>{d.repoUrl}</td>
                    <td style={styles.td}>{d.branch}</td>
                    <td style={styles.td}>{d.server?.name || "-"}</td>
                    <td style={styles.td}>
                      <span style={{ color: getStatusColor(d.status) }}>● {d.status}</span>
                    </td>
                    <td style={styles.td}>{d.deployedBy?.username || "-"}</td>
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
  navbar: { backgroundColor: "#1e293b", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { color: "#38bdf8", margin: 0 },
  navRight: { display: "flex", gap: "12px" },
  navBtn: { padding: "8px 16px", backgroundColor: "#334155", color: "#f1f5f9", border: "none", borderRadius: "6px", cursor: "pointer" },
  logoutBtn: { padding: "8px 16px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  content: { padding: "32px" },
  heading: { color: "#f1f5f9", marginBottom: "24px" },
  card: { backgroundColor: "#1e293b", borderRadius: "12px", padding: "24px", marginBottom: "24px" },
  cardTitle: { color: "#f1f5f9", marginTop: 0 },
  formRow: { display: "flex", gap: "12px", flexWrap: "wrap" },
  input: { padding: "10px", borderRadius: "8px", border: "1px solid #334155", backgroundColor: "#0f172a", color: "#f1f5f9", fontSize: "14px", flex: 1 },
  deployBtn: { padding: "10px 24px", backgroundColor: "#22c55e", color: "#fff", fontWeight: "bold", border: "none", borderRadius: "8px", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { color: "#94a3b8", textAlign: "left", padding: "12px", borderBottom: "1px solid #334155" },
  td: { color: "#f1f5f9", padding: "12px", borderBottom: "1px solid #0f172a" },
  empty: { color: "#94a3b8" },
};