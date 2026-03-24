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
import { useTasks } from '../context/taskContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../themes/color';

const formatTime = timeString => {
    if (!timeString || !timeString.includes(':')) return timeString;

    const [hours24, m] = timeString.split(':');
    let hours = parseInt(hours24, 10);
    const meridiem = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, '0')}:${m} ${meridiem}`;
};

const MainScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { tasks } = useTasks();
    const [activeTab, setActiveTab] = useState(
        route.params?.openScreen || 'Focus',
    );
    const today = new Date().toLocaleDateString('en-GB');
    const activeTasks = tasks.filter(t => !t.completed && t.date === today);
    const activeTaskCount = activeTasks.length;
    const [expanded, setExpanded] = useState(false);
    const displyedTasks = expanded ? activeTasks : activeTasks.slice(0, 4);
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
                            navigation.replace('All')
                        } else {
                            setActiveTab(value);
                        }
                    }}
                ></SwitchTabs>
                <View>
                    <Text style={styles.userGreetings}>Welcome User,</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.taskText}>{activeTaskCount} tasks today</Text>

                    {activeTasks.length > 4 && (
                        <TouchableOpacity
                            style={{ padding: 5 }}
                            onPress={() => setExpanded(!expanded)}
                        >
                            <Text style={styles.viewallText}>
                                {expanded ? 'View Less' : 'View All'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={[styles.whiteContainer, expanded && styles.expandedContainer]}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ padding: 15 }}
                    >
                        {displyedTasks.length > 0 ? (
                            displyedTasks.map(item => {
                                return (
                                    <View
                                        key={item.id}
                                        style={[
                                            styles.taskRow,
                                            { backgroundColor: item.color || Colors.taskDefaultBg },
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
                    </ScrollView>
                </View>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
    },
    whiteContainer: {
        flexDirection: 'column',
        backgroundColor: Colors.surface,
        borderRadius: 30,
        padding: 1,
        marginVertical: 10,
        shadowOpacity: 0.1,
        elevation: 2,
        shadowRadius: 20,
    },
    expandedContainer: {
        maxHeight: '70%'
    },
    container: {
        flex: 1,
        backgroundColor: Colors.surface,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    greetingContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    userGreetings: {
        fontSize: 14,
        color: Colors.textTertiary,
        fontWeight: '500',
    },
    viewallText: {
        color: Colors.accent,
        fontWeight: '600',
        fontSize: 14,
    },
    taskRow: {
        flexDirection: 'row',
        paddingVertical: 10,
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
        color: Colors.textPrimary,
        flex: 1,
        marginRight: 15,
    },
    taskTime: {
        fontSize: 12,
        fontWeight: '400',
        color: Colors.textSecondary,
        textAlign: 'right',
    },
    taskText: {
        fontWeight: '700',
        marginBottom: 10,
        fontSize: 20,
        color: Colors.textPrimary,
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
        backgroundColor: Colors.inactivePill,
        marginRight: 10,
        marginBottom: 15,
    },
    activePill: {
        backgroundColor: Colors.primary,
        color: Colors.white,
    },
    pillText: {
        color: Colors.textPlaceholder,
        fontWeight: '600',
    },
    activePillText: {
        color: Colors.white,
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
        minHeight: 40,
        paddingVertical: 10,
    },
    emptyTaskText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: Colors.textMuted,
    },
});
export default MainScreen;
