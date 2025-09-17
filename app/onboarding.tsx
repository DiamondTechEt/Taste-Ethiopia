import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ChefHat, Heart, Globe, ArrowRight, Languages } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { StorageService } from '@/utils/storage';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: 0,
    icon: Languages,
    titleEn: 'Choose Your Language',
    titleAm: 'ቋንቋዎን ይምረጡ',
    descriptionEn: 'Select your preferred language to get started with Ethiopian Cuisine app.',
    descriptionAm: 'የኢትዮጵያ ምግብ መተግበሪያን ለመጀመር የሚፈልጉትን ቋንቋ ይምረጡ።',
    image: require('@/assets/images/icon.png'),
    isLanguageSelection: true,
  },
  {
    id: 1,
    icon: ChefHat,
    titleEn: 'Welcome to Ethiopian Cuisine',
    titleAm: 'እንኳን ወደ ኢትዮጵያ ምግብ በሰላም መጡ',
    descriptionEn: 'Discover the rich flavors and traditions of Ethiopian cooking with authentic recipes passed down through generations.',
    descriptionAm: 'ከትውልድ ወደ ትውልድ የተላለፉ ባህላዊ የምግብ አሰራሮችን ይማሩ',
    image: require('@/assets/images/icon.png'),
  },
  {
    id: 2,
    icon: Heart,
    titleEn: 'Step-by-Step Cooking',
    titleAm: 'ደረጃ በደረጃ ምግብ አሰራር',
    descriptionEn: 'Follow detailed instructions with timers and visual guides to master every dish perfectly.',
    descriptionAm: 'ፍጹም ምግብ ለማብሰል የሚያስችሉ ዝርዝር መመሪያዎች',
    image: require('@/assets/images/favicon.png'),
  },
  {
    id: 3,
    icon: Globe,
    titleEn: 'Save Your Favorites',
    titleAm: 'የወደዷቸውን ያስቀምጡ',
    descriptionEn: 'Create your personal cookbook and access recipes offline wherever you are.',
    descriptionAm: 'የራስዎን የምግብ መጽሐፍ ይፍጠሩ እና በየትኛውም ቦታ ያገኙዋቸው',
    image: require('@/assets/images/icon.png'),
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();
  const { theme } = useTheme();
  const { t, language, toggleLanguage } = useLanguage();

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    } else {
      completeOnboarding();
    }
  };

  const handleLanguageSelection = async (selectedLanguage: 'en' | 'am') => {
    try {
      // Set the language if it's different from current
      if (language !== selectedLanguage) {
        await toggleLanguage();
      }
      setHasSelectedLanguage(true);
      // Auto-advance to next screen after language selection
      setTimeout(() => {
        handleNext();
      }, 500);
    } catch (error) {
      console.error('Error setting language:', error);
      setHasSelectedLanguage(true);
      handleNext();
    }
  };

  const completeOnboarding = async () => {
    try {
      await StorageService.setOnboardingCompleted();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      router.replace('/(tabs)');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    slide: {
      width,
      height,
      position: 'relative',
    },
    imageContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    content: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 32,
      paddingBottom: 120,
      paddingTop: 60,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      alignSelf: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
      marginBottom: 16,
      textShadowColor: 'rgba(0, 0, 0, 0.7)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
      lineHeight: 38,
    },
    description: {
      fontSize: 18,
      color: 'white',
      textAlign: 'center',
      lineHeight: 26,
      marginBottom: 40,
      textShadowColor: 'rgba(0, 0, 0, 0.7)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    languageSelectionContainer: {
      alignItems: 'center',
      marginTop: 40,
    },
    languageButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 25,
      marginVertical: 8,
      minWidth: 200,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    selectedLanguageButton: {
      backgroundColor: theme.colors.primary,
    },
    languageButtonText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      lineHeight: 22,
    },
    selectedLanguageButtonText: {
      color: 'white',
    },
    languageSubtext: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 4,
      lineHeight: 18,
    },
    selectedLanguageSubtext: {
      color: 'rgba(255, 255, 255, 0.8)',
    },
    pagination: {
      position: 'absolute',
      bottom: 97,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: 'white',
      width: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 32,
      paddingBottom: 50,
    },
    nextButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 32,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
    nextButtonText: {
      fontSize: 18,
      fontWeight: '600',
      color: 'white',
      marginRight: 8,
      lineHeight: 22,
    },
    skipButton: {
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 16,
    },
    skipButtonText: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.8)',
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
      lineHeight: 20,
    },
  });

  const renderLanguageSelection = () => (
    <View style={styles.languageSelectionContainer}>
      <TouchableOpacity
        style={[
          styles.languageButton,
          language === 'en' && styles.selectedLanguageButton
        ]}
        onPress={() => handleLanguageSelection('en')}
      >
        <Text style={[
          styles.languageButtonText,
          language === 'en' && styles.selectedLanguageButtonText
        ]}>
          English
        </Text>
        <Text style={[
          styles.languageSubtext,
          language === 'en' && styles.selectedLanguageSubtext
        ]}>
          Continue in English
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.languageButton,
          language === 'am' && styles.selectedLanguageButton
        ]}
        onPress={() => handleLanguageSelection('am')}
      >
        <Text style={[
          styles.languageButtonText,
          language === 'am' && styles.selectedLanguageButtonText
        ]}>
          አማርኛ
        </Text>
        <Text style={[
          styles.languageSubtext,
          language === 'am' && styles.selectedLanguageSubtext
        ]}>
          በአማርኛ ይቀጥሉ
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        scrollEnabled={true} // Disable manual scrolling
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      >
        {onboardingData.map((item) => {
          const IconComponent = item.icon;
          return (
            <View key={item.id} style={styles.slide}>
              <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.image} />
              </View>
              
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
                style={styles.overlay}
              />

              <View style={styles.content}>
                <View style={styles.iconContainer}>
                  <IconComponent size={40} color={theme.colors.primary} />
                </View>

                <Text style={styles.title}>
                  {item.isLanguageSelection 
                    ? (language === 'am' ? item.titleAm : item.titleEn)
                    : t(item.titleEn, item.titleAm)
                  }
                </Text>

                <Text style={styles.description}>
                  {item.isLanguageSelection 
                    ? (language === 'am' ? item.descriptionAm : item.descriptionEn)
                    : t(item.descriptionEn, item.descriptionAm)
                  }
                </Text>

                {item.isLanguageSelection && renderLanguageSelection()}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.pagination}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === currentIndex && styles.activeDot]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        {currentIndex > 0 && (
          <TouchableOpacity style={styles.skipButton} onPress={completeOnboarding}>
            <Text style={styles.skipButtonText}>
              {t('Skip', 'ዝለል')}
            </Text>
          </TouchableOpacity>
        )}

        {currentIndex > 0 && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentIndex === onboardingData.length - 1 
                ? t('Get Started', 'ጀምር') 
                : t('Next', 'ቀጥል')
              }
            </Text>
            <ArrowRight size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}