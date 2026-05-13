import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addNewTask } from '../redux/slices/taskSlice';
import FormInput from '../components/formInput';
import CalendarComponent from '../components/calendarComponent';
import TimePicker from '../components/timePicker';
import SuccessModal from '../components/Modals/SuccessModal';
import { useTheme } from '../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { formatTime } from '../utils/formatTime';
import { formatDate } from '../utils/formatDate';
import { getMinute } from '../utils/getMinutes';
import { currentTime } from '../utils/getCurrentTime';
import { getStyles } from './CreateTaskScreen.styles';
import { parseDate } from '../utils/parseDate';

const CreateTaskScreen = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
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

  const [showSuccess, setShowSuccess] = useState(false);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const isTimeValid = () => {
    if (!form.endDate || !form.endTime) return true;
    if (form.endDate > form.date) return true;
    if (form.endDate === form.date) {
      const startMinutes = getMinute(form.time);
      const endMinutes = getMinute(form.endTime);
      return endMinutes > startMinutes;
    }
    return false;
  };

  const isStartValid = () => {
    if (!form.date || !form.time) return true;
    const selectedDate = parseDate(form.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate > today) return true;

    if (selectedDate.getTime() === today.getTime()) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const selectedMinutes = getMinute(form.time);
      return selectedMinutes >= currentMinutes;
    }
    return false;
  };
  // ----- Form Validation -----
  const isFormValid =
    form.title.length > 0 &&
    form.date.length > 0 &&
    form.time.length > 0 &&
    isTimeValid() &&
    isStartValid();

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };
  const handleFinalSubmit = () => {
    const palette = theme.taskCardPalette;
    const randomColor = palette[Math.floor(Math.random() * palette.length)];
    const taskData = {
      ...form,
      color: existingTask?.color || randomColor,
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
    return date.toISOString().split('T')[0];
  };

  const getInitialDate = () => {
    const dateToParse = currentField === 'date' ? form.date : form.endDate;
    return dateToParse || todayDate();
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
              <Icon name="arrow-back" size={30} color={theme.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Task</Text>
            <TouchableOpacity
              onPress={toggleTheme}
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
                  label="Start Date"
                  placeholder="Add Date"
                  value={formatDate(form.date)}
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
                  label="Start Time"
                  placeholder="Add Time"
                  value={formatTime(form.time)}
                ></FormInput>
              </View>
            </TouchableOpacity>
            {!isStartValid() && (
              <Text style={styles.errorText}>
                Start Time cannot be a past time
              </Text>
            )}
            <TimePicker
              visible={timeModalVisible}
              initialTime={currentTime}
              onClose={() => setTimeModalVisible(false)}
              onSelect={formattedTime => {
                handleInputChange(currentField, formattedTime);
              }}
            ></TimePicker>

            <View>
              <TouchableOpacity onPress={() => handleOpenCalendar('endDate')}>
                <View pointerEvents="none">
                  <FormInput
                    label="End Date"
                    isOptional={true}
                    placeholder="Add end date"
                    value={formatDate(form.endDate)}
                  ></FormInput>
                </View>
              </TouchableOpacity>
              {form.endDate !== '' && (
                <TouchableOpacity
                  style={styles.clearIcon}
                  onPress={() => handleInputChange('endDate', '')}
                >
                  <Icon
                    name="close-circle"
                    size={20}
                    color={theme.buttonCancelText}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setCurrentField('endTime');
                  setTimeModalVisible(true);
                }}
              >
                <View pointerEvents="none">
                  <FormInput
                    label="End Time"
                    isOptional={true}
                    placeholder="Add end time"
                    value={formatTime(form.endTime)}
                  ></FormInput>
                </View>
              </TouchableOpacity>
              {form.endTime !== '' && (
                <TouchableOpacity
                  style={styles.clearIcon}
                  onPress={() => handleInputChange('endTime', '')}
                >
                  <Icon
                    name="close-circle"
                    size={20}
                    color={theme.buttonCancelText}
                  />
                </TouchableOpacity>
              )}
            </View>
            {!isTimeValid() && (
              <Text style={styles.errorText}>
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
              isOptional={true}
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
                handleInputChange(currentField, day.dateString);
                setIsCalendarVisible(false);
              }
            }}
          ></CalendarComponent>
          <SuccessModal
            visible={showSuccess}
            message={
              existingTask
                ? 'Task Updated Successfully!'
                : 'Task Created Successfully!'
            }
            onClose={() => setShowSuccess(false)}
          />
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

export default CreateTaskScreen;
