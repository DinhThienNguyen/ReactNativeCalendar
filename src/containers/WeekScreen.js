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

const itemsTemp = [
    {
        eventId: 1,
        eventColor: 'white',
        startTime: 1543680391,
        endTime: 1,
        eventTitle: 1,
        eventDescription: 1
    },
    {
        eventId: 2,
        eventColor: 'gray',
        startTime: 1544022978,
        endTime: 2,
        eventTitle: 2,
        eventDescription: 2
    }
]

//const dateTest = moment(1543680391*1000).format('YYYY-MM-DD');

class WeekScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: {},
            currentDate: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
            initialDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
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


        this.convertItemsToAgenda();
    }

    convertItemsToAgenda() {
        let dateTest;

        for (let i = 0; i < itemsTemp.length; i++) {
            dateTest = moment(itemsTemp[i].startTime * 1000).format('YYYY-MM-DD');
                items[dateTest] = [];
                items[dateTest].push({
                    eventId: itemsTemp[i].eventId,
                    eventColor: itemsTemp[i].eventColor,
                    startTime: itemsTemp[i].startTime,
                    endTime: itemsTemp[i].endTime,
                    eventTitle: itemsTemp[i].eventTitle,
                    eventDescription: itemsTemp[i].eventDescription
                });
        }

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
                items={this.state.items}
                loadItemsForMonth={this.loadItems.bind(this)}
                renderItem={this.renderItem.bind(this)}
                renderEmptyDate={this.renderEmptyDate.bind(this)}
                renderEmptyData={this.renderEmptyData.bind(this)}
                rowHasChanged={this.rowHasChanged.bind(this)}
                firstDay={1}
                minDate={'2012-10-05'}
            />
        );


    }

    loadItems(day) {
        setTimeout(() => {
            const newItems = {};
            Object.keys(this.state.items).forEach(key => { newItems[key] = this.state.items[key]; });
            this.setState({
                items: newItems
            });
        }, 1000);
    }

    renderItem(item) {
        return (
            <View style={[styles.item, { height: 150 }, { backgroundColor: item.eventColor }]}>
                {/* <Text>{item.eventTitle}</Text>
                <Text>{item.startTime}</Text>
                <Text>{item.endTime}</Text>
                <Text>{item.eventDescription}</Text> */}
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
    }

    renderEmptyDate() {
        return (
            <View style={styles.emptyDate}></View>
        );
    }

    renderEmptyData() {
        return (
            <View style={[styles.emptyData]}><Text style={[{fontSize: 25}, {color: 'black'}]}>Hôm nay không có sự kiện nào</Text></View>
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
    },
    emptyData: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
        marginLeft: 10,
        marginBottom: 17,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
});