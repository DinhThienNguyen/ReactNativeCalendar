import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, ToastAndroid, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { connect } from "react-redux";

class EventDetailScreen extends Component {

    static navigationOptions = {
        header: null
    }

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

    updateCurrentSelectedEvent = () => {
        //redux store 
        let action = {
            id: 1,
            hex: '#009ae4',
            startTime: 1540227600,
            endTime: 1540227600,
            title: 'test',
            description: 'test'
        };
        ToastAndroid.show(
            action.id + " " + action.hex + " " + action.startTime + " " + action.endTime + " " + action.title + " " + action.description, ToastAndroid.SHORT
        );
        this.props.dispatch({ type: 'UPDATE_CURRENT', action });
    }

    render() {
        // const { navigation } = this.props;
        // const eventId = navigation.getParam('eventId', '-1');
        // const eventTitle = navigation.getParam('eventTitle', 'Không tiêu đề');
        // const startTime = navigation.getParam('startTime', '0');
        // const endTime = navigation.getParam('endTime', '0');
        // const eventDescription = navigation.getParam('eventDescription', '0');
        // const eventColor = navigation.getParam('eventColor', 'Không tiêu đề');
        // ToastAndroid.show(eventId + '', ToastAndroid.SHORT);
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 3, justifyContent: 'flex-end', backgroundColor: this.props.eventColor }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 2 }}></View>
                        <View style={{ flex: 8 }}>
                            <Text style={{ fontSize: 28, color: '#ffffff', marginBottom: 20 }}>{this.props.eventTitle}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.detail}>
                    <Button title='Chỉnh sửa' onPress={() => {
                        this.props.navigation.navigate('EventEdit', {
                            startTime: this.props.startTime,
                            endTime: this.props.endTime
                        });
                    }}></Button>
                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <View style={styles.icon}>
                            <Icon name="md-time" size={30} />
                        </View>
                        <View style={{ flex: 8 }}>
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
                                <Text style={styles.detailText}>{this.props.eventDescription}</Text>
                            </ScrollView>
                        </View>
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
        eventDescription: state.currentSelectedEvent.eventDescription
    }
}

export default connect(mapStateToProps)(EventDetailScreen);

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
