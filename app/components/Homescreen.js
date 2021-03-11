import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Button, Text, StyleSheet, StatusBar } from 'react-native';

export default HomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    return (<>
        <StatusBar><Text>Hi</Text></StatusBar>
        <View style={styles.sectionContainer}>
            <Text>Home!</Text>
        </View>
    </>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
        flex: 1, justifyContent: 'center', alignItems: 'center'
    },
});