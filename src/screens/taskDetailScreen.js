import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { lightTheme, darkTheme } from '../themes/color';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/slices/taskSlice';
import React from 'react';

const formatDate = dateString => {
  if (!dateString) return '';
  if (dateString.includes('/')) {
    return dateString; // Already DD/MM/YYYY
  }
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const TaskDetailScreen = ({ route }) => {
  const isDarkMode = useSelector(state => state.tasks.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { task: initialTask } = route.params;
  const task = useSelector(state =>
    state.tasks.items.find(t => t.id === initialTask.id),
  );

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={{ color: theme.textPrimary }}>Task not found</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Detail</Text>
        <TouchableOpacity
          onPress={() => dispatch(toggleTheme())}
          hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
        >
          <Icon
            name={isDarkMode ? 'sunny' : 'moon'}
            size={24}
            color={theme.textPrimary}
          />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View
          style={[styles.badge, { backgroundColor: theme.badgeBackground }]}
        >
          <Text style={styles.badgeText}>{task.priority} Priority</Text>
        </View>
        <Text style={styles.title}>{task.title}</Text>
        <View style={styles.infoRow}>
          <Icon
            name="calendar-outline"
            size={20}
            color={theme.textMuted}
          ></Icon>
          <Text style={styles.infoText}>
            Created At: {formatDate(task.date)} at {task.time}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="skull" size={20} color={theme.textMuted}></Icon>
          <Text style={styles.infoText}>
            Ending At: {task.endDate || 'Not set'} {task.endTime || ''}
          </Text>
        </View>
        <View style={styles.divider}></View>
        <Text style={styles.sectionLabel}>Notes</Text>
        <Text style={styles.notesText}>
          {task.notes || 'No notes for this task.'}
        </Text>
      </ScrollView>
      <TouchableOpacity
        style={styles.editBtn}
        onPress={() =>
          navigation.navigate('CreateTask', { existingTask: task })
        }
      >
        <Icon name="pencil" size={24} color={theme.white}></Icon>
      </TouchableOpacity>
    </View>
  );
};

export default TaskDetailScreen;

const getStyles = theme =>
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
      backgroundColor: theme.blackSecondary,
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
