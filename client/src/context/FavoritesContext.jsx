import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/favorites');
      setFavorites(response.data.items || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (menuItemId) => {
    return favorites.some((fav) => fav._id === menuItemId);
  };

  const toggleFavorite = async (menuItemId) => {
    try {
      const response = await api.post(`/favorites/toggle/${menuItemId}`);
      // Refresh favorites
      await fetchFavorites();
      return { 
        success: true, 
        isFavorite: response.data.isFavorite 
      };
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to toggle favorite'
      };
    }
  };

  const favoriteCount = favorites.length;

  const value = {
    favorites,
    favoriteCount,
    loading,
    isFavorite,
    toggleFavorite,
    fetchFavorites
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};