import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const CART_STORAGE_KEY = 'aicha_cart';

const loadCart = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {
    // ignore
  }
  return [];
};

const saveCart = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    // ignore
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);

  const persist = useCallback((updater) => {
    setItems((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveCart(next);
      return next;
    });
  }, []);

  const addToCart = useCallback((product, quantity = 1) => {
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const entry = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image || '',
      quantity: qty
    };
    persist((prev) => {
      const idx = prev.findIndex((i) => i.productId === entry.productId);
      const next = [...prev];
      if (idx >= 0) {
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
      } else {
        next.push(entry);
      }
      return next;
    });
  }, [persist]);

  const removeFromCart = useCallback((productId) => {
    persist((prev) => prev.filter((i) => i.productId !== productId));
  }, [persist]);

  const updateQuantity = useCallback((productId, quantity) => {
    const qty = Math.max(0, parseInt(quantity, 10) || 0);
    if (qty === 0) {
      persist((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    persist((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i))
    );
  }, [persist]);

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const cartCount = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  const cartTotal = items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 0), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
