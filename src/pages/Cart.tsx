import { useEffect, useState } from "react";
import {
  listLineItems,
  updateLineItem,
  deleteLineItem,
  submitOrder,
  getOrCreateOrder,
  setShippingAddress,
  setBillingAddress,
  recalculateOrder,
  getOrder,
} from "../api/cart";
import { listAddresses } from "../api/addresses";
import { applyPromo, listOrderPromotions, removePromo } from "../api/promotions";
import { createPayment } from "../api/payments";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const { orderID, setOrderID, replaceCartItems } = useCart();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<string>("");
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<string>("");
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  
  // Promo & Order Totals
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [appliedPromos, setAppliedPromos] = useState<any[]>([]);
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  
  const navigate = useNavigate();

  async function loadCart() {
    setLoading(true);
    try {
      let currentOrderID: string = orderID || localStorage.getItem("oc_active_order_id") || "";
      if (!currentOrderID) {
        const order = await getOrCreateOrder();
        currentOrderID = order.ID;
        setOrderID(order.ID);
      }
      
      const lineItems = await listLineItems(currentOrderID);
      replaceCartItems(
        lineItems.map((li: any) => ({
          id: li.Product.ID,
          name: li.Product.Name,
          qty: li.Quantity,
        }))
      );
      setItems(lineItems);

      // Load order details for totals
      const order = await getOrder(currentOrderID);
      setOrderDetails(order);

      // Load applied promotions
      try {
        const promos = await listOrderPromotions(currentOrderID);
        setAppliedPromos(promos);
      } catch {
        setAppliedPromos([]);
      }

      // Load addresses
      const addrs = await listAddresses();
      setAddresses(addrs);
      
      // Auto-select first shipping address if available
      const shippingAddrs = addrs.filter((a: any) => a.Shipping);
      if (shippingAddrs.length > 0 && !selectedShippingAddress) {
        setSelectedShippingAddress(shippingAddrs[0].ID);
        if (useSameAddress) {
          setSelectedBillingAddress(shippingAddrs[0].ID);
        }
      }
      
      // Auto-select first billing address if different address mode
      const billingAddrs = addrs.filter((a: any) => a.Billing);
      if (billingAddrs.length > 0 && !selectedBillingAddress && !useSameAddress) {
        setSelectedBillingAddress(billingAddrs[0].ID);
      }
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
    setLoading(false);
  }

  // Apply promo code
  async function handleApplyPromo() {
    if (!promoCode.trim()) return;
    
    const oid = orderID || localStorage.getItem("oc_active_order_id");
    if (!oid) return;

    setApplyingPromo(true);
    setPromoError("");
    setPromoSuccess("");

    try {
      await applyPromo(oid, promoCode.trim());
      setPromoSuccess(`Promo code "${promoCode}" applied successfully!`);
      setPromoCode("");
      await loadCart(); // Reload to get updated totals
    } catch (err: any) {
      const errorMsg = err.response?.data?.Errors?.[0]?.Message || "Invalid promo code";
      setPromoError(errorMsg);
    } finally {
      setApplyingPromo(false);
    }
  }

  // Remove promo code
  async function handleRemovePromo(code: string) {
    const oid = orderID || localStorage.getItem("oc_active_order_id");
    if (!oid) return;

    try {
      await removePromo(oid, code);
      await loadCart();
    } catch (err) {
      console.error("Failed to remove promo:", err);
    }
  }

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateQty(li: any, newQty: number) {
    const oid = orderID || localStorage.getItem("oc_active_order_id");
    if (!oid) {
      alert("Cart error: No order found. Please refresh.");
      return;
    }
    if (newQty < 1) {
      await deleteLineItem(oid, li.ID);
    } else {
      await updateLineItem(oid, li.ID, newQty, li.Product.ID);
    }
    await loadCart();
  }

  async function handleCheckout() {
    const oid = orderID || localStorage.getItem("oc_active_order_id");
    if (!oid) {
      alert("No order to submit");
      return;
    }

    // Validate address selection
    if (!selectedShippingAddress) {
      alert("Please select a shipping address");
      return;
    }

    const billingAddr = useSameAddress ? selectedShippingAddress : selectedBillingAddress;
    if (!billingAddr) {
      alert("Please select a billing address");
      return;
    }

    setCheckingOut(true);
    try {
      // Step 1: Set shipping address on order
      await setShippingAddress(oid, selectedShippingAddress);
      
      // Step 2: Set billing address on order
      await setBillingAddress(oid, billingAddr);

      // Step 3: Try to recalculate order (optional - may fail if no integration event configured)
      let orderTotal = orderDetails?.Total || cartTotal;
      try {
        const recalculatedOrder = await recalculateOrder(oid);
        orderTotal = recalculatedOrder.Total || orderTotal;
      } catch (calcErr: any) {
        // If calculate fails (no integration event), just use current order total
        console.warn("Order calculate skipped:", calcErr.response?.data?.Errors?.[0]?.Message);
        // Refresh order to get latest totals
        const latestOrder = await getOrder(oid);
        orderTotal = latestOrder.Total || orderTotal;
      }

      // Step 4: Create payment for the order total
      await createPayment(oid, orderTotal);

      // Step 5: Submit the order
      await submitOrder(oid);
      
      alert("✅ Payment Successful! Order Submitted. 🎉");
      localStorage.removeItem("oc_active_order_id");
      setOrderID(null);
      replaceCartItems([]);
      setItems([]);
      navigate("/orders");
    } catch (err: any) {
      console.error("Checkout failed:", err);
      const errorMsg = err.response?.data?.Errors?.[0]?.Message || "Checkout failed. Please try again.";
      alert(`❌ ${errorMsg}`);
    } finally {
      setCheckingOut(false);
    }
  }

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading cart...</div>;
  const isEmpty = items.length === 0;
  const cartTotal = items.reduce((sum, li) => sum + (li.LineTotal || 0), 0);

  return (
    <div style={{ padding: "2rem", maxWidth: "960px", margin: "0 auto" }}>
      <h1 style={{
        fontSize: "2rem",
        marginBottom: "16px",
        background: "linear-gradient(90deg,#7377ff,#a7abff)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }}>Your Cart</h1>
      {isEmpty ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <h2>Your cart is empty</h2>
          <Link to="/products" style={{ color: "#646cff" }}>Continue Shopping →</Link>
        </div>
      ) : (
        <>
          <div style={{
            borderRadius: "11px",
            overflow: "hidden",
            boxShadow: "0 4px 28px rgba(100,108,255,0.08)",
            background: "rgba(32,32,48,0.95)",
          }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              color: "white",
              background: "transparent",
            }}>
              <thead>
                <tr style={{ background: "#232344" }}>
                  <th style={{ padding: "14px", textAlign: "left" }}>Product</th>
                  <th style={{ padding: "14px", textAlign: "right" }}>Unit Price</th>
                  <th style={{ padding: "14px", textAlign: "center" }}>Quantity</th>
                  <th style={{ padding: "14px", textAlign: "right" }}>Total</th>
                  <th style={{ padding: "14px", textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((li) => (
                  <tr key={li.ID} style={{ borderBottom: "1px solid #29294c" }}>
                    <td style={{ padding: "12px", fontWeight: 600 }}>{li.Product.Name}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>${(li.UnitPrice || 0).toFixed(2)}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <button
                        onClick={() => updateQty(li, li.Quantity - 1)}
                        style={{
                          background: "#353569",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0 10px",
                          fontSize: "1rem",
                          cursor: "pointer",
                          marginRight: "6px"
                        }}
                      >-</button>
                      <span style={{
                        minWidth: 32,
                        display: "inline-block",
                        fontWeight: "bold"
                      }}>{li.Quantity}</span>
                      <button
                        onClick={() => updateQty(li, li.Quantity + 1)}
                        style={{
                          background: "#353569",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0 10px",
                          fontSize: "1rem",
                          cursor: "pointer",
                          marginLeft: "6px"
                        }}
                      >+</button>
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>${(li.LineTotal || 0).toFixed(2)}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <button
                        onClick={() => updateQty(li, 0)}
                        style={{
                          background: "#d32f2f",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "7px 14px",
                          cursor: "pointer"
                        }}
                      >Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Promo Code Section */}
          <div style={{
            background: "#181828",
            borderRadius: "16px",
            padding: "24px",
            marginTop: "2rem",
            border: "1px solid #333",
          }}>
            <h3 style={{ margin: "0 0 16px 0", color: "#646cff", fontSize: "1.2rem" }}>
              🎁 Promo Code
            </h3>
            
            <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  fontSize: "1rem",
                  background: "#1f1f2e",
                  border: "1px solid #444",
                  borderRadius: "10px",
                  color: "white",
                }}
              />
              <button
                onClick={handleApplyPromo}
                disabled={applyingPromo || !promoCode.trim()}
                style={{
                  background: applyingPromo || !promoCode.trim() ? "#444" : "#646cff",
                  color: "white",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "600",
                  cursor: applyingPromo || !promoCode.trim() ? "not-allowed" : "pointer",
                }}
              >
                {applyingPromo ? "Applying..." : "Apply"}
              </button>
            </div>

            {promoError && (
              <p style={{ color: "#ff6b6b", fontSize: "0.9rem", margin: "8px 0 0 0" }}>
                {promoError}
              </p>
            )}
            {promoSuccess && (
              <p style={{ color: "#4ade80", fontSize: "0.9rem", margin: "8px 0 0 0" }}>
                {promoSuccess}
              </p>
            )}

            {/* Applied Promos */}
            {appliedPromos.length > 0 && (
              <div style={{ marginTop: "16px" }}>
                <p style={{ color: "#888", fontSize: "0.85rem", marginBottom: "8px" }}>Applied promotions:</p>
                {appliedPromos.map((promo) => (
                  <div
                    key={promo.ID}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "#1a472a",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ color: "#4ade80", fontWeight: "600" }}>
                      {promo.Code} {promo.Amount ? `(-$${promo.Amount.toFixed(2)})` : ""}
                    </span>
                    <button
                      onClick={() => handleRemovePromo(promo.Code)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#ff6b6b",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div style={{
            background: "#181828",
            borderRadius: "16px",
            padding: "24px",
            marginTop: "1.5rem",
            border: "1px solid #333",
          }}>
            <h3 style={{ margin: "0 0 20px 0", color: "#646cff", fontSize: "1.2rem" }}>
              📋 Order Summary
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#ccc" }}>
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              
              {orderDetails?.PromotionDiscount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "#4ade80" }}>
                  <span>Discount</span>
                  <span>-${orderDetails.PromotionDiscount.toFixed(2)}</span>
                </div>
              )}
              
              {orderDetails?.ShippingCost > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "#ccc" }}>
                  <span>Shipping</span>
                  <span>${orderDetails.ShippingCost.toFixed(2)}</span>
                </div>
              )}
              
              {orderDetails?.TaxCost > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "#ccc" }}>
                  <span>Tax</span>
                  <span>${orderDetails.TaxCost.toFixed(2)}</span>
                </div>
              )}
              
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "12px",
                borderTop: "1px solid #333",
                marginTop: "8px",
              }}>
                <span style={{ color: "#fff", fontSize: "1.2rem", fontWeight: "700" }}>Total</span>
                <span style={{ 
                  color: "#4ade80", 
                  fontSize: "1.4rem", 
                  fontWeight: "700" 
                }}>
                  ${(orderDetails?.Total || cartTotal).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          {/* Address Selection Section */}
          <div style={{
            background: "#181828",
            borderRadius: "16px",
            padding: "24px",
            marginTop: "2rem",
            border: "1px solid #333",
          }}>
            <h3 style={{ margin: "0 0 20px 0", color: "#646cff", fontSize: "1.3rem" }}>
              Shipping & Billing Address
            </h3>

            {addresses.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <p style={{ color: "#aaa", marginBottom: "16px" }}>No addresses found.</p>
                <Link
                  to="/addresses/new"
                  style={{
                    color: "#646cff",
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                >
                  + Add an address to continue
                </Link>
              </div>
            ) : (
              <>
                {/* Shipping Address */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ color: "#aaa", fontSize: "0.9rem", display: "block", marginBottom: "8px" }}>
                    Shipping Address
                  </label>
                  <select
                    value={selectedShippingAddress}
                    onChange={(e) => {
                      setSelectedShippingAddress(e.target.value);
                      if (useSameAddress) {
                        setSelectedBillingAddress(e.target.value);
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: "1rem",
                      background: "#1f1f2e",
                      border: "1px solid #444",
                      borderRadius: "10px",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    <option value="">-- Select Shipping Address --</option>
                    {addresses
                      .filter((a) => a.Shipping)
                      .map((addr) => (
                        <option key={addr.ID} value={addr.ID}>
                          {addr.AddressName} - {addr.Street1}, {addr.City}, {addr.State} {addr.Zip}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Same Address Checkbox */}
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#ccc",
                  cursor: "pointer",
                  marginBottom: "20px",
                }}>
                  <input
                    type="checkbox"
                    checked={useSameAddress}
                    onChange={(e) => {
                      setUseSameAddress(e.target.checked);
                      if (e.target.checked) {
                        setSelectedBillingAddress(selectedShippingAddress);
                      }
                    }}
                    style={{ width: "18px", height: "18px", accentColor: "#646cff" }}
                  />
                  Use same address for billing
                </label>

                {/* Billing Address (if different) */}
                {!useSameAddress && (
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ color: "#aaa", fontSize: "0.9rem", display: "block", marginBottom: "8px" }}>
                      Billing Address
                    </label>
                    <select
                      value={selectedBillingAddress}
                      onChange={(e) => setSelectedBillingAddress(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        fontSize: "1rem",
                        background: "#1f1f2e",
                        border: "1px solid #444",
                        borderRadius: "10px",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      <option value="">-- Select Billing Address --</option>
                      {addresses
                        .filter((a) => a.Billing)
                        .map((addr) => (
                          <option key={addr.ID} value={addr.ID}>
                            {addr.AddressName} - {addr.Street1}, {addr.City}, {addr.State} {addr.Zip}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* Selected Address Preview */}
                {selectedShippingAddress && (
                  <div style={{
                    background: "#1a1a2e",
                    borderRadius: "10px",
                    padding: "16px",
                    marginTop: "16px",
                  }}>
                    <p style={{ color: "#888", fontSize: "0.85rem", margin: "0 0 8px 0" }}>
                      Shipping to:
                    </p>
                    {(() => {
                      const addr = addresses.find((a) => a.ID === selectedShippingAddress);
                      return addr ? (
                        <p style={{ color: "#fff", margin: 0, lineHeight: 1.5 }}>
                          <strong>{addr.AddressName}</strong><br />
                          {addr.Street1}<br />
                          {addr.City}, {addr.State} {addr.Zip}<br />
                          {addr.Country}
                        </p>
                      ) : null;
                    })()}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Submit Order Button */}
          <div style={{ textAlign: "right", marginTop: "1.5rem" }}>
            <button
              onClick={handleCheckout}
              disabled={checkingOut || !selectedShippingAddress || addresses.length === 0}
              style={{
                background: checkingOut || !selectedShippingAddress || addresses.length === 0
                  ? "#555"
                  : "linear-gradient(135deg, #409040, #07b107)",
                color: "white",
                fontSize: "1.3rem",
                padding: "1rem 2.5rem",
                border: "none",
                borderRadius: "12px",
                cursor: checkingOut || !selectedShippingAddress || addresses.length === 0
                  ? "not-allowed"
                  : "pointer",
                fontWeight: 600,
                boxShadow: "0 2px 12px rgba(7,177,7,0.09)",
                opacity: checkingOut ? 0.7 : 1,
              }}
            >
              {checkingOut ? "Processing..." : "Submit Order"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
