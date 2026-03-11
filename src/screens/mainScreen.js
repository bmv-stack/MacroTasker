import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    StatusBar,
    Platform,
    TouchableOpacity,
} from 'react-native';
import AppBar from '../components/appBar';
import SwitchTabs from '../components/tabPills';
import { useTasks } from '../context/taskContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const MainScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { tasks } = useTasks();
    const [activeTab, setActiveTab] = useState(
        route.params?.openScreen || 'Focus',
    );
    const today = new Date().toLocaleDateString('en-GB')
    const activeTasks = tasks.filter(t => !t.completed && t.date === today);
    const activeTaskCount = activeTasks.length;
    const [expanded, setExpanded] = useState(false);
    const displyedTasks = expanded ? activeTasks : activeTasks.slice(0, 4);
    return (
        <View style={styles.safeArea}>
            <View style={styles.content}>
                <AppBar
                    title="TODO APP"
                    onIconPress={() => navigation.navigate('CreateTask')}
                ></AppBar>
                <SwitchTabs
                    activeTab={activeTab}
                    onTabChange={value => {
                        if (value === 'All') {
                            navigation.navigate('All');
                        } else {
                            setActiveTab(value);
                        }
                    }}
                ></SwitchTabs>
                <View>
                    <Text style={styles.userGreetings}>Welcome User,</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.taskText}>{activeTaskCount} task(s) today</Text>

                    {activeTasks.length > 4 && (
                        <TouchableOpacity
                            style={{ padding: 5 }}
                            onPress={() => setExpanded(!expanded)}
                        >
                            <Text style={styles.viewallText}>
                                {expanded ? 'Collapse' : 'View All'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View>
                    <View style={styles.whiteContainer}>
                        {displyedTasks.length > 0 ? (
                            displyedTasks.map(item => {
                                return (
                                    <View
                                        key={item.id}
                                        style={[
                                            styles.taskRow,
                                            { backgroundColor: item.color || '#F2F2F7' },
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
                                                {item.time}
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
                </View>
            </View>
        </View>
    );
};
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
        padding: 15,
        marginVertical: 10,
        shadowOpacity: 0.1,
        elevation: 2,
        shadowRadius: 20,
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    content: {
        paddingHorizontal: 20,
    },
    greetingContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    userGreetings: {
        fontSize: 14,
        color: '#BCBCBC',
        fontWeight: '500',
    },
    viewallText: {
        color: '#007AFF',
        fontWeight: '600',
        fontSize: 14,
    },
    taskRow: {
        flexDirection: 'row',
        paddingVertical: 8,
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
        color: 'black',
        flex: 1,
        marginRight: 15,
    },
    taskTime: {
        fontSize: 12,
        fontWeight: '400',
        color: '#333',
        textAlign: 'right',
    },
    taskText: {
        fontWeight: '700',
        marginBottom: 10,
        fontSize: 22,
        color: 'black',
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
        color: 'white',
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
        paddingVertical: 10,
    },
    emptyTaskText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#8E8E93',
    },
});
export default MainScreen;
