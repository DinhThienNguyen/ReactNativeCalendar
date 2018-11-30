import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Agenda } from 'react-native-calendars';
import EventCard from '../components/EventCard';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import ActionButton from 'react-native-action-button';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons'
import NotifService from '../components/NotifService';
import { connect } from "react-redux";

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({ name: 'calendarr.db', createFromLocation: '~calendar.db' }, this.openCB, this.errorCB);

var eventListLoaded = false;

const items = {
    '2018-11-30': [{ eventId: 'ewfhweufhwif', eventColor: 'white', startTime: 'eefwefwef', endTime: 'ewoifwoeijfwoief', eventTitle: 'wefjwoeifjwioe', eventDescription: 'ewjoiwjefoiwjeoif' }],
    '2018-03-30': [{ eventId: 'ewfhweufhwif', eventColor: 'gray', startTime: 'eefwefwef', endTime: 'ewoifwoeijfwoief', eventTitle: 'wefjwoeifjwioe', eventDescription: 'ewjoiwjefoiwjeoif' }]
}

class WeekScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: {},
            currentDate: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
            initialDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
        };
        if (!eventListLoaded) {
            this.refreshEventColorList();
            this.refreshSelectedDayEventList(moment().unix());
            eventListLoaded = true;
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            currentDate: this.state.currentDate,
            _refreshSelectedDayEventList: this.refreshSelectedDayEventList
        })

        this.setState({
            items: items
        })
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

    refreshSelectedDayEventList = (startDate) => {
        this.props.dispatch({ type: 'RESET_LIST', startDate });
        let startOfDay = moment(startDate * 1000).startOf('day').unix();
        let endOfDay = moment(startDate * 1000).endOf('day').unix();
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM event where starttime >= ? and starttime <= ?', [startOfDay, endOfDay], (tx, results) => {
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

    render() {

        return (
            <Agenda
                // items={
                //     {
                //         '2018-11-28': [{ text: 'item 1 - any js object', height: 50 }, { text: 'item 1 - any js object', height: 150 }],
                //         '2018-11-30': [{ text: 'item 3 - any js object', height: 120 }, { text: 'any js object', height: 60 }],
                //     }}
                items={this.state.items}
                loadItemsForMonth={this.loadItems.bind(this)}
                renderItem={this.renderItem.bind(this)}
                renderEmptyDate={this.renderEmptyDate.bind(this)}
                rowHasChanged={this.rowHasChanged.bind(this)}
                firstDay={1}
                minDate={'2012-10-05'}
                selected={this.state.initialDate}
                pastScrollRange={50}
            />
        );


    }

    loadItems(day) {
        setTimeout(() => {
            // for (let i = -15; i < 85; i++) {
            //     const time = day.timestamp + i * 24 * 60 * 60 * 1000;
            //     const strTime = this.timeToString(time);
            //     if (!this.state.items[strTime]) {
            //         this.state.items[strTime] = [];
            //         const numItems = Math.floor(Math.random() * 5);
            //         for (let j = 0; j < numItems; j++) {
            //             this.state.items[strTime].push({
            //                 name: 'Item for ' + strTime,
            //                 height: Math.max(50, Math.floor(Math.random() * 150))
            //             });
            //         }
            //     }
            // }
            //console.log(this.state.items);
            const newItems = {};
            Object.keys(this.state.items).forEach(key => { newItems[key] = this.state.items[key]; });
            this.setState({
                items: newItems
            });
        }, 1000);
        // console.log(`Load Items for ${day.year}-${day.month}`);
    }

    _OnDayPress(day) {

    }

    renderItem(item) {
        return (
            <View style={[styles.item, { height: 'auto' }, {backgroundColor: item.eventColor}]}>
                <Text>{item.eventTitle}</Text>
                <Text>{item.startTime}</Text>
                <Text>{item.endTime}</Text>
                <Text>{item.eventDescription}</Text>
            </View>
        );
    }

    renderEmptyDate() {
        return (
            <View style={styles.emptyDate}></View>
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }

    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }
}

function mapStateToProps(state) {
    return {
        events: state.selectedDayEventList
    }
}

export default connect(mapStateToProps)(WeekScreen);

const styles = StyleSheet.create({
    item: {
        //backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    }
});