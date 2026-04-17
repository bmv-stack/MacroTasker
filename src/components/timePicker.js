import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { lightTheme, darkTheme } from '../themes/color';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';

const TimePicker = ({ visible, onClose, onSelect, initialTime }) => {
  const isDarkMode = useSelector(state => state.tasks.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme);
  const [selectedHours, setSelectedHours] = useState('12');
  const [selectedMinutes, setSelectedMinutes] = useState('00');
  const [selectedSeconds, setSelectedSeconds] = useState('00');
  const [selectedMeridiem, setSelectedMeridiem] = useState('AM');

  const hours = Array.from({ length: 12 }, (notUSed, i) =>
    (i + 1).toString().padStart(2, '0'),
  );
  const minuteSeconds = Array.from({ length: 60 }, (notUsed, i) =>
    i.toString().padStart(2, '0'),
  );
  const meridiem = ['AM', 'PM'];

  if (Platform.OS === 'android') {
    if (!visible) return null;

    const onAndroid = (event, selectedDate) => {
      if (event.type === 'set' && selectedDate) {
        const hours = selectedDate.getHours().toString().padStart(2, '0');
        const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
        onSelect(`${hours}:${minutes}:00`);
      }
      onClose();
    };
    return (
      <DateTimePicker
        value={new Date()}
        mode="time"
        is24Hour={false}
        display="default"
        onChange={onAndroid}
      />
    );
  }

  useEffect(() => {
    if (
      visible &&
      typeof initialTime === 'string' &&
      initialTime.includes(':')
    ) {
      const [hour24, m, s] = initialTime.split(':');
      let hourValue = parseInt(hour24, 10);

      const meridiem = hourValue >= 12 ? 'PM' : 'AM';
      hourValue = hourValue % 12 || 12;

      setSelectedHours(hourValue.toString().padStart(2, '0'));
      setSelectedMinutes(m);
      setSelectedSeconds(s);
      setSelectedMeridiem(meridiem);
    }
  }, [visible, initialTime]);

  const handleConfirm = () => {
    let hour24 = parseInt(selectedHours, 10);
    if (selectedMeridiem === 'PM' && hour24 < 12) hour24 += 12;
    if (selectedMeridiem === 'AM' && hour24 === 12) hour24 = 0;

    const formattedTime = `${hour24
      .toString()
      .padStart(2, '0')}:${selectedMinutes}:${selectedSeconds}`;
    onSelect(formattedTime);
    onClose();
  };
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Set Time</Text>

          <View style={styles.pickerWrapper}>
            <View style={styles.selectionLinesContainer} pointerEvents="none">
              <View style={styles.topLine}></View>
              <View style={styles.bottomLine}></View>
            </View>
            <Picker
              style={styles.pickerColumn}
              selectedValue={selectedHours}
              selectionColor="transparent"
              itemStyle={styles.pickerItems}
              onValueChange={itemValue => setSelectedHours(itemValue)}
            >
              {hours.map(h => (
                <Picker.Item key={h} label={h} value={h} />
              ))}
            </Picker>
            <Text style={styles.separator}>:</Text>
            <Picker
              style={styles.pickerColumn}
              selectedValue={selectedMinutes}
              selectionColor="transparent"
              itemStyle={styles.pickerItems}
              onValueChange={itemValue => setSelectedMinutes(itemValue)}
            >
              {minuteSeconds.map(m => (
                <Picker.Item key={m} label={m} value={m} />
              ))}
            </Picker>
            <Text style={styles.separator}>:</Text>
            <Picker
              style={styles.pickerColumn}
              selectedValue={selectedSeconds}
              selectionColor="transparent"
              itemStyle={styles.pickerItems}
              onValueChange={itemValue => setSelectedSeconds(itemValue)}
            >
              {minuteSeconds.map(s => (
                <Picker.Item key={s} label={s} value={s} />
              ))}
            </Picker>
            <Picker
              style={styles.pickerColumn}
              selectedValue={selectedMeridiem}
              onValueChange={itemValue => setSelectedMeridiem(itemValue)}
              itemStyle={styles.pickerItems}
            >
              {meridiem.map(p => (
                <Picker.Item key={p} label={p} value={p} />
              ))}
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
  );
};

export default TimePicker;

const getStyles = theme =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.modalOverlay,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '93%',
      backgroundColor: theme.surface,
      borderRadius: 24,
      padding: 20,
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: 250,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 10,
    },
    pickerItems: {
      backgroundColor: 'transparent',
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: '600',
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
      backgroundColor: 'transparent',
    },
    cancelBtn: {
      width: 100,
      backgroundColor: theme.buttonCancel,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
    },
    saveBtn: {
      width: 100,
      backgroundColor: theme.buttonActive,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
    },
    cancelText: {
      fontWeight: '600',
      color: theme.buttonCancelText,
    },
    saveText: {
      fontWeight: '600',
      color: theme.textInverted,
    },
    pickerColumn: {
      flex: 1,
      backgroundColor: 'transparent',
      textShadowColor: 'transparent',
      marginHorizontal: -2,
    },
    separator: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.blackSecondary,
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
      backgroundColor: theme.pickerLine,
      position: 'absolute',
      top: 70,
      marginBottom: 40,
    },
    bottomLine: {
      width: '100%',
      height: 1,
      backgroundColor: theme.pickerLine,
      position: 'absolute',
      bottom: 70,
    },
  });
