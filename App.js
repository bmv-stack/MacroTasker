import React, { useEffect } from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AllTasksScreen from './src/screens/allTasksScreen';
import MainScreen from './src/screens/mainScreen';
import CreateTaskScreen from './src/screens/createTaskScreen';
import TaskDetailScreen from './src/screens/taskDetailScreen';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from './src/themes/color';
import { store } from './src/redux/store';
import { Provider, useDispatch } from 'react-redux';
import { fetchTasks } from './src/redux/slices/taskSlice';
import { getDBConnection, createTable } from './src/database/db';

const PlaceholderScreen = ({ route }) => (
  <View style={styles.center}>
    <Text style={styles.devText}>{route.name} is under development!</Text>
  </View>
);

const DashboardStack = createNativeStackNavigator({
  screens: {
    Main: {
      screen: MainScreen,
      options: {
        headerShown: false,
        animation: 'fade'
      }
    },
    All: {
      screen: AllTasksScreen,
      options: {
        headerShown: false,
        animation: 'fade'
      }
    },
    TaskDetail: {
      screen: TaskDetailScreen,
      options: {
        headerShown: false,
        animation: 'ios_from_right'
      }
    }
  }
})
const Tab = createBottomTabNavigator({
  screens: {
    Dashboard: {
      screen: DashboardStack,
      options: {
        animation: 'fade',
        title: 'Dashboard'
      }
    },
    Bills: {
      screen: PlaceholderScreen
    },
    AiTasks: {
      screen: PlaceholderScreen
    },
    SmartHome: {
      screen: PlaceholderScreen
    },
    Menu: {
      screen: PlaceholderScreen
    },
  },

  screenOptions: ({ route }) => ({
    headerShown: false,
    tabBarStyle: styles.tabBar,
    tabBarActiveTintColor: Colors.activeTabBar,
    tabBarInactiveTintColor: Colors.inactiveTabBAr,
    tabBarLabelStyle: styles.tabLabel,
    tabBarLabel: ({ focused, color }) => {
      return (
        <Text style={[
          styles.tabLabel,
          { color }, focused && { fontWeight: '700', color: Colors.blackSecondary }
        ]}>
          {route.name === 'AiTasks' ? 'Ai Task' : route.name}
        </Text>
      )
    },
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
      return (
        <View style={styles.iconContainer}>
          {focused && (
            <View style={styles.indicatorContainer}>
              <LinearGradient
                colors={['transparent', Colors.blackSecondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.fadeLineLeft} />
              <View style={styles.activeIndicatorDot}></View>
              <LinearGradient
                colors={[Colors.blackSecondary, 'transparent']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.fadeLineRight}></LinearGradient>
            </View>
          )}
          <Icon name={iconName} size={22} color={focused ? Colors.blackSecondary : color}></Icon>
        </View>
      )
    }
  })
})

const RootStack = createNativeStackNavigator({
  screens: {
    TabScreen: {
      screen: Tab,
      options: {
        headerShown: false
      }
    },
    CreateTask: {
      screen: CreateTaskScreen,
      options: {
        headerShown: false,
        animation: 'fade',
      },
    },
  },
});
const Navigation = createStaticNavigation(RootStack);

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const startApp = async () => {

      const db = await getDBConnection();
      await createTable(db);
      dispatch(fetchTasks());
    };
    startApp();
  }, [dispatch]);
  return <Navigation />
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface
  },
  devText: {
    fontSize: 16,
    color: Colors.textMuted,
    fontWeight: '500'
  },
  tabBar: {
    height: 90,
    backgroundColor: Colors.surface,
    borderTopWidth: 1.5,
    borderTopColor: Colors.borderTop,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    paddingTop: 10,
    paddingHorizontal: 20,
    shadowColor: Colors.shadow,
    elevation: 0

  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 5
  },
  activeIndicatorDot: {
    width: 6.5,
    height: 6.5,
    borderRadius: 4,
    backgroundColor: Colors.blackPure,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible'
  },
  indicatorContainer: {
    position: 'absolute',
    top: -22,
    flexDirection: 'row',
    alignItems: 'center'
  },
  fadeLineLeft: {
    height: 1,
    width: 40,
  },
  fadeLineRight: {
    height: 1,
    width: 40
  }
})
