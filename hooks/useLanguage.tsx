import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StorageService } from '@/utils/storage';
import { Language } from '@/types';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  isAmharic: boolean;
  t: (en: string, am?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await StorageService.getLanguagePreference();
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const toggleLanguage = async () => {
    try {
      const newLanguage: Language = language === 'en' ? 'am' : 'en';
      setLanguage(newLanguage);
      await StorageService.setLanguagePreference(newLanguage);
    } catch (error) {
      console.error('Error toggling language:', error);
    }
  };

  const t = (en: string, am?: string): string => {
    if (language === 'am' && am) {
      return am;
    }
    return en;
  };

  const value: LanguageContextType = {
    language,
    toggleLanguage,
    isAmharic: language === 'am',
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}