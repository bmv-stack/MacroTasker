import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  isOptional = false,
  ...props
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {isOptional && (
          <Text style={styles.optionalLabelText}> ( Optional )</Text>
        )}
      </View>
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
      fontWeight: '500',
      marginTop: 5,
    },
    labelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    optionalLabelText: {
      fontSize: 12,
      color: theme.textMuted,
      fontWeight: '300',
      marginLeft: 4,
    },
  });

export default FormInput;
