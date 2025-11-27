// src/api/promotions.ts
import axios from "axios";
import { getToken } from "./auth";

const base = (import.meta.env.VITE_ORDERCLOUD_API_URL || "").replace(/\/$/, "");

export interface OrderPromotion {
  ID: string;
  Code: string;
  Name?: string;
  Description?: string;
  Amount: number;
}

/**
 * Apply a promo code to an order
 */
export async function applyPromo(orderID: string, promoCode: string): Promise<OrderPromotion> {
  const res = await axios.post(
    `${base}/v1/orders/outgoing/${orderID}/promotions/${promoCode}`,
    {},
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return res.data;
}

/**
 * List all promotions applied to an order
 */
export async function listOrderPromotions(orderID: string): Promise<OrderPromotion[]> {
  const res = await axios.get(
    `${base}/v1/orders/outgoing/${orderID}/promotions`,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return res.data.Items || [];
}

/**
 * Remove a promotion from an order
 */
export async function removePromo(orderID: string, promoCode: string): Promise<void> {
  await axios.delete(
    `${base}/v1/orders/outgoing/${orderID}/promotions/${promoCode}`,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
}
