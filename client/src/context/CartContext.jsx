import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get("/cart");
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item, quantity = 1) => {
    try {
      const response = await api.post("/cart/add", {
        menuItemId: item._id || item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity,
      });
      setCartItems(response.data.items);
      return { success: true };
    } catch (error) {
      console.error("Error adding to cart:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Failed to add to cart",
      };
    }
  };

  const updateQuantity = async (menuItemId, quantity) => {
    try {
      const response = await api.put("/cart/update", { menuItemId, quantity });
      setCartItems(response.data.items);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to update",
      };
    }
  };

  const removeFromCart = async (menuItemId) => {
    try {
      const response = await api.delete(`/cart/remove/${menuItemId}`);
      setCartItems(response.data.items);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to remove",
      };
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart/clear");
      setCartItems([]);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to clear cart",
      };
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryCharge = subtotal > 0 ? 40 : 0;
  const total = subtotal + deliveryCharge;

  const value = {
    cartItems,
    cartCount,
    subtotal,
    deliveryCharge,
    total,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
