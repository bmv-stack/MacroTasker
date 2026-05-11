import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  FlatList,
  SectionList,
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
import { useTheme } from '../contexts/ThemeContext';
import PriorityModal from '../components/Modals/PriorityModal';
import DeleteModal from '../components/Modals/DeleteModal';
import { formatDate } from '../utils/formatDate';
import { formatTime } from '../utils/formatTime';
import { generateDateList } from '../utils/dateListGeneration';
import { getMinute } from '../utils/getMinutes';
import { resetFilters } from '../redux/slices/filterSlice';

const AllTasksScreen = () => {
  // -----THEME-----
  const { theme, isDarkMode } = useTheme();
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
  const { sortOrder, status, endDate, startDate } = useSelector(
    state => state.filters,
  );

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
  const undoTimer = useRef(null); // useRef doesn't trigger a re-render if .current value changes
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

  // -----DATE LIST (On Top) States-----
  const [selectedData, setSelectedData] = useState({
    label: 'Total',
    value: tasks.length,
    color: theme.blackSecondary,
  });
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

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  // ----- Data for Section List -----

  const sectionListGroup = tasks => {
    const groups = {};
    tasks.forEach(task => {
      const date = task.date;

      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(task);
    });
    const arraySection = Object.keys(groups)
      .sort()
      .map(date => {
        return {
          title: date,
          data: groups[date],
        };
      });
    return arraySection;
  };

  // ----- Filtered Tasks For Date Filtering -----
  const filteredTasks = useMemo(() => {
    let tasksToFilter = [...tasks];

    if (startDate && endDate) {
      const start = parseDate(startDate);
      const end = parseDate(endDate);
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
    // ----- Filtering for 'Task Status' -----
    if (status !== 'All') {
      tasksToFilter = tasksToFilter.filter(t => {
        const isEndDate = !!t.endDate;
        const endDate = isEndDate ? parseDate(t.endDate) : null;
        const taskDate = parseDate(t.date);

        if (status === 'Completed') return t.completed;

        const isOverdue =
          !t.completed &&
          isEndDate &&
          (endDate < now ||
            (endDate().getTime() === now.getTime() &&
              getMinute(t.endTime) < currentMinutes));

        if (status === 'Overdue') return isOverdue;

        if (status === 'Ongoing') {
          const isFuture = taskDate != null && taskDate > now;
          return !t.completed && !isOverdue && !isFuture;
        }
        return true;
      });
    }
    // ----- Sorting logic -----
    return tasksToFilter.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const priorityOrder = { High: 3, Normal: 2, Low: 1 };

      switch (sortOrder) {
        case 'priorityHigh':
          return (
            priorityOrder[b.priority || 'Normal'] -
            priorityOrder[a.priority || 'Normal']
          );
        case 'priorityLow':
          return (
            priorityOrder[a.priority || 'Normal'] -
            priorityOrder[b.priority || 'Normal']
          );
        case 'desc':
          return b.title.localeCompare(a.title);
        case 'asc':
          return a.title.localeCompare(b.title);
        default:
          return a.title.localeCompare(a.title);
      }
    });
  }, [tasks, selectedDate, status, sortOrder, startDate, endDate]);
  // ----- Sections for Date Filtering -----
  const groupedSections = useMemo(() => {
    if (startDate && endDate && filteredTasks) {
      return sectionListGroup(filteredTasks);
    }
    return [];
  }, [filteredTasks, startDate, endDate]);

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
    //setChartKey(chartKey + 1); // Forced re-render
  };

  const currentMinutes = new Date().getHours() * 60 + new Date().getMinutes();

  // ----- Chart Data function -----
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
        if (endDate < now) return true;
        if (endDate.getTime() === now.getTime() && t.endTime) {
          return getMinute(t.endTime) < currentMinutes;
        }
      }
      return false;
    }).length;
    const isFuture =
      startDate && endDate ? false : parseDate(selectedDate) > now;

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
    const ongoingCount = filteredTasks.filter(t => {
      if (t.completed) return false;
      // Exclude pending tasks
      const taskDate = parseDate(t.date);
      if (taskDate != null && taskDate > now) return false;
      if (t.endDate) {
        const endDate = parseDate(t.endDate);
        return endDate != null && endDate >= now;
      } // If no end date, task is ongoing
      return true;
    }).length;

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

  const handleUndo = () => {
    if (deletedTask) {
      dispatch(addNewTask(deletedTask));
      setUndoVisible(false);
      clearTimeout(undoTimer.current);
    }
  };
  const isFiltered = sortOrder === 'asc' || status === 'All' || !!startDate;

  function handleReset() {
    dispatch(resetFilters());
  }
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
  const renderItem = task => {
    const isEndDate = !!task.endDate;
    const endDate = isEndDate ? parseDate(task.endDate) : null;
    const isOverdue =
      !task.completed &&
      isEndDate &&
      (endDate < now ||
        (endDate.getTime() === now.getTime() &&
          task.endTime &&
          getMinute(task.endTime) < currentMinutes));
    const statusColor = getStatusColor(task);
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
                color={statusColor}
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
              onPress={() => dispatch(completeTask(task.id))}
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

          <View style={styles.filterIconContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('FilterScreen')}
              hitSlop={{ top: 10, bottom: 10, left: 5, right: 0 }}
            >
              <Icon name="filter" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
            {!isFiltered && (
              <TouchableOpacity
                onPress={handleReset}
                hitSlop={{ top: 10, bottom: 10, left: 0, right: 10 }}
              >
                <Icon
                  name="reload"
                  size={24}
                  color={theme.textPrimary}
                  style={{ marginLeft: 15 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* DATES Flatlist - only show when not filtering by date */}
        {!(startDate && endDate) && (
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
                let backgroundColor;
                if (isSelected) {
                  backgroundColor = isDarkMode
                    ? theme.white
                    : theme.blackSecondary;
                }
                let textColor;
                if (isSelected) {
                  textColor = isDarkMode ? '#000' : theme.white;
                } else {
                  textColor = theme.textMuted;
                }

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
          </View>
        )}

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
                innerCircleColor={isDarkMode ? theme.background : theme.white}
                data={chartData}
                centerLabelComponent={() => (
                  <View style={{ alignItems: 'center' }}>
                    <Text
                      style={
                        startDate && endDate
                          ? styles.centerChartCount // Range Mode Style
                          : {
                              // Daily Mode Style
                              fontWeight: 'bold',
                              fontSize: 22,
                              color: isDarkMode
                                ? theme.white
                                : theme.blackSecondary,
                            }
                      }
                    >
                      {selectedData.value}
                    </Text>
                    <Text
                      style={
                        startDate && endDate
                          ? styles.centerChartLabel // Range Mode Style
                          : {
                              // Daily Mode Style
                              fontSize: 10,
                              color: isDarkMode
                                ? theme.white
                                : theme.blackSecondary,
                              fontWeight: '600',
                            }
                      }
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

        {startDate && endDate ? (
          <SectionList
            sections={groupedSections}
            keyExtractor={item => item.id}
            stickySectionHeadersEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
            renderSectionHeader={({ section: { title, data } }) => (
              <View style={styles.sectionHeaderContainer}>
                <Text style={styles.sectionHeaderText}>
                  {formatDate(title)} ({data.length})
                </Text>
              </View>
            )}
            renderItem={({ item }) => renderItem(item)}
            ListEmptyComponent={() => (
              <View style={styles.emptyTaskContainer}>
                <Text style={styles.emptyTaskText}>
                  No tasks for this range!
                </Text>
              </View>
            )}
          />
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ marginBottom: 70, flexGrow: 1 }}
            ListEmptyComponent={() => (
              <View style={styles.emptyTaskContainer}>
                <Text style={styles.emptyTaskText}>No tasks for this day!</Text>
              </View>
            )}
            renderItem={({ item }) => renderItem(item)}
          />
        )}
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
    centerChartCount: {
      fontSize: 24,
      color: theme.primary,
      fontWeight: '600',
    },
    centerChartLabel: {
      fontSize: 12,
      color: theme.primary,
      fontWeight: '600',
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
    sectionHeaderText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.primary,
      letterSpacing: 1,
      textAlign: 'center',
    },
    emptyTaskContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyTaskText: {
      color: theme.textMuted,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    filterIconContainer: {
      flexDirection: 'row',
    },
  });

export default AllTasksScreen;
