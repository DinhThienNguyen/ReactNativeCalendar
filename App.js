import React, { Component } from 'react';
import store from './src/store'
import { Provider } from 'react-redux'
// import { Platform, StyleSheet, Text, View, Alert, Button } from 'react-native';

import { createStackNavigator } from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation';

import WeekScreen from './src/containers/WeekScreen'
import EventCard from './src/components/EventCard'
import EventEditScreen from './src/containers/EventEditScreen'
import EventDetailsScreen from './src/containers/EventDetailsScreen';

export default class App extends Component {

  render() {
    return (
      // <View style={styles.container}>
      /* <DateTimePickerTextComponent /> */
      //{/* </View> */}
      <Provider store={store}>
        <AppStackNavigator />
        {/* <AppDrawerNavigator /> */}
      </Provider>
    );
  }
}


const AppStackNavigator = createStackNavigator({
  Week: WeekScreen,
  EventCard: EventCard,
  EventEdit: EventEditScreen,
  EventDetails: EventDetailsScreen
},
)

const AppDrawerNavigator = createDrawerNavigator({
  HomePage: AppStackNavigator,
  Week: WeekScreen,
})
