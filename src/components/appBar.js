import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../themes/color';

const AppBar = ({ title = 'APP NAME', onIconPress }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.blackBox}>
          <Text style={styles.textLogo}>TA</Text>
        </View>
        <Text style={styles.textBrand}>{title}</Text>
      </View>
      <TouchableOpacity onPress={onIconPress}>
        <View style={styles.createTaskBox}>
          <Text style={styles.createSymbol}>+</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

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
    alignItems: 'center',
  },
  blackBox: {
    width: 32,
    height: 32,
    backgroundColor: Colors.blackCharcol,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLogo: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  textBrand: {
    marginLeft: 18,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textBrand,
  },
  createTaskBox: {
    height: 22,
    width: 22,
    backgroundColor: Colors.brandBlue,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createSymbol: {
    color: Colors.textInverted,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppBar;
