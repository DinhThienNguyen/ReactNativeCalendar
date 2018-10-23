import React, { Component } from 'react';
import { StyleSheet, View, Button, TouchableOpacity, Text, ToastAndroid, AppState } from 'react-native';
import EventCard from '../components/EventCard'

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({ name: 'calendarr.db', createFromLocation: '~calendar.db' }, this.openCB, this.errorCB);


export default class HomeScreen extends Component {

    errorCB(err) {
        console.log("SQL Error: " + err);
    }

    successCB() {
        console.log("SQL executed fine");
    }

    openCB() {
        console.log("Database OPENED");
    }

    state = {
        appState: AppState.currentState,
        events: [],
        isDaySelected: true,
        isWeekSelected: false,
        isMonthSelected: false,
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

    refreshEventList = (startDate, endDate) => {
        this.setState({
            events: []
        });

        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM event', [], (tx, results) => {
                console.log("Query completed");

                // Get rows with Web SQL Database spec compliance.

                let len = results.rows.length;
                ToastAndroid.show(`${len}`, ToastAndroid.SHORT);
                for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    let event = {
                        id: row.id,
                        day: row.day,
                        month: row.month,
                        year: row.year,
                        title: row.title,
                        description: row.description
                    }
                    this.setState({
                        events: [...this.state.events, event]
                    })
                    ToastAndroid.show(`${row.title}${row.description}`, ToastAndroid.SHORT);
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
                    <EventCard title={item.title} description={item.description}></EventCard>
                </View>
            );
        })
        return (
            <View style={styles.container}>
                <View style={styles.eventListView}>
                    {eventCardList}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    eventListView: {
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
