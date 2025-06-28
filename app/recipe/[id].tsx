import { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart, Clock, Users, ChefHat, Lightbulb } from 'lucide-react-native';
import { Timer } from '@/components/Timer';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { useRecipes } from '@/hooks/useRecipes';
import { Recipe } from '@/types';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { getRecipeById, favorites, toggleFavorite } = useRecipes();
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Memoize styles creation to ensure theme is available
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      position: 'relative',
      height: 300,
    },
    headerImage: {
      width: '100%',
      height: '100%',
    },
    headerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    headerButtons: {
      position: 'absolute',
      top: 60,
      left: 16,
      right: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      marginTop: -24,
      paddingTop: 24,
    },
    titleSection: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
      lineHeight: 34,
    },
    description: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      lineHeight: 24,
      marginBottom: 20,
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
    },
    metaText: {
      fontSize: 14,
      color: theme.colors.text,
      marginLeft: 6,
      fontWeight: '500',
      lineHeight: 18,
    },
    difficultyBadge: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    difficultyText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 18,
    },
    section: {
      marginBottom: 28,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 20,
      paddingHorizontal: 20,
      lineHeight: 26,
    },
    ingredientItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: theme.colors.surface,
      marginHorizontal: 16,
      marginBottom: 8,
      borderRadius: 12,
    },
    ingredientDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
      marginRight: 12,
    },
    ingredientText: {
      fontSize: 16,
      color: theme.colors.text,
      flex: 1,
      lineHeight: 22,
    },
    ingredientAmount: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontWeight: '500',
      lineHeight: 18,
    },
    stepItem: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 16,
      padding: 20,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    activeStep: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.card,
    },
    stepHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    stepNumber: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    stepNumberText: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
      lineHeight: 18,
    },
    stepTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      lineHeight: 24,
    },
    stepInstruction: {
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 24,
      marginBottom: 12,
    },
    stepNavigation: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    navButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
    },
    navButtonDisabled: {
      backgroundColor: theme.colors.border,
    },
    navButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 20,
    },
    navButtonTextDisabled: {
      color: theme.colors.textSecondary,
    },
    tipsSection: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: 16,
      marginBottom: 24,
      borderRadius: 16,
      padding: 20,
    },
    tipsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    tipsTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginLeft: 8,
      lineHeight: 24,
    },
    tipsText: {
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 24,
    },
    notFound: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    notFoundText: {
      fontSize: 18,
      color: theme.colors.text,
      textAlign: 'center',
      lineHeight: 24,
    },
  }), [theme]);

  useEffect(() => {
    if (id) {
      const foundRecipe = getRecipeById(id);
      setRecipe(foundRecipe || null);
    }
  }, [id, getRecipeById]);

  if (!recipe) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: theme.colors.text }]}>
            {t('Recipe not found', 'ምግቡ አልተገኘም')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isFavorite = favorites.includes(recipe.id);

  const handleBack = () => {
    router.back();
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(recipe.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: recipe.image || 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg' }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <View style={styles.headerOverlay} />
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
            <ArrowLeft size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleFavoriteToggle}>
            <Heart
              size={20}
              color={isFavorite ? theme.colors.accent : '#000'}
              fill={isFavorite ? theme.colors.accent : 'none'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>
            {t(recipe.title, recipe.titleAmharic)}
          </Text>
          <Text style={styles.description}>
            {t(recipe.description, recipe.descriptionAmharic)}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Clock size={16} color={theme.colors.text} />
              <Text style={styles.metaText}>
                {recipe.cookTime} {t('min', 'ደቂቃ')}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Users size={16} color={theme.colors.text} />
              <Text style={styles.metaText}>
                {recipe.servings} {t('servings', 'ብዛት')}
              </Text>
            </View>

            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>
                {t(recipe.difficulty, recipe.difficulty)}
              </Text>
            </View>
          </View>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('Ingredients', 'ንጥረ ነገሮች')}
          </Text>
          {recipe.ingredients.map((ingredient) => (
            <View key={ingredient.id} style={styles.ingredientItem}>
              <View style={styles.ingredientDot} />
              <Text style={styles.ingredientText}>
                {t(ingredient.name, ingredient.nameAmharic)}
              </Text>
              <Text style={styles.ingredientAmount}>
                {ingredient.amount} {ingredient.unit}
              </Text>
            </View>
          ))}
        </View>

        {/* Cooking Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('Instructions', 'መመሪያዎች')}
          </Text>
          
          {recipe.steps.map((step, index) => (
            <View key={step.id} style={[styles.stepItem, index === currentStep && styles.activeStep]}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.stepNumber}</Text>
                </View>
                <Text style={styles.stepTitle}>
                  {t('Step', 'ደረጃ')} {step.stepNumber}
                </Text>
              </View>
              
              <Text style={styles.stepInstruction}>
                {t(step.instruction, step.instructionAmharic)}
              </Text>
              
              {step.timer && step.timer > 0 && (
                <Timer duration={step.timer} />
              )}
            </View>
          ))}

          <View style={styles.stepNavigation}>
            <TouchableOpacity
              style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
              onPress={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <Text style={[styles.navButtonText, currentStep === 0 && styles.navButtonTextDisabled]}>
                {t('Previous', 'ቀደም')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, currentStep === recipe.steps.length - 1 && styles.navButtonDisabled]}
              onPress={() => setCurrentStep(Math.min(recipe.steps.length - 1, currentStep + 1))}
              disabled={currentStep === recipe.steps.length - 1}
            >
              <Text style={[styles.navButtonText, currentStep === recipe.steps.length - 1 && styles.navButtonTextDisabled]}>
                {t('Next', 'ቀጣይ')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tips */}
        {recipe.tips && (
          <View style={styles.tipsSection}>
            <View style={styles.tipsHeader}>
              <Lightbulb size={20} color={theme.colors.primary} />
              <Text style={styles.tipsTitle}>
                {t('Tips', 'ምክሮች')}
              </Text>
            </View>
            <Text style={styles.tipsText}>
              {t(recipe.tips, recipe.tipsAmharic || recipe.tips)}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}