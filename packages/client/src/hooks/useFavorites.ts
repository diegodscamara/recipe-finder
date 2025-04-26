import { useState, useEffect, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';

const FAVORITES_KEY = 'recipeFavorites';

const toggleFavoriteAPI = async (id: string) => {
  const response = await fetch(`http://localhost:3001/api/recipes/${id}/favorite`, {
    method: 'PATCH',
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(
      `API Error: Failed to toggle favorite for ${id}. Status: ${response.status}. Details: ${errorData}`,
    );
  }
  return await response.json();
};

/**
 * Custom hook to manage favorite recipe IDs using localStorage.
 *
 * @returns An object containing:
 *  - `favoriteIds`: A Set containing the IDs of favorite recipes.
 *  - `toggleFavorite`: A function to add/remove a recipe ID from favorites.
 *  - `isFavorite`: A function to check if a specific ID is in favorites.
 */
export const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const toggleFavoriteMutation = useMutation({
    mutationFn: toggleFavoriteAPI,
    onSuccess: (data) => {
      console.log('Successfully toggled favorite:', data);
    },
    onError: (error) => {
      console.error(`Error toggling favorite:`, error);
    },
  });

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        const parsedIds = JSON.parse(storedFavorites);
        if (Array.isArray(parsedIds)) {
          const newSet = new Set(parsedIds);
          setFavoriteIds(newSet);
        } else {
          console.warn('[useFavorites] localStorage data was not an array:', parsedIds);
        }
      }
    } catch (error) {
      console.error('Error reading favorites from localStorage:', error);
    }
  }, []);

  const toggleFavorite = useCallback(
    (id: string) => {
      const isCurrentlyFavorite = favoriteIds.has(id);
      const newFavorites = new Set(favoriteIds);
      if (isCurrentlyFavorite) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }

      setFavoriteIds(newFavorites);

      try {
        const idsArray = Array.from(newFavorites);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(idsArray));
      } catch (error) {
        console.error('[useFavorites] Error saving to localStorage during toggle:', error);
      }

      toggleFavoriteMutation.mutate(id);
    },
    [favoriteIds, toggleFavoriteMutation],
  );

  const isFavorite = useCallback(
    (id: string) => favoriteIds.has(id),
    [favoriteIds],
  );

  return { favoriteIds, toggleFavorite, isFavorite };
}; 