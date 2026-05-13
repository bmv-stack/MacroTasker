import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { formatDate } from '../utils/formatDate';
import { formatTime } from '../utils/formatTime';
import { parseDate } from '../utils/parseDate';
import { getMinute } from '../utils/getMinutes';
import { useTheme } from '../contexts/ThemeContext';
import { getStyles } from '../screens/AllTasksScreen.styles';
import { useNavigation } from '@react-navigation/native';

const TaskCard = ({ task, onEdit, onDelete, onComplete, onPriority }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  now.setHours(0, 0, 0, 0);
  const getStatusColor = task => {
    if (task.completed) return theme.chartCompleted;

    const isEndDate = !!task.endDate;
    const endDate = isEndDate ? parseDate(task.endDate) : null;

    if (isEndDate) {
      if (endDate < now) return theme.chartOverdue;

      if (endDate.getTime() === now.getTime() && task.endTime) {
        const taskEndMinutes = getMinute(task.endTime);
        if (taskEndMinutes < currentMinutes) return theme.chartOverdue;
      }
    }
    return theme.chartOngoing;
  };
  const isEndDate = !!task.endDate;
  const endDate = isEndDate ? parseDate(task.endDate) : null;
  const isOverdue =
    !task.completed &&
    isEndDate &&
    (endDate < now ||
      (endDate.getTime() === now.getTime() &&
        task.endTime &&
        getMinute(task.endTime) < currentMinutes));
  const statusColor = getStatusColor(task, theme);

  return (
    <View
      key={task.id}
      style={[styles.taskCard, task.completed && { opacity: 0.7 }]}
    >
      <View style={styles.cardTopRow}>
        <TouchableOpacity
          activeOpacity={0.5}
          hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
          onPress={() => navigation.navigate('TaskDetail', { task })}
          style={{ flex: 1, minWidth: 100 }}
        >
          <Text
            style={[
              styles.taskTitle,
              task.completed && {
                textDecorationLine: 'line-through',
                color: theme.textMuted,
              },
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
        </TouchableOpacity>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.iconCircle, task.completed && styles.checkedCircle]}
            disabled={task.completed}
            onPress={onEdit}
          >
            <FeatherIcon
              name="edit-3"
              size={18}
              color={theme.editIcon}
            ></FeatherIcon>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconCircle, task.completed && styles.checkedCircle]}
            onPress={onDelete}
          >
            <Icon
              name="trash-outline"
              size={18}
              color={theme.deleteIcon}
            ></Icon>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.cardBottomRow}>
        <View style={styles.leftInfoGroup}>
          <Text style={styles.dateTimeText}>
            {formatDate(task.date)} | {formatTime(task.time)}
          </Text>
          <View>
            <Icon
              name="bookmark"
              size={20}
              color={statusColor}
              style={{ marginLeft: 8 }}
            ></Icon>
          </View>
        </View>
        <View style={styles.rightActionsGroup}>
          <TouchableOpacity
            style={styles.textPriorityBadge}
            onPress={onPriority}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            disabled={task.completed}
          >
            <Text style={styles.badgeText}>{task.priority || 'Normal'}</Text>
            <Icon
              name="chevron-down"
              size={12}
              color={theme.textBadge}
              style={{ marginLeft: 4 }}
            ></Icon>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.completeCheckCircle,
              task.completed && styles.checkCompleted,
            ]}
            onPress={onComplete}
          >
            <Icon
              name="checkmark-sharp"
              size={18}
              color={task.completed ? theme.white : theme.completeTaskIcon}
              opacity={0.5}
            ></Icon>
          </TouchableOpacity>
        </View>
      </View>
      {isOverdue && <View style={styles.overdueIndicator} />}
    </View>
  );
};
export default TaskCard;
