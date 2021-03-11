import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Button, StyleSheet, Text } from 'react-native';
import { getUserProfile, selectIdToken, selectAccessToken, handleLogoutPress, handleLoginPress, upsertToHasura } from '../slices/userSlice';
import SInfo from "react-native-sensitive-info";

export default LoginOut = (props) => {
    const accessToken = useSelector(selectAccessToken);
    const idToken = useSelector(selectIdToken);
    const dispatch = useDispatch();
    const [idTokenFromSI, setIdTokenFromSI] = useState('');

    useEffect(() => {
        async function load() {
            const idTokenFromSI = await SInfo.getItem("idToken", {});
            setIdTokenFromSI(idTokenFromSI);
            console.log('idToken: ', idTokenFromSI);
        }
        load();
    }, [idToken]);

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
            <View style={styles.sectionContainer}>
                <Button title={'Upsert'} onPress={() => dispatch(upsertToHasura(idToken))} />
                <Text>&nbsp;</Text>
            </View>
            <View>
                {idToken &&
                    <Text>
                        idToken in state: &nbsp;
                        {idToken.substring(0, 7)}...
                        {idToken.substring(idToken.length - 7, idToken.length)}
                    </Text>
                }
                <Text>&nbsp;</Text>
                <Text>
                    idToken in SI: &nbsp;
                    {idTokenFromSI && idTokenFromSI.substring(0, 7)}...
                    {idTokenFromSI && idTokenFromSI.substring(idTokenFromSI.length - 7, idTokenFromSI.length)}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
});