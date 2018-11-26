import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Button, ToastAndroid, ScrollView } from 'react-native';
import EventCard from '../components/EventCard'
import { connect } from "react-redux";

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({ name: 'calendarr.db', createFromLocation: '~calendar.db' }, this.openCB, this.errorCB);

var eventListLoaded = false;

class HomeScreen extends Component {

    constructor(props) {
        super(props);
        ToastAndroid.show("Constructed", ToastAndroid.SHORT);
        this.state = {
            isDaySelected: true,
            isWeekSelected: false,
            isMonthSelected: false,
        };
        if (!eventListLoaded) {
            this.refreshEventColorList();
            this.refreshEventList();
            eventListLoaded = true;
        }
    }

    errorCB(err) {
        console.log("SQL Error: " + err);
    }

    successCB() {
        console.log("SQL executed fine");
    }

    openCB() {
        console.log("Database OPENED");
    }

    refreshEventColorList = () => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM event_color', [], (tx, results) => {
                console.log("Query completed");

                let len = results.rows.length;
                for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    let color = {
                        id: row.id,
                        name: row.name,
                        hex: row.hex,
                    }
                    this.props.dispatch({ type: 'ADD_COLOR', ...color });
                }
            });
        });
    }

    refreshEventList = (startDate, endDate) => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM event', [], (tx, results) => {
                console.log("Query completed");
                let len = results.rows.length;
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

                    this.props.dispatch({ type: 'ADD_EVENT', ...event });
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
        let eventCardList = this.props.events.map((item, key) => {
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
                        cardColor={item.eventColor}></EventCard>
                </View>
            );
        })
        return (
            <View style={styles.container}>
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

function mapStateToProps(state) {
    return {
        events: state.eventList
    }
}

export default connect(mapStateToProps)(HomeScreen);

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
