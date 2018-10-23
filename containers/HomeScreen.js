import React, { Component } from 'react';
import { StyleSheet, View, Button, TouchableOpacity, Text } from 'react-native';

export default class HomeScreen extends Component {

    state = {
        isDaySelected: true,
        isWeekSelected: false,
        isMonthSelected: false,
    }

    refreshDayEventList = () => {
        this.setState({
            isDaySelected: true,
            isWeekSelected: false,
            isMonthSelected: false
        })
    }

    refreshWeekEventList = () => {
        this.setState({
            isDaySelected: false,
            isWeekSelected: true,
            isMonthSelected: false
        })
    }

    refreshMonthEventList = () => {
        this.setState({
            isDaySelected: false,
            isWeekSelected: false,
            isMonthSelected: true
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.eventListView}>
                </View>
                <View style={styles.selectionBar}>
                    <TouchableOpacity
                        onPress={this.refreshDayEventList}
                        style={[styles.selectionCard, this.state.isDaySelected ? styles.active : styles.nonActive]}>
                        <Text style={this.state.isDaySelected ? styles.active : styles.nonActive}>21</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.refreshWeekEventList}
                        style={[styles.selectionCard, this.state.isWeekSelected ? styles.active : styles.nonActive]}></TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.refreshMonthEventList}
                        style={[styles.selectionCard, this.state.isMonthSelected ? styles.active : styles.nonActive]}></TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    eventListView: {
        flex: 9,
    },
    selectionBar: {
        flex: 1,
        flexDirection: 'row',
    },
    selectionCard: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1.5,
        borderColor: 'black'
    },
    active: {
        backgroundColor: '#2b579a',
        color: 'white',
        fontSize: 24,
    },
    nonActive: {
        color: 'black',
        backgroundColor: '#f3f2f1',
        fontSize: 24,
    }
});
