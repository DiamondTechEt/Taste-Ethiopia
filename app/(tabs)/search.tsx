import { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Text } from 'react-native';
import { SearchBar } from '@/components/SearchBar';
import { RecipeCard } from '@/components/RecipeCard';
import { FilterChips } from '@/components/FilterChips';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { useRecipes } from '@/hooks/useRecipes';
import { Recipe } from '@/types';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { recipes, searchRecipes } = useRecipes();

  // Updated categories with translations
  const categoryTranslations = {
    'vegetarian': { en: 'Vegetarian', am: 'የእጽዋት' },
    'meat': { en: 'Meat', am: 'ሥጋ' },
    'fasting': { en: 'Fasting', am: 'ጾም' },
    'breakfast': { en: 'Breakfast', am: 'ቁርስ' },
    'snack': { en: 'Snack', am: 'መክሰስ' },
    'drink': { en: 'Drink', am: 'መጠጥ' }
  };

  const categories = Object.keys(categoryTranslations);

  useEffect(() => {
    let results = searchRecipes(searchQuery);
    
    if (selectedCategory) {
      results = results.filter(recipe => recipe.category === selectedCategory);
    }
    
    setFilteredRecipes(results);
  }, [searchQuery, selectedCategory, recipes, searchRecipes]);

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
      paddingTop: 16,
      paddingBottom: 12,
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
    searchContainer: {
      paddingHorizontal: 4,
      marginBottom: 8,
    },
    filterSection: {
      backgroundColor: theme.colors.surface,
      paddingVertical: 12,
      marginBottom: 12,
      borderRadius: 20,
      marginHorizontal: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
    },
    filterTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 4,
      lineHeight: 22,
    },
    resultsContainer: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: theme.colors.background,
    },
    resultsText: {
      fontSize: 15,
      color: theme.colors.textSecondary,
      fontWeight: '500',
      lineHeight: 20,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
      paddingTop: 80,
    },
    emptyText: {
      fontSize: 18,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 28,
      paddingHorizontal: 16,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('Search Recipes', 'ምግቦችን ፈልግ')}
        </Text>
        <Text style={styles.subtitle}>
          {t('Find your perfect Ethiopian dish', 'የሚፈልጉትን የኢትዮጵያ ምግብ ያግኙ')}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>
          {t('Filter by Category', 'በምድብ ያጣሩ')}
        </Text>
        <FilterChips
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryTranslations={categoryTranslations}
        />
      </View>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredRecipes.length} {t('recipes found', 'ምግቦች ተገኝተዋል')}
        </Text>
      </View>

      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery || selectedCategory 
                ? t('No recipes match your search criteria. Try adjusting your filters.', 'ምንም ምግብ አልተገኘም። ፍለጋዎን ይቀይሩ።')
                : t('Start typing to search for recipes or use the category filters above.', 'ምግቦችን ለመፈለግ መተየብ ይጀምሩ ወይም ከላይ ያሉትን ምድቦች ይጠቀሙ።')
              }
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}