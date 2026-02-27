import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Modal, StatusBar, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTasks } from "../context/taskContext";
import FormInput from "../components/formInput";
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateTaskScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { addNewTask, updateTask } = useTasks();
    const { existingTask } = route.params || {};

    const [form, setForm] = useState({
        title: existingTask?.title || '',
        date: existingTask?.date || '',
        time: existingTask?.time || '',
        endDate: existingTask?.endDate || '',
        endTime: existingTask?.endTime || '',
        note: existingTask?.note || '',
        priority: existingTask?.priority || 'Normal'
    });
    const [picker, setPicker] = useState({
        show: false,
        mode: 'date',
        field: null,
    });

    const showPicker = (mode, field) => {
        setPicker({ show: true, mode, field })
    }

    const onPickerChange = (event, selectedVal) => {
        setPicker(prev => ({ ...prev, show: false }));

        if (event.type === 'dismissed') {
            return;
        }

        if (selectedVal) {
            let formattedValue = '';
            if (picker.mode === 'date') {
                formattedValue = selectedVal.toLocaleDateString('en-GB');
            } else {
                formattedValue = selectedVal.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
            handleInputChange(picker.field, formattedValue);
        }
    };
    const [showSuccess, setShowSuccess] = useState(false);

    const isFormValid = form.title.length > 0 && form.date.length > 0 && form.time.length > 0;

    const handleInputChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };
    const handleFinalSubmit = () => {
        const taskData = { ...form, id: existingTask?.id || Math.random().toString() };
        if (existingTask) {
            updateTask(taskData);
        } else {
            addNewTask(taskData)
        }
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            navigation.goBack();
        }, 1500)
    };
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Task</Text>
                <View style={{ width: 30 }}></View>
            </View>
            <View style={{ marginLeft: 15 }}>
                <FormInput
                    label="Title"
                    placeholder="Add Task Title"
                    value={form.title}
                    onChangeText={(val) => handleInputChange('title', val)}>
                </FormInput>
                <TouchableOpacity onPress={() => showPicker('date', 'date')}>
                    <View pointerEvents="none">
                        <FormInput label="Date" placeholder="Select Date" value={form.date} editable={false}></FormInput>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showPicker('time', 'time')}>
                    <View pointerEvents="none">
                        <FormInput label="Time" placeholder="Select Time" value={form.time} editable={false}></FormInput>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showPicker('date', 'endDate')}>
                    <View pointerEvents="none">
                        <FormInput label="End Date" placeholder="Select Date" value={form.endDate} editable={false}></FormInput>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showPicker('time', 'endTime')}>
                    <View pointerEvents="none">
                        <FormInput label="End Time" placeholder="Select Time" value={form.endTime} editable={false}></FormInput>
                    </View>
                </TouchableOpacity>
                <Text style={styles.label}>Priority</Text>
                <View style={styles.priorityRow}>
                    {['Low', 'Normal', 'High'].map((level) => (
                        <TouchableOpacity
                            key={level}
                            style={[styles.priorityPill, form.priority === level && styles.activePriorityPill]}
                            onPress={() => setForm({ ...form, priority: level })}>
                            <Text style={[styles.priorityPillText, form.priority === level && styles.activePriorityText]}>
                                {level}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <FormInput
                    label="Notes"
                    placeholder="Add a note..."
                    value={form.note}
                    onChangeText={(val) => handleInputChange('note', val)}>
                </FormInput>
                <View>
                    <TouchableOpacity style={[styles.submitButton, isFormValid ? styles.activeButton : styles.disableButton]}
                        onPress={handleFinalSubmit}
                        disabled={!isFormValid}>
                        <Text style={styles.submitText}>Submit</Text>
                        <Text style={{ color: '#FFF', fontWeight: 'bold', marginLeft: 5 }}>→</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {picker.show && (
                <DateTimePicker
                    value={new Date()}
                    mode={picker.mode}
                    is24Hour={false}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onPickerChange}>
                </DateTimePicker>
            )}
            <Modal transparent visible={showSuccess} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Task Created Successfully</Text>
                    </View>
                </View>

            </Modal>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10

    },
    backArrow: {
        color: 'black',
        fontSize: 30,

    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    button: {
        alignItems: 'center',
        marginTop: 30
    },
    submitButton: {
        flexDirection: 'row',
        paddingVertical: 16,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    activeButton: {
        backgroundColor: 'black'
    },
    disableButton: {
        backgroundColor: 'gray'
    },
    submitText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: '#c5d0c057',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.5
    },
    modalContent: {
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        width: '50%'
    },
    modalText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    priorityRow: {
        flexDirection: 'row',
        marginVertical: 10,
        gap: 10
    },
    priorityPill: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        backgroundColor: '#FFF'
    },
    activePriorityPill: {
        backgroundColor: '#000',
        borderColor: '#000'
    },
    priorityPillText: {
        color: '#8E8E93',
        fontWeight: '600'
    },
    activePriorityText: {
        color: '#FFF'
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 15,
        color: '#333'
    }

});

export default CreateTaskScreen;