import { StatusBar, Platform, StyleSheet } from 'react-native';

export const getStyles = theme =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
    },
    container: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
    userGreetings: {
      fontSize: 14,
      color: theme.textTertiary,
      fontWeight: '500',
    },
    taskCountContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    taskRow: {
      flexDirection: 'row',
      paddingVertical: 14,
      paddingHorizontal: 25,
      borderRadius: 50,
      marginBottom: 10,
    },
    taskHeaderRow: {
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      flexDirection: 'row',
    },
    taskTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textPrimary,
      flex: 1,
      marginRight: 15,
    },
    taskTime: {
      fontSize: 12,
      fontWeight: '400',
      color: theme.textSecondary,
      textAlign: 'right',
    },
    taskText: {
      fontWeight: '700',
      marginBottom: 10,
      fontSize: 20,
      color: theme.textPrimary,
      marginTop: 4,
      marginBottom: 15,
    },
    tabContainer: {
      marginBottom: 25,
    },
    pill: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 25,
      backgroundColor: theme.inactivePill,
      marginRight: 10,
      marginBottom: 15,
    },
    activePill: {
      backgroundColor: theme.primary,
      color: theme.white,
    },
    pillText: {
      color: theme.textPlaceholder,
      fontWeight: '600',
    },
    activePillText: {
      color: theme.white,
    },
    emptyTaskContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyTaskText: {
      fontWeight: 'bold',
      fontSize: 16,
      color: theme.textMuted,
      textAlign: 'center',
    },
    scrollContainer: {
      paddingBottom: 20,
    },
    taskContainer: {
      flex: 1,
      marginTop: 5,
      minHeight: '80%',
    },
  });
