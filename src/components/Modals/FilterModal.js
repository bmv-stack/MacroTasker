import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { lightTheme, darkTheme } from '../../themes/color';
import CalendarComponent from '../calendarComponent';

const FilterModal = ({
  visible,
  onClose,
  currentFilterTab,
  onTabChange,
  sortOrder,
  onSortChange,
  onReset,
  startDateFilter,
  endDateFilter,
  onOpenCalendar,
  calendarVisible,
  calendarType,
  calendarInitialDate,
  onCalendarSelect,
  onCalendarClose,
  onApply,
}) => {
  const isDarkMode = useSelector(state => state.tasks.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.drawerOverlay}>
        <View style={styles.drawerContent}>
          <View style={styles.drawerHeader}>
            <TouchableOpacity onPress={onClose}>
              <Icon name="arrow-back" size={24} color={theme.primary} />
            </TouchableOpacity>
            <Text style={styles.drawerHeaderText}>Filter</Text>
            <TouchableOpacity onPress={onReset}>
              <Text style={styles.resetText}>RESET</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.drawerBody}>
            <View style={styles.drawerSideBar}>
              {['Type', 'Date'].map(tab => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.sidebarTab,
                    currentFilterTab === tab && styles.activeSidebarTab,
                  ]}
                  onPress={() => onTabChange(tab)}
                >
                  <Text
                    style={[
                      styles.sidebarTabText,
                      currentFilterTab === tab && styles.activeSidebarTabText,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.drawerTabContent}>
              {currentFilterTab === 'Type' ? (
                <View style={styles.tabSection}>
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => onSortChange('asc')}
                  >
                    <Icon
                      name={sortOrder === 'asc' ? 'checkbox' : 'square-outline'}
                      size={24}
                      color={theme.accent}
                    />
                    <Text style={styles.checkboxLabel}>A-z Sorting</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => onSortChange('desc')}
                  >
                    <Icon
                      name={
                        sortOrder === 'desc' ? 'checkbox' : 'square-outline'
                      }
                      size={24}
                      color={theme.accent}
                    />
                    <Text style={styles.checkboxLabel}>Z-a Sorting</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.tabSection}>
                  <Text style={styles.dateLabel}>Start Date</Text>
                  <TouchableOpacity
                    onPress={() => onOpenCalendar('start')}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <View style={styles.dateInputFake}>
                      <Icon name="calendar" size={24} color={theme.textMuted} />
                      <Text style={styles.dateInputText}>
                        {startDateFilter || 'Select Start Date'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <Text style={[styles.dateLabel, { marginTop: 30 }]}>
                    End Date
                  </Text>
                  <TouchableOpacity
                    onPress={() => onOpenCalendar('end')}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <View style={styles.dateInputFake}>
                      <Icon
                        name="calendar-outline"
                        size={20}
                        color={theme.textMuted}
                      />
                      <Text style={styles.dateInputText}>
                        {endDateFilter || 'Select End Date'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {calendarVisible && (
                    <CalendarComponent
                      visible={true}
                      useModal={false}
                      onClose={onCalendarClose}
                      onSelect={onCalendarSelect}
                      initialDate={calendarInitialDate}
                      allowPastDates={true}
                    />
                  )}
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.applyBtn} onPress={onApply}>
            <Text style={styles.applyBtnText}>APPLY</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

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
      backgroundColor: theme.accent,
    },
    sidebarTabText: {
      color: theme.textMuted,
      fontWeight: '600',
    },
    activeSidebarTabText: {
      color: theme.primary,
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
  });

export default FilterModal;
