import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginOut from './components/logInOut';
import HomeScreen from './components/Homescreen';
import SettingsScreen from './components/SettingsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { selectIdToken, isAuthenticated, selectLoading } from './slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import SplashScreen from "react-native-splash-screen";
import Loading from './components/Loading';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const Icon = ({ focused, color, size, route }) => {
    let iconName;

    switch (route.name) {
        case 'Home':
            iconName = focused
                ? 'ios-home' : 'ios-home-outline';
            break;
        case 'Settings':
            iconName = focused
                ? 'ios-construct' : 'ios-construct-outline';
            break;
        case 'Login':
            iconName = focused
                ? 'ios-person' : 'ios-person-outline';
            break;
        case 'Logout':
            iconName = focused
                ? 'ios-person' : 'ios-person-outline';
            break;
    }

    return <Ionicons name={iconName} size={size} color={color} />;
};

const App = () => {
    const dispatch = useDispatch();
    const idToken = useSelector(selectIdToken);
    const loading = useSelector(selectLoading);

    useEffect(() => {
        SplashScreen.hide();
        dispatch(isAuthenticated());
    }, []);


    if (loading === 'pending') return <Loading />
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: "#06A9F4",
                    tabBarInactiveTintColor: "gray",
                    tabBarStyle: [
                        {
                            "display": "flex"
                        },
                        null
                    ],
                    tabBarIcon: ({ focused, color, size }) =>
                        <Icon focused={focused} color={color} size={size} route={route} />
                })}
            >{idToken ?
                <>
                    <Tab.Screen name="Home">
                        {() => (
                            <HomeStack.Navigator screenOptions={{ headerShown: false }} >
                                <HomeStack.Screen name="Day Schedule" component={HomeScreen} />
                                <HomeStack.Screen name="Night Schedule" component={HomeScreen} />
                            </HomeStack.Navigator>
                        )}
                    </Tab.Screen>
                    <Tab.Screen name="Settings" component={SettingsScreen} />
                    <Tab.Screen name="Logout" component={LoginOut} />
                </>
                : <>
                    <Tab.Screen name="Login" component={LoginOut} />
                </>
                }
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default App;