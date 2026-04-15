const commonColors = {
  high: '#FF3B30',
  normal: '#007AFF',
  low: '#34C759',
  brandBlue: '#1E40AF',
  editIcon: '#34C759',
  deleteIcon: '#FF3B30',
  white: '#FFF',
  transparent: 'transparent',
};
export const lightTheme = {
  ...commonColors,
  background: '#F8F9FA',
  surface: '#FFFFFF',
  textPrimary: '#000000',
  textSecondary: '#333333',
  textMuted: '#8E8E93',
  blackSecondary: '#1C1C1E',
  taskDefaultBg: '#F2F2F7',
  pillInactiveBg: '#f2eeeef3',
  borderLight: '#E5E5EA',
  activeTabBar: '#000',
  inactiveTabBAr: '#8E8E93',
  badgeBackground: '#f9f3e1',
  textBadge: '#b9a665',
};
export const darkTheme = {
  ...commonColors,
  background: '#121212', // Standard dark background
  surface: '#1E1E1E', // Slightly lighter for cards
  textPrimary: '#FFFFFF',
  textSecondary: '#E0E0E0',
  textMuted: '#A0A0A0',
  blackSecondary: '#FFFFFF', // Inverted for Dark Mode
  taskDefaultBg: '#2C2C2E',
  pillInactiveBg: '#2C2C2E',
  borderLight: '#38383A',
  activeTabBar: '#FFFFFF',
  inactiveTabBAr: '#8E8E93',
  badgeBackground: '#2C2C1E', // Darker gold tint
  textBadge: '#FFD700',
};
