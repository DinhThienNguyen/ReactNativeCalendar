import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
 class Page2 extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Text>Page2</Text>
            </View>
        );
    }
}
 export default Page2;
 const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: '#F5FCFF',
    },
 }); 