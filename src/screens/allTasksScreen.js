import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  FlatList,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteTask,
  completeTask,
  addNewTask,
} from '../redux/slices/taskSlice';
import AppBar from '../components/appBar';
import SwitchTabs from '../components/tabPills';
import { PieChart } from 'react-native-gifted-charts';
import { parseDate } from './createTaskScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Colors } from '../themes/color';

const generateDateList = () => {
  const dates = [];
  for (let i = -30; i < 355; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push({
      fullDate: d.toLocaleDateString('en-GB'),
      dayNumber: d.getDate().toString(),
      dayName: d
        .toLocaleDateString('en-GB', { month: 'short', weekday: 'short' })
        .toUpperCase(),
    });
  }
  return dates;
};

const AllTasksScreen = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks.items);

  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('All');
  const [chartKey, setChartKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString('en-GB'),
  );
  const [priorityModal, setPriorityModal] = useState({
    visible: false,
    taskId: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    taskId: null,
    taskTitle: '',
  });
  const [selectedData, setSelectedData] = useState({
    label: 'Total',
    value: tasks.length,
    color: Colors.blackSecondary,
  });

  const priorityStyles = {
    High: { iconColor: Colors.high },
    Normal: { iconColor: Colors.normal },
    Low: { iconColor: Colors.low },
  };

  const dateList = useMemo(() => generateDateList(), []);
  const goToday = () => {
    setSelectedDate(new Date().toLocaleDateString('en-GB'));
  }
  const filteredTasks = useMemo(() => {
    const todayTasks = tasks.filter(task => task.date === selectedDate);

    return [...todayTasks].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });
  }, [tasks, selectedDate]);

  useEffect(() => {
    if (selectedData.label === 'Total') {
      setSelectedData(prev =>
        prev.value !== filteredTasks.length
          ? { ...prev, value: filteredTasks.length }
          : prev,
      );
    }
  }, [filteredTasks.length, selectedData.label]);

  const resetTotal = () => {
    setSelectedData({
      label: 'Total',
      value: filteredTasks.length,
      color: Colors.blackSecondary,
    });
    setChartKey(prev => prev + 1);
  };

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const chartData = useMemo(() => {
    if (filteredTasks.length === 0) return [];

    const completedCount = filteredTasks.filter(t => t.completed).length;
    const pendingCount = filteredTasks.filter(t => {
      const taskDate = parseDate(t.date);
      return !t.completed && taskDate > now;
    }).length;
    const overdueCount = filteredTasks.filter(t => {
      if (t.completed || !t.endDate) return false;
      const taskDate = parseDate(t.endDate);
      return taskDate && taskDate < now;
    }).length;
    const isFuture = parseDate(selectedDate) > now;

    if (isFuture) {
      return [{
        value: pendingCount,
        color: Colors.chartPending,
        label: 'Pending Tasks',
        onPress: () =>
          setSelectedData({
            label: 'Pending',
            value: pendingCount,
            color: Colors.chartPending,
          }),
      }];
    }
    const ongoingCount =
      filteredTasks.length - completedCount - overdueCount - pendingCount;

    return [
      {
        value: ongoingCount,
        color: Colors.chartOngoing,
        label: 'Ongoing Tasks',
        onPress: () =>
          setSelectedData({
            label: 'Ongoing',
            value: ongoingCount,
            color: Colors.chartOngoing,
          }),
      },
      {
        value: overdueCount,
        color: Colors.chartOverdue,
        label: 'Overdue Tasks',
        onPress: () =>
          setSelectedData({
            label: 'Overdue',
            value: overdueCount,
            color: Colors.chartOverdue,
          }),
      },
      {
        value: completedCount,
        color: Colors.chartCompleted,
        label: 'Completed Tasks',
        onPress: () =>
          setSelectedData({
            label: 'Completed',
            value: completedCount,
            color: Colors.chartCompleted,
          }),
      },
    ]
  }, [filteredTasks]);

  const handlePriorityChange = (taskId, newPriority) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (taskToUpdate) {
      dispatch(addNewTask({ ...taskToUpdate, priority: newPriority }));
    }
    setPriorityModal({ visible: false, taskId: null });
  };
  const formatTime = timeString => {
    if (!timeString || !timeString.includes(':')) return timeString;

    const [hours24, m] = timeString.split(':');
    let hours = parseInt(hours24, 10);
    const meridiem = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, '0')}:${m} ${meridiem}`;
  };

  return (
    <View style={styles.container}>
      <AppBar
        title="MACROTASKER"
        onIconPress={() => navigation.navigate('CreateTask')}
      />
      <View style={styles.content}>
        <SwitchTabs
          activeTab={activeTab}
          onTabChange={value => {
            if (value === 'Focus') {
              navigation.replace('Main');
            } else {
              setActiveTab(value);
            }
          }}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All tasks</Text>
          {selectedDate !== goToday && (
            <TouchableOpacity onPress={goToday}>
              <Text style={{ color: Colors.accent, fontWeight: 'bold', fontSize: 14, marginBottom: -4.7 }}>Today</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.topSection}>
          <FlatList
            horizontal
            data={dateList}
            keyExtractor={item => item.fullDate}
            initialScrollIndex={30}
            showsHorizontalScrollIndicator={false}
            getItemLayout={(data, index) => ({
              length: 55,
              offset: 55 * index,
              index,
            })}
            renderItem={({ item }) => {
              const isSelected = item.fullDate === selectedDate;
              const [monthName, dayName] = item.dayName.split(' ');
              return (
                <TouchableOpacity
                  onPress={() => setSelectedDate(item.fullDate)}
                  style={[styles.dateCard, isSelected && styles.activeDateCard]}
                >
                  <Text
                    style={[
                      styles.dateNumber,
                      { color: isSelected ? Colors.white : Colors.blackSecondary }
                    ]}
                  >
                    {item.dayNumber}
                  </Text>
                  <Text
                    style={[
                      styles.dateMonthName,
                      isSelected && styles.activeDateText,
                    ]}
                  >
                    {monthName}
                  </Text>
                  <Text
                    style={[
                      styles.dateDay,
                      isSelected && styles.activeDateText,
                    ]}
                  >
                    {dayName}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
          {filteredTasks.length > 0 && (
            <View style={styles.chartContainer}>
              <TouchableOpacity activeOpacity={1} onPress={resetTotal}>
                <PieChart
                  key={chartKey}
                  donut
                  focusOnPress
                  sectionAutoFocus
                  shadow
                  radius={70}
                  innerRadius={55}
                  data={chartData}
                  centerLabelComponent={() => (
                    <View style={{ alignItems: 'center' }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 22,
                          color: selectedData.color,
                        }}
                      >
                        {selectedData.value}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: Colors.textMuted,
                          fontWeight: '600',
                        }}
                      >
                        {selectedData.label}
                      </Text>
                    </View>
                  )}
                />
              </TouchableOpacity>

              <View style={styles.dotContainer}>
                {chartData.map((item, index) => (
                  <View key={index} style={styles.chartItem}>
                    <View
                      style={[styles.dot, { backgroundColor: item.color }]}
                    />
                    <Text style={styles.dotText}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <FlatList
          data={filteredTasks}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginBottom: 20 }}
          ListEmptyComponent={() => (
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={{ color: Colors.textMuted }}>
                No tasks for this day.
              </Text>
            </View>
          )}
          renderItem={({ item: task }) => {
            const isEndDate = !!task.endDate;
            const taskDate = isEndDate ? parseDate(task.endDate) : null;
            const isOverdue = !task.completed && isEndDate && taskDate < now;
            const stylePriority =
              priorityStyles[task.priority] || priorityStyles.Normal;

            return (
              <View
                key={task.id}
                style={[styles.taskCard, task.completed && { opacity: 0.7 }]}
              >
                <View style={styles.cardTopRow}>
                  <Text
                    style={[
                      styles.taskTitle,
                      task.completed && {
                        textDecorationLine: 'line-through',
                        color: Colors.textMuted,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {task.title}
                  </Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[
                        styles.iconCircle,
                        task.completed && styles.checkedCircle,
                      ]}
                      disabled={task.completed}
                      onPress={() =>
                        navigation.navigate('CreateTask', {
                          existingTask: task,
                        })
                      }
                    >
                      <FeatherIcon
                        name="edit-3"
                        size={18}
                        color={Colors.editIcon}
                      ></FeatherIcon>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.iconCircle,
                        task.completed && styles.checkedCircle,
                      ]}
                      onPress={() =>
                        setDeleteModal({
                          visible: true,
                          taskId: task.id,
                          taskTitle: task.title,
                        })
                      }
                    >
                      <Icon
                        name="trash-outline"
                        size={18}
                        color={Colors.deleteIcon}
                      ></Icon>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.cardBottomRow}>
                  <View style={styles.leftInfoGroup}>
                    <Text style={styles.dateTimeText}>
                      {task.date} | {formatTime(task.time)}
                    </Text>
                    <View
                    >
                      <Icon
                        name="bookmark"
                        size={20}
                        color={stylePriority.iconColor}
                        style={{ marginLeft: 8 }}
                      ></Icon>
                    </View>
                  </View>

                  <View style={styles.rightActionsGroup}>
                    <TouchableOpacity style={styles.textPriorityBadge}
                      onPress={() => setPriorityModal({ visible: true, taskId: task.id })}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      disabled={task.completed}>
                      <Text style={styles.badgeText}>
                        {task.priority || 'Normal'}
                      </Text>
                      <Icon
                        name='chevron-down'
                        size={12}
                        color={Colors.textBadge}
                        style={{ marginLeft: 4 }}></Icon>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.completeCheckCircle,
                        task.completed && styles.checkCompleted,
                      ]}
                      onPress={() => dispatch(completeTask(task.id))}
                    >
                      <Icon
                        name="checkmark-sharp"
                        size={18}
                        color={task.completed ? Colors.white : Colors.black}
                        opacity={0.5}
                      ></Icon>
                    </TouchableOpacity>
                  </View>
                </View>
                {isOverdue && <View style={styles.overdueIndicator} />}
              </View>
            );
          }}
        ></FlatList>
        <Modal transparent visible={priorityModal.visible} animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setPriorityModal({ visible: false, taskId: null })}
          >
            <View style={styles.priorityMenu}>
              <Text style={styles.menuTitle}>Set Priority</Text>
              {['High', 'Normal', 'Low'].map(p => (
                <TouchableOpacity
                  key={p}
                  style={styles.menuItem}
                  onPress={() => handlePriorityChange(priorityModal.taskId, p)}
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
        <Modal transparent visible={deleteModal.visible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.deleteBox}>
              <Icon
                name="alert-circle-outline"
                size={50}
                color={Colors.deleteIcon}
                style={{ marginBottom: 10 }}
              />
              <Text style={styles.deleteText}>
                Delete task '{deleteModal.taskTitle}' ?
              </Text>
              <Text style={styles.subTitle}>
                This action cannot be reverted.
              </Text>

              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() =>
                    setDeleteModal({ visible: false, taskId: null })
                  }
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={() => {
                    dispatch(deleteTask(deleteModal.taskId));
                    setDeleteModal({ visible: false, taskId: null });
                  }}
                >
                  <Text style={styles.confirmBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
    paddingHorizontal: 16,
  },
  content: { flex: 1 },
  list: { marginTop: 10 },
  sectionHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: 10
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  topSection: { marginBottom: 15 },

  dateCard: {
    width: 45,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: Colors.surface,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  activeDateCard: {
    backgroundColor: Colors.blackSecondary,
    borderColor: Colors.blackSecondary,
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.blackSecondary,
  },
  dateDay: {
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 6,
    marginBottom: 4,
    textAlign: 'center',
  },
  dateMonthName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.textMuted,
    marginTop: 1,
  },
  activeDateText: {
    color: Colors.surface,
  },
  taskCard: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 16,
    borderTopColor: Colors.taskDefaultBg,
    borderTopWidth: 1.8,
  },
  overdueIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Colors.chartOverdue,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.blackSecondary,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  cardBottomRow: {
    marginTop: -10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftInfoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medalIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  dateTimeText: {
    fontSize: 12,
    color: Colors.blackSecondary,
    fontWeight: '500',
  },
  rightActionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: -10,
  },
  textPriorityBadge: {
    flexDirection: 'row',
    backgroundColor: Colors.badgeBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 4,
    width: 72,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textBadge,
    textAlign: 'center',
  },
  checkCircle: {
    borderColor: Colors.borderLight,
    backgroundColor: Colors.whitePure,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    height: 32,
    width: 32,
  },
  checkCompleted: {
    backgroundColor: Colors.checkedBg
  },
  completeCheckCircle: {
    borderColor: Colors.borderLight,
    backgroundColor: Colors.checkButton,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    height: 26,
    width: 26,
    marginTop: 5,
  },
  checkedCircle: {
    backgroundColor: Colors.completedBg,
    borderColor: Colors.completedBg,
    opacity: 0.5,
  },
  checkIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 16,
    marginRight: -10,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.blackPure,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  chartContainer: {
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: Colors.background,
    padding: 15,
    width: '100%',
  },
  dotContainer: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    width: '107%',
    marginTop: 20,
  },
  chartItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotText: {
    fontSize: 11,
    color: Colors.textChartLabel,
    fontWeight: '700',
  },
  dot: {
    width: 6.5,
    height: 6.5,
    borderRadius: 4,
    marginRight: 8,
    marginLeft: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.shadow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityMenu: {
    backgroundColor: Colors.white,
    width: '70%',
    borderRadius: 24,
    padding: 16,
    elevation: 10,
  },
  menuTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.textMuted,
    marginBottom: 15,
    fontSize: 15,
  },
  menuItem: {
    paddingVertical: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.taskDefaultBg,
  },
  menuItemText: { fontSize: 17, fontWeight: '600' },
  deleteBox: {
    backgroundColor: Colors.white,
    width: '80%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
  },
  subTitle: {
    color: Colors.textMuted,
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
    backgroundColor: Colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cancelBtnText: {
    color: Colors.blackSecondary,
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.deleteIcon,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: Colors.white,
    fontWeight: '600',
  },
});

export default AllTasksScreen;
