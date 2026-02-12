import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <CartContext.Provider value={{ cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
