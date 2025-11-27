import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { logout, getToken } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const location = useLocation();
  
  // Check if user is logged in
  const isLoggedIn = !!getToken();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header
      style={{
        background: "#0f0f1a",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        borderBottom: "1px solid #222",
      }}
    >
      <div
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          padding: "1rem 3rem", // ← Reduced from 1.5rem → smaller header
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo - Smaller but still bold */}
        <Link to="/products" style={{ textDecoration: "none" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "2.2rem", // ← Reduced from 2.8rem
              fontWeight: "800",
              background: "linear-gradient(90deg, #646cff, #a78bff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            OrderCloud + ReactJs
          </h1>
        </Link>

        {/* Nav Links - Perfect spacing & smaller text */}
        <nav style={{ display: "flex", alignItems: "center", gap: "3.5rem" }}>
          {/* Products link - visible for all users */}
          <Link
            to="/products"
            style={{
              color: isActive("/products") ? "#646cff" : "#e0e0e0",
              fontSize: "1.1rem",
              fontWeight: "600",
              textDecoration: "none",
              padding: "6px 0",
              borderBottom: isActive("/products")
                ? "2px solid #646cff"
                : "2px solid transparent",
              transition: "all 0.3s ease",
            }}
          >
            Products
          </Link>

          {/* Links for logged in users only */}
          {isLoggedIn && (
            <>
              <Link
                to="/orders"
                style={{
                  color: isActive("/orders") ? "#646cff" : "#e0e0e0",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  textDecoration: "none",
                  padding: "6px 0",
                  borderBottom: isActive("/orders")
                    ? "2px solid #646cff"
                    : "2px solid transparent",
                  transition: "all 0.3s ease",
                }}
              >
                My Orders
              </Link>

              <Link
                to="/addresses"
                style={{
                  color: isActive("/addresses") ? "#646cff" : "#e0e0e0",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  textDecoration: "none",
                  padding: "6px 0",
                  borderBottom: isActive("/addresses")
                    ? "2px solid #646cff"
                    : "2px solid transparent",
                  transition: "all 0.3s ease",
                }}
              >
                Addresses
              </Link>

              <Link
                to="/profile"
                style={{
                  color: isActive("/profile") ? "#646cff" : "#e0e0e0",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  textDecoration: "none",
                  padding: "6px 0",
                  borderBottom: isActive("/profile")
                    ? "2px solid #646cff"
                    : "2px solid transparent",
                  transition: "all 0.3s ease",
                }}
              >
                Profile
              </Link>

              <Link
                to="/cart"
                style={{
                  position: "relative",
                  color: "#fff",
                  fontSize: "1.15rem",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  Cart
                  {totalItems > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-10px",
                        right: "-20px",
                        background: "#ff2d55",
                        color: "white",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "3px solid #0f0f1a",
                      }}
                    >
                      {totalItems}
                    </span>
                  )}
                </span>
              </Link>
            </>
          )}

          {isLoggedIn ? (
            <button
              onClick={() => logout(navigate)}
              style={{
                background: "transparent",
                border: "2px solid #646cff",
                color: "#646cff",
                padding: "8px 20px",
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#646cff";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#646cff";
              }}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/"
              style={{
                background: "linear-gradient(135deg, #646cff, #535bf2)",
                color: "white",
                padding: "8px 20px",
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: "600",
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
