import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/EditClaim.css";

export default function EditClaim() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    claimNumber: "",
    policyNumber: "",
    type: "",
    status: "",
    priority: "",
    amount: "",
    customer: "",
    customerEmail: "",
    description: "",
  });

  // Fetch claim data
  useEffect(() => {
    fetch(`http://localhost:5000/api/claims/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch claim data");
        return res.json();
      })
      .then((data) => setFormData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/claims/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update claim");
        return res.json();
      })
      .then(() => {
        alert("✅ Claim updated successfully!");
        navigate(`/claims/${id}`);
      })
      .catch((err) => {
        alert("❌ Error updating claim: " + err.message);
      });
  };

  if (loading) return <p className="loading-text">Loading claim details...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;

  return (
    <div className="edit-claim-container">
      <div className="edit-claim-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Cancel
        </button>
        <h1>Edit Claim</h1>
        <p className="subtitle">Home Insurance Claims</p>
      </div>

      <form className="edit-claim-form" onSubmit={handleSubmit}>
        <h2 className="section-title">Claim Information</h2>
        <p className="section-subtitle">Update the claim details below</p>

        <div className="form-grid">
          <div className="form-group">
            <label>Claim Number</label>
            <input
              name="claimNumber"
              value={formData.claimNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Policy Number</label>
            <input
              name="policyNumber"
              value={formData.policyNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Customer Name</label>
            <input
              name="customer"
              value={formData.customer}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Customer Email</label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Claim Amount ($)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </div>

        <div className="button-row">
          <button type="submit" className="update-btn">
            💾 Update Claim
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            ✖ Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
