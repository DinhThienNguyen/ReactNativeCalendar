import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, Button, TouchableOpacity } from 'react-native';

export default class App extends Component {

    render() {
        return (
            <View>
                <TouchableOpacity style={styles.card}>
                    <Text style={styles.title}>{this.props.title}</Text>
                    <Text style={styles.description}>{this.props.description}</Text>
                </TouchableOpacity>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        padding: 5
    },
    description: {
        fontSize: 20,
        padding: 5
    },
    card: {
        backgroundColor: 'white'
    }
});
