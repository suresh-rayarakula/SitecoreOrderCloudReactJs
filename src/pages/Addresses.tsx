import { useEffect, useState } from "react";
import { listAddresses, deleteAddress } from "../api/addresses";
import { Link } from "react-router-dom";

export default function Addresses() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const items = await listAddresses();
      setAddresses(items);
      setLoading(false);
    }
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Are you sure you want to delete this address?")) return;
    setDeleting(id);
    try {
      await deleteAddress(id);
      const refreshed = await listAddresses();
      setAddresses(refreshed);
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", fontSize: "1.6rem", color: "#aaa" }}>
        Loading addresses...
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "2.4rem", margin: 0, color: "#646cff" }}>
          My Addresses
        </h2>
        <Link
          to="/addresses/new"
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
          + Add New Address
        </Link>
      </div>

      {addresses.length === 0 && (
        <div
          style={{
            background: "#181828",
            borderRadius: "16px",
            padding: "48px",
            textAlign: "center",
            border: "1px solid #333",
          }}
        >
          <p style={{ color: "#888", fontSize: "1.2rem", margin: 0 }}>
            No addresses found. Add your first address to get started.
          </p>
        </div>
      )}

      <div style={{ display: "grid", gap: "1.5rem" }}>
        {addresses.map((addr) => (
          <div
            key={addr.ID}
            style={{
              background: "#181828",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid #333",
              transition: "all 0.3s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ margin: "0 0 12px 0", color: "#fff", fontSize: "1.4rem" }}>
                  {addr.AddressName || "Address"}
                </h3>
                <p style={{ color: "#ccc", margin: "4px 0", fontSize: "1.05rem" }}>
                  {addr.Street1}
                </p>
                {addr.Street2 && (
                  <p style={{ color: "#ccc", margin: "4px 0", fontSize: "1.05rem" }}>
                    {addr.Street2}
                  </p>
                )}
                <p style={{ color: "#aaa", margin: "4px 0", fontSize: "1rem" }}>
                  {addr.City}, {addr.State} {addr.Zip}
                </p>
                <p style={{ color: "#888", margin: "4px 0", fontSize: "0.95rem" }}>
                  {addr.Country}
                </p>
                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                  {addr.Shipping && (
                    <span style={{
                      background: "#1a472a",
                      color: "#4ade80",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                    }}>
                      Shipping
                    </span>
                  )}
                  {addr.Billing && (
                    <span style={{
                      background: "#1e3a5f",
                      color: "#60a5fa",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                    }}>
                      Billing
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <Link
                  to={`/addresses/edit/${addr.ID}`}
                  style={{
                    background: "transparent",
                    border: "2px solid #646cff",
                    color: "#646cff",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => remove(addr.ID)}
                  disabled={deleting === addr.ID}
                  style={{
                    background: "transparent",
                    border: "2px solid #ff4757",
                    color: "#ff4757",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    cursor: deleting === addr.ID ? "not-allowed" : "pointer",
                    opacity: deleting === addr.ID ? 0.5 : 1,
                    transition: "all 0.3s ease",
                  }}
                >
                  {deleting === addr.ID ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
