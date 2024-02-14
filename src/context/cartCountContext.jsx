import  { createContext, useEffect, useState } from 'react';

const CartContext = createContext();


export const CartProvider = ({ children }) => {


  const [cartCount, setCartCount] = useState(() => {
    // Get the cart count from localStorage if it exists
    const storedCount = localStorage.getItem('cartCount');
    return storedCount ? parseInt(storedCount, 10) : 0;
  });

  // Update localStorage whenever cartCount changes


  useEffect(() => {
    localStorage.setItem('cartCount', cartCount.toString());
  }, [cartCount]);

  

  return (
    <CartContext.Provider value={{ cartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
