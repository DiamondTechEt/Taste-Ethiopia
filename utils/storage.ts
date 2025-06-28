import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '@/types';

const STORAGE_KEYS = {
  FAVORITES: '@favorites',
  RECIPES: '@recipes',
  THEME: '@theme',
  LANGUAGE: '@language',
  ONBOARDING: '@onboarding_completed',
} as const;

export const StorageService = {
  // Favorites
  async getFavorites(): Promise<string[]> {
    try {
      const favorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  async setFavorites(favorites: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error setting favorites:', error);
    }
  },

  async addToFavorites(recipeId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      if (!favorites.includes(recipeId)) {
        favorites.push(recipeId);
        await this.setFavorites(favorites);
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  },

  async removeFromFavorites(recipeId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const updated = favorites.filter(id => id !== recipeId);
      await this.setFavorites(updated);
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  },

  // Custom Recipes
  async getCustomRecipes(): Promise<Recipe[]> {
    try {
      const recipes = await AsyncStorage.getItem(STORAGE_KEYS.RECIPES);
      return recipes ? JSON.parse(recipes) : [];
    } catch (error) {
      console.error('Error getting custom recipes:', error);
      return [];
    }
  },

  async setCustomRecipes(recipes: Recipe[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
    } catch (error) {
      console.error('Error setting custom recipes:', error);
    }
  },

  async addCustomRecipe(recipe: Recipe): Promise<void> {
    try {
      const recipes = await this.getCustomRecipes();
      recipes.push(recipe);
      await this.setCustomRecipes(recipes);
    } catch (error) {
      console.error('Error adding custom recipe:', error);
      throw error;
    }
  },

  async updateCustomRecipe(updatedRecipe: Recipe): Promise<void> {
    try {
      const recipes = await this.getCustomRecipes();
      const updatedRecipes = recipes.map(recipe => 
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      );
      await this.setCustomRecipes(updatedRecipes);
    } catch (error) {
      console.error('Error updating custom recipe:', error);
      throw error;
    }
  },

  async deleteCustomRecipe(recipeId: string): Promise<void> {
    try {
      const recipes = await this.getCustomRecipes();
      const updatedRecipes = recipes.filter(recipe => recipe.id !== recipeId);
      await this.setCustomRecipes(updatedRecipes);
    } catch (error) {
      console.error('Error deleting custom recipe:', error);
      throw error;
    }
  },

  // Theme
  async getThemePreference(): Promise<'light' | 'dark' | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark' | null;
    } catch (error) {
      console.error('Error getting theme preference:', error);
      return null;
    }
  },

  async setThemePreference(theme: 'light' | 'dark'): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error('Error setting theme preference:', error);
    }
  },

  // Language
  async getLanguagePreference(): Promise<'en' | 'am' | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE) as 'en' | 'am' | null;
    } catch (error) {
      console.error('Error getting language preference:', error);
      return null;
    }
  },

  async setLanguagePreference(language: 'en' | 'am'): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    } catch (error) {
      console.error('Error setting language preference:', error);
    }
  },

  // Onboarding
  async getOnboardingStatus(): Promise<boolean> {
    try {
      const status = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING);
      return status === 'true';
    } catch (error) {
      console.error('Error getting onboarding status:', error);
      return false;
    }
  },

  async setOnboardingCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true');
    } catch (error) {
      console.error('Error setting onboarding completed:', error);
    }
  },

  // Clear all data (for testing or user data reset)
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.FAVORITES,
        STORAGE_KEYS.RECIPES,
        STORAGE_KEYS.THEME,
        STORAGE_KEYS.LANGUAGE,
        STORAGE_KEYS.ONBOARDING,
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  },
};