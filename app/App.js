import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

// import { SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import store from './store';
import CheckAuthenticated from './components/checkAuthenticated';
import LoginOut from './components/logInOut';
import HomeScreen from './components/Homescreen';
import SettingsScreen from './components/SettingsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
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
    }

    return <Ionicons name={iconName} size={size} color={color} />;
};

const App = () => {
    return (
        <NavigationContainer>
            <Provider store={store}>
                <CheckAuthenticated />
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) =>
                            <Icon focused={focused} color={color} size={size} route={route} />
                    })}
                    tabBarOptions={{
                        activeTintColor: 'tomato',
                        inactiveTintColor: 'gray',
                    }}
                >
                    <Tab.Screen name="Home" component={HomeScreen} />
                    <Tab.Screen name="Settings" component={SettingsScreen} />
                    <Tab.Screen name="Login" component={LoginOut} />
                </Tab.Navigator>
            </Provider>
        </NavigationContainer>
    );
};

export default App;