import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Alert } from 'react-native';
import { Agenda } from 'react-native-calendars';
import EventCard from '../components/EventCard';
import moment from 'moment';
import { connect } from "react-redux";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons'
import DBHelper from '../components/DBHelper'
import NotifService from '../components/NotifService'

// import BackgroundTask from 'react-native-background-task'
// import queueFactory from 'react-native-queue';

const cheerio = require('react-native-cheerio')
var eventColorListLoaded = false;

var DBHelperService = new DBHelper();
var notif = new NotifService();


// BackgroundTask.define(async () => {

//     // Init queue
//     queue = await queueFactory();

//     // Register worker
//     queue.addWorker('background-example', async (id, payload) => {

//         // Load some arbitrary data while the app is in the background
//         if (payload.name == 'luke') {
//             await AsyncStorage.setItem('lukeData', 'Luke Skywalker arbitrary data loaded!');
//         } else {
//             await AsyncStorage.setItem('c3poData', 'C-3PO arbitrary data loaded!');
//         }

//     });

//     // Start the queue with a lifespan
//     // IMPORTANT: OS background tasks are limited to 30 seconds or less.
//     // NOTE: Queue lifespan logic will attempt to stop queue processing 500ms less than passed lifespan for a healthy shutdown buffer.
//     // IMPORTANT: Queue processing started with a lifespan will ONLY process jobs that have a defined timeout set.
//     // Additionally, lifespan processing will only process next job if job.timeout < (remainingLifespan - 500).
//     await queue.start(20000); // Run queue for at most 20 seconds.

//     // finish() must be called before OS hits timeout.
//     BackgroundTask.finish();

// });

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
            selectedDay: moment().unix(),
            initialDate: `${moment().format('YYYY-MM-DD')}`,
            selectedMonth: -1,
        };
        // this.DBHelperService = new DBHelper();
        this.props.dispatch({ type: 'UPDATE_DB_HELPER', DBHelper: DBHelperService });
        // this.notif = new NotifService(this.onNotif.bind(this));
        notif.configure(this.onNotif.bind(this));
        this.props.dispatch({ type: 'UPDATE_NOTIF_SERVICE', notifService: notif });
        if (!eventColorListLoaded) {
            this.refreshEventColorList();
            this.refreshLatestEventId();
            this.refreshLatestEventNotifyId();
            eventColorListLoaded = true;
        }
    }


    componentDidMount() {
        this.props.navigation.setParams({
            _showCurrentDateEvent: this.showCurrentDateEvent,
        })
    }

    async onNotif(notif) {
        console.log(notif);
        let event = await DBHelperService.getEventById(notif.number);
        console.log(event);
        this.props.dispatch({ type: 'UPDATE_CURRENT', event: event });
        this.props.navigation.navigate('EventDetails');
    }

    showCurrentDateEvent = () => {
        this.setState({
            selectedDay: moment().unix(),
        })
    }

    async refreshLatestEventId() {
        let latestEventId = await DBHelperService.getLatestEventId();
        this.props.dispatch({ type: 'UPDATE_LAST_ID', latestEventId });
    }

    async refreshLatestEventNotifyId() {
        let latestEventNotifyId = await DBHelperService.getLatestEventNotifyId();
        this.props.dispatch({ type: 'UPDATE_LAST_EVENT_NOTIFY_ID', latestEventNotifyId });
    }

    async refreshEventColorList() {
        let eventColorList = await DBHelperService.getEventColorList();
        this.props.dispatch({ type: 'UPDATE_COLOR_LIST', eventColorList });
    }

    async getAllEventsIn2Months(time) {
        if (this.state.selectedMonth !== time.month) {

            this.setState({
                selectedMonth: time.month,
            });
            let startOfMonth = moment().set({ 'year': time.year, 'month': (time.month - 1) }).startOf('month').unix();
            let endOfMonth = moment().set({ 'year': time.year, 'month': (time.month) }).endOf('month').unix();
            let monthEventList = await DBHelperService.getEventList(startOfMonth, endOfMonth);
            this.convertItemsToAgenda(monthEventList);
        }
    }

    convertItemsToAgenda(monthEventList) {
        let dayEventList = {};
        for (let i = 0; i < monthEventList.length; i++) {
            let date = moment(monthEventList[i].startTime * 1000).format('YYYY-MM-DD');
            if (!dayEventList[date]) {
                dayEventList[date] = [];
            }
            dayEventList[date] = [...dayEventList[date], monthEventList[i]];
        }
        this.props.dispatch({ type: 'UPDATE_LIST', dayEventList: dayEventList });
    }

    async test() {

        const searchUrl = `https://oep.uit.edu.vn/vi/thong-bao-chung`;
        const response = await fetch(searchUrl);  // fetch page 

        const htmlString = await response.text(); // get response text
        const $ = cheerio.load(htmlString);       // parse HTML string

        let temp = $("div.content > article")             // select result <li>s
            .map((_, article) => ({                      // map to an list of objects
                title: $("a", article).text(),
                timeStamp: $("div.submitted", article).text(),
                link: $("a", article).attr("href")
            }));

        console.log(temp);
    }

    handlePerm(perms) {
        Alert.alert("Permissions", JSON.stringify(perms));
    }

    render() {

        return (
<<<<<<< HEAD
            <View style={styles.container}>
                <Button title="test" onPress={() => {
                    // this.notif.checkPermission(this.handlePerm.bind(this));
                    // let event = {
                    //     eventTitle: 'hello',
                    //     eventId: 99,
                    // }
                    // this.notif.scheduleNotif(10, event, 99);
                }}></Button>
=======
            <View style={styles.container}>         
>>>>>>> 48b029e113729ca1e9217efdb9970ddc4a7345be
                <Agenda
                    items={this.props.monthEventList}
                    loadItemsForMonth={(month) => { this.getAllEventsIn2Months(month); }}
                    renderItem={this.renderItem.bind(this)}
                    onDayPress={(day) => { this.setState({ selectedDay: day.timestamp / 1000 }) }}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    renderEmptyData={this.renderEmptyData.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    selected={moment(this.state.selectedDay * 1000).format('YYYY-MM-DD')}
                    firstDay={1}
                    // refreshing={true}
                    minDate={'2012-10-05'}
                />
                <ActionButton
                    buttonColor="rgba(231,76,60,1)"
                    onPress={() => {
                        let action = {
                            eventId: -1,
                            eventColor: '#009ae4',
                            startTime: this.state.selectedDay,
                            endTime: this.state.selectedDay,
                            eventTitle: '',
                            eventDescription: '',
                            notifyTime: [],
                        };
                        this.props.dispatch({ type: 'UPDATE_CURRENT', event: action });
                        this.props.navigation.navigate('EventEdit', {
                            screenTitle: 'Thêm mới',
                            // selectedDay: this.state.selectedDay
                        });
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
                    eventDescription={item.eventDescription}
                    notifyTime={item.notifyTime}></EventCard>
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
        return r1.eventTitle !== r2.eventTitle ||
            r1.eventColor !== r2.eventColor ||
            r1.startTime !== r2.startTime ||
            r1.endTime !== r2.endTime ||
            r1.eventDescription !== r2.eventDescription;
    }
}

function mapStateToProps(state) {
    return {
        monthEventList: state.selectedMonthEventList
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