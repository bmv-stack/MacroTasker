import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTasks } from "../context/taskContext";
import AppBar from '../components/appBar';
import SwitchTabs from "../components/tabPills";
import { PieChart } from "react-native-gifted-charts";

const AllTasksScreen = () => {
    const navigation = useNavigation();
    const { tasks, deleteTask, completeTask } = useTasks();
    const [activeTab, setActiveTab] = useState('All');
    console.log("Curent Active Tab:", activeTab);

    const days = [
        { day: 'THU', date: '21' },
        { day: 'FRI', date: '22' },
        { day: 'SAT', date: '23' },
        { day: 'SUN', date: '24', active: true },
        { day: 'MON', date: '25' },
        { day: 'TUE', date: '26' },
        { day: 'WED', date: '27' },
    ];

    const priorityStyles = {
        High: { bg: '#FFD1D1', text: 'red' },
        Normal: { bg: '#D1E9FF', text: 'blue' },
        Low: { bg: '#D1FFD7', text: 'green' },
    }

    const completedCount = tasks.filter(t => t.completed).length;
    const ongoingCount = tasks.filter(t => !t.completed).length;
    const overdueCount = tasks.filter(t => t.priority === 'High' && !t.completed).length;

    const chartData = [
        { value: ongoingCount, color: '#007BFF', label: 'Ongoing' },
        { value: completedCount, color: '#51d761', label: 'Completed' },
        { value: overdueCount, color: '#e6552d', label: 'Overdue' },
    ]
    return (
        <View style={styles.container}>
            <AppBar title="TODO APP"
                onIconPress={() => navigation.navigate('CreateTask')}>
            </AppBar>
            <View style={styles.content}>
                <SwitchTabs
                    activeTab={activeTab}
                    onTabChange={(value) => {
                        if (value === 'Focus') {
                            navigation.navigate('Main', { openScreen: 'Focus' });
                        } else {
                            setActiveTab(value);
                        }
                    }}>
                </SwitchTabs>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>All Tasks</Text>
                </View>
                <View style={{ marginBottom: 10 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {days.map((item, index) => (
                            <View key={index} style={[styles.dateCard, item.active && styles.activeDateCard]}>
                                <Text style={[styles.dateNumber, item.active && styles.activeDateText]}>{item.date}</Text>
                                <Text style={[styles.dateDay, item.active && styles.activeDateText]}>{item.day}</Text>
                            </View>
                        ))}
                    </ScrollView>
                    <View style={styles.chartConatiner}>
                        <PieChart
                            donut
                            focusOnPress
                            shadow
                            radius={70}
                            innerRadius={50}
                            data={chartData}
                            centerLabelComponent={() => (
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 22, color: '#1C1C1E' }}>{tasks.length}</Text>
                                </View>
                            )}>
                        </PieChart>
                        <View style={styles.dotContainer}>
                            {chartData.map((item, index) => (
                                <View key={index} style={styles.chartItem}>
                                    <View style={[styles.dot, { backgroundColor: item.color }]}>
                                    </View>
                                    <Text style={styles.dotText}>{item.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
                    {tasks.length > 0 ? (
                        tasks.map((task) => {
                            const stylePriority = priorityStyles[task.priority] || priorityStyles.Normal;
                            return (
                                <View key={task.id} style={[styles.taskCard, task.completed && { opacity: 0.5 }]}>
                                    <View style={styles.cardTopRow}>
                                        <Text style={[styles.taskTitle, task.completed && { textDecorationLine: 'line-through' }]} numberOfLines={1}>{task.title}</Text>
                                        <View style={styles.actionButtons}>
                                            <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.navigate('CreateTask', { existingTask: task })}>
                                                <Text style={styles.editIcon}>✎</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.iconCircle} onPress={() => deleteTask(task.id)}>
                                                <Text style={styles.deleteIcon}>🗑</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={styles.cardBottomRow}>
                                        <View style={styles.timeInfo}>
                                            <Text style={styles.dateTimeText}>{task.date} | {task.time}</Text>
                                            <View style={[
                                                styles.priorityBadge,
                                                { backgroundColor: stylePriority.bg }
                                            ]}>
                                                <Text style={[
                                                    styles.priorityText,
                                                    { color: stylePriority.text }
                                                ]}>
                                                    {task.priority}
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity style={styles.checkCircle} onPress={() => completeTask(task.id)}>
                                            <Text style={[styles.checkIcon, task.completed && { color: '#FFF' }]}>✔</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            );
                        })
                    ) : (
                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                            <Text style={{ color: '#8E8E93' }}>No tasks created yet.</Text>
                        </View>
                    )}
                </ScrollView>

            </View>

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
        paddingHorizontal: 20
    },
    content: {
        flex: 1,
        paddingHorizontal: 17,
    },
    tabRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15
    },
    tabPill: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#f2f2f7'
    },
    activeTab: {
        backgroundColor: '#1C1C1E'
    },
    tabText: {
        color: '#8E8E93',
        fontWeight: 'bold',
        fontSize: 12
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    activeTabText: {
        color: '#FFF'
    },
    dateCard: {
        width: 45,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        marginRight: 10
    },
    activeDateCard: {
        backgroundColor: '#1C1C1E',
        borderColor: '#1C1C1E'
    },
    dateNumber: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    dateDay: {
        fontSize: 10,
        color: '#8E8E93'
    },
    activeDateText: {
        color: '#FFF'
    },
    taskCard: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7'
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    taskTitle: {
        fontSize: 15,
        fontWeight: '600',
        flex: 1
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8
    },
    iconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F2F2F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editIcon: {
        color: '#34C759',
        fontSize: 14
    },
    deleteIcon: {
        color: '#FF3B30',
        fontSize: 14
    },
    cardBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },
    timeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    dateTimeText: {
        fontSize: 12,
        color: '#8E8E93'
    },
    priorityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 15
    },
    priorityText: {
        fontSize: 11,
        fontWeight: 'bold'
    },
    checkCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#C7C7CC',
        justifyContent: 'center',
        alignItems: 'center'
    },
    checkIcon: {
        color: '#C7C7CC',
        fontSize: 12
    },
    chartConatiner: {
        borderRadius: 25,
        padding: 20,
        alignItems: 'center',
        marginVertical: 15,
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    dotContainer: {
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        gap: 50,
        padding: 20
    },
    chartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    dotText: {
        fontSize: 12,
        color: '#444',
        fontWeight: '500'
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8
    },
});

export default AllTasksScreen;