import React from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AllTasksScreen from './src/screens/allTasksScreen';
import MainScreen from './src/screens/mainScreen';
import CreateTaskScreen from './src/screens/createTaskScreen';
import { TaskProvider } from './src/context/taskContext';

const RootStack = createNativeStackNavigator({
  screens: {
    Main: {
      screen: MainScreen,
      options: { headerShown: false }
    },
    CreateTask: {
      screen: CreateTaskScreen,
      options: { headerShown: false }
    },
    AllTasks: {
      screen: AllTasksScreen,
      options: { headerShown: false }
    }
  }
});
const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <TaskProvider>
      <Navigation></Navigation>
    </TaskProvider>
  )
}