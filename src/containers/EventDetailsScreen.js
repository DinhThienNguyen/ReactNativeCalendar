import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, ToastAndroid, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { connect } from "react-redux";

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

    render() {
        return (
           <View style = {{flex:1}}>
                <View style = {{flex:3, justifyContent: 'flex-end', backgroundColor: this.props.eventColor}}>
                    <View style={{flexDirection: 'row'}}>
                            <Text style={{ fontFamily: 'sans-serif', fontSize: 28, fontWeight: 'bold', color: '#ffffff', marginBottom: 10, marginLeft: 20 }}>
                                {this.props.eventTitle === '' ? "Không có tiêu đề" : this.props.eventTitle}
                            </Text>
                    </View>
                </View>
                <View style = {styles.detail}>
                    <View style = {{flexDirection: 'row'}}>
                        <View style = {styles.icon}>
                            <Icon name="md-time" size={30} color = '#212121' />
                        </View>
                        <View style = {{flex: 9, flexDirection: 'row', alignItems: 'center'}}>
                            <Text style = {styles.title}>Time</Text>
                        </View>                          
                    </View>
                    <View style = {styles.line}></View>

                        <Text style={[styles.detailText,{paddingLeft: 20, paddingRight: 20}]}>
                            {this.isEventOnlyToday(this.props.startTime, this.props.endTime) ? 'Hôm nay' : this.convertMillisToDateString(this.props.startTime)}
                        </Text>
                        <Text style={[styles.detailText,{paddingLeft: 20, paddingRight: 20}]}>
                            {this.isEventOnlyToday(this.props.startTime, this.props.endTime) ?
                                this.convertMillisToHour(this.props.startTime) + ":" + this.convertMillisToMinute(this.props.startTime)+
                                this.convertMillisToHour(this.props.endTime) + ":" + this.convertMillisToMinute(this.props.endTime)
                                :
                                this.convertMillisToDateString(this.props.endTime)}
                        </Text>

                    
                    <View style = {{flexDirection: 'row'}}>
                        <View style = {styles.icon}>
                            <Icon name="md-notifications" size={30} color = '#212121' />
                        </View>
                        <View style = {{flex: 9}}>
                            <Text style = {styles.title}>Notification</Text>
                        </View> 
                    </View>
                    <View style = {styles.line}></View>


                    <Text style={[styles.detailText,{paddingLeft: 20, paddingRight: 20}]}>TEST</Text>

                    
                    <View style = {{flexDirection: 'row'}}>
                        <View style = {styles.icon}>
                            <Icon name="md-clipboard" size={30} color = '#212121' />
                        </View>
                        <View style = {{flex: 9}}>
                            <Text style = {styles.title}>Description</Text>
                        </View> 
                    </View>
                    <View style = {styles.line}></View>
                    
                    <ScrollView>
                        <Text style={[styles.detailText,{paddingLeft: 20, paddingRight: 20, fontFamily: 'sans-serif'}]}>{this.props.eventDescription === '' ? "không có miêu tả" : this.props.eventDescription}</Text>
                    </ScrollView>
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

export default connect(mapStateToProps)(EventDetailsScreen);

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        color: '#484848',
        fontWeight: 'bold'
    },
    detail: {
        flex: 7,
        backgroundColor: '#ffffff',
    },
    detailText: {
        fontSize: 22,
        color: '#484848',
        fontFamily: 'Roboto'
    },
    icon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    line: {
        borderBottomColor: '#484848',
        borderBottomWidth: 1,
        marginTop: 10,
        marginRight: 10,
        marginBottom: 10,
        marginLeft: 10
    }
});

