import React, { Component } from 'react';
import store from './src/store'
import { Provider } from 'react-redux'
// import { Platform, StyleSheet, Text, View, Alert, Button } from 'react-native';

import { createStackNavigator } from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation';

import Page2 from './src/containers/page2'
import HomeScreen from './src/containers/HomeScreen'
import EventDetailScreen from './src/containers/EventDetailScreen';
import EventCard from './src/components/EventCard'
import EventEditScreen from './src/containers/EventEditScreen'
// import DateTimePickerTextComponent from './components/DateTimePickerTextComponent/DateTimePickerTextComponent.js';

export default class App extends Component {

  render() {
    return (
      // <View style={styles.container}>
      /* <DateTimePickerTextComponent /> */
      //{/* </View> */}
      <Provider store={store}>
        {/* <AppStackNavigator /> */}
        <AppDrawerNavigator />
      </Provider>
    );
  }
}


const AppStackNavigator = createStackNavigator({
  Home: HomeScreen,
  EventDetail: EventDetailScreen,
  EventCard: EventCard,
  EventEdit: EventEditScreen
},
)

const AppDrawerNavigator = createDrawerNavigator({
  HomePage: AppStackNavigator ,
  Page2: Page2,
})
