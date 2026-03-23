import React, { useState } from 'react';
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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTasks } from '../context/taskContext';
import FormInput from '../components/formInput';
import CalendarComponent from '../components/calendarComponent';
import TimePicker from '../components/timePicker';
import { Colors } from '../themes/color';
import Icon from 'react-native-vector-icons/Ionicons';

const formatTime = timeString => {
    if (!timeString || !timeString.includes(':')) return timeString;

    const [hours24, m] = timeString.split(':');
    let hours = parseInt(hours24, 10);
    const meridiem = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, '0')}:${m}`;
};

const CreateTaskScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { addNewTask, updateTask } = useTasks();
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
        console.log('Opening calendar for field:', field);
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
    const startDate = parseDate(form.date);
    const endDate = parseDate(form.endDate);
    const isStartDateValid =
        !startDate || (existingTask ? true : startDate >= now);
    const isDateValid = !endDate || (startDate && endDate >= startDate);
    const isFormValid =
        form.title.length > 0 &&
        form.date.length > 0 &&
        form.time.length > 0 &&
        isDateValid &&
        isStartDateValid;

    const handleInputChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };
    const handleFinalSubmit = () => {
        const taskData = {
            ...form,
            id: existingTask?.id || Math.random().toString(),
        };
        if (existingTask) {
            updateTask(taskData);
        } else {
            addNewTask(taskData);
        }
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            navigation.goBack();
        }, 1500);
    };

    const getInitialDate = () => {
        const dateToParse = currentField === 'date' ? form.date : form.endDate;
        const parsed = parseDate(dateToParse);
        return parsed
            ? parsed.toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0];
    };
    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollView}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Create Task</Text>
                    <View style={{ width: 30 }}></View>
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
                                editable={false}
                            ></FormInput>
                        </View>
                    </TouchableOpacity>
                    {form.date.length > 0 && !isStartDateValid && (
                        <Text
                            style={{
                                color: Colors.textError,
                                fontSize: 12,
                                marginBottom: 13,
                                marginTop: -17,
                            }}
                        >
                            Start date cannot be before current date
                        </Text>
                    )}
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
                                editable={false}
                            ></FormInput>
                        </View>
                    </TouchableOpacity>
                    <TimePicker
                        visible={timeModalVisible}
                        initialTime={new Date()}
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
                                editable={false}
                            ></FormInput>
                        </View>
                    </TouchableOpacity>
                    {!isDateValid && (
                        <Text
                            style={{
                                color: Colors.textError,
                                fontSize: 12,
                                marginBottom: 13,
                                marginTop: -17,
                            }}
                        >
                            End date cannot be before 'Date'
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
                                editable={false}
                            ></FormInput>
                        </View>
                    </TouchableOpacity>
                    <FormInput
                        label="Note"
                        placeholder="Add note"
                        value={form.notes}
                        onChangeText={val => handleInputChange('notes', val)}
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
                        <TouchableOpacity style={styles.modalContent}
                            activeOpacity={1}
                            onPress={() => setShowSuccess(false)}>
                            <Icon name='checkmark-circle'
                                size={60}
                                color={Colors.chartCompleted}
                                style={styles.modalIcon}></Icon>
                            <Text style={styles.modalText}>Task Created Successfully!</Text>
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
                    <Text style={styles.submitText}>Submit</Text>
                    <View style={styles.arrowContainer}>
                        <Text
                            style={{ color: Colors.white, fontWeight: 'bold', marginLeft: 5 }}
                        >
                            ➜
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
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
        color: Colors.textPrimary,
        fontSize: 30,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
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
        backgroundColor: Colors.buttonActive,
    },
    disableButton: {
        backgroundColor: Colors.buttonDisabled,
    },
    submitText: {
        color: Colors.textInverted,
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: Colors.blackPure,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.9,
    },
    modalContent: {
        backgroundColor: Colors.surface,
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
        color: Colors.textPrimary,
    },
    modalIcon: {
        marginBottom: 20
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
        borderColor: Colors.borderLight,
        backgroundColor: Colors.surface,
    },
    activePriorityPill: {
        backgroundColor: Colors.primary,
        borderColor: Colors.borderLight,
    },
    priorityPillText: {
        color: Colors.textMuted,
        fontWeight: '600',
    },
    activePriorityText: {
        color: Colors.textSecondary,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 15,
        color: Colors.textLabel,
    },
});

export default CreateTaskScreen;
export const parseDate = dateString => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day);
};
