import axios from "axios";
import { getToken } from "./auth";

const base = import.meta.env.VITE_ORDERCLOUD_API_URL;

// Get all addresses
export async function listAddresses() {
  const res = await axios.get(`${base}/v1/me/addresses`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data.Items;
}

// Create new address
export async function createAddress(address: any) {
  const res = await axios.post(`${base}/v1/me/addresses`, address, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
}

// Update address
export async function updateAddress(id: string, patch: any) {
  const res = await axios.patch(`${base}/v1/me/addresses/${id}`, patch, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
}

// Delete address
export async function deleteAddress(id: string) {
  await axios.delete(`${base}/v1/me/addresses/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}
