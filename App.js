import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  AppState,
} from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
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

const DashboardStack = createNativeStackNavigator({
  screens: {
    Main: {
      screen: MainScreen,
      options: { headerShown: false, animation: 'fade' },
    },
    All: {
      screen: AllTasksScreen,
      options: { headerShown: false, animation: 'fade' },
    },
    TaskDetail: {
      screen: TaskDetailScreen,
      options: { headerShown: false, animation: 'ios_from_right' },
    },
  },
});

const Tab = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Dashboard: {
      screen: DashboardStack,
      options: {
        tabBarIcon: ({ focused, color }) => (
          <Icon
            name={focused ? 'home' : 'home-outline'}
            size={24}
            color={color}
          />
        ),
      },
    },
    Bills: {
      screen: PlaceholderScreen,
      options: {
        tabBarIcon: ({ focused, color }) => (
          <Icon
            name={focused ? 'receipt' : 'receipt-outline'}
            size={24}
            color={color}
          />
        ),
      },
    },
    AiTasks: {
      screen: PlaceholderScreen,
      options: {
        tabBarIcon: ({ focused, color }) => (
          <Icon
            name={focused ? 'sparkles' : 'sparkles-outline'}
            size={24}
            color={color}
          />
        ),
      },
    },
    SmartHome: {
      screen: PlaceholderScreen,
      options: {
        tabBarIcon: ({ focused, color }) => (
          <Icon
            name={focused ? 'id-card' : 'id-card-outline'}
            size={24}
            color={color}
          />
        ),
      },
    },
    Menu: {
      screen: PlaceholderScreen,
      options: {
        tabBarIcon: ({ focused, color }) => (
          <Icon
            name={focused ? 'list' : 'list-outline'}
            size={24}
            color={color}
          />
        ),
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    TabScreen: { screen: Tab, options: { headerShown: false } },
    CreateTask: {
      screen: CreateTaskScreen,
      options: { headerShown: false, animation: 'fade' },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

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
        setIsReady(true); // Still set ready to show error UI or fallback
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
      <Navigation
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
        })}
      />
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
