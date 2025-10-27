// src/pages/ManagerModules.js
import React, { useEffect, useState, useMemo } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/Manager.css";
import logo from "../assets/logo.jpg";

const MODULES = ["Car", "Life", "Health", "Travel"];
const STATUS_COLORS = { open: "#0088FE", closed: "#00C49F", pending: "#FFBB28" };

export default function ManagerModules() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeModule, setActiveModule] = useState(""); // "" = Dashboard (all)

  const perPage = 7;

  /* ----------  auth guard  ---------- */
  useEffect(() => {
    // if (localStorage.getItem("role") !== "Manager") navigate("/dashboard");
  }, [navigate]);

  /* ----------  fetch claims ONCE  ---------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/claims");
        const data = await res.json();
        setClaims(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ----------  filter by module  ---------- */
  const managerClaims = useMemo(() => {
    if (!activeModule) return claims; // Dashboard → all
    return claims.filter(c =>
      (c.type || "").toLowerCase() === activeModule.toLowerCase()
    );
  }, [claims, activeModule]);

  /* ----------  search  ---------- */
  const filtered = useMemo(() => {
    if (!search) return managerClaims;
    const s = search.toLowerCase();
    return managerClaims.filter(c =>
      (c.claimNumber + c.customer + c.type + c.status).toLowerCase().includes(s)
    );
  }, [managerClaims, search]);

  /* ----------  stats & charts  ---------- */
  const summary = useMemo(() => {
    const st = { total: 0, open: 0, pending: 0, closed: 0, amount: 0 };
    managerClaims.forEach(c => {
      st.total++;
      st[(c.status || "").toLowerCase()]++;
      st.amount += Number(c.amount || 0);
    });
    return st;
  }, [managerClaims]);

  const barData = MODULES.map(m => ({
    name: m,
    count: claims.filter(c => (c.type || "").toLowerCase() === m.toLowerCase()).length,
  }));

  const pieData = useMemo(() =>
    Object.entries(summary)
      .filter(([k]) => k !== "total" && k !== "amount")
      .map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
      })),
    [summary]
  );

  /* ----------  pagination  ---------- */
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / perPage);

  /* ----------  PDF export  ---------- */
  const downloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("Claims Summary – Manager Modules", 14, 22);
    autoTable(doc, {
      head: [["Claim #", "Customer", "Type", "Status", "Priority", "Amount", "Date"]],
      body: filtered.map(c => [
        c.claimNumber,
        c.customer,
        c.type,
        c.status,
        c.priority,
        `$${Number(c.amount || 0).toLocaleString()}`,
        c.date
      ]),
      startY: 30,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: "#2c3e50", textColor: "#fff" },
    });
    doc.save("claims-manager.pdf");
  };

  /* ----------  logout  ---------- */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) return React.createElement("p", { className: "loading" }, "Loading…");

  /* ----------  SIDEBAR  ---------- */
  const sidebar = React.createElement("aside", { className: "sidebar" },
    React.createElement("img", { src: logo, alt: "logo", className: "login_logo" }),
    React.createElement("h2", { className: "app-title" }, "Insurance CMS"),
    React.createElement("nav", { className: "nav-menu" },
      React.createElement("ul", null,
        React.createElement("li", {
          className: "nav-item" + (activeModule === "" ? " active" : ""),
          onClick: () => { setActiveModule(""); setPage(1); }
        }, "Dashboard"),
        MODULES.map(mod =>
          React.createElement("li", {
            key: mod,
            className: "nav-item" + (activeModule === mod ? " active" : ""),
            onClick: () => { setActiveModule(mod); setPage(1); }
          }, mod)
        )
      )
    ),
    React.createElement("div", { className: "user-info" },
      React.createElement("p", null, "Signed in as Manager"),
      React.createElement("p", { className: "user-email" }, localStorage.getItem("email") || "manager@insurance.com"),
      React.createElement("button", { className: "sign-out-btn", onClick: handleLogout }, "Sign Out")
    )
  );

  /* ----------  MAIN  ---------- */
  return React.createElement("div", { className: "dashboard-container" },
    sidebar,
    React.createElement("main", { className: "main-content" },
      React.createElement("div", { className: "top-bar" },
        React.createElement("div", null,
          React.createElement("h1", { className: "page-title" },
            activeModule ? `${activeModule} Claims` : "All Claims"
          ),
          React.createElement("p", { className: "page-subtitle" },
            activeModule
              ? `Claims for module ${activeModule}`
              : "Track & filter claims across Car, Life, Health, Travel"
          )
        ),
        React.createElement("div", { className: "top-actions" },
          React.createElement("input", {
            className: "search-input",
            placeholder: "Search claims, customers, status…",
            value: search,
            onChange: (e) => { setSearch(e.target.value); setPage(1); }
          }),
          React.createElement("button", { className: "export-btn", onClick: downloadPDF }, "Download PDF"),
            React.createElement("button", { className: "new-btn", onClick: () => navigate("/add_claim") }, "New Claim +")
        )
      ),

      /* KPI CARDS */
      React.createElement("section", { className: "kpi-grid" },
        React.createElement(KpiCard, { title: "Total Claims", value: summary.total, desc: activeModule || "All modules" }),
        React.createElement(KpiCard, { title: "Open", value: summary.open, desc: "Awaiting action" }),
        React.createElement(KpiCard, { title: "Pending", value: summary.pending, desc: "Under review" }),
        React.createElement(KpiCard, { title: "Closed", value: summary.closed, desc: "Completed" }),
        React.createElement(KpiCard, { title: "Total Value", value: `$${summary.amount.toLocaleString()}`, desc: "Sum of amounts" })
      ),


      React.createElement("section", { className: "data-section" },
        /* BAR */
        React.createElement("div", { className: "chart-card" },
          React.createElement("h3", { className: "chart-title" }, "Claims by Module"),
          React.createElement(ResponsiveContainer, { width: "100%", height: 270 },
            React.createElement(BarChart, { data: barData },
              React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
              React.createElement(XAxis, { dataKey: "name" }),
              React.createElement(YAxis, null),
              React.createElement(Tooltip, null),
              React.createElement(Bar, { dataKey: "count", fill: "#2c3e50", radius: [4, 4, 0, 0] })
            )
          )
        ),

        /* PIE */
        React.createElement("div", { className: "chart-card" },
          React.createElement("h3", { className: "chart-title" }, "Status Distribution"),
          React.createElement(ResponsiveContainer, { width: "100%", height: 270 },
            React.createElement(PieChart, null,
              React.createElement(Pie, {
                data: pieData,
                dataKey: "value",
                nameKey: "name",
                cx: "50%",
                cy: "50%",
                outerRadius: 80,
                label: true
              }, pieData.map((e, i) =>
                React.createElement(Cell, { key: `cell-${i}`, fill: STATUS_COLORS[e.name.toLowerCase()] })
              )),
              React.createElement(Tooltip, null),
              React.createElement(Legend, null)
            )
          )
        )
      ),

      /* TABLE */
      React.createElement("section", { className: "table-card" },
        React.createElement("div", { className: "table-header" },
          React.createElement("h3", { className: "table-title" },
            activeModule ? `${activeModule} Claims` : "All Claims"
          ),
          React.createElement("p", { className: "table-count" }, `${filtered.length} record(s)`)
        ),
        React.createElement("div", { className: "table-container" },
          React.createElement("table", { className: "claims-table" },
            React.createElement("thead", null,
              React.createElement("tr", null,
                React.createElement("th", null, "Claim Number"),
                React.createElement("th", null, "Customer"),
                React.createElement("th", null, "Type"),
                React.createElement("th", null, "Status"),
                React.createElement("th", null, "Priority"),
                React.createElement("th", { className: "amount-cell" }, "Amount"),
                React.createElement("th", null, "Created"),
                React.createElement("th", null, "Updated"),
                React.createElement("th", null, "Actions")
              )
            ),
            React.createElement("tbody", null,
              paginated.map((c) =>
                React.createElement("tr", { key: c._id },
                  React.createElement("td", null, c.claimNumber),
                  React.createElement("td", null, c.customer),
                  React.createElement("td", null, c.type),
                  React.createElement("td", null,
                    React.createElement("span", { className: `status-badge status-${c.status?.toLowerCase()}` }, c.status)
                  ),
                  React.createElement("td", null,
                    React.createElement("span", { className: `priority-badge priority-${c.priority?.toLowerCase()}` }, c.priority)
                  ),
                  React.createElement("td", { className: "amount-cell" }, `$${Number(c.amount || 0).toLocaleString()}`),
                  React.createElement("td", null, c.date),
                  React.createElement("td", null, c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : "-"),
                  React.createElement("td", null,
                    React.createElement("button", { className: "action-btn",  onClick: () => navigate(`/claims/${c._id}`) }, "View")
                  )
                )
              )
            )
          )
        ),

        /* PAGINATION */
        React.createElement("div", { className: "pagination" },
          React.createElement("button", { disabled: page === 1, onClick: () => setPage((p) => p - 1) }, "Prev"),
          React.createElement("span", null, `Page ${page} of ${totalPages}`),
          React.createElement("button", { disabled: page === totalPages, onClick: () => setPage((p) => p + 1) }, "Next")
        )
      )
    )
  );
}

/* ----------  reusable KPI card  ---------- */
const KpiCard = ({ title, value, desc }) =>
  React.createElement("div", { className: "kpi-card" },
    React.createElement("h3", { className: "kpi-title" }, title),
    React.createElement("div", { className: "kpi-value" }, value),
    React.createElement("p", { className: "kpi-description" }, desc)
  );