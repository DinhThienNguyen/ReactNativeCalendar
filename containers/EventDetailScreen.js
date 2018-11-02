import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

export default class EventDetailScreen extends Component {

    alertDetail = () => {
        Alert.alert(this.props.title);
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
        return dayInWeek + ", " + converter.getDate() + "/" + (converter.getMonth() + 1) + "/" + converter.getFullYear() + ", " + converter.getHours() + ":" + converter.getMinutes();
    }

    convertMillisToHour = (millis) => {
        return new Date(millis * 1000).getHours;
    }

    convertMillisToMinute = (millis) => {
        return new Date(millis * 1000).getMinutes;
    }

    isEventOnlyToday = (startTime, endTime) => {
        //ToastAndroid.show(this.getCurrentDateInMillis()+"", ToastAndroid.SHORT);
        
        if ((startTime - this.getCurrentDateInMillis < 86400) && (endTime - startTime < 86400)) {
            //ToastAndroid.show('isEventOnlyToday: true', ToastAndroid.SHORT);
            return true;
        }
        //ToastAndroid.show('isEventOnlyToday: false', ToastAndroid.SHORT);
        return false;
    }

    render() {
        const { navigation } = this.props;
        const eventTitle = navigation.getParam('eventTitle', 'Không tiêu đề');
        const startTime = navigation.getParam('startTime', '0');
        const endTime = navigation.getParam('endTime', '0');
        const eventDescription = navigation.getParam('eventDescription', '0');
        const eventColor = navigation.getParam('eventColor', 'Không tiêu đề');
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 3, justifyContent: 'flex-end', backgroundColor: eventColor }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 2 }}></View>
                        <View style={{ flex: 8 }}>
                            <Text style={{ fontSize: 28, color: '#ffffff', marginBottom: 20 }}>{eventTitle}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.detail}>
                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <View style={styles.icon}>
                            <Icon name="md-time" size={30} />
                        </View>
                        <View style={{ flex: 8 }}>
                            <Text style={styles.detailText}>
                                {this.isEventOnlyToday(startTime, endTime) ? 'Hôm nay' : this.convertMillisToDateString(startTime) + " -"}
                            </Text>
                            <Text style={styles.detailText}>
                                {this.isEventOnlyToday(startTime, endTime) ?
                                    this.convertMillisToHour(startTime) + ":" + this.convertMillisToMinute(startTime)
                                    + " - " +
                                    this.convertMillisToHour(endTime) + ":" + this.convertMillisToMinute(endTime)
                                    :
                                    this.convertMillisToDateString(endTime)}
                            </Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <View style={styles.icon}>
                            <Icon name="md-notifications" size={30} />
                        </View>
                        <View style={{ flex: 8, justifyContent: 'center' }}>
                            <Text style={styles.detailText}>Hello</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <View style={styles.icon}>
                            <Icon name="md-list" size={30} />
                        </View>
                        <View style={{ flex: 8, justifyContent: 'center' }}>
                            <ScrollView>
                                <Text style={styles.detailText}>{eventDescription}</Text>
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        flex: 3,
        justifyContent: 'flex-end'
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
