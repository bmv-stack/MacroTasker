import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AppBar = ({ title = "APP NAME", onIconPress }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <View style={styles.diamond}>
                    <Text style={styles.textLogo}>TA</Text>
                </View>
                <Text style={styles.textBrand}>{title}</Text>
            </View>
            <TouchableOpacity style={styles.circle} onPress={onIconPress}>
                <View style={styles.gridBox}>
                    <Text style={styles.gridSymbol}>+</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: 'transparent',
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    diamond: {
        width: 32,
        height: 32,
        backgroundColor: '#1A1A1A',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textLogo: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textBrand: {
        marginLeft: 18,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000'

    },
    circle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'light-blue',
        borderWidth: 15,
        borderColor: '#C7D2FE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridBox: {
        height: 22,
        width: 22,
        backgroundColor: '#1E40AF',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridSymbol: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold'
    }
});

export default AppBar;