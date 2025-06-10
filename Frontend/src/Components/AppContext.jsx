import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  return (
    <AppContext.Provider value={{ wishlist, setWishlist, cart, setCart }}>
      {children}
    </AppContext.Provider>
  );
}
