import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const SwitchTabs = ({ activeTab, onTabChange }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tabPill, activeTab === 'Focus' && styles.activeTab]}
        onPress={() => onTabChange('Focus')}
      >
        <Text
          style={[styles.tabText, activeTab === 'Focus' && styles.activeText]}
        >
          Today's Focus
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabPill, activeTab === 'Gmail' && styles.activeTab]}
        onPress={() => onTabChange('Gmail')}
      >
        <Text
          style={[styles.tabText, activeTab === 'Gmail' && styles.activeText]}
        >
          Gmail Tasks
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabPill, activeTab === 'All' && styles.activeTab]}
        onPress={() => onTabChange('All')}
      >
        <Text
          style={[styles.tabText, activeTab === 'All' && styles.activeText]}
        >
          All Tasks
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingVertical: 15,
    },
    tabPill: {
      paddingHorizontal: 22,
      paddingVertical: 10,
      alignItems: 'space-evenly',
      justifyContent: 'center',
      borderRadius: 22,
      backgroundColor: theme.pillInactiveBg,
      marginRight: 12,
      height: 42,
    },
    activeTab: {
      backgroundColor: theme.primary,
      color: theme.white,
    },
    tabText: {
      color: theme.textPillInactive,
      fontWeight: '600',
      fontSize: 13,
      textAlign: 'center',
      letterSpacing: -0.4,
    },
    activeText: {
      color: theme.textInverted,
      fontWeight: '700',
    },
  });
export default SwitchTabs;
