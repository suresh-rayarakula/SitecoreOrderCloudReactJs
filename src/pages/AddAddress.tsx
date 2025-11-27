import { useState } from "react";
import { createAddress } from "../api/addresses";
import { Link, useNavigate } from "react-router-dom";

export default function AddAddress() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    AddressName: "",
    Street1: "",
    Street2: "",
    City: "",
    State: "",
    Zip: "",
    Country: "India",
    Shipping: true,
    Billing: true,
  });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validate at least one address type is selected
    if (!form.Shipping && !form.Billing) {
      setError("Please select at least one address type (Shipping or Billing)");
      return;
    }

    setLoading(true);

    try {
      await createAddress(form);
      navigate("/addresses");
    } catch (err: any) {
      console.error("Failed to create address:", err);
      setError(err.response?.data?.Errors?.[0]?.Message || "Failed to create address. Please try again.");
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

  const labelStyle = {
    color: "#aaa",
    fontSize: "0.9rem",
    marginBottom: "6px",
    display: "block",
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link
          to="/addresses"
          style={{ color: "#646cff", textDecoration: "none", fontSize: "1rem" }}
        >
          ← Back to Addresses
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
          Add New Address
        </h2>

        <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div>
            <label style={labelStyle}>Address Name</label>
            <input
              type="text"
              placeholder="e.g., Home, Office"
              value={form.AddressName}
              onChange={(e) => setForm({ ...form, AddressName: e.target.value })}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Street Address</label>
            <input
              type="text"
              placeholder="Street address"
              value={form.Street1}
              onChange={(e) => setForm({ ...form, Street1: e.target.value })}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Street Address 2 (Optional)</label>
            <input
              type="text"
              placeholder="Apartment, suite, unit, etc."
              value={form.Street2}
              onChange={(e) => setForm({ ...form, Street2: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>City</label>
              <input
                type="text"
                placeholder="City"
                value={form.City}
                onChange={(e) => setForm({ ...form, City: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>State</label>
              <input
                type="text"
                placeholder="State"
                value={form.State}
                onChange={(e) => setForm({ ...form, State: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>ZIP Code</label>
              <input
                type="text"
                placeholder="ZIP Code"
                value={form.Zip}
                onChange={(e) => setForm({ ...form, Zip: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Country</label>
              <input
                type="text"
                placeholder="Country"
                value={form.Country}
                onChange={(e) => setForm({ ...form, Country: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Address Type */}
          <div>
            <label style={labelStyle}>Address Type</label>
            <div style={{ display: "flex", gap: "2rem", marginTop: "8px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ccc", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.Shipping}
                  onChange={(e) => setForm({ ...form, Shipping: e.target.checked })}
                  style={{ width: "18px", height: "18px", accentColor: "#646cff" }}
                />
                Shipping Address
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ccc", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.Billing}
                  onChange={(e) => setForm({ ...form, Billing: e.target.checked })}
                  style={{ width: "18px", height: "18px", accentColor: "#646cff" }}
                />
                Billing Address
              </label>
            </div>
            {!form.Shipping && !form.Billing && (
              <p style={{ color: "#ff6b6b", fontSize: "0.85rem", marginTop: "8px" }}>
                Please select at least one address type
              </p>
            )}
          </div>

          {error && (
            <p style={{ color: "#ff6b6b", fontSize: "0.95rem", margin: "0.5rem 0" }}>
              {error}
            </p>
          )}

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
              marginTop: "1rem",
              transition: "all 0.3s ease",
            }}
          >
            {loading ? "Saving..." : "Save Address"}
          </button>
        </form>
      </div>
    </div>
  );
}
