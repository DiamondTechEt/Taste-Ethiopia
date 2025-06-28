export const EthiopianColors = {
  // Ethiopian Flag Colors
  green: '#228B22',
  yellow: '#FFD700',
  red: '#DC143C',
  
  // Extended Palette
  forestGreen: '#006400',
  limeGreen: '#32CD32',
  gold: '#FFD700',
  amber: '#FFBF00',
  orange: '#FF8C00',
  crimson: '#DC143C',
  darkRed: '#8B0000',
  
  // Neutral Ethiopian Earth Tones
  sand: '#F4E4B8',
  clay: '#B87333',
  coffee: '#6F4E37',
  spice: '#A0522D',
  
  // Modern Grays
  lightGray: '#F5F5F5',
  gray: '#9E9E9E',
  darkGray: '#424242',
  charcoal: '#2E2E2E',
};

export const lightTheme = {
  isDark: false,
  colors: {
    primary: EthiopianColors.green,
    secondary: EthiopianColors.yellow,
    accent: EthiopianColors.orange,
    background: '#FFFFFF',
    surface: '#FAFAFA',
    text: '#1A1A1A',
    textSecondary: '#666666',
    border: '#E0E0E0',
    card: '#FFFFFF',
    notification: EthiopianColors.crimson,
  },
};

export const darkTheme = {
  isDark: true,
  colors: {
    primary: EthiopianColors.limeGreen,
    secondary: EthiopianColors.gold,
    accent: EthiopianColors.amber,
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    border: '#333333',
    card: '#2D2D2D',
    notification: EthiopianColors.red,
  },
};