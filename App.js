import React, { Component } from 'react';
// import { Platform, StyleSheet, Text, View, Alert, Button } from 'react-native';
import { createStackNavigator } from 'react-navigation'
import HomeScreen from './containers/HomeScreen'
import EventDetailScreen from './containers/EventDetailScreen';
import EventCard from './components/EventCard'
import EventEditScreen from './components/EventEditScreen'
// import DateTimePickerTextComponent from './components/DateTimePickerTextComponent/DateTimePickerTextComponent.js';

export default class App extends Component {

  render() {
    return (
      // <View style={styles.container}>
        /* <DateTimePickerTextComponent /> */
      //{/* </View> */}
      
        <AppStackNavigator />
      
    );
  }
}

const AppStackNavigator = createStackNavigator({
  Home: HomeScreen,
  EventDetail: EventDetailScreen,
  EventCard: EventCard,
  EventEdit: EventEditScreen
}, {
      navigationOptions: {
          headerTitle: 'Calendar',
      }
  })