import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  FlatList,
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
import { lightTheme, darkTheme } from '../themes/color';
import CalendarComponent from '../components/calendarComponent';
import PriorityModal from '../components/Modals/PriorityModal';
import DeleteModal from '../components/Modals/DeleteModal';
import FilterModal from '../components/Modals/FilterModal';

// -----DateList Generation function-----
const generateDateList = () => {
  const dates = [];
  for (let i = -30; i < 355; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push({
      fullDate: d.toISOString().split('T')[0],
      dayNumber: d.getDate().toString(),
      dayName: d
        .toLocaleDateString('en-GB', { month: 'short', weekday: 'short' })
        .toUpperCase(),
    });
  }
  return dates;
};

// -----Date Conversion Functions-----
const formatDate = dateString => {
  if (!dateString) return '';
  if (dateString.includes('/')) {
    return dateString;
  }
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const AllTasksScreen = () => {
  // -----THEME Data-----
  const isDarkMode = useSelector(state => state.tasks.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme);
  // --------------------------------------------------
  const dateListRef = useRef(null);
  // --------------------------------------------------
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks.items);
  // --------------------------------------------------
  const navigation = useNavigation();
  // --------------------------------------------------
  // -----FILTER TASKS States-----
  const [filterVisible, setFilterVisible] = useState(false);
  const [currentFilterTab, setCurrentFilterTab] = useState('Type');

  // -----UNDO States-----
  const [undoVisible, setUndoVisible] = useState(false);
  // -----DELETE Modal States-----
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    taskId: null,
    taskTitle: '',
  });
  const [deletedTask, setDeletedTask] = useState(null);
  // --------------------------------------------------
  const undoTimer = useRef(null);
  // --------------------------------------------------

  // ----- UNDO Timer Function -----
  useEffect(() => {
    return () => {
      if (undoTimer.current) clearTimeout(undoTimer.current);
    };
  }, []);
  // -----ACTIVE TAB States-----
  const [activeTab, setActiveTab] = useState('All');
  // -----CHART States-----
  const [chartKey, setChartKey] = useState(0);
  // -----DATE States-----
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  // -----PRIORITY States-----
  const [priorityModal, setPriorityModal] = useState({
    visible: false,
    taskId: null,
  });
  // -----FILTER States-----
  const [sortOrder, setSortOrder] = useState(null);
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarType, setCalendarType] = useState(null); // 'start' or 'end'
  // -----DATE LIST (On Top) States-----
  const [selectedData, setSelectedData] = useState({
    label: 'Total',
    value: tasks.length,
    color: theme.blackSecondary,
  });

  const priorityStyles = {
    High: { iconColor: theme.high },
    Normal: { iconColor: theme.normal },
    Low: { iconColor: theme.low },
  };
  // -----DateList Memoization-----
  const dateList = useMemo(() => generateDateList(), []);

  const goToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);

    dateListRef.current?.scrollToIndex({
      index: 30,
      animated: true,
      viewPosition: 0.5,
    });
  };

  const filteredTasks = useMemo(() => {
    let tasksToFilter = tasks;

    if (startDateFilter && endDateFilter) {
      const start = parseDate(startDateFilter);
      const end = parseDate(endDateFilter);
      if (start && end) {
        tasksToFilter = tasks.filter(task => {
          const taskDate = parseDate(task.date);
          return taskDate && taskDate >= start && taskDate <= end;
        });
      }
    } else {
      const selected = parseDate(selectedDate);
      if (selected) {
        tasksToFilter = tasks.filter(task => {
          const taskDate = parseDate(task.date);
          return (
            taskDate && taskDate.toDateString() === selected.toDateString()
          );
        });
      }
    }

    return [...tasksToFilter].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      if (sortOrder === 'asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortOrder === 'desc') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });
  }, [tasks, selectedDate, sortOrder, startDateFilter, endDateFilter]);

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
      color: theme.blackSecondary,
    });
    setChartKey(chartKey + 1);
  };

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const chartData = useMemo(() => {
    if (filteredTasks.length === 0) return [];

    const completedCount = filteredTasks.filter(t => t.completed).length;
    const pendingCount = filteredTasks.filter(t => {
      const taskDate = parseDate(t.date);
      return !t.completed && taskDate != null && taskDate > now;
    }).length;
    const overdueCount = filteredTasks.filter(t => {
      if (t.completed) return false;
      if (t.endDate) {
        const endDate = parseDate(t.endDate);
        return endDate != null && endDate < now;
      } else {
        const taskDate = parseDate(t.date);
        return taskDate != null && taskDate < now;
      }
    }).length;
    const isFuture =
      startDateFilter && endDateFilter ? false : parseDate(selectedDate) > now;

    if (isFuture) {
      return [
        {
          value: pendingCount,
          color: theme.chartPending,
          label: 'Pending Tasks',
          onPress: () =>
            setSelectedData({
              label: 'Pending',
              value: pendingCount,
              color: theme.chartPending,
            }),
        },
      ];
    }
    const ongoingCount =
      filteredTasks.length - completedCount - overdueCount - pendingCount;

    return [
      {
        value: ongoingCount,
        color: theme.chartOngoing,
        label: 'Ongoing Tasks',
        onPress: () =>
          setSelectedData({
            label: 'Ongoing',
            value: ongoingCount,
            color: theme.chartOngoing,
          }),
      },
      {
        value: overdueCount,
        color: theme.chartOverdue,
        label: 'Overdue Tasks',
        onPress: () =>
          setSelectedData({
            label: 'Overdue',
            value: overdueCount,
            color: theme.chartOverdue,
          }),
      },
      {
        value: completedCount,
        color: theme.chartCompleted,
        label: 'Completed Tasks',
        onPress: () =>
          setSelectedData({
            label: 'Completed',
            value: completedCount,
            color: theme.chartCompleted,
          }),
      },
    ];
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

  const handleUndo = () => {
    if (deletedTask) {
      dispatch(addNewTask(deletedTask));
      setUndoVisible(false);
      clearTimeout(undoTimer.current);
    }
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
          <View style={styles.headerLeft}>
            <Text style={styles.sectionTitle}>All tasks</Text>
            {selectedDate !== new Date().toISOString().split('T')[0] && (
              <TouchableOpacity onPress={goToday}>
                <Text style={styles.todayText}>Today</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={() => setFilterVisible(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="filter" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* DATES Flatlist - only show when not filtering by date range */}
        {!(startDateFilter && endDateFilter) && (
          <View style={styles.topSection}>
            <FlatList
              horizontal
              ref={dateListRef}
              data={dateList}
              extraData={selectedDate}
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
                const backgroundColor = isSelected
                  ? isDarkMode
                    ? theme.white
                    : theme.blackSecondary
                  : isDarkMode
                  ? theme.surface
                  : theme.white;
                const textColor = isSelected
                  ? isDarkMode
                    ? '#000000'
                    : theme.white
                  : isDarkMode
                  ? theme.textMuted
                  : theme.textMuted;
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedDate(item.fullDate)}
                    style={[styles.dateCard, { backgroundColor }]}
                  >
                    <Text style={[styles.dateNumber, { color: textColor }]}>
                      {item.dayNumber}
                    </Text>
                    <Text style={[styles.dateMonthName, { color: textColor }]}>
                      {monthName}
                    </Text>
                    <Text style={[styles.dateDay, { color: textColor }]}>
                      {dayName}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
            {/* -----Pie Chart----- */}
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
                    innerCircleColor={
                      isDarkMode ? theme.background : theme.white
                    }
                    data={chartData}
                    centerLabelComponent={() => (
                      <View
                        style={{
                          alignItems: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: 22,
                            color: isDarkMode
                              ? theme.white
                              : theme.blackSecondary,
                          }}
                        >
                          {selectedData.value}
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            color: isDarkMode
                              ? theme.white
                              : theme.blackSecondary,
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
        )}

        {/* -----Pie Chart----- for date filtered tasks */}
        {startDateFilter && endDateFilter && filteredTasks.length > 0 && (
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
                innerCircleColor={isDarkMode ? theme.background : theme.white}
                data={chartData}
                centerLabelComponent={() => (
                  <View
                    style={{
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 22,
                        color: isDarkMode ? theme.white : theme.blackSecondary,
                      }}
                    >
                      {selectedData.value}
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        color: isDarkMode ? theme.white : theme.blackSecondary,
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
        )}

        <FlatList
          data={filteredTasks}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginBottom: 20 }}
          ListEmptyComponent={() => (
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={{ color: theme.textMuted }}>
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
                  <TouchableOpacity
                    activeOpacity={0.5}
                    hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
                    onPress={() => navigation.navigate('TaskDetail', { task })}
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
                        color={theme.editIcon}
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
                        color={stylePriority.iconColor}
                        style={{ marginLeft: 8 }}
                      ></Icon>
                    </View>
                  </View>
                  <View style={styles.rightActionsGroup}>
                    <TouchableOpacity
                      style={styles.textPriorityBadge}
                      onPress={() =>
                        setPriorityModal({ visible: true, taskId: task.id })
                      }
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      disabled={task.completed}
                    >
                      <Text style={styles.badgeText}>
                        {task.priority || 'Normal'}
                      </Text>
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
                      onPress={() => dispatch(completeTask(task.id))}
                    >
                      <Icon
                        name="checkmark-sharp"
                        size={18}
                        color={
                          task.completed ? theme.white : theme.completeTaskIcon
                        }
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
        <PriorityModal
          visible={priorityModal.visible}
          onClose={() => setPriorityModal({ visible: false, taskId: null })}
          onSelect={priority =>
            handlePriorityChange(priorityModal.taskId, priority)
          }
        />
        {
          /* Delete Modal */
          <DeleteModal
            visible={deleteModal.visible}
            taskTitle={deleteModal.taskTitle}
            onCancel={() => setDeleteModal({ visible: false, taskId: null })}
            onConfirm={() => {
              const taskToSave = tasks.find(t => t.id === deleteModal.taskId);
              setDeletedTask(taskToSave);
              dispatch(deleteTask(deleteModal.taskId));
              setDeleteModal({ visible: false, taskId: null });
              setUndoVisible(true);
              if (undoTimer.current) clearTimeout(undoTimer.current);
              undoTimer.current = setTimeout(() => setUndoVisible(false), 5000);
            }}
          />
        }
      </View>
      {/* UNDO Modal */}
      {undoVisible && (
        <View style={styles.undoMessage}>
          <Text style={styles.undoText}>Task Deleted</Text>
          <TouchableOpacity onPress={handleUndo}>
            <Text style={styles.undoBtn}>UNDO</Text>
          </TouchableOpacity>
        </View>
      )}
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        currentFilterTab={currentFilterTab}
        onTabChange={setCurrentFilterTab}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        onReset={() => {
          setSortOrder(null);
          setCurrentFilterTab('Type');
          setStartDateFilter('');
          setEndDateFilter('');
        }}
        startDateFilter={startDateFilter}
        endDateFilter={endDateFilter}
        onOpenCalendar={type => {
          setCalendarType(type);
          setCalendarVisible(true);
        }}
        calendarVisible={calendarVisible}
        calendarType={calendarType}
        calendarInitialDate={
          calendarType === 'start'
            ? startDateFilter || undefined
            : endDateFilter || undefined
        }
        onCalendarSelect={day => {
          if (calendarType === 'start') {
            setStartDateFilter(day.dateString);
          } else {
            setEndDateFilter(day.dateString);
          }
          setCalendarVisible(false);
        }}
        onCalendarClose={() => setCalendarVisible(false)}
        onApply={() => setFilterVisible(false)}
      />
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
      paddingHorizontal: 16,
    },
    content: { flex: 1 },
    list: { marginTop: 10 },
    sectionHeader: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      marginVertical: 10,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    topSection: { marginBottom: 15 },

    dateCard: {
      width: 45,
      height: 75,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      backgroundColor: theme.dateCard,
      marginRight: 10,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    activeDateCard: {
      backgroundColor: theme.primary,
      borderColor: theme.blackSecondary,
    },
    dateNumber: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.dayTextColor,
    },
    dateDay: {
      fontSize: 9,
      color: theme.textMuted,
      marginTop: 6,
      marginBottom: 4,
      textAlign: 'center',
    },
    dateMonthName: {
      fontSize: 9,
      fontWeight: 'bold',
      color: theme.textMuted,
      marginTop: 1,
    },
    activeDateText: {
      color: theme.surface,
    },
    taskCard: {
      backgroundColor: theme.background,
      borderRadius: 20,
      padding: 16,
      borderTopColor: theme.taskDefaultBg,
      borderTopWidth: 1.8,
    },
    overdueIndicator: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      backgroundColor: theme.chartOverdue,
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
      color: theme.textPrimary,
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
      color: theme.textPrimary,
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
      backgroundColor: theme.badgeBackground,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
      marginTop: 4,
      width: 72,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.textBadge,
      textAlign: 'center',
    },
    checkCompleted: {
      backgroundColor: theme.completedBg,
      borderColor: theme.completedBg,
    },
    completeCheckCircle: {
      borderColor: theme.borderLight,
      backgroundColor: theme.checkButton,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 16,
      height: 26,
      width: 26,
      marginTop: 5,
    },
    checkedCircle: {
      backgroundColor: theme.buttonDisabled,
      borderColor: theme.buttonDisabled,
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
      backgroundColor: theme.surface,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.blackPure,
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },

    chartContainer: {
      alignItems: 'center',
      marginTop: 20,
      backgroundColor: theme.background,
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
      color: theme.textChartLabel,
      fontWeight: '400',
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
      backgroundColor: theme.shadow,
      justifyContent: 'center',
      alignItems: 'center',
    },
    priorityMenu: {
      backgroundColor: theme.white,
      width: '70%',
      borderRadius: 24,
      padding: 16,
      elevation: 10,
    },
    menuTitle: {
      textAlign: 'center',
      fontWeight: 'bold',
      color: theme.textMuted,
      marginBottom: 15,
      fontSize: 15,
    },
    menuItem: {
      paddingVertical: 15,
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: theme.taskDefaultBg,
    },
    menuItemText: { fontSize: 17, fontWeight: '600' },
    deleteBox: {
      backgroundColor: theme.surface,
      width: '80%',
      borderRadius: 24,
      padding: 24,
      alignItems: 'center',
      elevation: 10,
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
    undoMessage: {
      position: 'absolute',
      bottom: 10,
      left: 20,
      right: 20,
      backgroundColor: theme.blackSecondary,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 15,
      borderRadius: 12,
      elevation: 5,
      alignItems: 'center',
    },
    undoText: {
      color: theme.white,
      fontWeight: '600',
    },
    undoBtn: {
      color: theme.accent,
      fontWeight: 'bold',
    },
    todayText: {
      color: theme.accent,
      fontWeight: 'bold',
      fontSize: 14,
    },
    drawerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.surface,
    },
    drawerDrop: {
      flex: 0.2,
      backgroundColor: 'rgba(0,0,0,0.5)',
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
    resetText: { color: theme.accent, fontWeight: 'bold' },
    drawerBody: { flex: 1, flexDirection: 'row' },
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
      backgroundColor: theme.accent,
    },
    sidebarTabText: { color: theme.textMuted, fontWeight: '600' },
    activeSidebarTabText: { color: theme.primary },
    drawerTabContent: { flex: 1, padding: 20 },
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
    emptyCheckbox: {
      width: 22,
      height: 22,
      borderWidth: 2,
      borderColor: theme.borderLight,
      borderRadius: 4,
    },
    dateLabel: { color: theme.textMuted, fontSize: 14, marginBottom: 10 },
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
  });

export default AllTasksScreen;
