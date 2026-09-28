import { Route, Routes } from "react-router-dom";

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

// Layouts
import { UserLayout } from "./layouts/UserLayout";
import { AdminLayout } from "./layouts/AdminLayout";

// Admin Pages
import { AdminDashboard } from "./admin/pages/AdminDashboard";
import { AdminMenu } from "./admin/pages/AdminMenu";
import { AdminOrders } from "./admin/pages/AdminOrders";
import { AdminUsers } from "./admin/pages/AdminUsers";
import { AdminReports } from "./admin/pages/AdminReports";

import "./App.css";

const App = () => {
  return (
    <Routes>
      {/* ADMIN ROUTES */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
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
      </Route>
    </Routes>
  );
};

export default App;
