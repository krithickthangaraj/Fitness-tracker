import React, { createContext, useState, useContext } from 'react';

// Create Context for Cart
const CartContext = createContext();

// Create a custom hook to use the Cart context
export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Function to add item to the cart
  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  // Function to remove item from the cart
  const removeItemFromCart = (item) => {
    setCart(cart.filter(cartItem => cartItem !== item)); // Remove item from the cart
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeItemFromCart }}>
        {children}
    </CartContext.Provider>
);

};
