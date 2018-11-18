import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Button, ToastAndroid, AppState, ScrollView } from 'react-native';
import EventCard from '../components/EventCard'
import { connect } from "react-redux";

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({ name: 'calendarr.db', createFromLocation: '~calendar.db' }, this.openCB, this.errorCB);

var PushNotification = require('react-native-push-notification');

class HomeScreen extends Component {

    constructor(props) {
        super(props);
        ToastAndroid.show("Constructed", ToastAndroid.SHORT);
        this.state = {
            appState: AppState.currentState,
            events: [],            
            isDaySelected: true,
            isWeekSelected: false,
            isMonthSelected: false,
        };
        this.refreshEventColorList();
    }

    // componentDidMount() {
    //     this.refreshEventList()
    // }

    errorCB(err) {
        console.log("SQL Error: " + err);
    }

    successCB() {
        console.log("SQL executed fine");
    }

    openCB() {
        console.log("Database OPENED");
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            this.refreshEventList()
        }
        this.setState({ appState: nextAppState });
    }

    refreshEventColorList = () => {
        let colors = [];
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM event_color', [], (tx, results) => {
                console.log("Query completed");

                let len = results.rows.length;
                // ToastAndroid.show(`${len}`, ToastAndroid.SHORT);
                for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    let color = {
                        id: row.id,
                        name: row.name,
                        hex: row.hex,
                    }
                    colors = [...colors, color];                    
                    //ToastAndroid.show(`${color.name}   ${color.hex}`, ToastAndroid.SHORT);
                }                                
            });
        });
        this.props.dispatch({ type: 'UPDATE_COLOR_LIST', ...colors });
    }

    refreshEventList = (startDate, endDate) => {
        this.setState({
            events: []
        });

        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM event', [], (tx, results) => {
                console.log("Query completed");

                // Get rows with Web SQL Database spec compliance.

                let len = results.rows.length;
                //ToastAndroid.show(`${len}`, ToastAndroid.SHORT);
                for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    let event = {
                        eventId: row.id,
                        eventColor: row.color_hexid,
                        startTime: row.starttime,
                        endTime: row.endtime,
                        eventTitle: row.title,
                        eventDescription: row.description
                    }
                    this.setState({
                        events: [...this.state.events, event]
                    })
                    //ToastAndroid.show(`${row.title}${row.description}`, ToastAndroid.SHORT);
                }
            });
        });
    }

    refreshDayEventList = () => {
        this.setState({
            isDaySelected: true,
            isWeekSelected: false,
            isMonthSelected: false
        })
    }

    refreshWeekEventList = () => {
        this.setState({
            isDaySelected: false,
            isWeekSelected: true,
            isMonthSelected: false
        })
    }

    refreshMonthEventList = () => {
        this.setState({
            isDaySelected: false,
            isWeekSelected: false,
            isMonthSelected: true
        })
    }

    render() {
        let eventCardList = this.state.events.map((item, key) => {
            return (
                <View key={key}>
                    <EventCard
                        navigation={this.props.navigation}
                        eventId={item.eventId}
                        eventColor={item.eventColor}
                        startTime={item.startTime}
                        endTime={item.endTime}
                        eventTitle={item.eventTitle}
                        eventDescription={item.eventDescription}
                        cardColor={item.color_hexid}></EventCard>
                </View>
            );
        })
        // PushNotification.localNotificationSchedule({
        //     //... You can use all the options from localNotifications
        //     message: "My Notification Message", // (required)
        //     date: new Date(Date.now() + (20 * 1000)) // in 60 secs
        //   });
        return (
            <View style={styles.container}>
                <Button title='test' onPress={() => {
                    this.props.navigation.navigate('EventDetail')
                }}></Button>
                <View style={styles.eventListView}>
                    <ScrollView>
                        {eventCardList}
                    </ScrollView>
                </View>
                <View style={styles.selectionBar}>
                    <TouchableOpacity
                        onPress={this.refreshDayEventList}
                        style={[styles.selectionCard, this.state.isDaySelected ? styles.active : styles.nonActive]}>
                        <Text style={this.state.isDaySelected ? styles.active : styles.nonActive}>21</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.refreshWeekEventList}
                        style={[styles.selectionCard, this.state.isWeekSelected ? styles.active : styles.nonActive]}></TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.refreshMonthEventList}
                        style={[styles.selectionCard, this.state.isMonthSelected ? styles.active : styles.nonActive]}></TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default connect()(HomeScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    eventListView: {
        width: '100%',
        flex: 9,
    },
    selectionBar: {
        flex: 1,
        flexDirection: 'row',
    },
    selectionCard: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1.5,
        borderColor: 'black'
    },
    active: {
        backgroundColor: '#2b579a',
        color: 'white',
        fontSize: 24,
    },
    nonActive: {
        color: 'black',
        backgroundColor: '#f3f2f1',
        fontSize: 24,
    }
});
