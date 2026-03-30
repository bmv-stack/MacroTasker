import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Platform,
    StatusBar,
} from 'react-native';
import { Colors } from '../themes/color';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react';

const TaskDetailScreen = ({ route }) => {
    const navigation = useNavigation();
    const { task } = route.params;
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Task Detail</Text>
                <View style={{ width: 30 }}></View>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View
                    style={[styles.badge, { backgroundColor: Colors.badgeBackground }]}
                >
                    <Text style={styles.badgeText}>{task.priority} Priority</Text>
                </View>
                <Text style={styles.title}>{task.title}</Text>
                <View style={styles.infoRow}>
                    <Icon
                        name="calendar-outline"
                        size={20}
                        color={Colors.textMuted}
                    ></Icon>
                    <Text style={styles.infoText}>
                        Created At: {task.date} at {task.time}
                    </Text>
                </View>
                <View style={styles.infoRow}>
                    <Icon
                        name="skull"
                        size={20}
                        color={Colors.textMuted}
                    ></Icon>
                    <Text style={styles.infoText}>
                        Ending At: {task.endDate || 'Not set'} {task.endTime || ''}
                    </Text>

                </View>
                <View style={styles.divider}></View>
                <Text style={styles.sectionLabel}>Notes</Text>
                <Text style={styles.notesText}>
                    {task.notes || 'No notes for this task.'}
                </Text>
            </ScrollView>
            <TouchableOpacity
                style={styles.editBtn}
                onPress={() =>
                    navigation.navigate('CreateTask', { existingTask: task })
                }
            >
                <Icon name="pencil" size={24} color={Colors.white}></Icon>
            </TouchableOpacity>
        </View>
    );
};

export default TaskDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight,
    },
    scrollContent: { padding: 20 },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 15,
    },
    badgeText: { fontWeight: 'bold', color: Colors.textBadge, fontSize: 12 },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.blackSecondary,
        marginBottom: 20,
    },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    infoText: { marginLeft: 10, color: Colors.blackSecondary, fontSize: 16 },
    divider: {
        height: 1,
        backgroundColor: Colors.borderLight,
        marginVertical: 20,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.textMuted,
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    notesText: { fontSize: 16, color: Colors.blackSecondary, lineHeight: 24 },
    editBtn: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: Colors.blackSecondary,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    backArrow: {
        color: Colors.textPrimary,
        fontSize: 30,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
});
