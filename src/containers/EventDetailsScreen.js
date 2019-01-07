import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { connect } from "react-redux";
import { NavigationActions, StackActions } from 'react-navigation';
import moment from 'moment';


class EventDetailsScreen extends Component {

    static navigationOptions = {
        header: null
    }

    getCurrentDateInMillis = () => {
        let converter = new Date();
        converter.setHours(0);
        converter.setMinutes(0);
        converter.setMilliseconds(0);
        converter.setSeconds(0);
        return converter.getTime() / 1000;
    }

    convertMillisToDateString = (millis) => {
        let converter = new Date(millis * 1000);
        dayInWeek = "";
        switch (converter.getDay()) {
            case 0:
                dayInWeek = "Chủ nhật";
                break;
            case 1:
                dayInWeek = "Thứ hai";
                break;
            case 2:
                dayInWeek = "Thứ ba";
                break;
            case 3:
                dayInWeek = "Thứ tư";
                break;
            case 4:
                dayInWeek = "Thứ năm";
                break;
            case 5:
                dayInWeek = "Thứ sáu";
                break;
            case 6:
                dayInWeek = "Thứ bảy";
                break;
        }
        return dayInWeek + ", " + this.addZero(converter.getDate()) + "/" + this.addZero((converter.getMonth() + 1)) + "/" + converter.getFullYear() + ", " + this.addZero(converter.getHours()) + ":" + this.addZero(converter.getMinutes());
    }

    convertMillisToHour = (millis) => {
        return new Date(millis * 1000).getHours;
    }

    convertMillisToMinute = (millis) => {
        return new Date(millis * 1000).getMinutes;
    }

    isEventOnlyToday = (startTime, endTime) => {

        if ((startTime - this.getCurrentDateInMillis < 86400) && (endTime - startTime < 86400)) {
            return true;
        }
        return false;
    }

    addZero = (i) => {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    deleteEvent = () => {
        let event = {
            eventId: this.props.eventId
        };

        this.props.DBHelper.deleteEvent(event);

        let dateString = moment(this.props.startTime * 1000).format('YYYY-MM-DD');
        let tempList = this.props.monthEventList;
        let dateEventList = tempList[dateString];

        for (let i = 0; i < dateEventList.length; i++) {
            if (dateEventList[i].eventId === this.props.eventId) {
                dateEventList.splice(i, 1);
                break;
            }
        }

        tempList[dateString] = dateEventList;

        this.props.dispatch({ type: 'UPDATE_LIST', dayEventList: tempList });
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

    render() {
        let notifyTimeList = this.props.notifyTime.map((item, key) => {
            return (
                <View key={key}>
                    <Text style={styles.detailText}>
                        {this.convertNotifyTimeToString(item.notifyTime)}
                    </Text>
                </View>
            );
        })
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 3, justifyContent: 'flex-end', backgroundColor: this.props.eventColor }}>

                    <View style={{flexDirection: 'row', paddingLeft: 20, paddingBottom: 10 }}>
                        <ScrollView>
                            <Text style={{ fontFamily: 'sans-serif', fontSize: 24, fontWeight: 'bold', color: '#ffffff' }}>
                                {this.props.eventTitle === '' ? "Không có tiêu đề" : this.props.eventTitle}
                            </Text>
                        </ScrollView>
                    </View>
                </View>
                <View style={styles.detail}>
                    <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}>
                        <View style={styles.icon}>
                            <Icon name="md-time" size={25} color='#212121' />
                        </View>
                        <View style={{ flex: 9, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.title}>Thời gian</Text>
                        </View>
                    </View>

                    <Text style={styles.detailText}>
                        {this.isEventOnlyToday(this.props.startTime, this.props.endTime) ? 'Hôm nay' : this.convertMillisToDateString(this.props.startTime)}
                    </Text>
                    <Text style={styles.detailText}>
                        {this.isEventOnlyToday(this.props.startTime, this.props.endTime) ?
                            this.convertMillisToHour(this.props.startTime) + ":" + this.convertMillisToMinute(this.props.startTime) +
                            this.convertMillisToHour(this.props.endTime) + ":" + this.convertMillisToMinute(this.props.endTime)
                            :
                            this.convertMillisToDateString(this.props.endTime)}
                    </Text>


                    <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}>
                        <View style={styles.icon}>
                            <Icon name="md-notifications" size={25} color='#212121' />
                        </View>
                        <View style={{ flex: 9 }}>
                            <Text style={styles.title}>Thông báo</Text>
                        </View>
                    </View>

                    <View style={{ justifyContent: 'center' }}>
                        {this.props.notifyTime.length > 0 ? notifyTimeList
                            : <Text style={styles.detailText}>Không có thông báo trước</Text>}
                    </View>


                    <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5, paddingLeft: 10 }}>
                        <View style={styles.icon}>
                            <Icon name="md-list" size={25} color='#212121' />
                        </View>
                        <View style={{ flex: 9 }}>
                            <Text style={styles.title}>Mô tả chi tiết</Text>
                        </View>
                    </View>

                    <ScrollView>
                        <Text onPress={() => {
                            if (this.props.eventDescription.slice(0, 5) === 'https') {
                                Linking.openURL(this.props.eventDescription);
                            }
                        }} style={styles.detailText}>
                            {this.props.eventDescription === '' ? "không có miêu tả" : this.props.eventDescription}
                        </Text>
                    </ScrollView>
                </View>
                <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon
                            name="md-create" size={30} color='#212121'
                            onPress={() => {
                                this.props.navigation.navigate('EventEdit', {
                                    screenTitle: 'Chỉnh sửa'
                                });
                            }}></Icon>

                        <View style={{ width: 35 }}></View>

                        <Icon
                            name="md-trash" size={30} color='#212121'
                            onPress={() => {
                                Alert.alert(
                                    '',
                                    'Xóa sự kiện này ?',
                                    [
                                        { text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                        {
                                            text: 'Đồng ý', onPress: () => {
                                                this.deleteEvent();
                                                console.log('OK Pressed');
                                                const resetAction = StackActions.reset({
                                                    index: 0,
                                                    actions: [
                                                        NavigationActions.navigate({ routeName: 'Week' }),
                                                    ],
                                                });
                                                this.props.navigation.dispatch(resetAction);
                                            }
                                        },
                                    ],
                                    { cancelable: false }
                                )
                            }}></Icon>
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
        notifyTime: state.currentSelectedEvent.notifyTime,
        DBHelper: state.globalDBHelper,
        monthEventList: state.selectedMonthEventList,
    }
}

export default connect(mapStateToProps)(EventDetailsScreen);

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        color: '#484848',
        fontWeight: 'bold',
        fontFamily: 'sans-serif'
    },
    detail: {
        flex: 6,
        backgroundColor: '#ffffff',
    },
    detailText: {
        fontSize: 18,
        color: '#484848',
        fontFamily: 'sans-serif',
        paddingLeft: 20,
        paddingRight: 20
    },
    icon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

