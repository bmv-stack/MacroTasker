import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Entypo';
import { lightTheme, darkTheme } from '../themes/color';
import { useSelector } from 'react-redux';

const CalendarComponent = ({ visible, onClose, onSelect, initialDate }) => {
  const isDarkMode = useSelector(state => state.tasks.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme);
  const todayDate = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = todayDate();

  const [tempSelectedDate, setTempSelectedDate] = useState(initialDate);
  const [currentVisibleMonth, setCurrentVisibleMonth] = useState(
    (initialDate || today).substring(0, 7),
  );

  const currentMonth = today.substring(0, 7);
  const minMonth = currentVisibleMonth <= currentMonth;

  useEffect(() => {
    if (visible) {
      setTempSelectedDate(initialDate);
      setCurrentVisibleMonth((initialDate || today).substring(0, 7));
    }
  }, [visible, initialDate]);

  const handleSelectPress = () => {
    if (tempSelectedDate) {
      onSelect({ dateString: tempSelectedDate });
    }
  };
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Calendar
            minDate={today}
            current={initialDate || today}
            onDayPress={day => setTempSelectedDate(day.dateString)}
            markedDates={{
              [tempSelectedDate]: {
                selected: true,
                selectedColor: theme.black,
                selectedTextColor: theme.white,
              },
            }}
            theme={{
              backgroundColor: theme.surface,
              calendarBackground: theme.surface,
              textSectionTitleColor: theme.calendarHeader,

              selectedDayBackgroundColor: theme.primary,
              selectedDayTextColor: theme.white,
              todayTextColor: theme.primary,
              dayTextColor: theme.dayTextColor,
              textDisabledColor: theme.calendarDisabled,
              monthTextColor: theme.textPrimary,
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 12,
            }}
            disableArrowLeft={minMonth}
            onMonthChange={month => {
              setCurrentVisibleMonth(month.dateString.substring(0, 7));
            }}
            hideExtraDays={true}
            disableAllTouchEventsForDisabledDays={false}
            renderArrow={direction => (
              <Icon
                name={
                  direction === 'left'
                    ? 'chevron-thin-left'
                    : 'chevron-thin-right'
                }
              ></Icon>
            )}
          ></Calendar>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={handleSelectPress}
            >
              <Text style={styles.selectText}>Select</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CalendarComponent;

const getStyles = theme =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.modalOverlay,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '95%',
      backgroundColor: theme.surface,
      borderRadius: 24,
      padding: 20,
      justifyContent: 'space-between',
      minHeight: 400,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
      gap: 12,
    },
    cancelButton: {
      width: 120,
      backgroundColor: theme.buttonCancel,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
    },
    selectButton: {
      width: 120,
      backgroundColor: theme.buttonActive,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
    },
    cancelText: {
      fontWeight: '600',
      color: theme.buttonCancelText,
    },
    selectText: {
      fontWeight: '600',
      color: theme.white,
    },
  });
