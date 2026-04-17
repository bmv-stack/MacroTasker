import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { lightTheme, darkTheme } from '../../themes/color';

const DeleteModal = ({ visible, taskTitle, onCancel, onConfirm }) => {
  const isDarkMode = useSelector(state => state.tasks.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.deleteBox}>
          <Text style={styles.title}>Delete task '{taskTitle}' ?</Text>
          <Text style={styles.subTitle}>This action cannot be reverted.</Text>
          <View style={styles.modalButtonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    deleteBox: {
      backgroundColor: theme.surface,
      width: '80%',
      borderRadius: 24,
      padding: 24,
      alignItems: 'center',
      elevation: 10,
    },
    title: {
      color: theme.textPrimary,
      fontSize: 16,
      marginBottom: 8,
      textAlign: 'center',
    },
    subTitle: {
      color: theme.textMuted,
      fontSize: 14,
      marginBottom: 20,
      textAlign: 'center',
    },
    modalButtonRow: {
      flexDirection: 'row',
      width: '100%',
      gap: 12,
    },
    cancelBtn: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: theme.surface,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    cancelBtnText: {
      color: theme.primary,
      fontWeight: '600',
    },
    confirmBtn: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: theme.deleteIcon,
      alignItems: 'center',
    },
    confirmBtnText: {
      color: theme.white,
      fontWeight: '600',
    },
  });

export default DeleteModal;
