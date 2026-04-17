import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { lightTheme, darkTheme } from '../../themes/color';

const PriorityModal = ({ visible, onClose, onSelect }) => {
  const isDarkMode = useSelector(state => state.tasks.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme);

  const priorityStyles = {
    High: { iconColor: theme.high },
    Normal: { iconColor: theme.normal },
    Low: { iconColor: theme.low },
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.priorityMenu}>
          <Text style={styles.menuTitle}>Set Priority</Text>
          {['High', 'Normal', 'Low'].map(p => (
            <TouchableOpacity
              key={p}
              style={styles.menuItem}
              onPress={() => onSelect(p)}
            >
              <Text
                style={[
                  styles.menuItemText,
                  { color: priorityStyles[p].iconColor },
                ]}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.shadow,
      justifyContent: 'center',
      alignItems: 'center',
    },
    priorityMenu: {
      backgroundColor: theme.white,
      width: '70%',
      borderRadius: 24,
      padding: 16,
      elevation: 10,
    },
    menuTitle: {
      textAlign: 'center',
      fontWeight: 'bold',
      color: theme.textMuted,
      marginBottom: 15,
      fontSize: 15,
    },
    menuItem: {
      paddingVertical: 15,
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: theme.taskDefaultBg,
    },
    menuItemText: {
      fontSize: 17,
      fontWeight: '600',
    },
  });

export default PriorityModal;
