import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity, ToastAndroid, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import DatePicker from 'react-native-datepicker'
import { NavigationActions } from 'react-navigation';
import moment from 'moment';
import DBHelper from '../components/DBHelper'
import { connect } from "react-redux";

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({ name: 'calendarr.db', createFromLocation: '~calendar.db' }, this.openCB, this.errorCB);
class EventEditScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: navigation.getParam('screenTitle', 'Thêm mới'),
            headerRight: (
                <Button
                    onPress={() => {
                        if (params.eventId == -1) {
                            params.addNewEvent();
                            navigation.dispatch(NavigationActions.back());
                        } else {
                            params.updateEvent();
                            params.updateCurrentSelectedEvent();
                            navigation.dispatch(NavigationActions.back());
                        }
                    }}
                    title="Lưu"
                    color="#000"
                />
            ),
        };
    };

    constructor(props) {
        super(props);

        let startDate = new Date(this.props.startTime * 1000);
        let endDate = new Date(this.props.endTime * 1000);

        const currentColor = this.props.eventColorList.find(element => element.hex === this.props.eventColor);

        this.state = {
            eventColor: currentColor,
            colorPickerDialogVisible: false,
            startTime: startDate,
            endTime: endDate,
            eventTitle: this.props.eventTitle,
            eventDescription: this.props.eventDescription
        };

        this.DBHelperService = new DBHelper();
    }

    _addNewEvent = () => {
        let event = {
            eventId: this.props.latestEventId + 1,
            eventColor: this.state.eventColor.hex,
            startTime: moment(this.state.startTime, "dddd, DD/MM/YYYY, HH:mm").unix(),
            endTime: moment(this.state.endTime, "dddd, DD/MM/YYYY, HH:mm").unix(),
            eventTitle: this.state.eventTitle,
            eventDescription: this.state.eventDescription
        };

        if (event.eventTitle === '') {
            event.eventTitle = "Không có tiêu đề";
        }
        if (event.eventDescription === '') {
            event.eventDescription = "Không có mô tả";
        }

        this.DBHelperService.addEvent(event);

        let latestEventId = event.eventId + 1;
        this.props.dispatch({ type: 'UPDATE_LAST_ID', latestEventId });

        let dayEventList = this.props.monthEventList;
        let dateString = moment(event.startTime * 1000).format('YYYY-MM-DD');
        if (!dayEventList[dateString]) {
            dayEventList[dateString] = [];
        }
        dayEventList[dateString] = [...dayEventList[dateString], event];
        this.props.dispatch({ type: 'UPDATE_LIST', dayEventList });
    }

    _updateEvent = () => {
        let event = {
            eventId: this.props.eventId,
            eventColor: this.state.eventColor.hex,
            startTime: moment(this.state.startTime, "dddd, DD/MM/YYYY, HH:mm").unix(),
            endTime: moment(this.state.endTime, "dddd, DD/MM/YYYY, HH:mm").unix(),
            eventTitle: this.state.eventTitle,
            eventDescription: this.state.eventDescription,
        };
        if (event.eventTitle === '') {
            event.eventTitle = "Không có tiêu đề";
        }
        if (event.eventDescription === '') {
            event.eventDescription = "Không có mô tả";
        }
        this.DBHelperService.updateEvent(event);

        let dayEventList = this.props.monthEventList;
        let dateString = moment(event.startTime * 1000).format('YYYY-MM-DD');
        let tempEventList = dayEventList[dateString];
        tempEventList = tempEventList.map(events => (events.eventId === event.eventId) ? { ...event } : events);
        dayEventList[dateString] = tempEventList;
        this.props.dispatch({ type: 'UPDATE_LIST', dayEventList });
    }

    componentDidMount() {
        this.props.navigation.setParams({
            addNewEvent: this._addNewEvent,
            updateEvent: this._updateEvent,
            updateCurrentSelectedEvent: this._updateCurrentSelectedEvent,
            eventId: this.props.eventId
        })
    }

    _updateCurrentSelectedEvent = () => {
        let action = {
            eventId: this.props.eventId,
            eventColor: this.state.eventColor.hex,
            startTime: moment(this.state.startTime, "dddd, DD/MM/YYYY, HH:mm").unix(),
            endTime: moment(this.state.endTime, "dddd, DD/MM/YYYY, HH:mm").unix(),
            eventTitle: this.state.eventTitle,
            eventDescription: this.state.eventDescription
        };

        this.props.dispatch({ type: 'UPDATE_CURRENT', ...action });
    }

    render() {
        let colorList = this.props.eventColorList.map((item, key) => {
            return (
                <View key={key}>
                    <TouchableOpacity onPress={() => { this.setState({ eventColor: item, colorPickerDialogVisible: false }) }}>
                        <View style={{ flexDirection: 'row', padding: 10 }}>
                            <View >
                                <View style={{ height: 30, width: 30, backgroundColor: item.hex }}></View>
                            </View>
                            <View style={{ paddingLeft: 10 }}>
                                <Text style={{ fontSize: 24, color: 'black' }}>{item.name}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        })
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, paddingBottom: 10, paddingLeft: 10 }}>
                    <TextInput
                        defaultValue={this.props.eventTitle}
                        style={styles.titleText}
                        placeholder='Nhập tiêu đề'
                        onChangeText={(text) => { this.setState({ eventTitle: text }) }}>
                    </TextInput>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <View style={styles.icon}>
                        <Icon name="md-time" size={30} />
                    </View>
                    <View style={{ flex: 8 }}>
                        <DatePicker
                            style={{ width: '100%', backgroundColor: '#fff' }}
                            showIcon={false}
                            customStyles={{
                                dateText: {
                                    fontSize: 22
                                },
                                dateInput: { borderWidth: 0 }
                            }}
                            is24Hour={true}
                            date={this.state.startTime}
                            mode="datetime"
                            format="dddd, DD/MM/YYYY, HH:mm"
                            confirmBtnText="OK"
                            cancelBtnText="Hủy"
                            onDateChange={(date) => {
                                this.setState({ startTime: date });
                            }}
                        />
                        <DatePicker
                            style={{ width: '100%', backgroundColor: '#fff' }}
                            showIcon={false}
                            customStyles={{
                                dateText: {
                                    fontSize: 22
                                },
                                dateInput: { borderWidth: 0 }
                            }}
                            is24Hour={true}

                            date={this.state.endTime}
                            mode="datetime"
                            format="dddd, DD/MM/YYYY, HH:mm"
                            confirmBtnText="OK"
                            cancelBtnText="Hủy"
                            onDateChange={(date) => {
                                this.setState({ endTime: date });
                            }}
                        />
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <View style={styles.icon}>
                        <Icon name="md-notifications" size={30} />
                    </View>
                    <View style={{ flex: 8, justifyContent: 'center' }}>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <View style={styles.icon}>
                        <View style={{ width: 20, height: 20, backgroundColor: this.state.eventColor.hex }}></View>
                    </View>
                    <View style={{ flex: 8, justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => { this.setState({ colorPickerDialogVisible: true }) }}>
                            <Text style={styles.detailText}>{this.state.eventColor.name}</Text>
                        </TouchableOpacity>
                        <Dialog visible={this.state.colorPickerDialogVisible}
                            onTouchOutside={() => { this.setState({ colorPickerDialogVisible: false }) }}>
                            <DialogContent>
                                {colorList}
                            </DialogContent>
                        </Dialog>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <View style={styles.icon}>
                        <Icon name="md-list" size={30} />
                    </View>
                    <View style={{ flex: 8, justifyContent: 'center' }}>
                        <ScrollView>
                            <TextInput
                                style={styles.detailText}
                                defaultValue={this.props.eventDescription}
                                multiline={true}
                                placeholder='Nhập ghi chú'
                                onChangeText={(text) => { this.setState({ eventDescription: text }) }}>
                            </TextInput>
                        </ScrollView>
                    </View>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        eventId: state.currentSelectedEvent.eventId,
        eventColor: state.currentSelectedEvent.eventColor,
        startTime: state.currentSelectedEvent.startTime,
        endTime: state.currentSelectedEvent.endTime,
        eventTitle: state.currentSelectedEvent.eventTitle,
        eventDescription: state.currentSelectedEvent.eventDescription,
        eventColorList: state.eventColorList,
        latestEventId: state.latestEventId,
        monthEventList: state.selectedMonthEventList
    }
}

export default connect(mapStateToProps)(EventEditScreen);

const styles = StyleSheet.create({
    title: {
        flex: 3,
        justifyContent: 'flex-end'
    },
    titleText: {
        fontSize: 28,
        color: 'black'
    },
    detail: {
        flex: 7,
        backgroundColor: '#ffffff',
    },
    detailText: {
        fontSize: 22,
        color: 'black'
    },
    icon: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
