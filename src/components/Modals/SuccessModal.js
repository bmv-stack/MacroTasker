import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { lightTheme, darkTheme } from '../../themes/color';
import Icon from 'react-native-vector-icons/Ionicons';

const SuccessModal = ({ visible, message, onClose }) => {
  const isDarkMode = useSelector(state => state.tasks.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalContent}
          activeOpacity={1}
          onPress={onClose}
        >
          <Icon
            name="checkmark-done-circle"
            size={60}
            color={theme.chartCompleted}
            style={styles.modalIcon}
          />
          <Text style={styles.modalText}>{message}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.blackPure,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0.9,
    },
    modalContent: {
      backgroundColor: theme.surface,
      padding: 30,
      borderRadius: 35,
      alignItems: 'center',
      justifyContent: 'center',
      width: '80%',
    },
    modalText: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      color: theme.textPrimary,
    },
    modalIcon: {
      marginBottom: 20,
    },
  });

export default SuccessModal;
