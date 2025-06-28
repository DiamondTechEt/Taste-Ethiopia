import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';

interface FilterChipsProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  categoryTranslations?: Record<string, { en: string; am: string }>;
}

export function FilterChips({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  categoryTranslations 
}: FilterChipsProps) {
  const { theme } = useTheme();
  const { t, language } = useLanguage();

  const getCategoryLabel = (category: string) => {
    if (categoryTranslations && categoryTranslations[category]) {
      return language === 'am' 
        ? categoryTranslations[category].am 
        : categoryTranslations[category].en;
    }
    return t(category, category);
  };

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 8,
    },
    chip: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      marginRight: 12,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
      minWidth: 80,
      alignItems: 'center',
    },
    selectedChip: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 4,
      transform: [{ scale: 1.02 }],
    },
    chipText: {
      fontSize: 15,
      fontWeight: '500',
      color: theme.colors.text,
      textAlign: 'center',
      lineHeight: 20,
    },
    selectedChipText: {
      color: 'white',
      fontWeight: '600',
    },
  });

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={[styles.chip, selectedCategory === null && styles.selectedChip]}
        onPress={() => onSelectCategory(null)}
      >
        <Text style={[styles.chipText, selectedCategory === null && styles.selectedChipText]}>
          {t('All', 'ሁሉም')}
        </Text>
      </TouchableOpacity>
      
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[styles.chip, selectedCategory === category && styles.selectedChip]}
          onPress={() => onSelectCategory(category)}
        >
          <Text style={[styles.chipText, selectedCategory === category && styles.selectedChipText]}>
            {getCategoryLabel(category)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}