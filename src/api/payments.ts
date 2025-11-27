// src/api/payments.ts
import axios from "axios";
import { getToken } from "./auth";

const base = (import.meta.env.VITE_ORDERCLOUD_API_URL || "").replace(/\/$/, "");

export interface Payment {
  ID: string;
  Type: string;
  Amount: number;
  Accepted: boolean;
  DateCreated?: string;
}

/**
 * Create a payment on an order
 * Types: "PurchaseOrder", "CreditCard", "SpendingAccount"
 */
export async function createPayment(orderID: string, amount: number): Promise<Payment> {
  const res = await axios.post(
    `${base}/v1/orders/outgoing/${orderID}/payments`,
    {
      Type: "PurchaseOrder",
      Amount: amount,
      Accepted: true,
    },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return res.data;
}

/**
 * List all payments on an order
 */
export async function listPayments(orderID: string): Promise<Payment[]> {
  const res = await axios.get(
    `${base}/v1/orders/outgoing/${orderID}/payments`,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return res.data.Items || [];
}

/**
 * Delete a payment from an order
 */
export async function deletePayment(orderID: string, paymentID: string): Promise<void> {
  await axios.delete(
    `${base}/v1/orders/outgoing/${orderID}/payments/${paymentID}`,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
}
