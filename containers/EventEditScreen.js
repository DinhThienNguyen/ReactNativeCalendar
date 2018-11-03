import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, Alert, ScrollView, TouchableOpacity, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import Dialog from 'react-native-popup-dialog';

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({ name: 'calendarr.db', createFromLocation: '~calendar.db' }, this.openCB, this.errorCB);

export default class EventDetailScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedEventColor: {},
            colors: [],
            colorPickerDialogVisible: false,
        };

        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM event_color', [], (tx, results) => {
                console.log("Query completed");

                // Get rows with Web SQL Database spec compliance.

                let len = results.rows.length;
                //ToastAndroid.show(`${len}`, ToastAndroid.SHORT);
                for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    let color = {
                        id: row.id,
                        name: row.name,
                        hex: row.hex,
                    }
                    this.setState({
                        colors: [...this.state.colors, color]
                    })
                    //ToastAndroid.show(`${row.title}${row.description}`, ToastAndroid.SHORT);
                }
            });
        });
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

    render() {
        const { navigation } = this.props;
        const eventTitle = navigation.getParam('eventTitle', '');
        const startTime = navigation.getParam('startTime', '0');
        const endTime = navigation.getParam('endTime', '0');
        const eventDescription = navigation.getParam('eventDescription', '');
        const eventColor = navigation.getParam('eventColor', '#009ae4');
        this.setState({
            selectedEventColor = this.state.colors.find(function (element) { return element.hex === eventColor }),
        })

        let colorList = this.state.colors.map((item, key) => {
            return (
                <View key={key}>
                    <TouchableOpacity onPress={() => { this.setState({selectedEventColor : item}) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.icon}>
                                <View style={{ height: 30, width: 30, backgroundColor: item.hex }}></View>
                            </View>
                            <View style={{ flex: 8 }}>
                                <Text>{item.name}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        })
        return (
            <View style={{ flex: 1 }}>
                <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, paddingBottom: 10 }}>
                    <TextInput placeholder='Nhập tiêu đề'>{this.eventTitle == '' ? '' : this.eventTitle}</TextInput>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <View style={styles.icon}>
                        <Icon name="md-time" size={30} />
                    </View>
                    <View style={{ flex: 8 }}>

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
                        <View style={{ width: 20, height: 20, backgroundColor: this.eventColor }}></View>
                    </View>
                    <View style={{ flex: 8, justifyContent: 'center' }}>
                        <TouchableOpacity>
                            <Text></Text>
                        </TouchableOpacity>
                        <Dialog visible={this.state.colorPickerDialogVisible}>
                            <View>
                                {colorList}
                            </View>
                        </Dialog>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <View style={styles.icon}>
                        <Icon name="md-list" size={30} />
                    </View>
                    <View style={{ flex: 8, justifyContent: 'center' }}>
                        <ScrollView>
                            <TextInput multiline={true} placeholder='Nhập ghi chú'>{this.eventDescription == '' ? '' : this.eventDescription}</TextInput>
                        </ScrollView>
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
