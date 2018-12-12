import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, ToastAndroid, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { connect } from "react-redux";

class EventDetailScreen extends Component {

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

    convertMillisToDateString = (sec) => {
        let converter = new Date(sec * 1000);
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

    convertMillisToHour = (sec) => {
        return new Date(sec * 1000).getHours;
    }

    convertMillisToMinute = (sec) => {
        return new Date(sec * 1000).getMinutes;
    }

    convertNotifyTimeToString = (notifyTime) => {
        let minute = 0;
        let hour = 0;
        let day = 0;
        let week = 0;
        console.log(notifyTime);
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
            return `Trước ${hour} giờ`;
        }
        if (notifyTime % 60 === 0) {
            minute = notifyTime / 60;
            return `Trước ${minute} phút`;
        }
        if(notifyTime === 1){
            return 'Tại thời điểm xảy ra sự kiện';
        }
    }

    isEventOnlyToday = (startTime, endTime) => {

        if ((startTime - this.getCurrentDateInMillis < 86400) && (endTime - startTime < 86400)) {
            return true;
        }
        return false;
    }

    render() {
        let notifyTimeList = this.props.notifyTime.map((item, key) => {
            return (
                <View key={key}>
                    <Text style={{ fontSize: 20, color: 'black' }}>
                        {this.convertNotifyTimeToString(item.notifyTime)}
                    </Text>
                </View>
            );
        })
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 3, justifyContent: 'flex-end', backgroundColor: this.props.eventColor }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 2 }}></View>
                        <View style={{ flex: 8 }}>
                            <Text style={{ fontSize: 28, color: '#ffffff', marginBottom: 20 }}>{this.props.eventTitle === '' ? "Không có tiêu đề" : this.props.eventTitle}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.detail}>
                    <Button title='Chỉnh sửa' onPress={() => {
                        this.props.navigation.navigate('EventEdit', {
                            screenTitle: 'Chỉnh sửa'
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
                            {this.props.notifyTime.length > 0 ? notifyTimeList : <Text style={{ fontSize: 20, color: 'black' }}>Không có thông báo trước</Text>}
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <View style={styles.icon}>
                            <Icon name="md-list" size={30} />
                        </View>
                        <View style={{ flex: 8, justifyContent: 'center' }}>
                            <ScrollView>
                                <Text style={styles.detailText}>{this.props.eventDescription === '' ? "không có miêu tả" : this.props.eventDescription}</Text>
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
        eventDescription: state.currentSelectedEvent.eventDescription,
        notifyTime: state.currentSelectedEvent.notifyTime,
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
