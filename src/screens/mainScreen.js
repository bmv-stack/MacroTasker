import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import AppBar from '../components/appBar';
import SwitchTabs from '../components/tabPills';
import { useSelector } from 'react-redux';
import { useTheme } from '../contexts/ThemeContext';
import { formatTime } from '../utils/formatTime';
import { getStyles } from './MainScreen.styles';

const MainScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
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

export default MainScreen;
