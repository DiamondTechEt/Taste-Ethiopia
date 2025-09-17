import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { RecipeCard } from '@/components/RecipeCard'; 
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { useRecipes } from '@/hooks/useRecipes';
import { Recipe } from '@/types';
import { StorageService } from '@/utils/storage';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { recipes } = useRecipes();

  const categories = Array.from(new Set(recipes.map(recipe => recipe.category)));

  useEffect(() => {
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredRecipes(recipes.filter(recipe => recipe.category === selectedCategory));
    } else {
      setFilteredRecipes(recipes);
    }
  }, [recipes, selectedCategory]);

  const checkOnboarding = async () => {
    try {
      const hasCompleted = await StorageService.getOnboardingStatus();
      if (!hasCompleted) {
        router.replace('/onboarding');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <RecipeCard recipe={item} />
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 50,
      paddingBottom: 20,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
      lineHeight: 38,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 16,
      lineHeight: 22,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
      paddingTop: 60,
    },
    emptyText: {
      fontSize: 18,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 26,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('Ethiopian Recipes', 'የኢትዮጵያ ምግቦች')}
        </Text>
        <Text style={styles.subtitle}>
          {t('Discover authentic flavors from Ethiopia', 'ዋናውን የኢትዮጵያ ጣዕም ይወቁ')}
        </Text>
      </View>

    
 {/* <AdviceSection /> */}

      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {t('No recipes found in this category', 'በዚህ ምድብ ምግብ አልተገኘም')}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}