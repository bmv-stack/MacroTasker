import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const SwitchTabs = ({ activeTab, onTabChange }) => {
    return (
        <View style={styles.tabRow}>
            <TouchableOpacity style={[styles.tabPill, activeTab === 'Focus' && styles.activeTab]}
                onPress={() => onTabChange('Focus')}>
                <Text style={[styles.tabText, activeTab === 'Focus' && styles.activeText]}>Today's Focus</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabPill, activeTab === 'All' && styles.activeTab]}
                onPress={() => onTabChange('All')}>
                <Text style={[styles.tabText, activeTab === 'All' && styles.activeText]}>All Tasks</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    tabRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 10,
        marginVertical: 15
    },
    tabPill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: '#8e8b8b',
        marginRight: 10,
        marginBottom: 15,
    },
    activeTab: {
        backgroundColor: 'black',
        color: 'white',
    },
    tabText: {
        color: '#FFF',
        fontWeight: '600',
    },
    activeText: {
        color: '#FFF'
    }
});
export default SwitchTabs;