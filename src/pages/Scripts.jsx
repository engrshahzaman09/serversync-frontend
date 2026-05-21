 
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllScripts, executeScript } from "../services/api";
import api from "../services/api";

export default function Scripts() {
  const [scripts, setScripts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", content: "" });
  const [output, setOutput] = useState("");
  const [runningId, setRunningId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchScripts(); }, []);

  const fetchScripts = async () => {
    try {
      const res = await getAllScripts();
      setScripts(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    if (!form.name || !form.content) return alert("Name and content required!");
    setLoading(true);
    try {
      await api.post(`/scripts?name=${form.name}&content=${encodeURIComponent(form.content)}&description=${form.description}`);
      setForm({ name: "", description: "", content: "" });
      fetchScripts();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleExecute = async (id) => {
    setRunningId(id);
    setOutput("Running script...");
    try {
      const res = await executeScript(id);
      setOutput(res.data);
    } catch (err) {
      setOutput("Error executing script: " + err.message);
    } finally { setRunningId(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this script?")) return;
    try {
      await api.delete(`/scripts/${id}`);
      fetchScripts();
    } catch (err) { console.error(err); }
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>⚙️ ServerSync</h2>
        <div style={styles.navRight}>
          <button style={styles.navBtn} onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button style={styles.navBtn} onClick={() => navigate("/servers")}>Servers</button>
          <button style={styles.navBtn} onClick={() => navigate("/deployments")}>Deployments</button>
          <button style={styles.logoutBtn} onClick={() => { localStorage.clear(); navigate("/"); }}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        <h1 style={styles.heading}>📜 Script Manager</h1>

        {/* Add Script Form */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Add New Script</h2>
          <div style={styles.formCol}>
            <div style={styles.formRow}>
              <input style={styles.input} placeholder="Script Name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input style={styles.input} placeholder="Description (optional)" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <textarea style={styles.textarea} placeholder="#!/bin/bash&#10;echo 'Hello ServerSync!'"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })} />
            <button style={styles.saveBtn} onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "💾 Save Script"}
            </button>
          </div>
        </div>

        {/* Scripts List */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>All Scripts ({scripts.length})</h2>
          {scripts.length === 0 ? (
            <p style={styles.empty}>No scripts saved yet.</p>
          ) : (
            scripts.map((script) => (
              <div key={script.id} style={styles.scriptCard}>
                <div style={styles.scriptHeader}>
                  <div>
                    <h3 style={styles.scriptName}>{script.name}</h3>
                    <p style={styles.scriptDesc}>{script.description || "No description"}</p>
                  </div>
                  <div style={styles.scriptActions}>
                    <button style={styles.runBtn} onClick={() => handleExecute(script.id)}
                      disabled={runningId === script.id}>
                      {runningId === script.id ? "⏳ Running..." : "▶ Run"}
                    </button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(script.id)}>
                      🗑 Delete
                    </button>
                  </div>
                </div>
                <pre style={styles.scriptContent}>{script.content}</pre>
              </div>
            ))
          )}
        </div>

        {/* Output */}
        {output && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📤 Script Output</h2>
            <pre style={styles.output}>{output}</pre>
          </div>
        )}
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
  formCol: { display: "flex", flexDirection: "column", gap: "12px" },
  formRow: { display: "flex", gap: "12px" },
  input: { padding: "10px", borderRadius: "8px", border: "1px solid #334155", backgroundColor: "#0f172a", color: "#f1f5f9", fontSize: "14px", flex: 1 },
  textarea: { padding: "10px", borderRadius: "8px", border: "1px solid #334155", backgroundColor: "#0f172a", color: "#f1f5f9", fontSize: "14px", minHeight: "150px", fontFamily: "monospace" },
  saveBtn: { padding: "10px 24px", backgroundColor: "#38bdf8", color: "#0f172a", fontWeight: "bold", border: "none", borderRadius: "8px", cursor: "pointer", alignSelf: "flex-start" },
  scriptCard: { backgroundColor: "#0f172a", borderRadius: "8px", padding: "16px", marginBottom: "12px" },
  scriptHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" },
  scriptName: { color: "#38bdf8", margin: 0 },
  scriptDesc: { color: "#94a3b8", margin: "4px 0 0 0", fontSize: "14px" },
  scriptActions: { display: "flex", gap: "8px" },
  runBtn: { padding: "6px 16px", backgroundColor: "#22c55e", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  deleteBtn: { padding: "6px 16px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  scriptContent: { color: "#94a3b8", backgroundColor: "#1e293b", padding: "12px", borderRadius: "6px", fontSize: "13px", overflow: "auto" },
  output: { color: "#22c55e", backgroundColor: "#0f172a", padding: "16px", borderRadius: "8px", fontSize: "14px", overflow: "auto", fontFamily: "monospace" },
  empty: { color: "#94a3b8" },
};