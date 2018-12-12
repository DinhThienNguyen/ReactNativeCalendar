import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity, Button, Picker, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import DatePicker from 'react-native-datepicker'
import { NavigationActions, StackActions } from 'react-navigation';
import moment from 'moment';
// import DBHelper from '../components/DBHelper'
import { connect } from "react-redux";

class EventEditScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: navigation.getParam('screenTitle', 'Thêm mới'),
            headerStyle: {
                backgroundColor: `${params.headerColor}`,
            },
            headerTintColor: 'white',
            headerRight: (
                <TouchableOpacity style={{ marginRight: 20 }} onPress={() => {
                    if (params.eventId == -1) {
                        params.addNewEvent();
                        const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'Week' }),
                            ],
                        });
                        navigation.dispatch(resetAction);
                    } else {
                        params.updateEvent();
                        params.updateCurrentSelectedEvent();
                        const resetAction = StackActions.reset({
                            index: 1,
                            actions: [
                                NavigationActions.navigate({ routeName: 'Week' }),
                                NavigationActions.navigate({ routeName: 'EventDetail' }),
                            ],
                        });
                        navigation.dispatch(resetAction);
                    }
                }}>
                    <Text style={{ fontSize: 18, color: 'white' }}>Lưu</Text>
                </TouchableOpacity>
            ),
        };
    };

    constructor(props) {
        super(props);

        let startDate = new Date(this.props.startTime * 1000);
        let endDate = new Date(this.props.endTime * 1000);

        const currentColor = this.props.eventColorList.find(element => element.hex === this.props.eventColor);

        let notifyTime = this.props.notifyTime;

        this.state = {
            notifyTime: notifyTime.length > 0 ? notifyTime : [],
            eventColor: currentColor,
            colorPickerDialogVisible: false,
            notificationDialogVisible: false,
            customNotificationDialogVisible: false,
            startTime: startDate,
            endTime: endDate,
            eventTitle: this.props.eventTitle,
            eventDescription: this.props.eventDescription,
            selectedNotification: -1,
            notificationTimeUnit: 'phút',
            notificationTimeAmount: 1
        };
        // this.DBHelperService = new DBHelper();
    }

    _addNewEvent = () => {
        let latestEventId = this.props.latestEventId + 1;
        let event = {
            eventId: latestEventId,
            eventColor: this.state.eventColor.hex,
            startTime: moment(this.state.startTime, "dddd, DD/MM/YYYY, HH:mm").unix(),
            endTime: moment(this.state.endTime, "dddd, DD/MM/YYYY, HH:mm").unix(),
            eventTitle: this.state.eventTitle,
            eventDescription: this.state.eventDescription,
            notifyTime: this.state.notifyTime
        };

        // console.log(event);

        if (event.eventTitle === '') {
            event.eventTitle = "Không có tiêu đề";
        }
        if (event.eventDescription === '') {
            event.eventDescription = "Không có mô tả";
        }

        this.props.DBHelper.addEvent(event);

        this.props.dispatch({ type: 'UPDATE_LAST_ID', latestEventId });

        let dayEventList = this.props.monthEventList;
        let dateString = moment(event.startTime * 1000).format('YYYY-MM-DD');
        if (!dayEventList[dateString]) {
            dayEventList[dateString] = [];
        }
        dayEventList[dateString] = [...dayEventList[dateString], event];

        this.props.dispatch({ type: 'UPDATE_LIST', dayEventList: dayEventList });

        this.scheduleEventNotification(event);
    }

    _updateEvent = () => {
        let event = {
            eventId: this.props.eventId,
            eventColor: this.state.eventColor.hex,
            startTime: moment(this.state.startTime, "dddd, DD/MM/YYYY, HH:mm").unix(),
            endTime: moment(this.state.endTime, "dddd, DD/MM/YYYY, HH:mm").unix(),
            eventTitle: this.state.eventTitle,
            eventDescription: this.state.eventDescription,
            notifyTime: this.state.notifyTime
        };
        if (event.eventTitle === '') {
            event.eventTitle = "Không có tiêu đề";
        }
        if (event.eventDescription === '') {
            event.eventDescription = "Không có mô tả";
        }
        this.props.DBHelper.updateEvent(event);

        let dayEventList = this.props.monthEventList;
        let dateString = moment(event.startTime * 1000).format('YYYY-MM-DD');
        let tempEventList = dayEventList[dateString];
        tempEventList = tempEventList.map(events => (events.eventId === event.eventId) ? { ...event } : events);
        dayEventList[dateString] = tempEventList;
        this.props.dispatch({ type: 'UPDATE_LIST', dayEventList });

        this.scheduleEventNotification(event);
    }

    scheduleEventNotification = (event) => {
        for (let i = 0; i < event.notifyTime.length; i++) {
            if ((event.startTime - event.notifyTime[i].notifyTime) > moment().unix()) {
                let timeRemaining = event.startTime - moment().unix() - event.notifyTime[i].notifyTime;
                this.props.notifService.scheduleNotif(timeRemaining, event, event.notifyTime[i].notifyId);
            }
        }
    }

    addNewEventNotification = (event) => {
        let latestEventNotifyId = this.props.latestEventNotifyId;
        let notifyTimeList = [];

        for (let i = 0; i < event.notifyTime.length; i++) {
            latestEventNotifyId++;
            let notification = {
                notifyId: latestEventNotifyId,
                eventId: event.eventId,
                notifyTime: event.notifyTime[i]
            };

            notifyTimeList = [...notifyTimeList, notification];
            this.props.DBHelper.addEventNotfication(notification);

            if ((event.startTime - event.notifyTime[i]) > moment().unix()) {
                let timeRemaining = event.startTime - moment().unix() - event.notifyTime[i];
                this.props.notifService.scheduleNotif(timeRemaining, event, latestEventNotifyId);
            }
        }
        event.notifyTime = notifyTimeList;
        this.props.dispatch({ type: 'UPDATE_LAST_EVENT_NOTIFY_ID', latestEventNotifyId });
    }

    addEventNotfication = (notifyTime) => {
        let latestEventId = this.props.latestEventId + 1;
        let latestEventNotifyId = this.props.latestEventNotifyId;
        let tempList = this.state.notifyTime;
        latestEventNotifyId++;
        let notification = {
            notifyId: latestEventNotifyId,
            eventId: latestEventId,
            notifyTime: notifyTime
        };
        this.props.DBHelper.addEventNotfication(notification);
        this.props.dispatch({ type: 'UPDATE_LAST_EVENT_NOTIFY_ID', latestEventNotifyId });
        tempList = [...tempList, notification];
        this.setState({
            notifyTime: tempList
        })
    }

    updateEventNotification = (notifyTime) => {
        if (notifyTime === 0) {
            let tempList = this.state.notifyTime;
            let notification = tempList[this.state.selectedNotification];
            this.props.DBHelper.deleteEventNotification(notification);
            tempList.splice(this.state.selectedNotification, 1);
            this.setState({
                notifyTime: tempList
            })
        } else {
            let tempList = this.state.notifyTime;
            let notification = tempList[this.state.selectedNotification];
            notification.notifyTime = notifyTime;
            this.props.DBHelper.updateEventNotification(notification);
            tempList[this.state.selectedNotification] = notification;
            this.setState({
                notifyTime: tempList
            })
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            addNewEvent: this._addNewEvent,
            updateEvent: this._updateEvent,
            updateCurrentSelectedEvent: this._updateCurrentSelectedEvent,
            eventId: this.props.eventId,
            headerColor: this.state.eventColor.hex
        })
    }

    convertNotifyTimeToString = (notifyTime) => {
        let minute = 0;
        let hour = 0;
        let day = 0;
        let week = 0;
        if (notifyTime % 604800 === 0) {
            week = notifyTime / 604800;
            return `Trước ${week} tuần`;
        }
        if (notifyTime % 86400 === 0) {
            day = notifyTime / 86400;
            return `Trước ${day} ngày`;
        }
        if (notifyTime % 3600 === 0) {
            hour = notifyTime / 3600;
            return `Trước ${hour} tiếng`;
        }
        if (notifyTime % 60 === 0) {
            minute = notifyTime / 60;
            return `Trước ${minute} phút`;
        }
        if (notifyTime === 1) {
            minute = notifyTime / 60;
            return `Tại thời điểm sự kiện`;
        }
    }

    _updateCurrentSelectedEvent = () => {
        let action = {
            eventId: this.props.eventId,
            eventColor: this.state.eventColor.hex,
            startTime: moment(this.state.startTime, "dddd, DD/MM/YYYY, HH:mm").unix(),
            endTime: moment(this.state.endTime, "dddd, DD/MM/YYYY, HH:mm").unix(),
            eventTitle: this.state.eventTitle,
            eventDescription: this.state.eventDescription,
            notifyTime: this.state.notifyTime
        };

        this.props.dispatch({ type: 'UPDATE_CURRENT', event: action });
    }

    render() {
        let notifyTimeList = this.state.notifyTime.map((item, key) => {
            return (
                <View key={key}>
                    <TouchableOpacity style={{ borderBottomWidth: 0.5, marginTop: 10, marginBottom: 10 }} onPress={() => {
                        this.setState({
                            notificationDialogVisible: true,
                            selectedNotification: key
                        })
                    }}>
                        <Text style={styles.detailText}>{this.convertNotifyTimeToString(item.notifyTime)}</Text>
                    </TouchableOpacity>
                </View>
            );
        })
        let colorList = this.props.eventColorList.map((item, key) => {
            return (
                <View key={key}>
                    <TouchableOpacity onPress={() => { this.setState({ eventColor: item, colorPickerDialogVisible: false }); this.props.navigation.setParams({ headerColor: item.hex }); }}>
                        <View style={{ flexDirection: 'row', padding: 10 }}>
                            <View >
                                <View style={{ height: 30, width: 30, backgroundColor: item.hex }}></View>
                            </View>
                            <View style={{ paddingLeft: 10 }}>
                                <Text style={{ fontSize: 20, color: 'black' }}>{item.name}</Text>
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
                                    fontSize: 18
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
                                    fontSize: 18
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
                        <Dialog dialogStyle={{ width: '90%' }} visible={this.state.notificationDialogVisible}
                            onTouchOutside={() => { this.setState({ notificationDialogVisible: false }) }}>
                            <DialogContent>
                                <View>
                                    <TouchableOpacity style={{ marginTop: 30 }} onPress={() => {
                                        if (this.state.selectedNotification !== -1) {
                                            this.updateEventNotification(0);
                                            this.setState({
                                                notificationDialogVisible: false
                                            })
                                        }
                                    }}>
                                        <Text style={styles.detailText}>Không thông báo</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{ marginTop: 30 }} onPress={() => {
                                        if (this.state.selectedNotification !== -1) {
                                            this.updateEventNotification(1);
                                        } else {
                                            this.addEventNotfication(1);
                                        }
                                        this.setState({
                                            notificationDialogVisible: false
                                        })
                                    }}>
                                        <Text style={styles.detailText}>Tại thời điểm sự kiện</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{ marginTop: 30 }} onPress={() => {
                                        if (this.state.selectedNotification !== -1) {
                                            this.updateEventNotification(1800);
                                        } else {
                                            this.addEventNotfication(1800);
                                        }
                                        this.setState({
                                            notificationDialogVisible: false
                                        })
                                    }}>
                                        <Text style={styles.detailText}>Trước 30 phút</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{ marginTop: 30 }} onPress={() => {
                                        if (this.state.selectedNotification !== -1) {
                                            this.updateEventNotification(3600);
                                        } else {
                                            this.addEventNotfication(3600);
                                        }
                                        this.setState({
                                            notificationDialogVisible: false
                                        })
                                    }}>
                                        <Text style={styles.detailText}>Trước 1 tiếng</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{ marginTop: 30 }} onPress={() => {
                                        this.setState({
                                            notificationDialogVisible: false,
                                            customNotificationDialogVisible: true
                                        })
                                    }}>
                                        <Text style={styles.detailText}>Tùy chọn</Text>
                                    </TouchableOpacity>
                                </View>
                            </DialogContent>
                        </Dialog>

                        <Dialog dialogStyle={{ width: '90%' }} visible={this.state.customNotificationDialogVisible} onTouchOutside={() => { this.setState({ customNotificationDialogVisible: false }) }}>
                            <DialogContent>
                                <View>
                                    <Text style={[styles.detailText, { marginTop: 10 }]}>Trước</Text>
                                    <TextInput keyboardType='numeric' style={[styles.detailText, { borderBottomWidth: 1 }]} onChangeText={(text) => {
                                        this.setState({
                                            notificationTimeAmount: text
                                        })
                                    }}></TextInput>

                                    <TouchableOpacity onPress={() => { this.setState({ notificationTimeUnit: 'phút' }) }}>
                                        <Text style={{ marginTop: 30, fontSize: 18, color: this.state.notificationTimeUnit === 'phút' ? '#009ae4' : 'black' }}>phút</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => { this.setState({ notificationTimeUnit: 'giờ' }) }}>
                                        <Text style={{ marginTop: 30, fontSize: 18, color: this.state.notificationTimeUnit === 'giờ' ? '#009ae4' : 'black' }}>giờ</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => { this.setState({ notificationTimeUnit: 'ngày' }) }}>
                                        <Text style={{ marginTop: 30, fontSize: 18, color: this.state.notificationTimeUnit === 'ngày' ? '#009ae4' : 'black' }}>ngày</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => { this.setState({ notificationTimeUnit: 'tuần' }) }}>
                                        <Text style={{ marginTop: 30, fontSize: 18, color: this.state.notificationTimeUnit === 'tuần' ? '#009ae4' : 'black' }}>tuần</Text>
                                    </TouchableOpacity>

                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>

                                        <TouchableOpacity style={{ marginRight: 30 }} onPress={() => {
                                            if (this.state.notificationTimeAmount <= 0) {
                                                ToastAndroid.show("Vui lòng nhập số lớn hơn 0!", ToastAndroid.LONG);
                                            } else {
                                                let amount = 0;
                                                switch (this.state.notificationTimeUnit) {
                                                    case 'phút':
                                                        amount = this.state.notificationTimeAmount * 60;
                                                        break;

                                                    case 'giờ':
                                                        amount = this.state.notificationTimeAmount * 3600;
                                                        break;

                                                    case 'ngày':
                                                        amount = this.state.notificationTimeAmount * 86400;
                                                        break;

                                                    case 'tuần':
                                                        amount = this.state.notificationTimeAmount * 604800;
                                                        break;

                                                    default:
                                                        amount = 0;
                                                }
                                                if (this.state.selectedNotification !== -1) {
                                                    this.updateEventNotification(amount);
                                                } else {
                                                    this.addEventNotfication(amount);
                                                }
                                                this.setState({
                                                    customNotificationDialogVisible: false
                                                })
                                            }
                                        }}>
                                            <Text style={[styles.detailText]}>OK</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => {
                                            this.setState({
                                                notificationDialogVisible: true,
                                                customNotificationDialogVisible: false
                                            })
                                        }}>
                                            <Text style={[styles.detailText]}>Hủy</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </DialogContent>
                        </Dialog>

                        {notifyTimeList}

                        <TouchableOpacity onPress={() => {
                            this.setState({
                                selectedNotification: -1,
                                notificationDialogVisible: true
                            })
                        }}>
                            <Text style={styles.detailText}>Thêm thông báo</Text>
                        </TouchableOpacity>
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
                        <Dialog dialogStyle={{ width: '90%' }} visible={this.state.colorPickerDialogVisible}
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
        notifyTime: state.currentSelectedEvent.notifyTime,
        latestEventId: state.latestEventId,
        monthEventList: state.selectedMonthEventList,
        notifService: state.globalNotifService,
        DBHelper: state.globalDBHelper,
        latestEventNotifyId: state.latestEventNotifyId
    }
}

export default connect(mapStateToProps)(EventEditScreen);

const styles = StyleSheet.create({
    title: {
        flex: 3,
        justifyContent: 'flex-end'
    },
    titleText: {
        fontSize: 22,
        color: 'black'
    },
    detail: {
        flex: 7,
        backgroundColor: '#ffffff',
    },
    detailText: {
        fontSize: 18,
        color: 'black'
    },
    icon: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    notifyOption: {
        padding: 5,
        borderBottomWidth: 1
    }
});
