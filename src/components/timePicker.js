import { StyleSheet, Text, View, Modal, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker'

const TimePicker = ({ visible, onClose, onSelect, initialTime }) => {
    const [selectedHours, setSelectedHours] = useState('00');
    const [selectedMinutes, setSelectedMinutes] = useState('00');
    const [selectedSeconds, setSelectedSeconds] = useState('00');

    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minuteSeconds = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    useEffect(() => {
        if (visible && typeof initialTime === 'string' && initialTime.includes(':')) {
            const parts = initialTime.split(':');
            if (parts.length === 3) {
                setSelectedHours(parts[0]);
                setSelectedMinutes(parts[1]);
                setSelectedSeconds(parts[2]);
            } else if (visible) {
                setSelectedHours('00');
                setSelectedMinutes('00');
                setSelectedSeconds('00')

            }
        }
    }, [visible, initialTime]);

    const handleConfirm = () => {
        onSelect(`${selectedHours}:${selectedMinutes}:${selectedSeconds}`);
        onClose();
    }
    return (
        <Modal visible={visible} transparent animationType='fade'>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Set Time</Text>

                    <View style={styles.pickerWrapper}>
                        <View style={styles.selectionLinesContainer} pointerEvents='none'>
                            <View style={styles.topLine}></View>
                            <View style={styles.bottomLine}></View>
                        </View>
                        <Picker
                            style={styles.pickerColumn}
                            selectedValue={selectedHours}
                            selectionColor='transparent'
                            itemStyle={{ backgroundColor: 'transparent', color: '#1C1C1E', fontSize: 22, fontWeight: '600' }}
                            onValueChange={(itemValue) => setSelectedHours(itemValue)}>
                            {hours.map((h) => <Picker.Item key={h} label={h} value={h} />)}
                        </Picker>
                        <Text style={styles.separator}>:</Text>
                        <Picker
                            style={styles.pickerColumn}
                            selectedValue={selectedMinutes}
                            selectionColor='transparent'
                            itemStyle={{ backgroundColor: 'transparent', color: '#1C1C1E', fontSize: 22, fontWeight: '600' }}
                            onValueChange={(itemValue) => setSelectedMinutes(itemValue)}>
                            {minuteSeconds.map((m) => <Picker.Item key={m} label={m} value={m} />)}
                        </Picker>
                        <Text style={styles.separator}>:</Text>
                        <Picker
                            style={styles.pickerColumn}
                            selectedValue={selectedSeconds}
                            selectionColor='transparent'
                            itemStyle={{ backgroundColor: 'transparent', color: '#1C1C1E', fontSize: 22, fontWeight: '600' }}
                            onValueChange={(itemValue) => setSelectedSeconds(itemValue)}>
                            {minuteSeconds.map((s) => <Picker.Item key={s} label={s} value={s} />)}
                        </Picker>
                    </View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveBtn} onPress={handleConfirm}>
                            <Text style={styles.saveText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default TimePicker

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#00000080',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        width: '93%',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 250
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        gap: 12,
    },
    pickerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 200,
        width: '100%',
        backgroundColor: 'transparent'
    },
    cancelBtn: {
        width: 100,
        backgroundColor: '#E5E5EA',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveBtn: {
        width: 100,
        backgroundColor: '#1C1C1E',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center'
    },
    cancelText: {
        fontWeight: '600',
        color: '#1C1C1E'
    },
    saveText: {
        fontWeight: '600',
        color: '#FFF'
    },
    pickerColumn: {
        flex: 1,
        backgroundColor: 'transparent',
        textShadowColor: 'transparent'
    },
    separator: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1C1C1E',
    },
    selectionLinesContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    topLine: {
        width: '100%',
        height: 0.5,
        backgroundColor: '#E5E5EA',
        position: 'absolute',
        top: 70,
    },
    middleMask: {
        width: '100%',
        height: 38,
        backgroundColor: '#FFF',
        position: 'absolute',
        top: 81,
        zIndex: -1,
    },
    bottomLine: {
        width: '100%',
        height: 1,
        backgroundColor: '#E5E5EA',
        position: 'absolute',
        bottom: 70,
    },
})