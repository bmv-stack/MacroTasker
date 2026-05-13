import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SectionList,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteTask,
  completeTask,
  addNewTask,
} from '../redux/slices/taskSlice';
import AppBar from '../components/appBar';
import SwitchTabs from '../components/tabPills';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../contexts/ThemeContext';
import PriorityModal from '../components/Modals/PriorityModal';
import DeleteModal from '../components/Modals/DeleteModal';
import { formatDate } from '../utils/formatDate';
import { generateDateList } from '../utils/dateListGeneration';
import { resetFilters } from '../redux/slices/filterSlice';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { getStyles } from './AllTasksScreen.styles';
import TaskCard from '../components/TaskCard';
import TaskChart from '../components/TaskChart';
import DateList from '../components/DateList';

const AllTasksScreen = ({ navigation }) => {
  // -----THEME-----
  const { theme } = useTheme();
  const screenStyles = getStyles(theme);
  // --------------------------------------------------
  const dateListRef = useRef(null);
  // --------------------------------------------------
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks.items);
  const filters = useSelector(state => state.filters);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  // -----FILTER TASKS States-----
  const { sortOrder, status, endDate, startDate } = filters;

  const [chartKey, setChartKey] = useState(0);

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

  // -----PRIORITY States-----
  const [priorityModal, setPriorityModal] = useState({
    visible: false,
    taskId: null,
  });

  // ----- Chart Data -----
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

  const { filteredTasks, groupedSections, chartData } = useTaskFilters(
    tasks,
    filters,
    selectedDate,
  );

  // ----- Chart Data in array form -----
  const chartDataRaw = useMemo(() => {
    const { isFuture } = chartData;
    if (isFuture) {
      return [
        {
          value: chartData.pendingCount,
          color: theme.chartPending,
          label: 'Pending Tasks',
          onPress: () =>
            setSelectedData({
              label: 'Pending',
              value: chartData.pendingCount,
              color: theme.chartPending,
            }),
        },
      ];
    }
    return [
      {
        value: chartData.ongoingCount,
        color: theme.chartOngoing,
        label: 'Ongoing Tasks',
        onPress: () =>
          setSelectedData({
            label: 'Ongoing',
            value: chartData.ongoingCount,
            color: theme.chartOngoing,
          }),
      },
      {
        value: chartData.overdueCount,
        color: theme.chartOverdue,
        label: 'Overdue Tasks',
        onPress: () =>
          setSelectedData({
            label: 'Overdue',
            value: chartData.overdueCount,
            color: theme.chartOverdue,
          }),
      },
      {
        value: chartData.completedCount,
        color: theme.chartCompleted,
        label: 'Completed Tasks',
        onPress: () =>
          setSelectedData({
            label: 'Completed',
            value: chartData.completedCount,
            color: theme.chartCompleted,
          }),
      },
      {
        value: chartData.pendingCount,
        color: theme.chartPending,
        label: 'Pending Tasks',
        onPress: () =>
          setSelectedData({
            label: 'Pending',
            value: chartData.pendingCount,
            color: theme.chartPending,
          }),
      },
    ];
  }, [theme, chartData]);

  useEffect(() => {
    if (selectedData.label === 'Total') {
      setSelectedData(prev =>
        prev.value !== filteredTasks.length
          ? { ...prev, value: filteredTasks.length }
          : prev,
      );
    }
  }, [filteredTasks.length, selectedData.label]);

  useEffect(() => {
    setSelectedData({
      label: 'Total',
      value: filteredTasks.length,
      color: theme.blackSecondary,
    });
    setChartKey(chartKey + 1);
  }, [selectedDate, filteredTasks.length]);

  const resetTotal = () => {
    setSelectedData({
      label: 'Total',
      value: filteredTasks.length,
      color: theme.blackSecondary,
    });
    //setChartKey(chartKey + 1);
  };

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
  const isFiltered = sortOrder !== '' || status !== '' || !!startDate;

  function handleReset() {
    dispatch(resetFilters());
  }
  return (
    <View style={screenStyles.container}>
      <AppBar
        title="MACROTASKER"
        onIconPress={() => navigation.navigate('CreateTask')}
      />
      <View style={screenStyles.content}>
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

        <View style={screenStyles.sectionHeader}>
          <View style={screenStyles.headerLeft}>
            <Text style={screenStyles.sectionTitle}>All tasks</Text>
            {selectedDate !== new Date().toISOString().split('T')[0] && (
              <TouchableOpacity onPress={goToday}>
                <Text style={screenStyles.todayText}>Today</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={screenStyles.filterIconContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('FilterScreen')}
              hitSlop={{ top: 10, bottom: 10, left: 5, right: 0 }}
            >
              <Icon name="filter" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
            {isFiltered && (
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
          <View style={screenStyles.topSection}>
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
              renderItem={({ item }) => (
                <DateList
                  item={item}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              )}
            />
          </View>
        )}

        {/* -----Pie Chart----- */}
        {filteredTasks.length > 0 && (
          <TaskChart
            chartData={chartDataRaw}
            selectedData={selectedData}
            startDate={startDate}
            endDate={endDate}
            resetTotal={resetTotal}
            chartKey={chartKey}
          />
        )}

        {startDate ? (
          <SectionList
            sections={groupedSections}
            keyExtractor={item => item.id}
            stickySectionHeadersEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
            renderSectionHeader={({ section: { title, data } }) => (
              <View style={screenStyles.sectionHeaderContainer}>
                <Text style={screenStyles.sectionHeaderText}>
                  {formatDate(title)} ({data.length})
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <TaskCard
                task={item}
                navigation={navigation}
                onEdit={() =>
                  navigation.navigate('CreateTask', { existingTask: item })
                }
                onDelete={() =>
                  setDeleteModal({
                    visible: true,
                    taskId: item.id,
                    taskTitle: item.title,
                  })
                }
                onComplete={() => dispatch(completeTask(item.id))}
                onPriority={() =>
                  setPriorityModal({ visible: true, taskId: item.id })
                }
              />
            )}
            ListEmptyComponent={() => (
              <View style={screenStyles.emptyTaskContainer}>
                <Text style={screenStyles.emptyTaskText}>
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
            alwaysBounceVertical={false}
            ListEmptyComponent={() => (
              <View style={screenStyles.emptyTaskContainer}>
                <Text style={screenStyles.emptyTaskText}>
                  No tasks for this day!
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <TaskCard
                task={item}
                theme={theme}
                onEdit={() =>
                  navigation.navigate('CreateTask', { existingTask: item })
                }
                onDelete={() =>
                  setDeleteModal({
                    visible: true,
                    taskId: item.id,
                    taskTitle: item.title,
                  })
                }
                onComplete={() => dispatch(completeTask(item.id))}
                onPriority={() =>
                  setPriorityModal({ visible: true, taskId: item.id })
                }
              />
            )}
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
        <View style={screenStyles.undoMessage}>
          <Text style={screenStyles.undoText}>Task Deleted</Text>
          <TouchableOpacity onPress={handleUndo}>
            <Text style={screenStyles.undoBtn}>UNDO</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
export default AllTasksScreen;
