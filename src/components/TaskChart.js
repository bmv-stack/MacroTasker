import { Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { getStyles } from '../screens/AllTasksScreen.styles';
import { useTheme } from '../contexts/ThemeContext';
import { PieChart } from 'react-native-gifted-charts';

const TaskChart = ({
  chartData,
  selectedData,
  chartKey,
  resetTotal,
  startDate,
  endDate,
}) => {
  const { theme, isDarkMode } = useTheme();
  const styles = getStyles(theme);
  if (!chartData || chartData.length === 0) return null;
  return (
    <View style={styles.chartContainer}>
      <TouchableOpacity activeOpacity={1} onPress={resetTotal}>
        <PieChart
          key={chartKey}
          donut
          focusOnPress
          sectionAutoFocus
          shadow
          radius={70}
          innerRadius={55}
          innerCircleColor={isDarkMode ? theme.background : theme.white}
          data={chartData}
          centerLabelComponent={() => (
            <View style={{ alignItems: 'center' }}>
              <Text
                style={
                  startDate && endDate
                    ? styles.centerChartCount
                    : {
                        fontWeight: 'bold',
                        fontSize: 22,
                        color: isDarkMode ? theme.white : theme.blackSecondary,
                      }
                }
              >
                {selectedData.value}
              </Text>
              <Text
                style={
                  startDate && endDate
                    ? styles.centerChartLabel
                    : {
                        fontSize: 10,
                        color: isDarkMode ? theme.white : theme.blackSecondary,
                        fontWeight: '600',
                      }
                }
              >
                {selectedData.label}
              </Text>
            </View>
          )}
        />
      </TouchableOpacity>
      <View style={styles.dotContainer}>
        {chartData.map((item, index) => {
          if (item.label === 'Pending Tasks' && item.value === 0) {
            return null;
          }
          return (
            <View key={index} style={styles.chartItem}>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              <Text style={styles.dotText}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default TaskChart;
