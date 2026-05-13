import { StatusBar, Platform, StyleSheet } from 'react-native';

export const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight,
    },
    scrollContent: { padding: 20 },
    badge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 8,
      marginBottom: 15,
    },
    badgeText: { fontWeight: 'bold', color: theme.textBadge, fontSize: 12 },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: 20,
    },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    infoText: { marginLeft: 10, color: theme.textPrimary, fontSize: 16 },
    divider: {
      height: 1,
      backgroundColor: theme.borderLight,
      marginVertical: 20,
    },
    sectionLabel: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.textMuted,
      marginBottom: 10,
      textTransform: 'uppercase',
    },
    notesText: { fontSize: 16, color: theme.textPrimary, lineHeight: 24 },
    editBtn: {
      position: 'absolute',
      bottom: 30,
      right: 20,
      backgroundColor: theme.textPrimary,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
    backArrow: {
      color: theme.textPrimary,
      fontSize: 30,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
  });
