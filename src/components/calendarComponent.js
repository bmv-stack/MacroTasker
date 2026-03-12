import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Calendar } from 'react-native-calendars'
import Icon from 'react-native-vector-icons/Entypo'

const CalendarComponent = ({ visible, onClose, onSelect, initialDate }) => {

    const [tempSelectedDate, setTempSelectedDate] = useState(initialDate);

    useEffect(() => {
        if (visible) {
            setTempSelectedDate(initialDate);
        }
    }, [visible, initialDate])

    const handleSelectPress = () => {
        if (tempSelectedDate) {
            onSelect({ dateString: tempSelectedDate });
        };
    };
    return (
        <Modal
            visible={visible}
            transparent
            animationType='fade'>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Calendar
                        current={initialDate}
                        onDayPress={(day) => setTempSelectedDate(day.dateString)}
                        markedDates={{
                            [tempSelectedDate]: {
                                selected: true,
                                selectedColor: '#1C1C1E',
                                selectedTextColor: '#FFF'
                            }
                        }}
                        theme={{
                            backgroundColor: '#FFF',
                            calendarBackground: '#FFF',
                            textSectionTitleColor: '#B6B1B1',
                            selectedDayBackgroundColor: '#1C1C1E',
                            selectedDayTextColor: '#FFF',
                            todayTextColor: '#1C1C1E',
                            dayTextColor: '#2D4150',
                            textDisabledColor: '#D9E1E8',
                            monthTextColor: '#1C1C1E',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '600',
                            textDayFontSize: 14,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 12,
                        }}
                        renderArrow={(direction) => (
                            <Icon
                                name={direction === 'left' ? 'chevron-thin-left' : 'chevron-thin-right'}></Icon>
                        )}></Calendar>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.selectButton} onPress={handleSelectPress}>
                            <Text style={styles.selectText}>Select</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CalendarComponent

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#00000080',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        width: '95%',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        justifyContent: 'space-between',
        minHeight: 400
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        gap: 12,
    },
    cancelButton: {
        width: 120,
        backgroundColor: '#E5E5EA',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    selectButton: {
        width: 120,
        backgroundColor: '#1C1C1E',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center'
    },
    cancelText: {
        fontWeight: '600',
        color: '#1C1C1E'
    },
    selectText: {
        fontWeight: '600',
        color: '#FFF'
    }
})