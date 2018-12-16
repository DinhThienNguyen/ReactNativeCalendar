import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ToastAndroid } from 'react-native';
import { connect } from 'react-redux'

class EventCard extends Component {

    getCurrentTimeNoMillis = () => {
        let converter = new Date();
        converter.setMilliseconds(0);
        converter.setSeconds(0);
        return converter.getTime() / 1000;
    };

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
    };

    convertMillisToHour = (millis) => {
        return new Date(millis * 1000).getHours;
    };

    convertMillisToMinute = (millis) => {
        return new Date(millis * 1000).getMinutes;
    };

    isEventOnlyToday = (startTime, endTime) => {
        if ((startTime == this.getCurrentTimeNoMillis) && (endTime - startTime < 86400)) {
            return true;
        }
        return false;
    };

    updateCurrentSelectedEvent = () => {        
        let action = {
            eventId: this.props.eventId,
            eventColor: this.props.eventColor,
            startTime: this.props.startTime,
            endTime: this.props.endTime,
            eventTitle: this.props.eventTitle,
            eventDescription: this.props.eventDescription,
            notifyTime: this.props.notifyTime
        };
        
        this.props.dispatch({ type: 'UPDATE_CURRENT', event: action });
    }

    render() {
        return (
            <View style={[styles.card, { backgroundColor: this.props.eventColor }]}>
                <TouchableOpacity onPress={() => {
                    this.updateCurrentSelectedEvent();
                    this.props.navigation.navigate('EventDetails');
                }} >

                    <Text numberOfLines={1} style={styles.title}>{this.props.eventTitle === '' ? "Không có tiêu đề" : this.props.eventTitle}</Text>
                    <Text style={styles.detailText}>
                        {this.isEventOnlyToday(this.props.startTime, this.props.endTime) ? 'Hôm nay' : this.convertMillisToDateString(this.props.startTime) + " -"}
                    </Text>
                    <Text style={styles.detailText}>
                        {this.isEventOnlyToday(this.props.startTime, this.props.endTime) ?
                            this.convertMillisToHour(this.props.startTime) + ":" + this.convertMillisToMinute(this.props.startTime)
                            + " - " +
                            this.convertMillisToHour(this.props.endTime) + ":" + this.convertMillisToMinute(this.props.endTime)
                            :
                            this.convertMillisToDateString(this.props.endTime)}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default connect()(EventCard);

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        padding: 5,
        paddingLeft: 10,
        color: 'white',
    },
    time: {
        fontSize: 20,
        padding: 5,
        color: 'white',
    },
    card: {
        marginTop: 5,
    },
    detailText: {
        fontSize: 18,
        paddingLeft: 10,
        padding: 5,
        color: 'white'
    },
});
