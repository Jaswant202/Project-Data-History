import { useEffect, useState } from "react";
import "./App.css";
const names = ["Website Redesign", "Mobile Application", "CRM Development", "Marketing Campaign", "E-Commerce Store", "AI Analytics", "Cloud Migration", "HR Management", "Finance Portal", "Customer Support", "Inventory System", "Learning Platform", "Security Upgrade", "Sales Dashboard", "Booking System", "Payment Gateway", "Social Media App", "Data Visualization", "Task Automation", "Portfolio Website", "Hospital System", "Food Delivery", "Travel Planner", "Chat Application", "IoT Monitoring", "Library Management", "Student Portal", "Payroll System", "Supply Chain", "Fitness Application", "Project Tracker", "Event Management", "Online Banking", "Document Manager", "Video Streaming", "Smart Farming", "Helpdesk Portal", "AI Chatbot", "Retail Analytics", "Hotel Booking", "Weather Dashboard", "Transport System", "Digital Marketing", "Report Generator", "Expense Tracker", "Job Portal", "Survey Platform", "Cloud Backup", "Research Portal", "Business Intelligence"];
const managers = ["Onkar Jadhav", "Rahul Patil", "Priya Shah", "Amit Joshi", "Sneha Kulkarni", "Rohan Desai", "Neha Pawar", "Karan Mehta"];
const statuses = ["In Progress", "Planning", "Completed", "On Hold"];
const priorities = ["High", "Medium", "Low"];
const samples = names.map((name, i) => ({
  id: i + 1, name, manager: managers[i % managers.length],
  start: `2026-${String(i % 9 + 1).padStart(2, "0")}-01`,
  due: `2026-${String(i % 9 + 1).padStart(2, "0")}-${String(i % 20 + 10).padStart(2, "0")}`,
  priority: priorities[i % 3],
  status: statuses[i % 4],
  progress: [70, 25, 100, 45, 60, 15, 85, 35, 90, 50][i % 10]
}));
const blank = { name: "", manager: "", start: "", due: "", priority: "Medium", status: "Planning", progress: 0 };
export default function App() {
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem("flow50");
      return saved ? JSON.parse(saved) : samples;
    } catch { return samples; }
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [priority, setPriority] = useState("All");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [modal, setModal] = useState(false);
  useEffect(() => {
    localStorage.setItem("flow50", JSON.stringify(projects));
  }, [projects]);
  const done = projects.filter(p => p.status === "Completed").length;
  const active = projects.filter(p => p.status === "In Progress").length;
  const today = new Date().toISOString().slice(0, 10);
  const late = projects.filter(p => p.status !== "Completed" && p.due && p.due < today).length;
  const filtered = projects.filter(p =>
    `${p.name} ${p.manager}`.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "All" || p.status === filter) &&
    (priority === "All" || p.priority === priority)
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 10));
  const rows = filtered.slice((page - 1) * 10, page * 10);
  function openForm(p = null) {
    setEditing(p?.id ?? null);
    setForm(p ? { ...p } : { ...blank });
    setModal(true);
  }
  function save(e) {
    e.preventDefault();
    const item = { ...form, id: editing ?? Date.now(),
      progress: form.status === "Completed" ? 100 : Number(form.progress) };
    setProjects(old => editing ? old.map(p => p.id === editing ? item : p) : [item, ...old]);
    setPage(1);
    setModal(false);
  }
  function remove(id) {
    if (confirm("Delete this project?")) setProjects(old => old.filter(p => p.id !== id));
  }
  function setField(key, value) {
    setForm(old => ({ ...old, [key]: value }));
  }
  function resetFilters() {
    setSearch(""); setFilter("All"); setPriority("All"); setPage(1);
  }
  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><span className="brand-icon">P</span><span>PROJECT<span className="violet">LY</span><small>WORKSPACE OS</small></span></div>
      <p className="nav-title">MAIN MENU</p>
      <button className="nav active" onClick={resetFilters}>◈ <span>Overview</span></button>
      <button className="nav" onClick={resetFilters}>▤ <span>All Projects</span><b>{projects.length}</b></button>
      <button className="nav" onClick={() => { setFilter("In Progress"); setPage(1); }}>◷ <span>In Progress</span></button>
      <button className="nav" onClick={() => { setFilter("Completed"); setPage(1); }}>✓ <span>Completed</span></button>
      <button className="nav" onClick={() => { setFilter("On Hold"); setPage(1); }}>Ⅱ <span>On Hold</span></button>
      <div className="sidebar-bottom"><div className="avatar">OJ</div><div><b>Onkar Jadhav</b><small>Workspace Admin</small></div><span>•••</span></div>
    </aside>
    <main className="main">
      <header className="topbar"><div><span className="breadcrumb">WORKSPACE <i>/</i> PROJECTS</span><h1>Project Overview <span className="spark">✳</span></h1><p>Your work, organized. Your goals, within reach.</p></div>
        <button className="primary" onClick={() => openForm()}>＋ Create Project</button>
      </header>
      <section className="welcome"><div><span className="eyebrow">YOUR WORKSPACE AT A GLANCE</span><h2>Make every project <em>count.</em></h2><p>Track progress, keep teams aligned, and turn plans into results.</p></div><div className="welcome-art"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="orb">↗</div><span className="float f1">✦</span><span className="float f2">●</span></div></section>
      <section className="stats">
        <article><div className="stat-top"><span>Total Projects</span><span className="stat-icon purple">▤</span></div><strong>{projects.length}</strong><small>Across your workspace</small><div className="mini-line purple-line"></div></article>
        <article><div className="stat-top"><span>In Progress</span><span className="stat-icon blue">◷</span></div><strong>{active}</strong><small>Projects in motion</small><div className="mini-line blue-line"></div></article>
        <article><div className="stat-top"><span>Completed</span><span className="stat-icon green">✓</span></div><strong>{done}</strong><small>{projects.length ? Math.round(done / projects.length * 100) : 0}% of all projects</small><div className="mini-line green-line"></div></article>
        <article><div className="stat-top"><span>Overdue</span><span className="stat-icon red">!</span></div><strong>{late}</strong><small>Require attention</small><div className="mini-line red-line"></div></article>
      </section>
      <section className="panel">
        <div className="panel-head"><div><h2>Project Directory <span className="count">{filtered.length}</span></h2><p>Manage all your projects from one place.</p></div><button className="outline" onClick={() => openForm()}>＋ New Project</button></div>
        <div className="filters"><input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="⌕   Search projects or managers..." />
          <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>{["All", "Planning", "In Progress", "Completed", "On Hold"].map(x => <option key={x} value={x}>{x === "All" ? "All statuses" : x}</option>)}</select>
          <select value={priority} onChange={e => { setPriority(e.target.value); setPage(1); }}>{["All", "High", "Medium", "Low"].map(x => <option key={x} value={x}>{x === "All" ? "All priorities" : `${x} priority`}</option>)}</select>
        </div>
        <div className="table-wrap"><table><thead><tr><th>PROJECT</th><th>MANAGER</th><th>DEADLINE</th><th>PRIORITY</th><th>STATUS</th><th>PROGRESS</th><th>ACTIONS</th></tr></thead>
          <tbody>{rows.map(p => <tr key={p.id}><td><div className="project-cell"><span className="project-symbol">{p.name.charAt(0)}</span><div><b>{p.name}</b><small>PRJ-{String(p.id).padStart(3, "0")}</small></div></div></td>
            <td><div className="manager"><span>{p.manager.split(" ").map(n => n[0]).slice(0, 2).join("")}</span>{p.manager}</div></td>
            <td>{p.due || "—"}</td><td><span className={`priority ${p.priority.toLowerCase()}`}>{p.priority}</span></td>
            <td><span className={`status ${p.status.toLowerCase().replace(" ", "-")}`}><i></i>{p.status}</span></td>
            <td><div className="progress-label">{p.status === "Completed" ? 100 : p.progress}%</div><div className="track"><div style={{ width: `${p.status === "Completed" ? 100 : p.progress}%` }} /></div></td>
            <td><button className="action" title="Edit" onClick={() => openForm(p)}>✎</button><button className="action delete" title="Delete" onClick={() => remove(p.id)}>×</button></td>
          </tr>)}
          {!rows.length && <tr><td colSpan="7" className="empty">No projects match these filters. <button onClick={resetFilters}>Clear filters</button></td></tr>}</tbody>
        </table></div>
        <footer><span>Showing <b>{filtered.length ? (page - 1) * 10 + 1 : 0}–{Math.min(page * 10, filtered.length)}</b> of <b>{filtered.length}</b> projects</span><div className="pagination"><button disabled={page === 1} onClick={() => setPage(page - 1)}>←</button><span>Page {page} of {pages}</span><button disabled={page === pages} onClick={() => setPage(page + 1)}>→</button></div></footer>
      </section>
      <div className="copyright">PROJECTLY <span>BUILT FOR BETTER WORKFLOWS ✦</span></div>
      {modal && <div className="overlay" onClick={() => setModal(false)}><form className="modal" onSubmit={save} onClick={e => e.stopPropagation()}>
        <span className="eyebrow">PROJECT WORKSPACE</span><h2>{editing ? "Edit Project" : "Create a Project"}</h2><p>Enter the details to keep your team aligned.</p>
        <label>Project name<input required value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g. Website redesign" /></label>
        <label>Project manager<input required value={form.manager} onChange={e => setField("manager", e.target.value)} placeholder="Full name" /></label>
        <div className="form-row"><label>Start date<input type="date" value={form.start} onChange={e => setField("start", e.target.value)} /></label><label>Deadline<input type="date" min={form.start || undefined} value={form.due} onChange={e => setField("due", e.target.value)} /></label></div>
        <div className="form-row"><label>Priority<select value={form.priority} onChange={e => setField("priority", e.target.value)}>{priorities.map(v => <option key={v}>{v}</option>)}</select></label><label>Status<select value={form.status} onChange={e => setField("status", e.target.value)}>{statuses.map(v => <option key={v}>{v}</option>)}</select></label></div>
        <label>Progress — {form.status === "Completed" ? 100 : form.progress}%<input type="range" min="0" max="100" value={form.progress} onChange={e => setField("progress", e.target.value)} /></label>
        <div className="modal-actions"><button type="button" className="outline" onClick={() => setModal(false)}>Cancel</button><button className="primary" type="submit">{editing ? "Save Changes" : "Create Project"}</button></div>
      </form></div>}
    </main>
  </div>;
}
