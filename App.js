import React from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AllTasksScreen from './src/screens/allTasksScreen';
import MainScreen from './src/screens/mainScreen';
import CreateTaskScreen from './src/screens/createTaskScreen';
import { TaskProvider } from './src/context/taskContext';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


const PlaceholderScreen = ({ route }) => (
  <View style={styles.center}>
    <Text style={styles.devText}>{route.name} is under development!</Text>
  </View>
);
const Tab = createBottomTabNavigator({
  screens: {
    Dashboard: {
      screen: MainScreen
    },
    All: {
      screen: AllTasksScreen,
      options: {
        tabBarButton: () => null,
        tabBarItemStyle: { display: 'none' }
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
    tabBarActiveTintColor: '#1c1c1e',
    tabBarInactiveTintColor: '#8e8e93',
    tabBarLabelStyle: styles.tabLabel,
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
          {focused && <View style={styles.activeIndicatorDot} />}
          <Icon name={iconName} size={22} color={color}></Icon>
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

export default function App() {
  return (
    <TaskProvider>
      <Navigation></Navigation>
    </TaskProvider>
  );
}
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  devText: {
    fontSize: 16,
    color: '#8e8e93',
    fontWeight: '500'
  },
  tabBar: {
    height: 80,
    backgroundColor: '#fff',
    borderTopWidth: 1.5,
    borderTopColor: '#000',
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    paddingTop: 10,
    paddingHorizontal: 20
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 5
  },
  activeIndicatorDot: {
    position: 'absolute',
    top: -16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000'
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  }
})
