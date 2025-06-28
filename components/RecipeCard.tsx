import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Clock, Users, ChefHat, CreditCard as Edit, Trash2 } from 'lucide-react-native';
import { Recipe } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { useRecipes } from '@/hooks/useRecipes';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { favorites, toggleFavorite, deleteRecipe, isCustomRecipe } = useRecipes();

  const isFavorite = favorites.includes(recipe.id);
  const isCustom = isCustomRecipe(recipe.id);

  const handlePress = () => {
    router.push(`/recipe/${recipe.id}`);
  };

  const handleFavoritePress = () => {
    toggleFavorite(recipe.id);
  };

  const handleEditPress = () => {
    router.push(`/edit-recipe/${recipe.id}`);
  };

  const handleDeletePress = () => {
    Alert.alert(
      t('Delete Recipe', 'ምግቡን ሰርዝ'),
      t('Are you sure you want to delete this recipe? This action cannot be undone.', 'ይህንን ምግብ መሰረዝ ይፈልጋሉ? ይህ ተግባር መመለስ አይችልም።'),
      [
        {
          text: t('Cancel', 'ሰርዝ'),
          style: 'cancel',
        },
        {
          text: t('Delete', 'ሰርዝ'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecipe(recipe.id);
            } catch (error) {
              Alert.alert(
                t('Error', 'ስህተት'),
                t('Failed to delete recipe', 'ምግቡን መሰረዝ አልተቻለም')
              );
            }
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    imageContainer: {
      position: 'relative',
      height: 200,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    favoriteButton: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    traditionalBadge: {
      position: 'absolute',
      top: 12,
      left: 12,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    customBadge: {
      position: 'absolute',
      top: 12,
      left: 12,
      backgroundColor: theme.colors.accent,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    badgeText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '600',
    },
    actionButtons: {
      position: 'absolute',
      top: 12,
      left: 12,
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      padding: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    description: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 12,
      lineHeight: 20,
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    metaText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginLeft: 4,
    },
    difficultyContainer: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      alignSelf: 'flex-start',
    },
    difficultyText: {
      fontSize: 12,
      color: theme.colors.text,
      fontWeight: '500',
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.image || 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg' }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {isCustom ? (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleEditPress}>
              <Edit size={16} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleDeletePress}>
              <Trash2 size={16} color={theme.colors.notification} />
            </TouchableOpacity>
          </View>
        ) : recipe.isTraditional ? (
          <View style={styles.traditionalBadge}>
            <Text style={styles.badgeText}>
              {t('Traditional', 'ባህላዊ')}
            </Text>
          </View>
        ) : null}
        
        <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
          <Heart
            size={20}
            color={isFavorite ? theme.colors.accent : theme.colors.textSecondary}
            fill={isFavorite ? theme.colors.accent : 'none'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {t(recipe.title, recipe.titleAmharic)}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {t(recipe.description, recipe.descriptionAmharic)}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Clock size={16} color={theme.colors.textSecondary} />
            <Text style={styles.metaText}>
              {recipe.cookTime} {t('min', 'ደቂቃ')}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Users size={16} color={theme.colors.textSecondary} />
            <Text style={styles.metaText}>
              {recipe.servings} {t('servings', 'ብዛት')}
            </Text>
          </View>

          <View style={styles.difficultyContainer}>
            <Text style={styles.difficultyText}>
              {t(recipe.difficulty, recipe.difficulty)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}