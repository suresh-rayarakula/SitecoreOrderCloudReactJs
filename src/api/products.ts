import axios from "axios";
import { getToken } from "./auth";

const apiUrl = (import.meta.env.VITE_ORDERCLOUD_API_URL || "").replace(/\/$/, "");
const clientId = import.meta.env.VITE_ORDERCLOUD_CLIENT_ID;
const clientSecret = import.meta.env.VITE_ORDERCLOUD_CLIENT_SECRET;

export interface Product {
  ID: string;
  Name: string;
  Description?: string;
}

// Get anonymous token for unauthenticated product browsing
async function getAnonymousToken(): Promise<string> {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);

  const res = await axios.post(`${apiUrl}/oauth/token`, params);
  return res.data.access_token;
}

export async function listProducts(): Promise<Product[]> {
  // Use user token if logged in, otherwise get anonymous token
  let token = getToken();
  
  if (!token) {
    token = await getAnonymousToken();
  }

  const res = await axios.get(`${apiUrl}/v1/me/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.Items;
}