import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Agenda } from 'react-native-calendars';
import EventCard from '../components/EventCard';
import moment from 'moment';
import { connect } from "react-redux";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons'

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({ name: 'calendarr.db', createFromLocation: '~calendar.db' }, this.openCB, this.errorCB);

class WeekScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerTitle: <View style={{ flex: 7, alignItems: 'center' }}>
                <Text style={styles.screenTitle}></Text>
            </View>,
            headerRight: (
                <TouchableOpacity
                    style={{ flex: 3, alignItems: 'center', justifyContent: 'center', padding: 10 }}
                    onPress={() => {
                        params._showCurrentDateEvent();
                    }}
                >
                    <Icon name="md-calendar" size={40} />
                </TouchableOpacity>
            ),
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            items: {},
            eventList: [],
            initialDate: `${moment().format('YYYY-MM-DD')}`,
        };
    }


    componentDidMount() {
        this.props.navigation.setParams({
            _showCurrentDateEvent: this.showCurrentDateEvent,
        })
    }

    showCurrentDateEvent = () => {
        this.setState({
            initialDate: `${moment().format('YYYY-MM-DD')}`,
        })
    }

    getAllEventsIn2Months = (time) => {
        console.log("\n\n\n\n");
        console.log(time);
        let monthEventList = [];
        let startOfMonth = moment().set({ 'year': time.year, 'month': (time.month - 1) }).startOf('month').unix();
        let endOfMonth = moment().set({ 'year': time.year, 'month': (time.month) }).endOf('month').unix();
        console.log(startOfMonth);
        console.log(endOfMonth);
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM event where starttime >= ? and starttime <= ? ORDER BY starttime ASC', [startOfMonth, endOfMonth], (tx, results) => {
                let len = results.rows.length;
                console.log(len);
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
                    monthEventList = [...monthEventList, event];
                }
                this.setState({
                    eventList: monthEventList,
                });
                this.convertItemsToAgenda();
            });
        });
    }

    convertItemsToAgenda() {
        let dayEventList = {};
        for (let i = 0; i < this.state.eventList.length; i++) {
            let date = moment(this.state.eventList[i].startTime * 1000).format('YYYY-MM-DD');
            if (!dayEventList[date]) {
                dayEventList[date] = [];
            }
            dayEventList[date] = [...dayEventList[date], this.state.eventList[i]];
        }

        this.setState({
            items: dayEventList
        })
    }

    errorCB(err) {
        // console.log("SQL Error: " + err);
    }

    successCB() {
        // console.log("SQL executed fine");
    }

    openCB() {
        // console.log("Database OPENED");
    }

    render() {

        return (
            <View style={styles.container}>
                <Agenda
                    items={this.state.items}
                    loadItemsForMonth={(month) => { this.getAllEventsIn2Months(month); }}
                    renderItem={this.renderItem.bind(this)}
                    onDayPress={(day) => { this.setState({ initialDate: `${day.year}-${day.month}-${day.day}` }) }}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    renderEmptyData={this.renderEmptyData.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    selected={this.state.initialDate}
                    firstDay={1}
                    refreshing={true}
                    minDate={'2012-10-05'}
                />
                <ActionButton
                    buttonColor="rgba(231,76,60,1)"
                    onPress={() => {
                        // let action = {
                        //     eventId: -1,
                        //     eventColor: '#009ae4',
                        //     startTime: this.state.selectedDay,
                        //     endTime: this.state.selectedDay,
                        //     eventTitle: '',
                        //     eventDescription: ''
                        // };
                        // this.props.dispatch({ type: 'UPDATE_CURRENT', ...action });
                        // this.props.navigation.navigate('EventEdit', {
                        //     screenTitle: 'Thêm mới',
                        //     selectedDay: this.state.selectedDay
                        // });
                    }}
                >
                </ActionButton>
            </View>


        );


    }

    renderItem(item) {
        return (
            <View style={[styles.item, { height: 150 }, { backgroundColor: item.eventColor }]}>
                <EventCard
                    navigation={this.props.navigation}
                    eventId={item.eventId}
                    eventColor={item.eventColor}
                    startTime={item.startTime}
                    endTime={item.endTime}
                    eventTitle={item.eventTitle}
                    eventDescription={item.eventDescription}></EventCard>
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
            <View style={[styles.emptyData]}><Text style={[{ fontSize: 25 }, { color: 'black' }]}>Hôm nay không có sự kiện nào</Text></View>
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }
}

function mapStateToProps(state) {
    return {
        events: state.selectedDayEventList
    }
}

export default connect(mapStateToProps)(WeekScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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