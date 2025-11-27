import { useState } from "react";
import { signupUser } from "../api/signup";
import { login } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signupUser(form);

      // Auto login after signup
      await login(form.username, form.password);

      navigate("/products");
    } catch (err: any) {
      console.error("Signup/Login error:", err);
      const errorMsg =
        err.response?.data?.Errors?.[0]?.Message ||
        err.response?.data?.error_description ||
        err.message ||
        "Signup failed. Username may already exist.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    padding: "1rem 1.2rem",
    fontSize: "1.05rem",
    background: "#1f1f2e",
    border: "1px solid #444",
    borderRadius: "12px",
    color: "white",
    width: "100%",
    boxSizing: "border-box" as const,
  };

  const fieldLabels: Record<string, string> = {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    username: "Username",
    password: "Password",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      <div
        style={{
          background: "rgba(20, 20, 30, 0.95)",
          padding: "3rem 2.5rem",
          borderRadius: "20px",
          boxShadow: "0 20px 50px rgba(100, 108, 255, 0.2)",
          border: "1px solid #333",
          width: "100%",
          maxWidth: "420px",
          textAlign: "center",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1
          style={{
            fontSize: "2.4rem",
            fontWeight: "800",
            background: "linear-gradient(90deg, #646cff, #a78bff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 0.5rem 0",
          }}
        >
          Create Account
        </h1>
        <p style={{ color: "#aaa", fontSize: "1.05rem", marginBottom: "2rem" }}>
          Join React Commerce today
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {/* Name Row */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <input
              type="text"
              placeholder={fieldLabels.firstName}
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
              style={inputStyle}
            />
            <input
              type="text"
              placeholder={fieldLabels.lastName}
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
              style={inputStyle}
            />
          </div>

          <input
            type="email"
            placeholder={fieldLabels.email}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            style={inputStyle}
          />

          <input
            type="text"
            placeholder={fieldLabels.username}
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder={fieldLabels.password}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={inputStyle}
          />

          <p style={{ color: "#aaa", fontSize: "0.95rem", margin: "0.5rem 0" }}>
            Already have an account?{" "}
            <Link to="/" style={{ color: "#646cff", textDecoration: "none", fontWeight: "600" }}>
              Login
            </Link>
          </p>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #646cff, #535bf2)",
              color: "white",
              padding: "1.1rem",
              fontSize: "1.1rem",
              fontWeight: "600",
              border: "none",
              borderRadius: "12px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.3s ease",
            }}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {error && (
          <p style={{ color: "#ff6b6b", marginTop: "1.5rem", fontSize: "0.95rem" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
