import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const FormInput = ({ label, value, onChangeText, placeholder, error, ...props }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#C7C7CD"
                {...props}
            >
            </TextInput>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        width: '100%',
    },
    title: {
        fontSize: 14,
        color: '#000',
        fontWeight: 'black',
        marginBottom: 5,
        marginTop: 8

    },
    input: {
        fontSize: 14,
        color: '#000',
        paddingVertical: 8
    },
    label: {
        fontSize: 14,
        color: '#000',
        marginBottom: 8,
        fontWeight: '500%'
    },
});

export default FormInput;