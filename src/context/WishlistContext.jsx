import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Wishlist context
const WishlistContext = createContext();

// Wishlist action types
const WISHLIST_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_WISHLIST: 'CLEAR_WISHLIST',
  LOAD_WISHLIST: 'LOAD_WISHLIST'
};

// Wishlist reducer
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case WISHLIST_ACTIONS.ADD_ITEM: {
      const { product } = action.payload;
      const isAlreadyInWishlist = state.items.some(item => item.id === product.id);
      
      if (isAlreadyInWishlist) {
        return state; // Don't add if already exists
      }
      
      return {
        ...state,
        items: [...state.items, product]
      };
    }
    
    case WISHLIST_ACTIONS.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.productId)
      };
    }
    
    case WISHLIST_ACTIONS.CLEAR_WISHLIST: {
      return {
        ...state,
        items: []
      };
    }
    
    case WISHLIST_ACTIONS.LOAD_WISHLIST: {
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

// Wishlist provider component
export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('princevibe_wishlist');
    if (savedWishlist) {
      try {
        const wishlistData = JSON.parse(savedWishlist);
        dispatch({ type: WISHLIST_ACTIONS.LOAD_WISHLIST, payload: wishlistData });
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('princevibe_wishlist', JSON.stringify(state));
  }, [state]);

  // Wishlist actions
  const addToWishlist = (product) => {
    dispatch({ type: WISHLIST_ACTIONS.ADD_ITEM, payload: { product } });
  };

  const removeFromWishlist = (productId) => {
    dispatch({ type: WISHLIST_ACTIONS.REMOVE_ITEM, payload: { productId } });
  };

  const clearWishlist = () => {
    dispatch({ type: WISHLIST_ACTIONS.CLEAR_WISHLIST });
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Wishlist calculations
  const wishlistItemsCount = state.items.length;
  const isInWishlist = (productId) => state.items.some(item => item.id === productId);

  const value = {
    wishlist: state,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    toggleWishlist,
    wishlistItemsCount,
    isInWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext; 