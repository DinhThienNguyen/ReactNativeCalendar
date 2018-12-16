import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { Agenda } from 'react-native-calendars';
import EventCard from '../components/EventCard';
import moment from 'moment';
import { connect } from "react-redux";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons'
import DBHelper from '../components/DBHelper'
import NotifService from '../components/NotifService'
import BackgroundFetch from "react-native-background-fetch";
import WebFetchService from '../components/WebFetchService'

var eventColorListLoaded = false;

var DBHelperService = new DBHelper();
var notif = new NotifService();
var webFetchService = new WebFetchService();

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
            markedDates: {},
        };
        this.props.dispatch({ type: 'UPDATE_DB_HELPER', DBHelper: DBHelperService });
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

        BackgroundFetch.configure({
            minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
            stopOnTerminate: false,   // <-- Android-only,
            startOnBoot: true         // <-- Android-only
        }, async () => {
            console.log("Background task")
            let OEPNews = await webFetchService.fetchOEP();
            let latestOEPFetchTime = await DBHelperService.getLatestOEPFetchTime();
            let latestEventId = await DBHelperService.getLatestEventId();
            let latestNotifyId = await DBHelperService.getLatestEventNotifyId();
            OEPNews.map(news => {
                if (news.timeStamp >= latestOEPFetchTime) {
                    latestEventId++;
                    latestNotifyId++;
                    let event = {
                        eventId: latestEventId,
                        eventColor: '#009ae4',
                        startTime: news.timeStamp,
                        endTime: news.timeStamp,
                        eventTitle: news.title,
                        eventDescription: news.link,
                    };
                    DBHelperService.addEvent(event);
                    notif.scheduleNotif(5, event, latestNotifyId);
                    DBHelperService.updateLatestOEPFetchTime(moment().unix());
                }
            });

            let CTSVNews = await webFetchService.fetchCTSV();
            let latestCTSVFetchTime = await DBHelperService.getLatestCTSVFetchTime();
            CTSVNews.map(news => {
                if (news.timeStamp >= latestCTSVFetchTime) {
                    latestEventId++;
                    latestNotifyId++;
                    let event = {
                        eventId: latestEventId,
                        eventColor: '#009ae4',
                        startTime: news.timeStamp,
                        endTime: news.timeStamp,
                        eventTitle: news.title,
                        eventDescription: news.link,
                    };
                    DBHelperService.addEvent(event);
                    notif.scheduleNotif(5, event, latestNotifyId);
                    DBHelperService.updateLatestCTSVFetchTime(moment().unix());
                }
            });

            let DAANews = await webFetchService.fetchDAA();
            let latestDAAFetchTime = await DBHelperService.getLatestDAAFetchTime();
            DAANews.map(news => {
                if (news.timeStamp >= latestDAAFetchTime) {
                    latestEventId++;
                    latestNotifyId++;
                    let event = {
                        eventId: latestEventId,
                        eventColor: '#009ae4',
                        startTime: news.timeStamp,
                        endTime: news.timeStamp,
                        eventTitle: news.title,
                        eventDescription: news.link,
                    };
                    DBHelperService.addEvent(event);
                    notif.scheduleNotif(5, event, latestNotifyId);
                    DBHelperService.updateLatestDAAFetchTime(moment().unix());
                }
            });

            BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
        }, (error) => {
            console.log("[js] RNBackgroundFetch failed to start");
        });

        // Optional: Query the authorization status.
        BackgroundFetch.status((status) => {
            switch (status) {
                case BackgroundFetch.STATUS_RESTRICTED:
                    console.log("BackgroundFetch restricted");
                    break;
                case BackgroundFetch.STATUS_DENIED:
                    console.log("BackgroundFetch denied");
                    break;
                case BackgroundFetch.STATUS_AVAILABLE:
                    console.log("BackgroundFetch is enabled");
                    break;
            }
        });
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
        let eventColorList = [];
        let markedDates = {};
        for (let i = 0; i < monthEventList.length; i++) {
            let date = moment(monthEventList[i].startTime * 1000).format('YYYY-MM-DD');
            if (!dayEventList[date]) {
                dayEventList[date] = [];
                eventColorList = [];
            }
            if (eventColorList === [])
                eventColorList = [...eventColorList, { color: monthEventList[i].eventColor }]
            else {
                if (!eventColorList.includes(monthEventList[i].eventColor)) {
                    eventColorList = [...eventColorList, { color: monthEventList[i].eventColor }]
                }
            }
            dayEventList[date] = [...dayEventList[date], monthEventList[i]];
            markedDates[date] = { dots: eventColorList };
        }
        this.setState({
            markedDates: markedDates
        })
        this.props.dispatch({ type: 'UPDATE_LIST', dayEventList: dayEventList });
    }

    async test() {
        let DAANews = await webFetchService.fetchDAA();
        let latestDAAFetchTime = await DBHelperService.getLatestDAAFetchTime();
        let latestEventId = await DBHelperService.getLatestEventId();
        let latestNotifyId = await DBHelperService.getLatestEventNotifyId();
        DAANews.map(news => {
            if (news.timeStamp >= latestDAAFetchTime) {
                latestEventId++;
                latestNotifyId++;
                let event = {
                    eventId: latestEventId,
                    eventColor: '#009ae4',
                    startTime: news.timeStamp,
                    endTime: news.timeStamp,
                    eventTitle: news.title,
                    eventDescription: news.link,
                };
                DBHelperService.addEvent(event);
                notif.scheduleNotif(5, event, latestNotifyId);
                DBHelperService.updateLatestCTSVFetchTime(moment().unix());
            }
        });
    }

    render() {

        return (
            <View style={styles.container}>
                <Button title="test" onPress={() => { this.test(); }}></Button>
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
                    markingType={'multi-dot'}
                    // refreshing={true}
                    minDate={'2012-10-05'}
                    markedDates={this.state.markedDates}
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