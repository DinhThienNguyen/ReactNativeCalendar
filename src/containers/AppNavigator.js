import React from 'react';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import HomeScreen from './HomeScreen'
import EventDetailScreen from './EventDetailScreen';
import EventCard from '../components/EventCard'
import EventEditScreen from './EventEditScreen'

export const AppNavigator = StackNavigator({
    Home: HomeScreen,
    EventDetail: EventDetailScreen,
    EventCard: EventCard,
    EventEdit: EventEditScreen
});

const AppWithNavigationState = ({ dispatch, nav }) => (
    <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

const mapStateToProps = state => ({
    nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);