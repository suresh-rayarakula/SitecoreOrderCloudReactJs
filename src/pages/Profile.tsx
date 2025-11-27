import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";
import { Link } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const me = await getCurrentUser();
      setUser(me);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", fontSize: "1.6rem", color: "#aaa" }}>
        Loading profile...
      </div>
    );
  }

  const cardStyle = {
    background: "#181828",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "20px",
    border: "1px solid #333",
  };

  const labelStyle = {
    color: "#888",
    fontSize: "0.9rem",
    marginBottom: "4px",
  };

  const valueStyle = {
    color: "#fff",
    fontSize: "1.2rem",
    fontWeight: "600" as const,
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "2.4rem", margin: 0, color: "#646cff" }}>
          My Profile
        </h2>
        <Link
          to="/profile/edit"
          style={{
            background: "linear-gradient(135deg, #646cff, #535bf2)",
            color: "white",
            padding: "12px 24px",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: "600",
            textDecoration: "none",
            transition: "all 0.3s ease",
          }}
        >
          Edit Profile
        </Link>
      </div>

      <div style={cardStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div>
            <p style={labelStyle}>Username</p>
            <p style={valueStyle}>{user?.Username || "—"}</p>
          </div>
          <div>
            <p style={labelStyle}>Email</p>
            <p style={valueStyle}>{user?.Email || "—"}</p>
          </div>
          <div>
            <p style={labelStyle}>First Name</p>
            <p style={valueStyle}>{user?.FirstName || "—"}</p>
          </div>
          <div>
            <p style={labelStyle}>Last Name</p>
            <p style={valueStyle}>{user?.LastName || "—"}</p>
          </div>
          {user?.Phone && (
            <div>
              <p style={labelStyle}>Phone</p>
              <p style={valueStyle}>{user.Phone}</p>
            </div>
          )}
        </div>
      </div>

      {user?.DateCreated && (
        <div style={{ ...cardStyle, background: "#1a1a2e" }}>
          <p style={labelStyle}>Member Since</p>
          <p style={valueStyle}>{new Date(user.DateCreated).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}
