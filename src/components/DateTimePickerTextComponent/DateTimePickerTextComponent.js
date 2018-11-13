import React, { Component } from 'react';
import {
    AppRegistry,
    Text,
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native';

import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

export default class DateTimePickerTextComponent extends Component {
    constructor() {
        super();
        this.state = {
            isVisible: false,
            chosenDateTime: moment(new Date()).format('MMMM, Do YYYY HH:mm')
        }
    }

    handlePicker = (datetime) => {
        this.setState({
            isVisible: false,
            chosenDateTime: moment(datetime).format('MMMM, Do YYYY HH:mm')
        })
    }

    showPicker = () => {
        this.setState({
            isVisible: true
        })
    }

    hidePicker = () => {
        this.setState({
            isVisible: false
        })
    }

    render() {
        return (
            <View>
                <TouchableOpacity style={styles.button} onPress={this.showPicker}>
                    <Text style={styles.text}>{this.state.chosenDateTime}</Text>
                </TouchableOpacity>

                <DateTimePicker
                    isVisible={this.state.isVisible}
                    onConfirm={this.handlePicker}
                    onCancel={this.hidePicker}
                    mode='datetime'
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        width: 250,
        height: 50,
        backgroundColor: 'gray',
        borderRadius: 5,
        borderColor: 'black',
        borderWidth: 5,
        justifyContent: 'center',
        marginTop: 15
    },
    text: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center'
    }
});