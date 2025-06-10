import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Cart context
const CartContext = createContext();

// Cart action types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity while preserving stock info
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + quantity,
          // Update stock info if new product data has it
          availableStock: product.quantity || existingItem.availableStock,
          inStock: product.inStock !== undefined ? product.inStock : existingItem.inStock
        };
        return {
          ...state,
          items: updatedItems
        };
      } else {
        // Add new item - preserve original stock info as availableStock
        const cartItem = { 
          ...product, 
          quantity, // This becomes the cart quantity
          availableStock: product.quantity, // Preserve original stock
          inStock: product.inStock // Preserve stock status
        };
        return {
          ...state,
          items: [...state.items, cartItem]
        };
      }
    }
    
    case CART_ACTIONS.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.productId)
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== productId)
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      };
    }
    
    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: []
      };
    }
    
    case CART_ACTIONS.LOAD_CART: {
      return {
        ...state,
        items: action.payload.items || []
      };
    }
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: []
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('princevibe_cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('princevibe_cart', JSON.stringify(state));
  }, [state]);

  // Cart actions
  const addToCart = (product, quantity = 1) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: { product, quantity } });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: { productId } });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Helper function to ensure cart items have stock information
  const getEnhancedCart = () => {
    return state.items.map(item => {
      // If item doesn't have availableStock, use the quantity field as fallback
      if (!item.availableStock && item.quantity) {
        return {
          ...item,
          availableStock: item.inStock ? Math.max(item.quantity, 10) : 0 // Fallback logic
        };
      }
      return item;
    });
  };

  // Cart calculations
  const cartTotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemsCount = state.items.reduce((count, item) => count + item.quantity, 0);
  const isItemInCart = (productId) => state.items.some(item => item.id === productId);
  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cart: getEnhancedCart(),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartItemsCount,
    isItemInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext; 