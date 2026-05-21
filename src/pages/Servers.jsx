 
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllServers, addServer, deleteServer } from "../services/api";

export default function Servers() {
  const [servers, setServers] = useState([]);
  const [form, setForm] = useState({ name: "", ipAddress: "", description: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchServers(); }, []);

  const fetchServers = async () => {
    try {
      const res = await getAllServers();
      setServers(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAdd = async () => {
    if (!form.name || !form.ipAddress) return alert("Name and IP required!");
    setLoading(true);
    try {
      await addServer(form);
      setForm({ name: "", ipAddress: "", description: "" });
      fetchServers();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this server?")) return;
    try {
      await deleteServer(id);
      fetchServers();
    } catch (err) { console.error(err); }
  };

  const getStatusColor = (status) => {
    if (status === "ONLINE") return "#22c55e";
    if (status === "OFFLINE") return "#ef4444";
    return "#f59e0b";
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>⚙️ ServerSync</h2>
        <div style={styles.navRight}>
          <button style={styles.navBtn} onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button style={styles.navBtn} onClick={() => navigate("/deployments")}>Deployments</button>
          <button style={styles.navBtn} onClick={() => navigate("/scripts")}>Scripts</button>
          <button style={styles.logoutBtn} onClick={() => { localStorage.clear(); navigate("/"); }}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        <h1 style={styles.heading}>Servers</h1>

        {/* Add Server Form */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Add New Server</h2>
          <div style={styles.formRow}>
            <input style={styles.input} placeholder="Server Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input style={styles.input} placeholder="IP Address" value={form.ipAddress}
              onChange={(e) => setForm({ ...form, ipAddress: e.target.value })} />
            <input style={styles.input} placeholder="Description (optional)" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <button style={styles.addBtn} onClick={handleAdd} disabled={loading}>
              {loading ? "Adding..." : "Add Server"}
            </button>
          </div>
        </div>

        {/* Servers List */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>All Servers ({servers.length})</h2>
          {servers.length === 0 ? (
            <p style={styles.empty}>No servers added yet.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>IP Address</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {servers.map((server) => (
                  <tr key={server.id}>
                    <td style={styles.td}>{server.name}</td>
                    <td style={styles.td}>{server.ipAddress}</td>
                    <td style={styles.td}>{server.description || "-"}</td>
                    <td style={styles.td}>
                      <span style={{ color: getStatusColor(server.status) }}>● {server.status}</span>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(server.id)}>Delete</button>
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
  addBtn: { padding: "10px 24px", backgroundColor: "#38bdf8", color: "#0f172a", fontWeight: "bold", border: "none", borderRadius: "8px", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { color: "#94a3b8", textAlign: "left", padding: "12px", borderBottom: "1px solid #334155" },
  td: { color: "#f1f5f9", padding: "12px", borderBottom: "1px solid #0f172a" },
  deleteBtn: { padding: "6px 12px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  empty: { color: "#94a3b8" },
};