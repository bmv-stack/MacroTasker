import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AppBar from '../components/appBar';
import SwitchTabs from '../components/tabPills';
import { useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { formatTime } from '../utils/formatTime';

const MainScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const route = useRoute();
  const tasks = useSelector(state => state.tasks.items);
  const [activeTab, setActiveTab] = useState(
    route.params?.openScreen || 'Focus',
  );
  const today = new Date().toISOString().split('T')[0];
  const activeTasks = tasks.filter(t => !t.completed && t.date === today);
  const activeTaskCount = activeTasks.length;
  const displyedTasks = activeTasks;
  return (
    <View style={styles.safeArea}>
      <View style={styles.content}>
        <AppBar
          title="MACROTASKER"
          onIconPress={() => navigation.navigate('CreateTask')}
        ></AppBar>
        <SwitchTabs
          activeTab={activeTab}
          onTabChange={value => {
            if (value === 'All') {
              navigation.replace('All');
            } else {
              setActiveTab(value);
            }
          }}
        ></SwitchTabs>
        <View>
          <Text style={styles.userGreetings}>Welcome User,</Text>
        </View>
        <View style={styles.taskCountContainer}>
          <Text style={styles.taskText}>{activeTaskCount} tasks today</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          alwaysBounceVertical={false}
        >
          <View style={styles.taskContainer}>
            {displyedTasks.length > 0 ? (
              displyedTasks.map(item => {
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.taskRow,
                      { backgroundColor: item.color || theme.taskDefaultBg },
                    ]}
                  >
                    <View style={styles.taskHeaderRow}>
                      <Text
                        style={[
                          styles.taskTitle,
                          item.completed && {
                            textDecorationLine: 'line-through',
                            color: '#a39f9f',
                            opacity: 0.5,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={[
                          styles.taskTime,
                          item.completed && {
                            textDecorationLine: 'line-through',
                            color: '#a39f9f',
                            opacity: 0.5,
                          },
                        ]}
                      >
                        {formatTime(item.time)}
                      </Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyTaskContainer}>
                <Text style={styles.emptyTaskText}>No Tasks available!</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
const getStyles = theme =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
    },
    container: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
    userGreetings: {
      fontSize: 14,
      color: theme.textTertiary,
      fontWeight: '500',
    },
    taskCountContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    taskRow: {
      flexDirection: 'row',
      paddingVertical: 14,
      paddingHorizontal: 25,
      borderRadius: 50,
      marginBottom: 10,
    },
    taskHeaderRow: {
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      flexDirection: 'row',
    },
    taskTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textPrimary,
      flex: 1,
      marginRight: 15,
    },
    taskTime: {
      fontSize: 12,
      fontWeight: '400',
      color: theme.textSecondary,
      textAlign: 'right',
    },
    taskText: {
      fontWeight: '700',
      marginBottom: 10,
      fontSize: 20,
      color: theme.textPrimary,
      marginTop: 4,
      marginBottom: 15,
    },
    tabContainer: {
      marginBottom: 25,
    },
    pill: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 25,
      backgroundColor: theme.inactivePill,
      marginRight: 10,
      marginBottom: 15,
    },
    activePill: {
      backgroundColor: theme.primary,
      color: theme.white,
    },
    pillText: {
      color: theme.textPlaceholder,
      fontWeight: '600',
    },
    activePillText: {
      color: theme.white,
    },
    emptyTaskContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 40,
      paddingVertical: 10,
    },
    emptyTaskText: {
      fontWeight: 'bold',
      fontSize: 16,
      color: theme.textMuted,
    },
    scrollContainer: {
      paddingBottom: 20,
    },
    taskContainer: {
      marginTop: 5,
    },
  });
export default MainScreen;
