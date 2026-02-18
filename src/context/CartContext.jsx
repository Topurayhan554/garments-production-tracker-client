import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to cart
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.productId === product.productId &&
          item.size === product.size &&
          item.color === product.color,
      );

      if (existing) {
        return prev.map((item) =>
          item.productId === product.productId &&
          item.size === product.size &&
          item.color === product.color
            ? { ...item, quantity: item.quantity + product.quantity }
            : item,
        );
      }

      return [
        ...prev,
        {
          ...product,
          cartId: `${product.productId}-${product.size}-${product.color}-${Date.now()}`,
        },
      ];
    });
  };

  // Remove from cart
  const removeFromCart = (cartId) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  // Update quantity
  const updateQuantity = (cartId, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartId === cartId ? { ...item, quantity } : item,
      ),
    );
  };

  // Clear cart
  const clearCart = () => setCartItems([]);

  // Totals
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
