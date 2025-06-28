import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Heart } from 'lucide-react-native';
import { RecipeCard } from '@/components/RecipeCard';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { useRecipes } from '@/hooks/useRecipes';
import { Recipe } from '@/types';

export default function FavoritesScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { recipes, favorites } = useRecipes();

  const favoriteRecipes = recipes.filter(recipe => favorites.includes(recipe.id));

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
      lineHeight: 22,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
      paddingTop: 60,
    },
    emptyIcon: {
      marginBottom: 20,
    },
    emptyTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 12,
      textAlign: 'center',
      lineHeight: 30,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      paddingHorizontal: 16,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('My Favorites', 'የእኔ ተወዳጆች')}
        </Text>
        <Text style={styles.subtitle}>
          {t(`${favoriteRecipes.length} saved recipes`, `${favoriteRecipes.length} የተቀመጡ ምግቦች`)}
        </Text>
      </View>

      <FlatList
        data={favoriteRecipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Heart 
              size={80} 
              color={theme.colors.textSecondary} 
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>
              {t('No Favorites Yet', 'ገና ተወዳጅ የለም')}
            </Text>
            <Text style={styles.emptyText}>
              {t('Start exploring recipes and tap the heart icon to save your favorites here.', 'ምግቦችን መመልከት ይጀምሩ እና የሚወዷቸውን ለማስቀመጥ የልብ አዶን ይንኩ።')}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}