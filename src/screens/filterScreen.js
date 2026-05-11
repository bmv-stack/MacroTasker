import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFilters,
  resetFilters,
  initialState,
} from '../redux/slices/filterSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import CalendarComponent from '../components/calendarComponent';

const FilterScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const currentFilters = useSelector(state => state.filters);

  const [currentTab, setCurrentTab] = useState('Sort');
  const [draft, setDraft] = useState(currentFilters);
  const [calendar, setCalendar] = useState({ visible: false, type: null });

  const handleApply = () => {
    dispatch(setFilters(draft));
    navigation.goBack();
  };
  const handleReset = () => {
    dispatch(resetFilters());
    setDraft(initialState);
  };
  const activeFilterCount = () => {
    let count = 0;

    if (draft.sortOrder !== 'asc') count++;

    if (draft.status !== 'All') count++;

    if (draft.startDate || draft.endDate) count++;

    return count;
  };

  const activeCount = activeFilterCount();
  // TODO: Implement filtering by Task Status and Date Range, along with SectionList
  return (
    <View style={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.primary} />
        </TouchableOpacity>
        <Text style={styles.drawerHeaderText}>Filter</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetText}>RESET</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.drawerBody}>
        <View style={styles.drawerSideBar}>
          {['Sort', 'Type', 'Date'].map(tab => {
            const activeFilter =
              (tab === 'Sort' && draft.sortOrder !== 'asc') ||
              (tab === 'Type' && draft.status !== 'All') ||
              (tab === 'Date' && (draft.startDate || draft.endDate));
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.sidebarTab,
                  currentTab === tab && styles.activeSidebarTab,
                ]}
                onPress={() => setCurrentTab(tab)}
              >
                <Text
                  style={[
                    styles.sidebarTabText,
                    currentTab === tab && styles.activeSidebarTabText,
                  ]}
                >
                  {tab}
                </Text>
                {activeFilter && <View style={styles.activeDot} />}
              </TouchableOpacity>
            );
          })}
        </View>
        {/* TODO: Implement Due Date (Earliest First) sorting option */}
        <View style={styles.drawerTabContent}>
          {/* SORT */}
          {currentTab === 'Sort' && (
            <View style={styles.tabSection}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setDraft({ ...draft, sortOrder: 'asc' })}
              >
                <Icon
                  name={
                    draft.sortOrder === 'asc' ? 'checkbox' : 'square-outline'
                  }
                  size={24}
                  color={theme.accent}
                />
                <Text style={styles.checkboxLabel}>A-z Sorting</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setDraft({ ...draft, sortOrder: 'desc' })}
              >
                <Icon
                  name={
                    draft.sortOrder === 'desc' ? 'checkbox' : 'square-outline'
                  }
                  size={24}
                  color={theme.accent}
                />
                <Text style={styles.checkboxLabel}>Z-a Sorting</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() =>
                  setDraft({ ...draft, sortOrder: 'priorityHigh' })
                }
              >
                <Icon
                  name={
                    draft.sortOrder === 'priorityHigh'
                      ? 'checkbox'
                      : 'square-outline'
                  }
                  size={24}
                  color={theme.accent}
                />
                <Text style={styles.checkboxLabel}>Priority: High To Low</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setDraft({ ...draft, sortOrder: 'priorityLow' })}
              >
                <Icon
                  name={
                    draft.sortOrder === 'priorityLow'
                      ? 'checkbox'
                      : 'square-outline'
                  }
                  size={24}
                  color={theme.accent}
                />
                <Text style={styles.checkboxLabel}>Priority: Low To High</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* TYPE */}
          {currentTab === 'Type' && (
            <View style={styles.tabSection}>
              <Text style={styles.dateLabel}>Filter by Status</Text>
              {['All', 'Ongoing', 'Overdue', 'Completed'].map(statusItem => {
                const isSelected = draft.status === statusItem;
                return (
                  <TouchableOpacity
                    key={statusItem}
                    style={[styles.checkboxRow, { marginBottom: 15 }]}
                    onPress={() => setDraft({ ...draft, status: statusItem })}
                  >
                    <Icon
                      name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                      size={20}
                      color={isSelected ? theme.accent : theme.textMuted}
                    />
                    <Text style={[styles.checkboxLabel, { fontSize: 16 }]}>
                      {statusItem}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* DATE */}
          {currentTab === 'Date' && (
            <View style={styles.tabSection}>
              <Text style={styles.dateLabel}>Start Date</Text>
              <TouchableOpacity
                onPress={() =>
                  setCalendar({ visible: true, type: 'startDate' })
                }
              >
                <View style={styles.dateInputFake}>
                  <Icon name="calendar" size={24} color={theme.textMuted} />
                  <Text style={styles.dateInputText}>
                    {draft.startDate || 'Select Start Date'}
                  </Text>
                </View>
              </TouchableOpacity>

              <Text style={[styles.dateLabel, { marginTop: 30 }]}>
                End Date
              </Text>
              <TouchableOpacity
                onPress={() => setCalendar({ visible: true, type: 'endDate' })}
              >
                <View style={styles.dateInputFake}>
                  <Icon
                    name="calendar-outline"
                    size={20}
                    color={theme.textMuted}
                  />
                  <Text style={styles.dateInputText}>
                    {draft.endDate || 'Select End Date'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.applyBtn,
          activeCount === 0 && { backgroundColor: theme.textMuted },
        ]}
        onPress={handleApply}
      >
        <Text style={styles.applyBtnText}>
          {activeCount > 0 ? `APPLY (${activeCount})` : `APPLY`}
        </Text>
      </TouchableOpacity>
      <CalendarComponent
        visible={calendar.visible}
        onClose={() => setCalendar({ ...calendar, visible: false })}
        onSelect={day => {
          setDraft({ ...draft, [calendar.type]: day.dateString });
          setCalendar({ ...calendar, visible: false });
        }}
        initialDate={draft[calendar.type]}
        allowPastDates={true}
      />
    </View>
  );
};

export default FilterScreen;

const getStyles = theme =>
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
