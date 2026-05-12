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
import { getStyles } from './FilterScreen.styles';

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

    if (draft.sortOrder !== '') count++;

    if (draft.status !== '') count++;

    if (draft.startDate || draft.endDate) count++;

    return count;
  };
  // TODO, if the user doesn't choose endDate in Date Filtering, set today's date as endDate
  const activeCount = activeFilterCount();

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
              (tab === 'Sort' && draft.sortOrder !== '') ||
              (tab === 'Type' && draft.status !== '') ||
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

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setDraft({ ...draft, sortOrder: 'dueDate' })}
              >
                <Icon
                  name={
                    draft.sortOrder === 'dueDate'
                      ? 'checkbox'
                      : 'square-outline'
                  }
                  size={24}
                  color={theme.accent}
                />
                <Text style={styles.checkboxLabel}>
                  Due Date (Earliest First)
                </Text>
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
