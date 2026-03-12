import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  FlatList,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTasks } from '../context/taskContext';
import AppBar from '../components/appBar';
import SwitchTabs from '../components/tabPills';
import { PieChart } from 'react-native-gifted-charts';
import { parseDate } from './createTaskScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';

const generateDateList = () => {
  const dates = [];
  for (let i = -30; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push({
      fullDate: d.toLocaleDateString('en-GB'),
      dayNumber: d.getDate().toString(),
      dayName: d
        .toLocaleDateString('en-US', { weekday: 'short' })
        .toUpperCase(),
    });
  }
  return dates;
};

const AllTasksScreen = () => {
  const navigation = useNavigation();
  const { tasks, deleteTask, completeTask, updateTask } = useTasks();
  const [activeTab, setActiveTab] = useState('All');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString('en-GB'),
  );
  const [priorityModal, setPriorityModal] = useState({
    visible: false,
    taskId: null,
  });
  const [selectedData, setSelectedData] = useState({
    label: 'Total',
    value: tasks.length,
    color: '#1C1C1E',
  });

  const priorityStyles = {
    High: { iconColor: '#FF3B30' },
    Normal: { iconColor: '#007AFF' },
    Low: { iconColor: '#34C759' },
  };

  const dateList = generateDateList();
  const filteredTasks = tasks.filter(task => task.date === selectedDate);

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
      color: '#1C1C1E',
    });
  };

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const completedCount = filteredTasks.filter(t => t.completed).length;
  const overdueCount = filteredTasks.filter(t => {
    if (t.completed || !t.endDate) return false;
    const taskDate = parseDate(t.endDate);
    return taskDate && taskDate < now;
  }).length;
  const ongoingCount = filteredTasks.length - completedCount - overdueCount;

  const chartData =
    filteredTasks.length > 0
      ? [
        {
          value: ongoingCount,
          color: '#007BFF',
          label: 'Ongoing Tasks',
          onPress: () =>
            setSelectedData({
              label: 'Ongoing',
              value: ongoingCount,
              color: '#007BFF',
            }),
        },
        {
          value: completedCount,
          color: '#51d761',
          label: 'Completed Tasks',
          onPress: () =>
            setSelectedData({
              label: 'Completed',
              value: completedCount,
              color: '#51d761',
            }),
        },
        {
          value: overdueCount,
          color: '#e6552d',
          label: 'Overdue Tasks',
          onPress: () =>
            setSelectedData({
              label: 'Overdue',
              value: overdueCount,
              color: '#e6552d',
            }),
        },
      ]
      : [{ value: 1, color: '#f2f2f7', label: 'No Tasks' }];

  const handlePriorityChange = (taskId, newPriority) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (taskToUpdate) {
      updateTask({ ...taskToUpdate, priority: newPriority });
    }
    setPriorityModal({ visible: false, taskId: null });
  };

  return (
    <View style={styles.container}>
      <AppBar
        title="TODO APP"
        onIconPress={() => navigation.navigate('CreateTask')}
      />
      <View style={styles.content}>
        <SwitchTabs
          activeTab={activeTab}
          onTabChange={value => {
            if (value === 'Focus') {
              navigation.navigate('Dashboard');
            } else {
              setActiveTab(value);
            }
          }}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Tasks</Text>
        </View>

        <View style={styles.topSection}>
          <FlatList
            horizontal
            data={dateList}
            keyExtractor={item => item.fullDate}
            initialScrollIndex={30}
            showsHorizontalScrollIndicator={false}
            getItemLayout={(data, index) => ({
              length: 50,
              offset: 50 * index,
              index,
            })}
            renderItem={({ item }) => {
              const isSelected = item.fullDate === selectedDate;
              return (
                <TouchableOpacity
                  onPress={() => setSelectedDate(item.fullDate)}
                  style={[styles.dateCard, isSelected && styles.activeDateCard]}
                >
                  <Text
                    style={[
                      styles.dateNumber,
                      isSelected && styles.activeDateText,
                    ]}
                  >
                    {item.dayNumber}
                  </Text>
                  <Text
                    style={[
                      styles.dateDay,
                      isSelected && styles.activeDateText,
                    ]}
                  >
                    {item.dayName}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />

          <View style={styles.chartContainer}>
            <TouchableOpacity activeOpacity={1} onPress={resetTotal}>
              <PieChart
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
                        color: '#8E8E93',
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
                  <View style={[styles.dot, { backgroundColor: item.color }]} />
                  <Text style={styles.dotText}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => {
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
                          color: '#8E8E93',
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {task.title}
                    </Text>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.iconCircle}
                        onPress={() =>
                          navigation.navigate('CreateTask', {
                            existingTask: task,
                          })
                        }
                      >
                        <FeatherIcon
                          name="edit-3"
                          size={18}
                          color="#34C759"
                        ></FeatherIcon>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.iconCircle}
                        onPress={() => deleteTask(task.id)}>
                        <Icon
                          name="trash-outline"
                          size={18}
                          color="#FF3B30"
                        ></Icon>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.cardBottomRow}>
                    <View style={styles.leftInfoGroup}>
                      <Text style={styles.dateTimeText}>
                        {task.date} | {task.time}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          setPriorityModal({ visible: true, taskId: task.id })
                        }
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Icon
                          name="bookmark"
                          size={20}
                          color={stylePriority.iconColor}
                          style={{ marginLeft: 8 }}
                        ></Icon>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.rightActionsGroup}>
                      <View style={styles.textPriorityBadge}>
                        <Text style={styles.badgeText}>
                          {task.priority || 'Normal'}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.checkCircle,
                          task.completed && styles.checkedCircle,
                        ]}
                        onPress={() => completeTask(task.id)}
                      >
                        <Icon
                          name="checkmark-sharp"
                          size={18}
                          color={task.completed ? '#FFF' : '#161617'}
                          style={{ fontWeight: 'bold' }}
                        ></Icon>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {isOverdue && <View style={styles.overdueIndicator} />}
                </View>
              );
            })
          ) : (
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={{ color: '#8E8E93' }}>No tasks for this day.</Text>
            </View>
          )}
        </ScrollView>

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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
    paddingHorizontal: 16,
  },
  content: { flex: 1 },
  list: { marginTop: 10 },
  sectionHeader: { marginVertical: 10 },
  sectionTitle:
  {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E'
  },
  topSection: { marginBottom: 15 },

  dateCard: {
    width: 42,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#FFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  activeDateCard: {
    backgroundColor: '#1C1C1E',
    borderColor: '#1C1C1E',
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  dateDay: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 2,
  },
  activeDateText: {
    color: '#FFF',
  },
  taskCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    padding: 16,

  },
  overdueIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#FF3B30',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskTitle:
  {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1
  },
  actionButtons:
  {
    flexDirection: 'row',
    gap: 15
  },
  editIcon:
  {
    color: '#34C759',
    fontSize: 18
  },
  deleteIcon:
  {
    color: '#FF3B30',
    fontSize: 18
  },
  cardBottomRow: {
    marginTop: -10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftInfoGroup:
  {
    flexDirection: 'row',
    alignItems: 'center'
  },
  medalIcon:
  {
    fontSize: 22,
    marginRight: 8
  },
  dateTimeText:
  {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500'
  },
  rightActionsGroup:
  {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  textPriorityBadge: {
    backgroundColor: '#f9f3e1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeText:
  {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#b9a665'
  },
  checkCircle: {
    borderColor: '#E5E5EA',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    height: 32,
    width: 32,
  },
  checkedCircle: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  checkIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  chartContainer: {
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#f8f9fa',
    padding: 15,
    width: '100%',
  },
  dotContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
  },
  chartItem:
  {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dotText:
  {
    fontSize: 11,
    color: '#444',
    fontWeight: '500'
  },
  dot:
  {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityMenu: {
    backgroundColor: '#fff',
    width: '70%',
    borderRadius: 24,
    padding: 16,
    elevation: 10,
  },
  menuTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#8E8E93',
    marginBottom: 15,
    fontSize: 15,
  },
  menuItem: {
    paddingVertical: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  menuItemText: { fontSize: 17, fontWeight: '600' },
});

export default AllTasksScreen;
