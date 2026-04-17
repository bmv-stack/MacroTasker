import React, { useState, useRef } from 'react';
import DatePicker from 'react-native-date-picker';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  StatusBar,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addNewTask, toggleTheme } from '../redux/slices/taskSlice';
import FormInput from '../components/formInput';
import CalendarComponent from '../components/calendarComponent';
import TimePicker from '../components/timePicker';
import { lightTheme, darkTheme } from '../themes/color';
import Icon from 'react-native-vector-icons/Ionicons';

const getMinute = stringTime => {
  if (!stringTime || !stringTime.includes(' ')) return 0;
  const [time, meridiem] = stringTime.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (meridiem === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (meridiem === 'AM' && hours === 12) {
    hours = 0;
  }
  return hours * 60 + minutes;
};

const formatTime = timeString => {
  if (!timeString || !timeString.includes(':')) return timeString;

  const [hours24, m] = timeString.split(':');
  let hours = parseInt(hours24, 10);
  const meridiem = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, '0')}:${m} ${meridiem}`;
};

const CreateTaskScreen = () => {
  const isDarkMode = useSelector(state => state.tasks.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme);
  const scrollRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { existingTask } = route.params || {};
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const [form, setForm] = useState({
    title: existingTask?.title || '',
    date: existingTask?.date || '',
    time: existingTask?.time || '',
    endDate: existingTask?.endDate || '',
    endTime: existingTask?.endTime || '',
    notes: existingTask?.notes || '',
    priority: existingTask?.priority || 'Normal',
  });

  const [currentField, setCurrentField] = useState(null);

  const handleOpenCalendar = field => {
    setCurrentField(field);
    setIsCalendarVisible(true);
  };

  const [timeModalVisible, setTimeModalVisible] = useState(false);

  const [picker, setPicker] = useState({
    open: false,
    mode: 'date',
    field: null,
  });

  const onPickerChange = selectedVal => {
    setPicker(prev => ({ ...prev, open: false }));

    let formattedValue = '';
    if (picker.mode === 'date') {
      formattedValue = selectedVal.toLocaleDateString('en-GB');
    } else {
      formattedValue = selectedVal.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }
    handleInputChange(picker.field, formattedValue);
  };
  const [showSuccess, setShowSuccess] = useState(false);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const isDateValid = () => {
    if (!form.endDate) return true;
    const startDate = parseDate(form.date);
    const endDate = parseDate(form.endDate);
    return endDate >= startDate;
  };
  const isTimeValid = () => {
    if (!form.endDate || !form.endTime || form.date !== form.endDate)
      return true;
  };

  const isFormValid =
    form.title.length > 0 && form.date.length > 0 && form.time.length > 0;
  isDateValid() && isTimeValid();

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };
  const handleFinalSubmit = () => {
    const taskData = {
      ...form,
      id:
        existingTask?.id ||
        `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    dispatch(addNewTask(taskData));

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigation.goBack();
    }, 1500);
  };

  const todayDate = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getInitialDate = () => {
    const dateToParse = currentField === 'date' ? form.date : form.endDate;
    if (!dateToParse) {
      return todayDate();
    }
    const [date, month, year] = dateToParse.split('/');
    return `${year}-${month}-${date}`;
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.container}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="never"
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Task</Text>
            <TouchableOpacity
              onPress={() => dispatch(toggleTheme())}
              hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
            >
              <Icon
                name={isDarkMode ? 'sunny' : 'moon'}
                size={24}
                color={theme.textPrimary}
              />
            </TouchableOpacity>
          </View>
          <View style={{ marginLeft: 15, marginTop: 20 }}>
            <FormInput
              label="Title"
              placeholder="Add Title"
              value={form.title}
              onChangeText={val => handleInputChange('title', val)}
            ></FormInput>
            <TouchableOpacity onPress={() => handleOpenCalendar('date')}>
              <View pointerEvents="none">
                <FormInput
                  label="Date"
                  placeholder="Add Date"
                  value={form.date}
                ></FormInput>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setCurrentField('time');
                setTimeModalVisible(true);
              }}
            >
              <View pointerEvents="none">
                <FormInput
                  label="Time"
                  placeholder="Add Time"
                  value={formatTime(form.time)}
                ></FormInput>
              </View>
            </TouchableOpacity>
            <TimePicker
              visible={timeModalVisible}
              initialTime={(() => {
                const timeStr =
                  currentField === 'time' ? form.time : form.endTime;
                if (timeStr) {
                  const [h, m, s] = timeStr.split(':').map(Number);
                  return new Date(2000, 0, 1, h, m, s || 0);
                }
                return new Date();
              })()}
              onClose={() => setTimeModalVisible(false)}
              onSelect={formattedTime =>
                handleInputChange(currentField, formattedTime)
              }
            ></TimePicker>
            <TouchableOpacity onPress={() => handleOpenCalendar('endDate')}>
              <View pointerEvents="none">
                <FormInput
                  label="End Date"
                  placeholder="Add end date"
                  value={form.endDate}
                ></FormInput>
              </View>
            </TouchableOpacity>
            {form.endDate && !isDateValid() && (
              <Text
                style={{
                  color: theme.textError,
                  fontSize: 12,
                  marginBottom: 10,
                  marginTop: -5,
                }}
              >
                End Date cannot be before 'Date'
              </Text>
            )}
            <TouchableOpacity
              onPress={() => {
                setCurrentField('endTime');
                setTimeModalVisible(true);
              }}
            >
              <View pointerEvents="none">
                <FormInput
                  label="End Time"
                  placeholder="Add end time"
                  value={formatTime(form.endTime)}
                ></FormInput>
              </View>
            </TouchableOpacity>
            {!isTimeValid() && form.date === form.endDate && (
              <Text
                style={{
                  color: theme.textError,
                  fontSize: 12,
                  marginBottom: 10,
                  marginTop: -5,
                }}
              >
                End Time must be after 'Time'
              </Text>
            )}
            <Text style={styles.label}>Task Priority</Text>
            <View style={styles.priorityRow}>
              {['Low', 'Normal', 'High'].map(priority => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityPill,
                    form.priority === priority && styles.activePriorityPill,
                  ]}
                  onPress={() => handleInputChange('priority', priority)}
                >
                  <Text
                    style={[
                      styles.priorityPillText,
                      form.priority === priority && styles.activePriorityText,
                    ]}
                  >
                    {priority}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <FormInput
              label="Note"
              placeholder="Add note"
              value={form.notes}
              onChangeText={val => handleInputChange('notes', val)}
              onFocus={() => {
                setTimeout(() => {
                  scrollRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }}
            ></FormInput>
          </View>
          <CalendarComponent
            visible={isCalendarVisible}
            initialDate={getInitialDate()}
            onClose={() => setIsCalendarVisible(false)}
            onSelect={day => {
              if (day && day.dateString) {
                const [y, m, d] = day.dateString.split('-');
                const formattedDate = `${d}/${m}/${y}`;
                handleInputChange(currentField, formattedDate);
                setIsCalendarVisible(false);
              }
            }}
          ></CalendarComponent>
          {picker.open && (
            <DatePicker
              modal
              open={picker.open}
              date={new Date()}
              mode={picker.mode}
              theme="light"
              onConfirm={onPickerChange}
              onCancel={() => setPicker(prev => ({ ...prev, open: false }))}
              confirmText="Select"
              cancelText="Cancel"
              title="Set Time"
            />
          )}
          <Modal transparent visible={showSuccess} animationType="fade">
            <View style={styles.modalOverlay}>
              <TouchableOpacity
                style={styles.modalContent}
                activeOpacity={1}
                onPress={() => setShowSuccess(false)}
              >
                <Icon
                  name="checkmark-done-circle"
                  size={60}
                  color={theme.chartCompleted}
                  style={styles.modalIcon}
                ></Icon>
                <Text style={styles.modalText}>
                  {existingTask
                    ? 'Task Updated Successfully!'
                    : 'Task Created Successfully!'}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </ScrollView>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: Platform.OS === 'ios' ? 22 : 40,
          }}
        >
          <TouchableOpacity
            style={[
              styles.submitButton,
              isFormValid ? styles.activeButton : styles.disableButton,
            ]}
            onPress={handleFinalSubmit}
            disabled={!isFormValid}
          >
            <Text style={styles.submitText}>
              {existingTask ? 'Update' : 'Submit'}
            </Text>
            <View style={styles.arrowContainer}>
              <Text
                style={{
                  color: theme.textInverted,
                  fontWeight: 'bold',
                  marginLeft: 5,
                  fontSize: 16,
                }}
              >
                ➜
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight,
    },
    scrollView: {
      paddingHorizontal: 2,
      paddingBottom: 40,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
    arrowContainer: {
      position: 'absolute',
      right: 20,
    },
    backArrow: {
      color: theme.textPrimary,
      fontSize: 30,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.primary,
    },
    button: {
      alignItems: 'center',
      marginTop: 30,
    },
    submitButton: {
      flexDirection: 'row',
      paddingVertical: 16,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      width: '70%',
      height: 58,
    },
    activeButton: {
      backgroundColor: theme.buttonActive,
    },
    disableButton: {
      backgroundColor: theme.buttonDisabled,
    },
    submitText: {
      color: theme.textInverted,
      fontWeight: 'bold',
      fontSize: 16,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.blackPure,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0.9,
    },
    modalContent: {
      backgroundColor: theme.surface,
      padding: 30,
      borderRadius: 35,
      alignItems: 'center',
      justifyContent: 'center',
      width: '80%',
    },
    modalText: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      color: theme.textPrimary,
    },
    modalIcon: {
      marginBottom: 20,
    },
    priorityRow: {
      flexDirection: 'row',
      marginVertical: 10,
      gap: 10,
    },
    priorityPill: {
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.borderLight,
      backgroundColor: theme.surface,
    },
    activePriorityPill: {
      backgroundColor: theme.buttonActive,
      borderColor: theme.borderLight,
    },
    priorityPillText: {
      color: theme.textMuted,
      fontWeight: '600',
    },
    activePriorityText: {
      color: theme.textInverted,
    },
    label: {
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 15,
      color: theme.textLabel,
    },
  });

export default CreateTaskScreen;
export const parseDate = dateString => {
  if (!dateString) return null;
  const parts = dateString.split('/');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  const date = new Date(year, month - 1, day);
  return isNaN(date.getTime()) ? null : date;
};
