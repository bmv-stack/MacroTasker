import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { getStyles } from '../screens/AllTasksScreen.styles';
import { useTheme } from '../contexts/ThemeContext';

const DateList = ({ item, selectedDate, setSelectedDate }) => {
  const { theme, isDarkMode } = useTheme();
  const screenStyles = getStyles(theme);
  const isSelected = item.fullDate.trim() === selectedDate.trim();
  const [monthName, dayName] = item.dayName.split(' ');
  const backgroundColor = isSelected
    ? isDarkMode
      ? theme.white
      : theme.blackSecondary
    : theme.surface;
  const textColor = isSelected
    ? isDarkMode
      ? '#000'
      : theme.white
    : theme.textMuted;
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

export default React.memo(DateList, (prev, next) => {
  const prevSelected = prev.item.fullDate === prev.selectedDate;
  const nextSelected = next.item.fullDate === next.selectedDate;

  return (
    prevSelected === nextSelected && prev.selectedDate === next.selectedDate
  );
});
