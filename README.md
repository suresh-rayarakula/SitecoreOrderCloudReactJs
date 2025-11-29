#  🛒 React + Sitecore OrderCloud eCommerce Demo

A complete **end‑to‑end B2C eCommerce web application** built using **React + TypeScript + Vite** on the frontend and **Sitecore OrderCloud** as the headless commerce backend.
- A full-stack e-commerce web application built with React.js, providing complete shopping functionality including product browsing, cart management, checkout, user profile, address management, and order history. The application is deployed on Vercel.

This project is the public code companion for the **9‑part blog series**:
📚 Step‑by‑Step Blog Series (Implementation Guide)
This repository follows the complete 9‑Part blog series below. You can use these articles as a step‑by‑step implementation guide along with this source code:

🔹 Part 1 — Introduction & Architecture Overview
https://sureshrayarakula.wordpress.com/2025/11/02/building-a-complete-ecommerce-app-with-react-sitecore-ordercloud-part-1/

🔹 Part 2 — Setting Up Your OrderCloud Sandbox
https://sureshrayarakula.wordpress.com/2025/11/06/building-a-complete-ecommerce-app-with-react-sitecore-ordercloud-part-2-setting-up-your-ordercloud-sandbox/

🔹 Part 3 — Creating Your React App & Connecting to OrderCloud
https://sureshrayarakula.wordpress.com/2025/11/08/building-a-complete-ecommerce-app-with-react-sitecore-ordercloud-part-3-creating-your-react-app-and-connecting-to-ordercloud/

🔹 Part 4 — Build Product Catalog UI & Fetch Products
https://sureshrayarakula.wordpress.com/2025/11/12/building-a-complete-ecommerce-app-with-react-sitecore-ordercloud-part-4-build-product-catalog-ui-fetch-products-from-ordercloud/

🔹 Part 5 — Product Details & Add To Cart
https://sureshrayarakula.wordpress.com/2025/11/15/building-a-complete-ecommerce-app-with-react-sitecore-ordercloud-part-5-product-details-add-to-cart/

🔹 Part 6 — Cart Page & Checkout Flow
https://sureshrayarakula.wordpress.com/2025/11/17/building-a-complete-ecommerce-app-with-react-sitecore-ordercloud-part-6-cart-page-checkout-flow-view-cart-update-items-submit-order/

🔹 Part 7 — Order History & Order Details
https://sureshrayarakula.wordpress.com/2025/11/19/building-a-complete-ecommerce-app-with-react-sitecore-ordercloud-part-7-order-history-order-details-my-orders-page/

🔹 Part 8 — User Signup, Profile, Addresses & Shipping
https://sureshrayarakula.wordpress.com/2025/11/26/building-a-complete-ecommerce-app-with-react-sitecore-ordercloud-part-8-user-signup-profile-addresses-shipping-options/

🔹 Part 9 — Payments, Promotions & Taxes (Final Part) 🚀
https://sureshrayarakula.wordpress.com/2025/11/26/building-a-complete-ecommerce-app-with-react-sitecore-ordercloud-part-9-payments-promotions-taxes-final-part/

> **“Building a Complete eCommerce App with React + Sitecore OrderCloud”**  
> By **Suresh Rayarakula**
- 🔗 Live Demo:
- https://rect-js-order-cloud.vercel.app/


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
