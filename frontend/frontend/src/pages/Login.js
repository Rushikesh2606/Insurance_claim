// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import logo from "../assets/logo.jpg";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        alert(data.message || "Login failed");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      nav(data.dashboard);          // /Dashboard  or  /Manager_Dashboard
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const fillAdmin = () => {
    setEmail("admin@demo.com");
    setPassword("1234");
  };
  const fillManager = () => {
    setEmail("manager@demo.com");
    setPassword("1234");
  };

  return React.createElement("div", { className: "login-wrapper" },
    React.createElement("div", { className: "login-card" },
      React.createElement("img", { src: logo, alt: "Logo", className: "Login_logo" }),
      React.createElement("h1", { className: "Login_title" }, "Sign In"),
      React.createElement("p", { className: "Login_subtitle" }, "Access your Insurance Claims Management System"),

      React.createElement("form", { onSubmit: handleSubmit, className: "login-form" },
        React.createElement("label", null, "Email"),
        React.createElement("input", {
          type: "email", placeholder: "Enter your email", value: email, required: true,
          onChange: (e) => setEmail(e.target.value)
        }),

        React.createElement("label", null, "Password"),
        React.createElement("input", {
          type: "password", placeholder: "Enter your password", value: password, required: true,
          onChange: (e) => setPassword(e.target.value)
        }),

        React.createElement("button", { type: "submit", className: "sign-in-btn" }, "Sign In")
      ),

      React.createElement("div", { className: "demo-hints" },
        React.createElement("p", null, "Demo Accounts:"),
        React.createElement("button", { type: "button", onClick: fillAdmin, className: "demo-btn" }, "Admin Demo"),
        React.createElement("button", { type: "button", onClick: fillManager, className: "demo-btn" }, "Manager Demo")
      ),

      React.createElement("p", { className: "signup-link" },
        React.createElement("span", {
          onClick: () => nav("/signup"),
          style: { cursor: "pointer" }
        }, "Don't have an account? Sign up")
      )
    )
  );
}