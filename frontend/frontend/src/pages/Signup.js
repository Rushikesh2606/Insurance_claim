import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";
import placeholder from "../assets/add_user.png"; // swap with real logo later

function Signup() {
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, role }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Account created! Please sign in.");
        nav("/");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        {/* centred image above title */}
        <img src={placeholder} alt="" className="signup-logo" />

        <h1 className="Signup_title">Create Account</h1>
        <p className="Signup_subtitle">Join the Insurance Claims Management System</p>

        <form onSubmit={handleSubmit} className="signup-form">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="role-select">
            <option value="Admin">Admin (View Only)</option>
            <option value="Manager">Manager</option>
          </select>

          <button type="submit" className="create-btn">Create Account</button>
        </form>

        <p className="signin-link">
          <span onClick={() => nav("/")}> Already have an account?Sign in</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;