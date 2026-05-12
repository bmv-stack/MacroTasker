import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { getStyles } from '../screens/AllTasksScreen.styles';
import { useTheme } from '../contexts/ThemeContext';

const DateList = ({ item, selectedDate, setSelectedDate }) => {
  const { theme, isDarkMode } = useTheme();
  const screenStyles = getStyles(theme);
  const isSelected = item.fullDate === selectedDate;
  const [monthName, dayName] = item.dayName.split(' ');
  let backgroundColor;
  if (isSelected) {
    backgroundColor = isDarkMode ? theme.white : theme.blackSecondary;
  }
  let textColor;
  if (isSelected) {
    textColor = isDarkMode ? '#000' : theme.white;
  } else {
    textColor = theme.textMuted;
  }
  return (
    <TouchableOpacity
      onPress={() => setSelectedDate(item.fullDate)}
      style={[screenStyles.dateCard, { backgroundColor }]}
    >
      <Text style={[screenStyles.dateNumber, { color: textColor }]}>
        {item.dayNumber}
      </Text>
      <Text style={[screenStyles.dateMonthName, { color: textColor }]}>
        {monthName}
      </Text>
      <Text style={[screenStyles.dateDay, { color: textColor }]}>
        {dayName}
      </Text>
    </TouchableOpacity>
  );
};

export default DateList;
