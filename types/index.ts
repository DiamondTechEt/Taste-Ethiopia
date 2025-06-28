export interface Ingredient {
  id: string;
  name: string;
  nameAmharic: string;
  amount: string;
  unit: string;
}

export interface RecipeStep {
  id: string;
  stepNumber: number;
  instruction: string;
  instructionAmharic: string;
  image?: string;
  timer?: number; // in seconds
}

export interface Recipe {
  id: string;
  title: string;
  titleAmharic: string;
  description: string;
  descriptionAmharic: string;
  image?: string;
  cookTime: number; // in minutes
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'vegetarian' | 'meat' | 'fasting' | 'breakfast' | 'snack' | 'drink';
  isFavorite: boolean;
  isTraditional: boolean;
  region: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  tips?: string;
  tipsAmharic?: string;
}

export interface AppTheme {
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    card: string;
    notification: string;
  };
}

export type Language = 'en' | 'am';

export interface AppState {
  recipes: Recipe[];
  favorites: string[];
  theme: AppTheme;
  language: Language;
  hasCompletedOnboarding: boolean;
}