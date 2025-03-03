import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import API_BASE_URL from '../config/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch cart when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [], totalPrice: 0 });
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setCart(data);
      }
    } catch (error) {
      console.error('Fetch cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, size, color) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity, size, color })
      });

      const data = await response.json();
      if (response.ok) {
        setCart(data);
        return { success: true };
      } else {
        throw new Error(data.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, quantity, size, color) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      
      const response = await fetch(`${API_BASE_URL}/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity, size, color })
      });

      const data = await response.json();
      if (response.ok) {
        setCart(data);
        return { success: true };
      } else {
        throw new Error(data.message || 'Failed to update cart');
      }
    } catch (error) {
      console.error('Update cart error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId, size, color) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      
      const response = await fetch(`${API_BASE_URL}/cart/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, size, color })
      });

      const data = await response.json();
      if (response.ok) {
        setCart(data);
        return { success: true };
      } else {
        throw new Error(data.message || 'Failed to remove from cart');
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
