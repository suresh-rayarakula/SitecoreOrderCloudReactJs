// src/api/auth.ts
import axios from "axios";

const baseUrl = (import.meta.env.VITE_ORDERCLOUD_API_URL || "").replace(/\/$/, "");
const clientId = import.meta.env.VITE_ORDERCLOUD_CLIENT_ID;
const clientSecret = import.meta.env.VITE_ORDERCLOUD_CLIENT_SECRET; // DEV only (do NOT expose in prod)
const TOKEN_KEY = "access_token";

function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) console.log("Token retrieved from storage");
  return token;
}

/**
 * Password grant login (front-end, no client_secret)
 * Returns access token string
 */
export async function login(username: string, password: string): Promise<string> {
  const data = new URLSearchParams();
  data.append("grant_type", "password");
  data.append("client_id", clientId as string);
  data.append("username", username);
  data.append("password", password);
  // Include client_secret if configured (required for confidential clients)
  if (clientSecret) {
    data.append("client_secret", clientSecret);
  }

  try {
    const response = await axios.post(`${baseUrl}/oauth/token`, data.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    const token = response.data.access_token;
    setToken(token);
    console.log("Login successful, token stored");
    return token;
  } catch (err: any) {
    console.error("Login failed:", err.response?.data || err.message);
    console.error("Full error details:", {
      status: err.response?.status,
      data: err.response?.data,
      url: `${baseUrl}/oauth/token`,
      clientId: clientId,
    });
    const errorMsg = err.response?.data?.error_description || err.response?.data?.error || err.message || "Unknown error";
    throw new Error(`Login failed: ${errorMsg}`);
  }
}

/**
 * Get a client_credentials token (DEV / testing ONLY).
 * This uses client_secret and should be run from a secure server in prod.
 */
export async function getClientToken(): Promise<string> {
  if (!clientSecret) {
    throw new Error("Client secret not configured (VITE_ORDERCLOUD_CLIENT_SECRET). This method is for dev/testing only.");
  }

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", clientId as string);
  params.append("client_secret", clientSecret as string);
  // optionally: params.append("scope", "FullAccess");

  try {
    const res = await axios.post(`${baseUrl}/oauth/token`, params.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return res.data.access_token;
  } catch (err: any) {
    console.error("getClientToken failed:", err.response?.data || err.message);
    throw new Error("Client token request failed: check client secret and client configuration.");
  }
}

export interface MeUser {
  ID: string;
  Username: string;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  CompanyID?: string;
  Locale?: string | { ID: string; Currency: string; Language: string; OwnerID: string };
}

/**
 * Get current user (/v1/me). Returns null if no token or on failure.
 */
export async function getCurrentUser(): Promise<MeUser | null> {
  const token = getToken();
  if (!token) {
    console.warn("No token available for getCurrentUser");
    return null;
  }

  try {
    const response = await axios.get<MeUser>(`${baseUrl}/v1/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err: any) {
    console.error("Failed to get current user:", err.response?.data || err.message);
    return null;
  }
}

/**
 * Logout helper
 */
export function logout(navigate?: (path: string) => void): void {
  clearToken();
  localStorage.removeItem("oc_active_order_id");
  console.log("User logged out – token and order cleared");
  if (navigate) navigate("/");
}
export async function setUserLocale(_locale: string): Promise<void> {
  // TODO: Implement locale setting when needed
  console.log("setUserLocale temporarily disabled.");
}

/**
 * Update current user profile (/v1/me)
 */
export async function updateProfile(data: {
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Phone?: string;
}): Promise<MeUser> {
  const token = getToken();
  if (!token) {
    throw new Error("No token available");
  }

  try {
    const response = await axios.patch<MeUser>(`${baseUrl}/v1/me`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err: any) {
    console.error("Failed to update profile:", err.response?.data || err.message);
    throw err;
  }
}

