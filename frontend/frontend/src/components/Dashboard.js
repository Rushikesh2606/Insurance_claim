// Dashboard.js
import React, { useEffect, useState, useMemo } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import logo from "../assets/logo.jpg";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getClaims, getStatusSummary } from "../api";
import "../styles/Dashboard.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const STATUS_COLORS = { open: "#0088FE", closed: "#00C49F", processing: "#FFBB28" };
const MODULE_NAMES = ["Car", "Life", "Health", "Travel"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useSearchParams();


  const [claims, setClaims] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(""); // 🔍 search text


  const activeModule = search.get("module");


  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [c, s] = await Promise.all([getClaims(), getStatusSummary()]);
        setClaims(c);
        setSummary(s);
      } catch (e) {
        console.error("Error fetching dashboard data:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const [userEmail, setUserEmail] = useState("");
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUserEmail(JSON.parse(raw).email || "admin@insurance.com");
    } catch {
      setUserEmail("admin@insurance.com");
    }
  }, []);

  const filteredClaims = useMemo(() => {
    let list = claims;

    if (activeModule) {
      list = list.filter((c) =>
        (c.type || "").toLowerCase().includes(activeModule.toLowerCase())
      );
    }

    if (searchText.trim()) {
      const text = searchText.toLowerCase();
      list = list.filter(
        (c) =>
          c.claimNumber?.toString().toLowerCase().includes(text) ||
          c.customer?.toLowerCase().includes(text) ||
          c.status?.toLowerCase().includes(text)
      );
    }

    return list;
  }, [claims, activeModule, searchText]);

  const moduleSummary = useMemo(() => {
    const stats = { open: 0, closed: 0, processing: 0 };
    filteredClaims.forEach((c) => {
      const s = (c.status || "").toLowerCase();
      if (s in stats) stats[s]++;
    });
    return stats;
  }, [filteredClaims]);

  const statusPieData = Object.entries(moduleSummary).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
  }));

  const moduleBarData = MODULE_NAMES.map((m) => ({
    name: m,
    count: claims.filter((c) =>
      (c.type || "").toLowerCase().includes(m.toLowerCase())
    ).length,
  }));

  const totalAmount = filteredClaims.reduce((a, c) => a + (c.amount || 0), 0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const setModuleFilter = (mod) => {
    setSearch({ module: mod });
  };

  const clearFilter = () => {
    setSearch({});
  };


  const downloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("Claims Summary – Manager Modules", 14, 22);
    autoTable(doc, {
      head: [["Claim #", "Customer", "Type", "Status", "Priority", "Amount", "Date"]],
      body: filteredClaims.map((c) => [
        c.claimNumber,
        c.customer,
        c.type,
        c.status,
        c.priority,
        `$${Number(c.amount || 0).toLocaleString()}`,
        c.date,
      ]),
      startY: 30,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: "#2c3e50", textColor: "#fff" },
    });
    doc.save("claims-manager.pdf");
  };


  if (loading) return <p className="loading">Loading…</p>;

  return (
    <div className="dashboard-container">
      {window.innerWidth <= 992 && (
        <button
          className="menu-toggle"
          onClick={() => document.querySelector(".sidebar").classList.toggle("open")}
        >
          ☰
        </button>
      )}


      <aside className="sidebar">
        <img src={logo} alt="logo" className="login_logo" />
        <h2 className="app-title">Insurance CMS admin</h2>

        <nav className="nav-menu">
          <ul>
            <li className={`nav-item ${!activeModule ? "active" : ""}`} onClick={clearFilter}>
              Dashboard
            </li>

            <li className="nav-item with-submenu">
              View Modules
              <ul className="submenu">
                {MODULE_NAMES.map((m) => (
                  <li
                    key={m}
                    className={activeModule === m ? "active" : ""}
                    onClick={() => setModuleFilter(m)}
                  >
                    {m} Insurance Claims
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>

        <div className="user-info">
          <p>Signed in as Admin User</p>
          <p className="user-email">{userEmail}</p>
          <button className="sign-out-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </aside>


      <main className="main-content">
        <div className="top-bar">
          <div>
            <h1 className="page-title">
              {activeModule ? `${activeModule} Insurance Claims` : "Admin Dashboard"}
            </h1>
            <p className="page-subtitle">
              {activeModule
                ? `Claims filtered for ${activeModule} module`
                : "Overview of all insurance claims across the system"}
            </p>
          </div>


          <div className="top-actions">
            <input
              type="text"
              className="search-input"
              placeholder="Search claims, customers, or status…"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button className="export-btn" onClick={downloadPDF}>
              📄 Download PDF
            </button>

          </div>
        </div>


        <section className="kpi-grid">
          <KpiCard title="Total Claims" value={filteredClaims.length} desc="In current view" />
          <KpiCard title="Open Claims" value={moduleSummary.open} desc="Requiring attention" />
          <KpiCard title="Closed Claims" value={moduleSummary.closed} desc="Successfully resolved" />
          <KpiCard
            title="Total Amount"
            value={`$${totalAmount.toLocaleString()}`}
            desc="Sum of current view"
          />
        </section>


        <section className="data-section">
          <div className="chart-card">
            <h3 className="chart-title">Claims by Module</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={moduleBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Claim Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {statusPieData.map((e, i) => (
                    <Cell key={`cell-${i}`} fill={STATUS_COLORS[e.name.toLowerCase()]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="table-card">
          <h3 className="table-title">
            {activeModule ? `Recent ${activeModule} Claims` : "Recent Claims"}
          </h3>
          <div className="table-container">
            {filteredClaims.length ? (
              <table className="claims-table">
                <thead>
                  <tr>
                    <th>Claim Number</th>
                    <th>Customer</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClaims.slice(0, 10).map((c) => (
                    <tr key={c.claimNumber}>
                      <td>{c.claimNumber}</td>
                      <td>{c.customer}</td>
                      <td>{c.type}</td>
                      <td>
                        <span className={`status-badge status-${c.status}`}>{c.status}</span>
                      </td>
                      <td>
                        <span className={`priority-badge priority-${c.priority}`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="amount-cell">${(c.amount || 0).toLocaleString()}</td>
                      <td>{c.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">No claims data for selected module</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}


const KpiCard = ({ title, value, desc }) => (
  <div className="kpi-card">
    <h3 className="kpi-title">{title}</h3>
    <div className="kpi-value">{value}</div>
    <p className="kpi-description">{desc}</p>
  </div>
);
