import { useEffect, useState } from "react";
import { getCurrentUser, updateProfile } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
  });

  const [username, setUsername] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const user = await getCurrentUser();
        if (user) {
          setForm({
            FirstName: user.FirstName || "",
            LastName: user.LastName || "",
            Email: user.Email || "",
            Phone: (user as any).Phone || "",
          });
          setUsername(user.Username);
        }
      } catch (err: any) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await updateProfile(form);
      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setError(err.response?.data?.Errors?.[0]?.Message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
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

  const labelStyle = {
    color: "#aaa",
    fontSize: "0.9rem",
    marginBottom: "6px",
    display: "block",
  };

  if (loading) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", fontSize: "1.6rem", color: "#aaa" }}>
        Loading profile...
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link
          to="/profile"
          style={{ color: "#646cff", textDecoration: "none", fontSize: "1rem" }}
        >
          ← Back to Profile
        </Link>
      </div>

      <div
        style={{
          background: "#181828",
          borderRadius: "20px",
          padding: "2.5rem",
          border: "1px solid #333",
        }}
      >
        <h2 style={{ fontSize: "2rem", margin: "0 0 2rem 0", color: "#646cff", textAlign: "center" }}>
          Edit Profile
        </h2>

        <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {/* Username - Read Only */}
          <div>
            <label style={labelStyle}>Username (cannot be changed)</label>
            <input
              type="text"
              value={username}
              disabled
              style={{
                ...inputStyle,
                background: "#151520",
                color: "#888",
                cursor: "not-allowed",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input
                type="text"
                placeholder="First Name"
                value={form.FirstName}
                onChange={(e) => setForm({ ...form, FirstName: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input
                type="text"
                placeholder="Last Name"
                value={form.LastName}
                onChange={(e) => setForm({ ...form, LastName: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={form.Email}
              onChange={(e) => setForm({ ...form, Email: e.target.value })}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Phone (Optional)</label>
            <input
              type="tel"
              placeholder="Phone Number"
              value={form.Phone}
              onChange={(e) => setForm({ ...form, Phone: e.target.value })}
              style={inputStyle}
            />
          </div>

          {error && (
            <p style={{ color: "#ff6b6b", fontSize: "0.95rem", margin: "0.5rem 0" }}>
              {error}
            </p>
          )}

          {success && (
            <p style={{ color: "#4ade80", fontSize: "0.95rem", margin: "0.5rem 0" }}>
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            style={{
              background: "linear-gradient(135deg, #646cff, #535bf2)",
              color: "white",
              padding: "1.1rem",
              fontSize: "1.1rem",
              fontWeight: "600",
              border: "none",
              borderRadius: "12px",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
              marginTop: "1rem",
              transition: "all 0.3s ease",
            }}
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

