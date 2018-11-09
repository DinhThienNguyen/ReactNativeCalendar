import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, Alert, ScrollView, TouchableOpacity, ToastAndroid, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import DatePicker from 'react-native-datepicker'
import moment from 'moment';

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({ name: 'calendarr.db', createFromLocation: '~calendar.db' }, this.openCB, this.errorCB);
export default class EventEditScreen extends Component {

    static navigationOptions = ({ navigation }) => {    
        return {
            title: navigation.getParam('screenTitle', 'Thêm mới'),
            headerRight: (
                <Button
                    onPress={() => {                        
                        let newEvent = {
                            id: navigation.getParam('eventId', -1),
                            hex: this.state.selectedEventColor.hex,
                            startDate: this.state.eventStartDate,
                            endDate: this.state.eventEndDate,
                            title: this.state.eventTitle,
                            description: this.state.eventDescription
                        }
                        if (newEvent.id == -1) {
                            addNewEvent(newEvent);
                        } else {
                            udpateEvent(newEvent);
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

        let startDate = new Date(this.props.navigation.state.params.startTime * 1000);
        let endDate = new Date(this.props.navigation.state.params.endTime * 1000);        

        this.state = {
            selectedEventColor: {
            },
            colors: [],
            colorPickerDialogVisible: false,            
            eventStartDate: startDate,
            eventEndDate: endDate,
            eventTitle: "",
            eventDescription: ""
        };

        //Lấy danh sách màu
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM event_color', [], (tx, results) => {
                console.log("Query completed");

                let len = results.rows.length;
                // ToastAndroid.show(`${len}`, ToastAndroid.SHORT);
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
                    //ToastAndroid.show(`${color.name}   ${color.hex}`, ToastAndroid.SHORT);
                }

                //Set màu hiện tại của sự kiện nếu được gọi từ EventDetailScreen thông qua navigation
                const test = this.state.colors.find(element => element.hex === this.props.navigation.state.params.eventColor);
                this.setState({
                    selectedEventColor: test,

                })
            });
        });
    }

    addNewEvent = () => {
        const navigation = this.props;
        db.transaction((tx) => {
            tx.executeSql('INSERT INTO event(color_hexid, starttime, endtime, title, description) values(?,?,?,?,?)',
                [
                    this.state.selectedEventColor.hex,
                    moment(this.state.eventStartDate, "dddd, DD/MM/YYYY, HH:mm").unix(),
                    moment(this.state.eventEndDate, "dddd, DD/MM/YYYY, HH:mm").unix(),
                    this.state.eventTitle,
                    this.state.eventDescription,
                ], (tx, results) => {
                    console.log("Query completed");
                });
        });
    }

    udpateEvent = () => {
        const navigation = this.props;
        db.transaction((tx) => {
            tx.executeSql('UPDATE event set color_hexid = ?, starttime = ?, endtime = ?, title = ?, description = ? WHERE id = ?',
                [
                    this.state.selectedEventColor.hex,
                    moment(this.state.eventStartDate, "dddd, DD/MM/YYYY, HH:mm").unix(),
                    moment(this.state.eventEndDate, "dddd, DD/MM/YYYY, HH:mm").unix(),
                    this.state.eventTitle,
                    this.state.eventDescription,
                    navigation.getParam('eventId', -1),
                ], (tx, results) => {
                    console.log("Query completed");
                });
        });
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
        const eventDescription = navigation.getParam('eventDescription', '');


        let colorList = this.state.colors.map((item, key) => {
            return (
                <View key={key}>
                    <TouchableOpacity onPress={() => { this.setState({ selectedEventColor: item, colorPickerDialogVisible: false }) }}>
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
                <Button title='test' onPress={() => { ToastAndroid.show(this.state.eventId + " ", ToastAndroid.SHORT) }}></Button>
                <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, paddingBottom: 10, paddingLeft: 10 }}>
                    <TextInput
                        style={styles.titleText}
                        placeholder='Nhập tiêu đề'
                        onChangeText={(text) => { this.setState({ eventTitle: text }) }}>
                        {eventTitle == '' ? '' : eventTitle}
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
                            date={this.state.eventStartDate}
                            mode="datetime"
                            format="dddd, DD/MM/YYYY, HH:mm"
                            confirmBtnText="OK"
                            cancelBtnText="Hủy"
                            onDateChange={(date) => {
                                this.setState({ eventStartDate: date });
                                // ToastAndroid.show(this.state.eventStartDate+"", ToastAndroid.SHORT);
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
                            date={this.state.eventEndDate}
                            mode="datetime"
                            format="dddd, DD/MM/YYYY, HH:mm"
                            confirmBtnText="OK"
                            cancelBtnText="Hủy"
                            onDateChange={(date) => {
                                this.setState({ eventEndDate: date });
                                ToastAndroid.show(this.state.eventEndDate, ToastAndroid.SHORT)
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
                        <View style={{ width: 20, height: 20, backgroundColor: this.state.selectedEventColor.hex }}></View>
                    </View>
                    <View style={{ flex: 8, justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => { this.setState({ colorPickerDialogVisible: true }) }}>
                            <Text style={styles.detailText}>{this.state.selectedEventColor.name}</Text>
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
                                multiline={true}
                                placeholder='Nhập ghi chú'
                                onChangeText={(text) => { this.setState({ eventDescription: text }) }}>
                                {eventDescription == '' ? '' : eventDescription}
                            </TextInput>
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
