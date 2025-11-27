// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Addresses from "./pages/Addresses";
import AddAddress from "./pages/AddAddress";
import EditAddress from "./pages/EditAddress";

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <div style={{ paddingTop: "100px" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/addresses/new" element={<AddAddress />} />
          <Route path="/addresses/edit/:id" element={<EditAddress />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
