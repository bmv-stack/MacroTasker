import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, StatusBar, Platform } from 'react-native';
import AppBar from '../components/appBar';
import SwitchTabs from '../components/tabPills';
import { useTasks } from '../context/taskContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const MainScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { tasks } = useTasks();
    const [activeTab, setActiveTab] = useState(route.params?.openScreen || 'Focus');
    console.log("Curent Active Tab:", activeTab);
    const filteredTasks = activeTab === 'Focus' ? tasks.filter(t => !t.completed) : tasks;
    return (
        <View style={styles.safeArea}>
            <View style={styles.content}>
                <AppBar title='TODO APP' onIconPress={() => navigation.navigate('CreateTask')}>
                </AppBar>
                <SwitchTabs
                    activeTab={activeTab}
                    onTabChange={(value) => {
                        if (value === 'All') {
                            navigation.navigate('AllTasks')
                        } else {
                            setActiveTab(value);
                        }
                    }}>
                </SwitchTabs>
                <View>
                    <Text style={styles.userGreetings}>Hello User,</Text>
                    <Text style={styles.taskText}>{filteredTasks.length} Task(s) Today</Text>
                </View>
                <View>
                    <View style={styles.whiteContainer}>
                        <ScrollView contentContainerStyle={styles.scrollContainer}>
                            {filteredTasks.length > 0 ? (
                                filteredTasks.map((item) => {
                                    return (
                                        <View key={item.id} style={[styles.taskRow, { backgroundColor: item.color || '#F2F2F7' }]}>
                                            <View style={styles.taskHeaderRow}>
                                                <Text style={[styles.taskTitle, item.completed && {
                                                    textDecorationLine: 'line-through',
                                                    color: '#a39f9f',
                                                    opacity: 0.6
                                                }]}>{item.title}</Text>
                                                <Text style={[styles.taskTime, item.completed && {
                                                    textDecorationLine: 'line-through',
                                                    color: '#a39f9f',
                                                    opacity: 0.6
                                                }]}>{item.time}</Text>
                                            </View>
                                        </View>
                                    );
                                })) : (
                                <View style={styles.emptyTaskContainer}>
                                    <Text style={styles.emptyTaskText}>No Tasks available</Text>
                                </View>
                            )
                            }
                        </ScrollView>
                    </View>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,

    },
    whiteContainer: {
        flexDirection: 'column',
        backgroundColor: '#FFF',
        borderRadius: 30,
        padding: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 2,
        height: 260,
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    content: {
        paddingHorizontal: 20,
    },
    greetingContainer: {
        marginTop: 20,
        marginBottom: 20
    },
    userGreetings: {
        fontSize: 16,
        marginBottom: 15,
        color: '#8E8E93',
        fontWeight: '500',
    },
    taskRow: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginBottom: 10,
    },
    taskHeaderRow: {
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row'
    },
    taskTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: 'black',
        flex: 1,
        marginRight: 10
    },
    taskTime: {
        fontSize: 12,
        fontWeight: '400',
        color: '#333',
    },
    taskText: {
        fontWeight: 'bold',
        marginBottom: 15,
        fontSize: 28,
        color: 'black',
        marginTop: 4,
    },
    tabContainer: {
        marginBottom: 25,
    },
    scrollContainer: {
        paddingRight: 20,
        justifyContent: 'space-between',
        fontSize: 15,
        flexDirection: 'column'
    },
    pill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: '#8e8b8b',
        marginRight: 10,
        marginBottom: 15,
    },
    activePill: {
        backgroundColor: 'black',
        color: 'white',
    },
    pillText: {
        color: '#dedee6',
        fontWeight: '600',
    },
    activePillText: {
        color: 'white'
    },
    taskListContainer: {
        flex: 1,
        marginTop: 10,
        minHeight: 50,
    },
    taskListCard: {
        borderRadius: 30,
        padding: 20,

    },
    emptyTaskContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 10
    },
    emptyTaskText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#8E8E93'
    }
});
export default MainScreen;
