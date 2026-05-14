import { StyleSheet, StatusBar, Platform } from 'react-native';

export const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight,
    },
    scrollView: {
      paddingHorizontal: 2,
      paddingBottom: 40,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
    arrowContainer: {
      position: 'absolute',
      right: 20,
    },
    backArrow: {
      color: theme.textPrimary,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.primary,
    },
    button: {
      alignItems: 'center',
      marginTop: 30,
    },
    submitButton: {
      flexDirection: 'row',
      paddingVertical: 16,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      width: '70%',
      height: 58,
    },
    activeButton: {
      backgroundColor: theme.buttonActive,
    },
    disableButton: {
      backgroundColor: theme.buttonDisabled,
    },
    submitText: {
      color: theme.textInverted,
      fontWeight: 'bold',
      fontSize: 16,
    },
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
    priorityRow: {
      flexDirection: 'row',
      marginVertical: 10,
      gap: 10,
    },
    priorityPill: {
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.borderLight,
      backgroundColor: theme.surface,
    },
    activePriorityPill: {
      backgroundColor: theme.buttonActive,
      borderColor: theme.borderLight,
    },
    priorityPillText: {
      color: theme.textMuted,
      fontWeight: '600',
    },
    activePriorityText: {
      color: theme.textInverted,
    },
    label: {
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 15,
      color: theme.textLabel,
    },
    errorText: {
      color: theme.textError,
      fontSize: 12,
      marginBottom: 10,
      marginTop: -5,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'relative',
    },
    clearIcon: {
      position: 'absolute',
      right: 10,
      top: 35,
      padding: 10,
      zIndex: 10,
    },
  });
