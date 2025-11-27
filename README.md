# React + Sitecore OrderCloud eCommerce Demo

A complete **end‑to‑end B2C eCommerce web application** built using **React + TypeScript + Vite** on the frontend and **Sitecore OrderCloud** as the headless commerce backend.

This project is the public code companion for the **9‑part blog series**:

> **“Building a Complete eCommerce App with React + Sitecore OrderCloud”**  
> By **Suresh Rayarakula**

---

## ✨ Features

- ✅ User **Signup & Login**
- ✅ **Product Catalog** & Product Details
- ✅ **Add to Cart** & Cart Management
- ✅ **Checkout & Order Submission**
- ✅ **Order History & Order Details**
- ✅ **User Profile & Address Management**
- ✅ **Shipping Selection**
- ✅ **Payments, Promotions & Taxes (Demo Implementation)**

---

## 🛠 Tech Stack

- **Frontend:** React, TypeScript, Vite  
- **Routing:** React Router  
- **State Management:** React Context API  
- **Backend:** Sitecore OrderCloud (Headless Commerce)  
- **HTTP Client:** Axios  

---

## ✅ Prerequisites

Before running this project, ensure you have:

- **Node.js** v18 or higher  
- **npm** or **yarn**
- A valid **Sitecore OrderCloud Sandbox**
- A configured **Buyer, Catalog, Products, and API Client**

---

## ⚙️ OrderCloud Configuration (High‑Level)

Your OrderCloud environment must include:

### 1. Marketplace
- One active Marketplace

### 2. Buyer
- Buyer ID: `react_buyers`

### 3. API Client (Buyer Type)
- Application Type: **Buyer**
- OAuth **Password Grant** Enabled
- Allowed Buyers: `react_buyers`
- **Maximum Granted Roles:**
  - `ProductReader`
  - `OrderReader`
  - `OrderAdmin`
  - `MeAddressAdmin`
  - `MeAdmin`
  - `BuyerUserAdmin` (Required for Signup)
  - (Optional) `FullAccess` for development
- **Anonymous Buyer:** Disabled
- **Minimum Required Roles:** Empty

### 4. Buyer Users
- Initial setup user: `testuser`
- New users created via **Signup UI**

### 5. Catalog, Categories & Products
- One Catalog assigned to `react_buyers`
- Categories created & assigned
- Products created & assigned to:
  - Catalog
  - Category
  - Buyer

### 6. Promotions & Taxes (For Part 9)
- Promotion Codes configured in Admin
- Basic Tax configuration enabled

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_ORDERCLOUD_API_URL=https://australiaeast-sandbox.ordercloud.io
VITE_ORDERCLOUD_CLIENT_ID=YOUR_CLIENT_ID
VITE_ORDERCLOUD_BUYER_ID=react_buyers

# DEV ONLY – DO NOT COMMIT TO GITHUB
# VITE_ORDERCLOUD_CLIENT_SECRET=YOUR_CLIENT_SECRET
