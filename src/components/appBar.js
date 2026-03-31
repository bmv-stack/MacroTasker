
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../themes/color';
import Icon from 'react-native-vector-icons/Ionicons';
import logo from '../../assets/final_logo.png';

const AppBar = ({ title = 'APP NAME', onIconPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Image
          source={logo}
          style={styles.logo}
          resizeMode='cover'></Image>
        <Text style={styles.textBrand}>{title}</Text>
      </View>
      <TouchableOpacity onPress={onIconPress} hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}>
        <View style={styles.createTaskBox}>
          <Icon name='add'
            size={22} color={Colors.white}></Icon>
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
    backgroundColor: 'transparent',
    height: 60
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blackBox: {
    width: 32,
    height: 32,
    backgroundColor: Colors.blackCharcol,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLogo: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  textBrand: {
    marginLeft: -1,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textBrand,
  },
  createTaskBox: {
    height: 31,
    width: 31,
    backgroundColor: Colors.brandBlue,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.brandBlue,
    shadowOffset: { height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginTop: -2
  },
  createSymbol: {
    color: Colors.textInverted,
    fontSize: 22,
    fontWeight: '300',
    marginTop: -2
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginVertical: -15,
    marginLeft: -5
  }
});

export default AppBar;
