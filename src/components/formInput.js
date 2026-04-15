import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { lightTheme, darkTheme } from '../themes/color';
import { useSelector } from 'react-redux';

const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  ...props
}) => {
  const isDarkMode = useSelector(state => state.tasks.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme);
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

const getStyles = theme =>
  StyleSheet.create({
    container: {
      marginBottom: 20,
      width: '100%',
    },
    input: {
      fontSize: 14,
      color: theme.textInput,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
      paddingLeft: 2,
      marginTop: 10,
    },
    label: {
      fontSize: 14,
      color: theme.textLabel,
      marginBottom: 8,
      fontWeight: '500%',
      marginTop: 5,
    },
  });

export default FormInput;
