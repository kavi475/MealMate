import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
// User Pages
import Home from "./pages/Home";
import { Menu } from "./pages/Menu";
import { Orders } from "./pages/Orders";
import { Profile } from "./pages/Profile";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { OrderConfirmation } from "./pages/OrderConfirmation";
import { OrderTracking } from "./pages/OrderTracking";
import { ChangePassword } from "./pages/ChangePassword";
import { Favorites } from "./pages/Favorites";
import { MenuItemDetail } from "./pages/MenuItemDetail";
import { Contact } from "./pages/Contact";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Payment } from "./pages/Payment";
import ForgotPassword from "./pages/ForgotPassword";

// Layouts
import { UserLayout } from "./layouts/UserLayout";
import { AdminLayout } from "./layouts/AdminLayout";

// Admin Pages
import { AdminDashboard } from "./admin/pages/AdminDashboard";
import { AdminMenu } from "./admin/pages/AdminMenu";
import { AdminOrders } from "./admin/pages/AdminOrders";
import { AdminUsers } from "./admin/pages/AdminUsers";
import { AdminReports } from "./admin/pages/AdminReports";
import { AdminMessages } from "./admin/pages/AdminMessages";
import { AdminReviews } from "./admin/pages/AdminReviews";

import "./App.css";

const App = () => {
  return (
    <>
      {" "}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: { fontSize: "14px" },
          success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
      <Routes>
        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        {/*USER ROUTES*/}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="menu/:id" element={<MenuItemDetail />} />
          <Route path="menu" element={<Menu />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment" element={<Payment />} />
          <Route path="order-confirmation" element={<OrderConfirmation />} />
          <Route path="order-tracking/:id" element={<OrderTracking />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
