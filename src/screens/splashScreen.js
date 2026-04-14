import { StyleSheet, View, Image } from 'react-native';
import React from 'react';
import { Colors } from '../themes/color';
import logo from '../../assets/final_logo.png';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="cover"></Image>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 150,
    width: 150,
  },
});
