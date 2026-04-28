import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { lightTheme, darkTheme } from '../themes/color';
import Icon from 'react-native-vector-icons/Ionicons';
import logo from '../../assets/final_logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/slices/taskSlice';

const AppBar = ({ title = 'APP NAME', onIconPress }) => {
  const isDarkMode = useSelector(state => state.tasks.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme);
  const dispatch = useDispatch();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Image source={logo} style={styles.logo} resizeMode="cover"></Image>
        <Text style={styles.textBrand}>{title}</Text>
      </View>
      <View style={styles.right}>
        <TouchableOpacity
          onPress={handleToggleTheme}
          hitSlop={{ top: 10, bottom: 10, right: 5, left: 2 }}
        >
          <View style={styles.themeToggleBox}>
            <Icon
              name={isDarkMode ? 'sunny' : 'moon'}
              size={22}
              color={theme.textInverted}
            />
          </View>
        </TouchableOpacity>
        {onIconPress && (
          <TouchableOpacity
            onPress={onIconPress}
            hitSlop={{ top: 10, bottom: 10, right: 10 }}
          >
            <View style={styles.createTaskBox}>
              <Icon name="add" size={22} color={theme.white}></Icon>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'transparent',
      height: 60,
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    blackBox: {
      width: 32,
      height: 32,
      backgroundColor: theme.blackCharcol,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textLogo: {
      color: theme.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
    textBrand: {
      marginLeft: -1,
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.textBrand,
    },
    createTaskBox: {
      height: 31,
      width: 31,
      backgroundColor: theme.brandBlue,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.brandBlue,
      shadowOffset: { height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
      marginTop: -2,
      marginLeft: 10,
    },
    themeToggleBox: {
      height: 31,
      width: 31,
      backgroundColor: theme.primary,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.primary,
      shadowOffset: { height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
      marginTop: -2,
    },
    createSymbol: {
      color: theme.textInverted,
      fontSize: 22,
      fontWeight: '300',
      marginTop: -2,
    },
    logo: {
      width: 50,
      height: 50,
      borderRadius: 8,
      marginVertical: -15,
      marginLeft: -5,
    },
  });

export default AppBar;
