import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../themes/color';

const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#BCBCBC"
        {...props}
      ></TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  input: {
    fontSize: 14,
    color: Colors.textInput,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingLeft: 2,
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: Colors.textLabel,
    marginBottom: 8,
    fontWeight: '500%',
    marginTop: 5,
  },
});

export default FormInput;
