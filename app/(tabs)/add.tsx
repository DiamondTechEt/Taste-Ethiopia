import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Image, Modal } from 'react-native';
import { Plus, X, Camera, Image as ImageIcon, Upload } from 'lucide-react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { useRecipes } from '@/hooks/useRecipes';
import { Recipe, Ingredient, RecipeStep } from '@/types';

export default function AddRecipeScreen() {
  const [title, setTitle] = useState('');
  const [titleAmharic, setTitleAmharic] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionAmharic, setDescriptionAmharic] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [category, setCategory] = useState<'vegetarian' | 'meat' | 'fasting' | 'breakfast' | 'snack' | 'drink'>('vegetarian');
  const [region, setRegion] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<RecipeStep[]>([]);
  const [tips, setTips] = useState('');
  const [tipsAmharic, setTipsAmharic] = useState('');
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<CameraType>('back');
  const [cameraRef, setCameraRef] = useState<any>(null);

  const { theme } = useTheme();
  const { t } = useLanguage();
  const { addRecipe } = useRecipes();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const categoryOptions: { value: 'vegetarian' | 'meat' | 'fasting' | 'breakfast' | 'snack' | 'drink'; label: string; labelAmharic: string }[] = [
    { value: 'vegetarian', label: 'Vegetarian', labelAmharic: 'የእጽዋት' },
    { value: 'meat', label: 'Meat', labelAmharic: 'ሥጋ' },
    { value: 'fasting', label: 'Fasting', labelAmharic: 'ጾም' },
    { value: 'breakfast', label: 'Breakfast', labelAmharic: 'ቁርስ' },
    { value: 'snack', label: 'Snack', labelAmharic: 'መክሰስ' },
    { value: 'drink', label: 'Drink', labelAmharic: 'መጠጥ' },
  ];

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: '',
      nameAmharic: '',
      amount: '',
      unit: '',
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addStep = () => {
    const newStep: RecipeStep = {
      id: Date.now().toString(),
      stepNumber: steps.length + 1,
      instruction: '',
      instructionAmharic: '',
      timer: 0,
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (index: number, field: keyof RecipeStep, value: string | number) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  };

  const removeStep = (index: number) => {
    const updated = steps.filter((_, i) => i !== index);
    // Renumber steps
    updated.forEach((step, i) => {
      step.stepNumber = i + 1;
    });
    setSteps(updated);
  };

  const handleImagePicker = () => {
    setShowImagePicker(true);
  };

  const handleTakePhoto = async () => {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert(
          t('Permission Required', 'ፈቃድ ያስፈልጋል'),
          t('Camera permission is required to take photos', 'ፎቶ ለማንሳት የካሜራ ፈቃድ ያስፈልጋል')
        );
        return;
      }
    }
    setShowImagePicker(false);
    setShowCamera(true);
  };

  const handlePickFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert(
        t('Permission Required', 'ፈቃድ ያስፈልጋል'),
        t('Gallery permission is required to select photos', 'ፎቶ ለመምረጥ የጋለሪ ፈቃድ ያስፈልጋል')
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setRecipeImage(result.assets[0].uri);
    }
    setShowImagePicker(false);
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        setRecipeImage(photo.uri);
        setShowCamera(false);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert(
          t('Error', 'ስህተት'),
          t('Failed to take picture', 'ፎቶ ማንሳት አልተቻለም')
        );
      }
    }
  };

  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert(t('Error', 'ስህተት'), t('Please enter a recipe title', 'የምግቡን ስም ያስገቡ'));
      return false;
    }
    if (!description.trim()) {
      Alert.alert(t('Error', 'ስህተት'), t('Please enter a description', 'መግለጫ ያስገቡ'));
      return false;
    }
    if (!cookTime || isNaN(Number(cookTime))) {
      Alert.alert(t('Error', 'ስህተት'), t('Please enter a valid cook time', 'ትክክለኛ የማብሰያ ጊዜ ያስገቡ'));
      return false;
    }
    if (!servings || isNaN(Number(servings))) {
      Alert.alert(t('Error', 'ስህተት'), t('Please enter a valid number of servings', 'ትክክለኛ የሚያገለግል ብዛት ያስገቡ'));
      return false;
    }
    if (ingredients.length === 0) {
      Alert.alert(t('Error', 'ስህተት'), t('Please add at least one ingredient', 'ቢያንስ አንድ ንጥረ ነገር ያስገቡ'));
      return false;
    }
    if (steps.length === 0) {
      Alert.alert(t('Error', 'ስህተት'), t('Please add at least one cooking step', 'ቢያንስ አንድ የማብሰያ ደረጃ ያስገቡ'));
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const newRecipe: Recipe = {
      id: Date.now().toString(),
      title,
      titleAmharic,
      description,
      descriptionAmharic,
      image: recipeImage || undefined,
      cookTime: Number(cookTime),
      servings: Number(servings),
      difficulty,
      category,
      isFavorite: false,
      isTraditional: false,
      region: region || 'Custom',
      ingredients,
      steps,
      tips,
      tipsAmharic,
    };

    try {
      await addRecipe(newRecipe);
      Alert.alert(
        t('Success', 'ተሳክቷል'),
        t('Recipe added successfully!', 'ምግቡ በተሳካ ሁኔታ ተጨምሯል!'),
        [{ text: t('OK', 'እሺ'), onPress: resetForm }]
      );
    } catch (error) {
      Alert.alert(t('Error', 'ስህተት'), t('Failed to save recipe', 'ምግቡን ማስቀመጥ አልተቻለም'));
    }
  };

  const resetForm = () => {
    setTitle('');
    setTitleAmharic('');
    setDescription('');
    setDescriptionAmharic('');
    setCookTime('');
    setServings('');
    setDifficulty('Easy');
    setCategory('vegetarian');
    setRegion('');
    setIngredients([]);
    setSteps([]);
    setTips('');
    setTipsAmharic('');
    setRecipeImage(null);
  };

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
      lineHeight: 38,
    },
    content: {
      paddingHorizontal: 16,
    },
    section: {
      marginBottom: 28,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 16,
      lineHeight: 24,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      lineHeight: 22,
    },
    multilineInput: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    flex1: {
      flex: 1,
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 16,
    },
    categoryChip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    selectedCategoryChip: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    categoryChipText: {
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 18,
    },
    selectedCategoryChipText: {
      color: 'white',
      fontWeight: '600',
    },
    imageSection: {
      marginBottom: 28,
    },
    imageContainer: {
      height: 200,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      overflow: 'hidden',
    },
    recipeImage: {
      width: '100%',
      height: '100%',
    },
    imagePlaceholder: {
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    imagePlaceholderText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginTop: 12,
      textAlign: 'center',
      lineHeight: 22,
    },
    imageButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    imageButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
      lineHeight: 20,
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    addButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
      lineHeight: 20,
    },
    ingredientRow: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    ingredientHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    ingredientTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      lineHeight: 20,
    },
    removeButton: {
      padding: 4,
    },
    stepRow: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    stepHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    stepTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      lineHeight: 20,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 16,
      padding: 18,
      margin: 16,
      alignItems: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    saveButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 22,
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
      padding: 24,
      margin: 20,
      width: '80%',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 26,
    },
    modalButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    modalButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
      lineHeight: 20,
    },
    cancelButton: {
      backgroundColor: theme.colors.textSecondary,
    },
    camera: {
      flex: 1,
    },
    cameraContainer: {
      flex: 1,
      backgroundColor: 'black',
    },
    cameraControls: {
      position: 'absolute',
      bottom: 50,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    cameraButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
    },
    flipButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('Add New Recipe', 'አዲስ ምግብ ጨምር')}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recipe Image */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>
            {t('Recipe Photo', 'የምግቡ ፎቶ')}
          </Text>
          
          <TouchableOpacity style={styles.imageContainer} onPress={handleImagePicker}>
            {recipeImage ? (
              <Image source={{ uri: recipeImage }} style={styles.recipeImage} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <ImageIcon size={48} color={theme.colors.textSecondary} />
                <Text style={styles.imagePlaceholderText}>
                  {t('Tap to add a photo of your recipe', 'የምግቡን ፎቶ ለመጨመር ይንኩ')}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('Basic Information', 'መሰረታዊ መረጃ')}
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder={t('Recipe title (English)', 'የምግቡ ስም (እንግሊዝኛ)')}
            placeholderTextColor={theme.colors.textSecondary}
            value={title}
            onChangeText={setTitle}
          />
          
          <TextInput
            style={styles.input}
            placeholder={t('Recipe title (Amharic)', 'የምግቡ ስም (አማርኛ)')}
            placeholderTextColor={theme.colors.textSecondary}
            value={titleAmharic}
            onChangeText={setTitleAmharic}
          />
          
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder={t('Description (English)', 'መግለጫ (እንግሊዝኛ)')}
            placeholderTextColor={theme.colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
          />
          
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder={t('Description (Amharic)', 'መግለጫ (አማርኛ)')}
            placeholderTextColor={theme.colors.textSecondary}
            value={descriptionAmharic}
            onChangeText={setDescriptionAmharic}
            multiline
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.flex1]}
              placeholder={t('Cook time (minutes)', 'የማብሰያ ጊዜ (ደቂቃ)')}
              placeholderTextColor={theme.colors.textSecondary}
              value={cookTime}
              onChangeText={setCookTime}
              keyboardType="numeric"
            />
            
            <TextInput
              style={[styles.input, styles.flex1]}
              placeholder={t('Servings', 'የሚያገለግል ብዛት')}
              placeholderTextColor={theme.colors.textSecondary}
              value={servings}
              onChangeText={setServings}
              keyboardType="numeric"
            />
          </View>

          {/* Category Selection */}
          <Text style={styles.sectionTitle}>
            {t('Category', 'ምድብ')}
          </Text>
          <View style={styles.categoryGrid}>
            {categoryOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.categoryChip,
                  category === option.value && styles.selectedCategoryChip
                ]}
                onPress={() => setCategory(option.value)}
              >
                <Text style={[
                  styles.categoryChipText,
                  category === option.value && styles.selectedCategoryChipText
                ]}>
                  {t(option.label, option.labelAmharic)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TextInput
            style={styles.input}
            placeholder={t('Region/Origin', 'ክልል/ምንጭ')}
            placeholderTextColor={theme.colors.textSecondary}
            value={region}
            onChangeText={setRegion}
          />
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('Ingredients', 'ንጥረ ነገሮች')}
          </Text>
          
          {ingredients.map((ingredient, index) => (
            <View key={ingredient.id} style={styles.ingredientRow}>
              <View style={styles.ingredientHeader}>
                <Text style={styles.ingredientTitle}>
                  {t('Ingredient', 'ንጥረ ነገር')} {index + 1}
                </Text>
                <TouchableOpacity 
                  style={styles.removeButton} 
                  onPress={() => removeIngredient(index)}
                >
                  <X size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <TextInput
                style={styles.input}
                placeholder={t('Ingredient name (English)', 'ንጥረ ነገር ስም (እንግሊዝኛ)')}
                placeholderTextColor={theme.colors.textSecondary}
                value={ingredient.name}
                onChangeText={(value) => updateIngredient(index, 'name', value)}
              />
              
              <TextInput
                style={styles.input}
                placeholder={t('Ingredient name (Amharic)', 'ንጥረ ነገር ስም (አማርኛ)')}
                placeholderTextColor={theme.colors.textSecondary}
                value={ingredient.nameAmharic}
                onChangeText={(value) => updateIngredient(index, 'nameAmharic', value)}
              />
              
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.flex1]}
                  placeholder={t('Amount', 'መጠን')}
                  placeholderTextColor={theme.colors.textSecondary}
                  value={ingredient.amount}
                  onChangeText={(value) => updateIngredient(index, 'amount', value)}
                />
                
                <TextInput
                  style={[styles.input, styles.flex1]}
                  placeholder={t('Unit', 'መለኪያ')}
                  placeholderTextColor={theme.colors.textSecondary}
                  value={ingredient.unit}
                  onChangeText={(value) => updateIngredient(index, 'unit', value)}
                />
              </View>
            </View>
          ))}
          
          <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
            <Plus size={20} color="white" />
            <Text style={styles.addButtonText}>
              {t('Add Ingredient', 'ንጥረ ነገር ጨምር')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('Cooking Steps', 'የማብሰያ ደረጃዎች')}
          </Text>
          
          {steps.map((step, index) => (
            <View key={step.id} style={styles.stepRow}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepTitle}>
                  {t('Step', 'ደረጃ')} {step.stepNumber}
                </Text>
                <TouchableOpacity 
                  style={styles.removeButton} 
                  onPress={() => removeStep(index)}
                >
                  <X size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder={t('Instruction (English)', 'መመሪያ (እንግሊዝኛ)')}
                placeholderTextColor={theme.colors.textSecondary}
                value={step.instruction}
                onChangeText={(value) => updateStep(index, 'instruction', value)}
                multiline
              />
              
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder={t('Instruction (Amharic)', 'መመሪያ (አማርኛ)')}
                placeholderTextColor={theme.colors.textSecondary}
                value={step.instructionAmharic}
                onChangeText={(value) => updateStep(index, 'instructionAmharic', value)}
                multiline
              />
              
              <TextInput
                style={styles.input}
                placeholder={t('Timer (seconds, optional)', 'ሰዓት (ሰከንድ፣ አማራጭ)')}
                placeholderTextColor={theme.colors.textSecondary}
                value={step.timer?.toString() || ''}
                onChangeText={(value) => updateStep(index, 'timer', Number(value) || 0)}
                keyboardType="numeric"
              />
            </View>
          ))}
          
          <TouchableOpacity style={styles.addButton} onPress={addStep}>
            <Plus size={20} color="white" />
            <Text style={styles.addButtonText}>
              {t('Add Step', 'ደረጃ ጨምር')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('Tips (Optional)', 'ምክሮች (አማራጭ)')}
          </Text>
          
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder={t('Cooking tips (English)', 'የማብሰያ ምክሮች (እንግሊዝኛ)')}
            placeholderTextColor={theme.colors.textSecondary}
            value={tips}
            onChangeText={setTips}
            multiline
          />
          
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder={t('Cooking tips (Amharic)', 'የማብሰያ ምክሮች (አማርኛ)')}
            placeholderTextColor={theme.colors.textSecondary}
            value={tipsAmharic}
            onChangeText={setTipsAmharic}
            multiline
          />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {t('Save Recipe', 'ምግቡን አስቀምጥ')}
        </Text>
      </TouchableOpacity>

      {/* Image Picker Modal */}
      <Modal
        visible={showImagePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImagePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t('Add Recipe Photo', 'የምግቡ ፎቶ ጨምር')}
            </Text>
            
            <TouchableOpacity style={styles.modalButton} onPress={handleTakePhoto}>
              <Camera size={20} color="white" />
              <Text style={styles.modalButtonText}>
                {t('Take Photo', 'ፎቶ አንሳ')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalButton} onPress={handlePickFromGallery}>
              <Upload size={20} color="white" />
              <Text style={styles.modalButtonText}>
                {t('Choose from Gallery', 'ከጋለሪ ምረጥ')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={() => setShowImagePicker(false)}
            >
              <X size={20} color="white" />
              <Text style={styles.modalButtonText}>
                {t('Cancel', 'ሰርዝ')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Camera Modal */}
      <Modal
        visible={showCamera}
        animationType="slide"
        onRequestClose={() => setShowCamera(false)}
      >
        <View style={styles.cameraContainer}>
          <CameraView 
            style={styles.camera} 
            facing={cameraFacing}
            ref={setCameraRef}
          >
            <View style={styles.cameraControls}>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setShowCamera(false)}
              >
                <X size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
                <Camera size={32} color="black" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.flipButton} 
                onPress={() => setCameraFacing(current => current === 'back' ? 'front' : 'back')}
              >
                <Camera size={24} color="white" />
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}