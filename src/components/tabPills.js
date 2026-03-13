import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../themes/color';

const SwitchTabs = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.tabRow}>
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

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  tabPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: Colors.pillInactiveBg,
    marginRight: 12,
    width: 135,
    height: 42,
  },
  activeTab: {
    backgroundColor: Colors.primary,
    color: 'white',
  },
  tabText: {
    color: Colors.textPillInactive,
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  activeText: {
    color: Colors.textInverted,
    fontWeight: '700',
  },
});
export default SwitchTabs;
