import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ClaimDetails.css"; // quick CSS below

export default function ClaimDetails() {
  const navigate = useNavigate();
  const { id } = useParams(); // claim _id from URL
  const [claim, setClaim] = useState(null);

  /* ---------- fetch single claim ---------- */
  useEffect(() => {
    fetch(`http://localhost:5000/api/claims/${id}`)
      .then((r) => r.json())
      .then(setClaim)
      .catch(console.error);
  }, [id]);

  if (!claim) return <p className="loading">Loading…</p>;

  /* ---------- helpers ---------- */
  const daysOpen = Math.floor(
    (Date.now() - new Date(claim.date)) / (1000 * 60 * 60 * 24)
  );

  const handleExport = () => {
    window.print(); // or build PDF later
  };
const handleDelete = async () => {
  if (!window.confirm("Are you sure you want to delete this claim?")) return;

  try {
    const res = await fetch(`http://localhost:5000/api/claims/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Failed to delete claim");
      return;
    }

    alert("Claim deleted successfully!");
    navigate("/Manager_Dashboard"); // 👈 redirect after delete
  } catch (err) {
    console.error(err);
    alert("Error deleting claim");
  }
};

  return (
    <div className="cd-wrapper">
      <div className="cd-card">
        {/* TOP BAR */}
        <div className="cd-topbar">
          <button className="cd-back" onClick={() => navigate(-1)}>
            ← Back to List
          </button>
          <div className="cd-actions">
            <button className="cd-export" onClick={handleExport}>
              Export
            </button>
            <button
  className="cd-edit"
  onClick={() => navigate(`/claims/${id}/edit`)}
>
  Edit
</button>
            <button className="cd-delete" onClick={handleDelete}>Delete</button>
          </div>
        </div>

        {/* CLAIM NUMBER */}
        <h1 className="cd-title">{claim.claimNumber}</h1>

        <div className="cd-grid">
          {/* LEFT COLUMN */}
          <div className="cd-left">
            <Section title="Claim Information">
              <Row label="Claim Number" value={claim.claimNumber} />
              <Row label="Policy Number" value={claim.policyNumber} />
              <Row label="Claim Type" value={claim.type} />
              <Row label="Status" value={claim.status} />
              <Row label="Priority" value={claim.priority} />
              <Row label="Claim Amount" value={`$${claim.amount?.toLocaleString()}`} />
            </Section>

            <Section title="Customer Information">
              <Row label="Name" value={claim.customer} />
              <Row label="Email" value={claim.customerEmail} />
              <Row label="Policy" value={claim.policyNumber} />
            </Section>

            <Section title="Description">
              <p className="cd-desc">{claim.description}</p>
            </Section>
          </div>

          {/* RIGHT COLUMN – QUICK STATS */}
          <div className="cd-right">
            <div className="cd-stats">
              <div className="stat">
                <div className="stat-label">Claim Value</div>
                <div className="stat-value">${claim.amount?.toLocaleString()}</div>
              </div>
              <div className="stat">
                <div className="stat-label">Days Open</div>
                <div className="stat-value">{daysOpen}</div>
              </div>
              <div className="stat">
                <div className="stat-label">Last Activity</div>
                <div className="stat-value">{daysOpen - 7} days ago</div>
              </div>
              <div className="stat">
                <div className="stat-label">Claim Created</div>
                <div className="stat-value">
                  {new Date(claim.date).toLocaleString("en-GB")}
                </div>
              </div>
              <div className="stat">
                <div className="stat-label">Last Updated</div>
                <div className="stat-value">
                  {new Date(claim.updatedAt).toLocaleString("en-GB")}
                </div>
              </div>
            </div>

            <div className="cd-bottom-actions">
              <button className="cd-edit large" onClick={() => navigate(`/claims/${id}/edit`)}>Edit Claim</button>
              <button className="cd-delete large" onClick={handleDelete}>Delete Claim</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- tiny reusable row ---------- */
const Row = ({ label, value }) => (
  <div className="row">
    <span className="row-label">{label}</span>
    <span className="row-value">{value}</span>
  </div>
);

const Section = ({ title, children }) => (
  <section className="cd-section">
    <h2 className="section-title">{title}</h2>
    {children}
  </section>
);