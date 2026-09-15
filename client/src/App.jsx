import { Navbar } from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
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
import Footer from "./components/Footer";
import { Payment } from "./pages/Payment";
import "./App.css";

//Admin
import { AdminDashboard } from "./admin/pages/AdminDashboard";
import { AdminMenu } from "./admin/pages/AdminMenu";
import { AdminOrders } from "./admin/pages/AdminOrders";
import { AdminUsers } from "./admin/pages/AdminUsers";
import { AdminReports } from "./admin/pages/AdminReports";

const App = () => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/menu/:id" element={<MenuItemDetail />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/order-tracking/:id" element={<OrderTracking />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/forgot-password" element={<ChangePassword />} />
          <Route path="/payment" element={<Payment />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/menu" element={<AdminMenu />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/reports" element={<AdminReports />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
