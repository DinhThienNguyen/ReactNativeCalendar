import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Button, ScrollView } from 'react-native';
import EventCard from '../components/EventCard'
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { Calendar } from 'react-native-calendars';
import ActionButton from 'react-native-action-button';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons'
import NotifService from '../components/NotifService';
import { connect } from "react-redux";
import {LocaleConfig} from 'react-native-calendars';

var eventListLoaded = false;

class HomeScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerTitle: <TouchableOpacity style={{ flex: 7, alignItems: 'center' }} onPress={() => { params.toggleCalendarDialog() }}>
                <Text style={styles.screenTitle}>{params.currentDate}</Text>
            </TouchableOpacity>,
            headerRight: (
                <TouchableOpacity
                    style={{ flex: 3, alignItems: 'center', justifyContent: 'center', padding: 10 }}
                    onPress={() => {
                        params._refreshSelectedDayEventList(moment().unix())
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
            calendarDialogVisible: false,
            selectedDay: moment().unix(),
            currentDate: `${new Date().getMonth() + 1}/${new Date().getFullYear()}`
        };
        this.notif = new NotifService(this.onNotif.bind(this));
        // if (!eventListLoaded) {
        //     this.refreshEventColorList();
        //     this.refreshSelectedDayEventList(moment().unix());
        //     eventListLoaded = true;
        // }
    }

    

    _toggleCalendarDialog = () => {
        this.setState({ calendarDialogVisible: true })
    }

    componentDidMount() {
        this.props.navigation.setParams({
            toggleCalendarDialog: this._toggleCalendarDialog,
            currentDate: this.state.currentDate,
            _refreshSelectedDayEventList: this.refreshSelectedDayEventList
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

    onNotif(notif) {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM event where id = ?', [notif.id], (tx, results) => {

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
                    console.log(event);
                    this.props.dispatch({ type: 'UPDATE_CURRENT', ...event });
                }
            });
        });
        this.props.navigation.navigate('EventDetail');
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
            tx.executeSql('SELECT id FROM event ORDER BY id DESC', [], (tx, results) => {
                let row = results.rows.item(0);
                let lastEventId = row.id;
                this.props.dispatch({ type: 'UPDATE_LAST_ID', lastEventId });
                // console.log(lastEventId);
            });
        });
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
                        eventDescription={item.eventDescription}></EventCard>
                </View>
            );
        })
        return (
            <View style={styles.container}>
                <Dialog visible={this.state.calendarDialogVisible}
                    onTouchOutside={() => { this.setState({ calendarDialogVisible: false }) }}>
                    <DialogContent>
                        <Calendar
                            minDate={'2012-05-10'}
                            onDayPress={(day) => {

                                this.refreshSelectedDayEventList(day.timestamp / 1000);
                                this.setState({
                                    selectedDay: day.timestamp / 1000,
                                    calendarDialogVisible: false
                                });
                            }}
                            hideExtraDays={true}
                            monthFormat={'MM yyyy'}
                            firstDay={1}
                        />
                    </DialogContent>
                </Dialog>
                <Button title="test" onPress={() => {
                    this.notif.scheduleNotif(5, 181);
                    console.log(this.props.events.length);
                }}></Button>
                <View style={styles.eventListView}>
                    <ScrollView>
                        {eventCardList}
                    </ScrollView>
                </View>
                <ActionButton
                    buttonColor="rgba(231,76,60,1)"
                    onPress={() => {
                        let action = {
                            eventId: -1,
                            eventColor: '#009ae4',
                            startTime: this.state.selectedDay,
                            endTime: this.state.selectedDay,
                            eventTitle: '',
                            eventDescription: ''
                        };
                        this.props.dispatch({ type: 'UPDATE_CURRENT', ...action });
                        this.props.navigation.navigate('EventEdit', {
                            screenTitle: 'Thêm mới',
                            selectedDay: this.state.selectedDay
                        });
                    }}
                >
                </ActionButton>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        events: state.selectedDayEventList
    }
}

LocaleConfig.locales['vn'] = {
    monthNames: ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'],
    monthNamesShort: ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                    'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'],
    dayNames: ['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'],
    dayNamesShort: ['CN.','T2.','T3.','T4.','T5.','T6.','T7.']
  };

LocaleConfig.defaultLocale = 'vn';

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
    },
    screenTitle: {
        color: 'black',
        fontSize: 30,

    }
});
