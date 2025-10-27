import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NewClaimPage.css";

const TYPES = ["Car", "Life", "Health", "Travel", "Home"];

export default function NewClaim() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    claimNumber  : "",
    policyNumber : "",
    customerName : "",
    customerEmail: "",
    claimAmount  : 0,
    status       : "Open",
    priority     : "Medium",
    type         : "Home",
    description  : "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleCreate = async () => {
    const payload = {
      ...form,
      status : form.status.toLowerCase(),
      claimAmount: Number(form.claimAmount),
    };

    try {
      const res = await fetch("http://localhost:5000/api/claims", {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Network error");
      alert("Claim created!");
      navigate("/manager_dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to create claim");
    }
  };

  return (
    <div className="ncp-wrapper">
      <div className="ncp-card">
        <h1 className="ncp-title">Home Insurance Claims</h1>
        <p className="ncp-subtitle">Enter the details for the new claim</p>

        <div className="ncp-grid">
          <label>
            Claim Number
            <input name="claimNumber" placeholder="Enter claim number" value={form.claimNumber} onChange={handleChange} />
          </label>

          <label>
            Policy Number
            <input name="policyNumber" placeholder="Enter policy number" value={form.policyNumber} onChange={handleChange} />
          </label>

          <label>
            Customer Name
            <input name="customerName" placeholder="Enter customer name" value={form.customerName} onChange={handleChange} />
          </label>

          <label>
            Customer Email
            <input name="customerEmail" type="email" placeholder="Enter customer email" value={form.customerEmail} onChange={handleChange} />
          </label>

          <label>
            Claim Amount ($)
            <input name="claimAmount" type="number" min="0" value={form.claimAmount} onChange={handleChange} />
          </label>

          <label>
            Type of Claim
            <select name="type" value={form.type} onChange={handleChange}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>

          <label>
            Status
            <select name="status" value={form.status} onChange={handleChange}>
              <option>Open</option>
              <option>Pending</option>
              <option>Closed</option>
            </select>
          </label>

          <label>
            Priority
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>

          <label className="ncp-full">
            Description
            <textarea name="description" placeholder="Enter detailed description of the claim" rows={4} value={form.description} onChange={handleChange} />
          </label>
        </div>

        <div className="ncp-actions">
          <button className="ncp-cancel" onClick={() => navigate(-1)}>× Cancel</button>
          <button className="ncp-create" onClick={handleCreate}>Create Claim</button>
        </div>
      </div>
    </div>
  );
}