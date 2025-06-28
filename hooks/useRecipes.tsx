import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Recipe } from '@/types';
import { sampleRecipes } from '@/data/recipes';
import { StorageService } from '@/utils/storage';

interface RecipeContextType {
  recipes: Recipe[];
  favorites: string[];
  toggleFavorite: (recipeId: string) => Promise<void>;
  addRecipe: (recipe: Recipe) => Promise<void>;
  updateRecipe: (recipe: Recipe) => Promise<void>;
  deleteRecipe: (recipeId: string) => Promise<void>;
  searchRecipes: (query: string) => Recipe[];
  filterRecipes: (category?: string, difficulty?: string, region?: string) => Recipe[];
  getRecipeById: (id: string) => Recipe | undefined;
  isCustomRecipe: (recipeId: string) => boolean;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

interface RecipeProviderProps {
  children: ReactNode;
}

export function RecipeProvider({ children }: RecipeProviderProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedFavorites = await StorageService.getFavorites();
      const savedCustomRecipes = await StorageService.getCustomRecipes();
      
      setFavorites(savedFavorites);
      setCustomRecipes(savedCustomRecipes);
      setRecipes([...sampleRecipes, ...savedCustomRecipes]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const toggleFavorite = async (recipeId: string) => {
    try {
      const isFavorite = favorites.includes(recipeId);
      
      if (isFavorite) {
        await StorageService.removeFromFavorites(recipeId);
        setFavorites(prev => prev.filter(id => id !== recipeId));
      } else {
        await StorageService.addToFavorites(recipeId);
        setFavorites(prev => [...prev, recipeId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const addRecipe = async (recipe: Recipe) => {
    try {
      await StorageService.addCustomRecipe(recipe);
      const updatedCustomRecipes = [...customRecipes, recipe];
      setCustomRecipes(updatedCustomRecipes);
      setRecipes([...sampleRecipes, ...updatedCustomRecipes]);
    } catch (error) {
      console.error('Error adding recipe:', error);
      throw error;
    }
  };

  const updateRecipe = async (updatedRecipe: Recipe) => {
    try {
      // Only allow updating custom recipes
      if (!isCustomRecipe(updatedRecipe.id)) {
        throw new Error('Cannot update built-in recipes');
      }

      const updatedCustomRecipes = customRecipes.map(recipe => 
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      );
      
      await StorageService.updateCustomRecipe(updatedRecipe);
      setCustomRecipes(updatedCustomRecipes);
      setRecipes([...sampleRecipes, ...updatedCustomRecipes]);
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw error;
    }
  };

  const deleteRecipe = async (recipeId: string) => {
    try {
      // Only allow deleting custom recipes
      if (!isCustomRecipe(recipeId)) {
        throw new Error('Cannot delete built-in recipes');
      }

      await StorageService.deleteCustomRecipe(recipeId);
      
      // Remove from favorites if it exists there
      if (favorites.includes(recipeId)) {
        await StorageService.removeFromFavorites(recipeId);
        setFavorites(prev => prev.filter(id => id !== recipeId));
      }

      const updatedCustomRecipes = customRecipes.filter(recipe => recipe.id !== recipeId);
      setCustomRecipes(updatedCustomRecipes);
      setRecipes([...sampleRecipes, ...updatedCustomRecipes]);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  };

  const searchRecipes = (query: string): Recipe[] => {
    if (!query.trim()) return recipes;
    
    const lowercaseQuery = query.toLowerCase();
    return recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(lowercaseQuery) ||
      recipe.titleAmharic.toLowerCase().includes(lowercaseQuery) ||
      recipe.description.toLowerCase().includes(lowercaseQuery) ||
      recipe.category.toLowerCase().includes(lowercaseQuery) ||
      recipe.region.toLowerCase().includes(lowercaseQuery)
    );
  };

  const filterRecipes = (category?: string, difficulty?: string, region?: string): Recipe[] => {
    return recipes.filter(recipe => {
      if (category && recipe.category !== category) return false;
      if (difficulty && recipe.difficulty !== difficulty) return false;
      if (region && recipe.region !== region) return false;
      return true;
    });
  };

  const getRecipeById = (id: string): Recipe | undefined => {
    return recipes.find(recipe => recipe.id === id);
  };

  const isCustomRecipe = (recipeId: string): boolean => {
    return customRecipes.some(recipe => recipe.id === recipeId);
  };

  const value: RecipeContextType = {
    recipes,
    favorites,
    toggleFavorite,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    searchRecipes,
    filterRecipes,
    getRecipeById,
    isCustomRecipe,
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes(): RecipeContextType {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
}