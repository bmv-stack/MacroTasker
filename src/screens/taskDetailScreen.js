import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../contexts/ThemeContext';
import React from 'react';
import { formatDate } from '../utils/formatDate';
import { formatTime } from '../utils/formatTime';
import { getStyles } from './TaskDetailScreen.styles';

const TaskDetailScreen = ({ navigation, route }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const styles = getStyles(theme);

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
          onPress={toggleTheme}
          hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
        >
          <Icon
            name={isDarkMode ? 'sunny' : 'moon'}
            size={24}
            color={theme.textPrimary}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        alwaysBounceVertical={false}
      >
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
            Assigned: {formatDate(task.date)} at {formatTime(task.time)}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="skull" size={20} color={theme.textMuted}></Icon>
          <Text style={styles.infoText}>
            Deadline: {task.endDate ? formatDate(task.endDate) : 'Not set'}{' '}
            {task.endTime ? `at ${formatTime(task.endTime)}` : ' '}
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
        <Icon name="pencil" size={24} color={theme.textInverted}></Icon>
      </TouchableOpacity>
    </View>
  );
};

export default TaskDetailScreen;
