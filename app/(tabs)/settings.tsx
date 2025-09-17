import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Switch, Alert, Modal, ScrollView, Linking } from 'react-native';
import { Moon, Sun, Globe, Info, Trash2, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { StorageService } from '@/utils/storage';
import { useState } from 'react'; 

export default function SettingsScreen() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [showAboutModal, setShowAboutModal] = useState(false);

  const handleClearData = () => {
    Alert.alert(
      t('Clear All Data', 'ሁሉንም መረጃ ሰርዝ'),
      t('This will delete all your custom recipes, favorites, and settings. This action cannot be undone.', 'ይህ ሁሉንም የእርስዎ ምግቦች፣ ተወዳጆች እና ቅንብሮች ይሰርዛል። ይህ ተግባር መመለስ አይችልም።'),
      [
        {
          text: t('Cancel', 'ሰርዝ'),
          style: 'cancel',
        },
        {
          text: t('Clear Data', 'መረጃ ሰርዝ'),
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.clearAllData();
              Alert.alert(
                t('Success', 'ተሳክቷል'),
                t('All data has been cleared successfully.', 'ሁሉም መረጃ በተሳካ ሁኔታ ተሰርዟል።')
              );
            } catch (error) {
              Alert.alert(
                t('Error', 'ስህተት'),
                t('Failed to clear data', 'መረጃ መሰረዝ አልተቻለም')
              );
            }
          },
        },
      ]
    );
  };

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
      lineHeight: 38,
    },
    section: {
      backgroundColor: theme.colors.card,
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 20,
      lineHeight: 24,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingIcon: {
      marginRight: 16,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: 4,
      lineHeight: 20,
    },
    settingDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    languageButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    languageButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 18,
    },
    clearDataButton: {
      backgroundColor: theme.colors.notification,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    clearDataButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 18,
    },
    aboutButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    aboutButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 18,
    },
    appInfo: {
      alignItems: 'center',
      paddingVertical: 24,
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    appName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 6,
      lineHeight: 26,
    },
    appVersion: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 18,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: 16,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      margin: 20,
      maxHeight: '80%',
      width: '90%',
      paddingBottom: 16,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      lineHeight: 30,
    },
    closeButton: {
      padding: 8,
    },
    modalBody: {
      padding: 20,
    },
    aboutSection: {
      marginBottom: 24,
    },
    aboutSectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
      lineHeight: 24,
    },
    aboutText: {
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 24,
      marginBottom: 12,
    },
    featureList: {
      marginLeft: 16,
    },
    featureItem: {
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 24,
      marginBottom: 8,
    },
    contactInfo: {
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 12,
      marginTop: 16,
    },
    contactTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
      lineHeight: 20,
    },
    contactText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    
  emailLink: {
    color: '#007AFF', // iOS blue
    textDecorationLine: 'underline',
  },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('Settings', 'ቅንብር')}
        </Text>
      </View>

      {/* Appearance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('Appearance', 'አሳያ')}
        </Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            {isDark ? (
              <Moon size={24} color={theme.colors.text} style={styles.settingIcon} />
            ) : (
              <Sun size={24} color={theme.colors.text} style={styles.settingIcon} />
            )}
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>
                {t('Dark Mode', 'ጨለማ ዘይቤ')}
              </Text>
              <Text style={styles.settingDescription}>
                {t('Toggle between light and dark themes', 'በብሩህ እና ጨለማ ዘይቤዎች መካከል ይቀያየሩ')}
              </Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={isDark ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Language */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('Language', 'ቋንቋ')}
        </Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Globe size={24} color={theme.colors.text} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>
                {t('App Language', 'የመተግበሪያ ቋንቋ')}
              </Text>
              <Text style={styles.settingDescription}>
                {t('Switch between English and Amharic', 'በእንግሊዝኛ እና አማርኛ መካከል ይቀያየሩ')}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
            <Text style={styles.languageButtonText}>
              {language === 'en' ? 'አማርኛ' : 'English'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('Data Management', 'የመረጃ አስተዳደር')}
        </Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Trash2 size={24} color={theme.colors.notification} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>
                {t('Clear All Data', 'ሁሉንም መረጃ ሰርዝ')}
              </Text>
              <Text style={styles.settingDescription}>
                {t('Delete all custom recipes and settings', 'ሁሉንም ምግቦች እና ቅንብሮች ሰርዝ')}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.clearDataButton} onPress={handleClearData}>
            <Text style={styles.clearDataButtonText}>
              {t('Clear', 'ሰርዝ')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('About', 'ስለ')}
        </Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Info size={24} color={theme.colors.text} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>
                {t('App Information', 'የመተግበሪያ መረጃ')}
              </Text>
              <Text style={styles.settingDescription}>
                {t('Learn more about this app', 'ስለዚህ መተግበሪያ የበለጠ ይወቁ')}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.aboutButton} onPress={() => setShowAboutModal(true)}>
            <Text style={styles.aboutButtonText}>
              {t('About', 'ስለ')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.appInfo}>
        <Text style={styles.appName}>
          {t('Ethiopian Cuisine', 'የኢትዮጵያ ምግብ')}
        </Text>
        <Text style={styles.appVersion}>
          {t('Version 1.0.0', 'ሥሪት 1.0.0')}
        </Text>
      </View>

      {/* About Modal */}
      <Modal
        visible={showAboutModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAboutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t('About Ethiopian Cuisine', 'ስለ የኢትዮጵያ ምግብ')}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setShowAboutModal(false)}
              >
                <X size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.aboutSection}>
                <Text style={styles.aboutSectionTitle}>
                  {t('Welcome to Ethiopian Cuisine', 'እንኳን ወደ የኢትዮጵያ ምግብ በሰላም መጡ')}
                </Text>
                <Text style={styles.aboutText}>
                  {t(
                    'Ethiopian Cuisine is your comprehensive guide to authentic Ethiopian cooking. Our app brings together traditional recipes, modern cooking techniques, and cultural insights to help you master the art of Ethiopian cuisine.',
                    'የኢትዮጵያ ምግብ መተግበሪያ ባህላዊ የኢትዮጵያ ምግብ አሰራርን ለመማር የሚያስችል ሙሉ መመሪያ ነው። ባህላዊ የምግብ አሰራሮች፣ ዘመናዊ የማብሰያ ዘዴዎች እና ባህላዊ እውቀቶችን በማጣመር የኢትዮጵያ ምግብ አሰራርን እንዲቆጣጠሩ ይረዳዎታል።'
                  )}
                </Text>
              </View>

              <View style={styles.aboutSection}>
                <Text style={styles.aboutSectionTitle}>
                  {t('Features', 'ባህሪያት')}
                </Text>
                <View style={styles.featureList}>
                  <Text style={styles.featureItem}>
                    • {t('Authentic traditional Ethiopian recipes', 'ባህላዊ የኢትዮጵያ የምግብ አሰራሮች')}
                  </Text>
                  <Text style={styles.featureItem}>
                    • {t('Step-by-step cooking instructions with timers', 'ደረጃ በደረጃ የማብሰያ መመሪያዎች ከሰዓት ጋር')}
                  </Text>
                  <Text style={styles.featureItem}>
                    • {t('Bilingual support (English & Amharic)', 'ባለሁለት ቋንቋ ድጋፍ (እንግሊዝኛ እና አማርኛ)')}
                  </Text>
                  <Text style={styles.featureItem}>
                    • {t('Add and customize your own recipes', 'የራስዎን የምግብ አሰራሮች ይጨምሩ እና ያስተካክሉ')}
                  </Text>
                  <Text style={styles.featureItem}>
                    • {t('Save favorite recipes for quick access', 'ተወዳጅ የምግብ አሰራሮችን ለፈጣን መዳረሻ ያስቀምጡ')}
                  </Text>
                  <Text style={styles.featureItem}>
                    • {t('Search and filter recipes by category', 'የምግብ አሰራሮችን በምድብ ይፈልጉ እና ያጣሩ')}
                  </Text>
                  <Text style={styles.featureItem}>
                    • {t('Dark and light theme support', 'ጨለማ እና ብሩህ ዘይቤ ድጋፍ')}
                  </Text>
                  <Text style={styles.featureItem}>
                    • {t('Photo support for your recipes', 'ለምግብ አሰራሮችዎ የፎቶ ድጋፍ')}
                  </Text>
                </View>
              </View>

              <View style={styles.aboutSection}>
                <Text style={styles.aboutSectionTitle}>
                  {t('Our Mission', 'የእኛ ተልእኮ')}
                </Text>
                <Text style={styles.aboutText}>
                  {t(
                    'We believe that food is a bridge between cultures and generations. Our mission is to preserve and share the rich culinary heritage of Ethiopia while making it accessible to cooks of all skill levels around the world.',
                    'ምግብ በባህሎች እና በትውልዶች መካከል ድልድይ እንደሆነ እናምናለን። የእኛ ተልእኮ የኢትዮጵያን ሀብታም የምግብ ባህል መጠበቅ እና ማካፈል ሲሆን በዓለም ዙሪያ ላሉ የተለያዩ ችሎታ ያላቸው ምግብ አብሳዮች ተደራሽ ማድረግ ነው።'
                  )}
                </Text>
              </View>

              <View style={styles.aboutSection}>
                <Text style={styles.aboutSectionTitle}>
                  {t('Cultural Heritage', 'ባህላዊ ውርስ')}
                </Text>
                <Text style={styles.aboutText}>
                  {t(
                    'Ethiopian cuisine is one of the most distinctive and flavorful in the world, with a history spanning thousands of years. From the aromatic spice blends like berbere to the communal dining experience with injera, every aspect of Ethiopian food tells a story of tradition, community, and celebration.',
                    'የኢትዮጵያ ምግብ በዓለም ላይ ካሉት በጣም ልዩ እና ጣዕም ያለው ሲሆን ለሺዎች ዓመታት የሚዘልቅ ታሪክ አለው። ከመዓዛ ቅመሞች እንደ በርበሬ ጀምሮ እስከ እንጀራ ጋር የሚደረግ የጋራ የምግብ ልምድ ድረስ፣ የኢትዮጵያ ምግብ እያንዳንዱ ገጽታ የባህል፣ የማህበረሰብ እና የበዓል ታሪክ ይነግራል።'
                  )}
                </Text>
              </View>

              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>
                  {t('Support & Feedback', 'ድጋፍ እና አስተያየት')}
                </Text>
                <Text style={styles.contactText}>
    {t(
      'We value your feedback and suggestions. If you have any questions, recipe requests, or ideas for improvement, please don\'t hesitate to reach out to us.',
      'የእርስዎን አስተያየት እና ሀሳቦች እንዋጋለን። ማንኛውም ጥያቄ፣ የምግብ አሰራር ጥያቄ ወይም የማሻሻያ ሀሳብ ካለዎት እባክዎን እኛን ለማግኘት አያመንቱ።'
    )}{' '}
    <Text
      style={styles.emailLink}
      onPress={() => Linking.openURL('mailto:layfokru@gmail.com')}
     
    >   {t('Send', 'ላክ')}
    </Text>
  </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}