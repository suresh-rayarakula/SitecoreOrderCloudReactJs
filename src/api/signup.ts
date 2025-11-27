// src/api/signup.ts (dev/test only)
import axios from "axios";

const base = (import.meta.env.VITE_ORDERCLOUD_API_URL || "").replace(/\/$/, "");
const clientID = import.meta.env.VITE_ORDERCLOUD_CLIENT_ID;
const clientSecret = import.meta.env.VITE_ORDERCLOUD_CLIENT_SECRET; // DEV only
const buyerID = import.meta.env.VITE_ORDERCLOUD_BUYER_ID;

async function getClientToken() {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", clientID);
  params.append("client_secret", clientSecret);

  const tokenRes = await axios.post(`${base}/oauth/token`, params);
  return tokenRes.data.access_token;
}

export async function signupUser(data: any) {
  const token = await getClientToken();

  try {
    // Step 1: Create the user
    const res = await axios.post(
      `${base}/v1/buyers/${buyerID}/users`,
      {
        Username: data.username,
        Password: data.password,
        FirstName: data.firstName,
        LastName: data.lastName,
        Email: data.email,
        Active: true,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const newUser = res.data;
    console.log("User created successfully:", newUser);
    
    // Note: Security profile should be assigned at Buyer level in OrderCloud Portal
    // Go to Security Profiles -> Assignments -> Add assignment for Buyer "react_buyers"
    // This way all users under the buyer automatically get access

    return newUser;
  } catch (err: any) {
    console.error("Signup failed:", err.response?.data || err.message);
    throw err;
  }
}
