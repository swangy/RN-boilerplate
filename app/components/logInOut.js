import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Button, StyleSheet } from 'react-native';
import { getUserProfile, selectIdToken, selectAccessToken, handleLogoutPress, handleLoginPress, upsertToHasura } from '../slices/userSlice';

export default LoginOut = () => {
    const accessToken = useSelector(selectAccessToken);
    const idToken = useSelector(selectIdToken);
    const dispatch = useDispatch();

    return (
        <View>
            {!idToken ? (
                <View style={styles.sectionContainer}>
                    <Button title={'Login'} onPress={() => dispatch(handleLoginPress())} />
                </View>
            ) : (
                    <>
                        <View style={styles.sectionContainer}>
                            <Button title={'Logout'} onPress={() => dispatch(handleLogoutPress())} />
                        </View>
                        <View style={styles.sectionContainer}>
                            <Button title={'Retrieve Profile'} onPress={() => dispatch(getUserProfile(accessToken))} />
                        </View>
                    </>
                )}
            {
                <View style={styles.sectionContainer}>
                    <Button title={'Upsert'} onPress={() => dispatch(upsertToHasura(idToken))} />
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
});