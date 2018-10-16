/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Alert, Button } from 'react-native';
import DOMParser from 'react-native-html-parser';
import DateTimePickerTextComponent from './components/DateTimePickerTextComponent/DateTimePickerTextComponent.js';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  fetchOEP = () => {
    fetch('https://oep.uit.edu.vn/vi/thong-bao-chung?page=1').then((response) => {
      
      
      
     
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="MMMMAAkjhjdasdasadkhkj" onPress={this.fetchOEP} />
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <DateTimePickerTextComponent />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
