import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './src/redux/store';
import { fetchTasks } from './src/redux/slices/taskSlice';
import { getDBConnection, createTable } from './src/database/db';
import { lightTheme, darkTheme } from './src/themes/color';
import AllTasksScreen from './src/screens/allTasksScreen';
import MainScreen from './src/screens/mainScreen';
import CreateTaskScreen from './src/screens/createTaskScreen';
import TaskDetailScreen from './src/screens/taskDetailScreen';
import SplashScreen from './src/screens/splashScreen';

const PlaceholderScreen = ({ route }) => {
  const isDarkMode = useSelector(state => state.tasks.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme);
  return (
    <View style={styles.center}>
      <Text style={styles.devText}>{route.name} is under development!</Text>
    </View>
  );
};

const DashboardStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

const DashboardStackScreen = () => (
  <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
    <DashboardStack.Screen
      name="Main"
      component={MainScreen}
      options={{ animation: 'fade' }}
    />
    <DashboardStack.Screen
      name="All"
      component={AllTasksScreen}
      options={{ animation: 'fade' }}
    />
    <DashboardStack.Screen
      name="TaskDetail"
      component={TaskDetailScreen}
      options={{ animation: 'ios_from_right' }}
    />
  </DashboardStack.Navigator>
);

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const isDarkMode = useSelector(state => state.tasks.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: theme.activeTabBar,
        tabBarInactiveTintColor: theme.inactiveTabBar,
        tabBarLabel: ({ focused, color }) => (
          <Text
            style={[
              styles.tabLabel,
              { color },
              focused && { fontWeight: '700', color: theme.blackSecondary },
            ]}
          >
            {route.name === 'AiTasks' ? 'Ai Task' : route.name}
          </Text>
        ),
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Bills') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'AiTasks') {
            iconName = focused ? 'sparkles' : 'sparkles-outline';
          } else if (route.name === 'SmartHome') {
            iconName = focused ? 'id-card' : 'id-card-outline';
          } else if (route.name === 'Menu') {
            iconName = focused ? 'list' : 'list-outline';
          }

          return <Icon name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStackScreen} />
      <Tab.Screen name="Bills" component={PlaceholderScreen} />
      <Tab.Screen name="AiTasks" component={PlaceholderScreen} />
      <Tab.Screen name="SmartHome" component={PlaceholderScreen} />
      <Tab.Screen name="Menu" component={PlaceholderScreen} />
    </Tab.Navigator>
  );
};

const RootStackScreen = () => (
  <RootStack.Navigator screenOptions={{ headerShown: false }}>
    <RootStack.Screen
      name="TabScreen"
      component={TabNavigator}
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="CreateTask"
      component={CreateTaskScreen}
      options={{ headerShown: false, animation: 'fade' }}
    />
  </RootStack.Navigator>
);

const AppContent = () => {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);

  const isDarkMode = useSelector(state => state.tasks.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme);

  useEffect(() => {
    const startApp = async () => {
      try {
        const db = await getDBConnection();
        await createTable(db);
        dispatch(fetchTasks());
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsReady(true);
      }
    };
    startApp();
  }, [dispatch]);

  if (!isReady) return <SplashScreen />;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <NavigationContainer>
        <RootStackScreen />
      </NavigationContainer>
    </View>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const getStyles = theme =>
  StyleSheet.create({
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.surface,
    },
    devText: {
      fontSize: 16,
      color: theme.textMuted,
      fontWeight: '500',
    },
    tabBar: {
      height: 90,
      backgroundColor: theme.surface,
      borderTopWidth: 1.5,
      borderTopColor: theme.borderTop || theme.borderLight,
      paddingBottom: Platform.OS === 'ios' ? 25 : 10,
      paddingTop: 10,
      paddingHorizontal: 20,
    },
    tabLabel: { fontSize: 10, fontWeight: '600', marginTop: 5 },
    activeIndicatorDot: { width: 6.5, height: 6.5, borderRadius: 4 },
    iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'visible',
    },
    indicatorContainer: {
      position: 'absolute',
      top: -22,
      flexDirection: 'row',
      alignItems: 'center',
    },
    fadeLineLeft: { height: 1, width: 40 },
    fadeLineRight: { height: 1, width: 40 },
  });
