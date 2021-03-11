import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Button, Text, StyleSheet } from 'react-native';

export default SettingsScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    return (
        <View style={styles.sectionContainer}>
            <Text>Settings!!!</Text>
            <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
        </View>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
        flex: 1, justifyContent: 'center', alignItems: 'center'
    },
});