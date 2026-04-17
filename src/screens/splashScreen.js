import { StyleSheet, View, Image } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import logo from '../../assets/final_logo.png';
import { darkTheme, lightTheme } from '../themes/color';

const SplashScreen = () => {
  const isDarkMode = useSelector(state => state.tasks.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="cover"></Image>
    </View>
  );
};

export default SplashScreen;

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      height: 150,
      width: 150,
    },
  });
