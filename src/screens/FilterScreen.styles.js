import { StyleSheet, StatusBar, Platform } from 'react-native';

export const getStyles = theme =>
  StyleSheet.create({
    drawerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.surface,
    },
    drawerContent: {
      flex: 1,
      backgroundColor: theme.surface,
      paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
    },
    drawerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    drawerHeaderText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.primary,
    },
    resetText: {
      color: theme.accent,
      fontWeight: 'bold',
    },
    drawerBody: {
      flex: 1,
      flexDirection: 'row',
    },
    drawerSideBar: {
      width: 100,
      backgroundColor: theme.surface,
      borderRightWidth: 1,
      borderRightColor: theme.borderLight,
    },
    tabSection: {
      flex: 1,
      paddingTop: 10,
    },
    sidebarTab: {
      paddingVertical: 20,
      paddingHorizontal: 15,
    },
    activeSidebarTab: {
      backgroundColor: theme.primary,
    },
    sidebarTabText: {
      color: theme.textMuted,
      fontWeight: '600',
    },
    activeSidebarTabText: {
      color: theme.textInverted,
    },
    drawerTabContent: {
      flex: 1,
      padding: 20,
    },
    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    checkboxLabel: {
      marginLeft: 15,
      fontSize: 16,
      color: theme.primary,
    },
    dateLabel: {
      color: theme.textMuted,
      fontSize: 14,
      marginBottom: 10,
    },
    dateInputFake: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
      paddingVertical: 8,
    },
    dateInputText: {
      marginLeft: 10,
      fontSize: 16,
      color: theme.primary,
    },
    applyBtn: {
      backgroundColor: theme.primary,
      paddingVertical: 20,
      alignItems: 'center',
    },
    applyBtnText: {
      fontWeight: 'bold',
      fontSize: 16,
      color: theme.textInverted,
    },
    activeDot: {
      backgroundColor: theme.activeDotFilterScreen,
      width: 6.5,
      height: 6.5,
      borderRadius: 4,
      marginRight: 8,
      marginLeft: 8,
    },
  });
