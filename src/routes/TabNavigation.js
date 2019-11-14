import React from 'react';
import { Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs'

//Content
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';
import MapsScreen from '../screens/MapsScreen';

const TabNavigator = createBottomTabNavigator({
    ProfileScreen: {
        screen: ProfileScreen,
        navigationOptions: {
            tabBarLabel: 'Profile'
        }
    },
    ChatScreen: {
        screen: ChatScreen,
        navigationOptions: {
            tabBarLabel: 'Chat',
        }
    },
    MapsScreen: {
        screen: MapsScreen,
        navigationOptions: {
            tabBarLabel: 'Friends',
        }
    },
},{
    //router config
    initialRouteName: 'ProfileScreen',
    order: ['ProfileScreen','ChatScreen','MapsScreen'],
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({focused}) => {
            const { routeName } = navigation.state;
            let focus = focused ? {width: 27, height: 27} : {width: 22, height: 22};
            let sourceImage;
            
            if (routeName === 'ProfileScreen') {
                sourceImage = focused ? require('../images/UserIconSelected.png') : require('../images/UserIcon.png');
            } else if (routeName === 'ChatScreen') {
                sourceImage = focused ? require('../images/ChatIconSelected.png') : require('../images/ChatIcon.png');
            } else {
                sourceImage = focused ? require('../images/MapsIconSelected.png') : require('../images/MapsIcon.png');
            }
            
            return <Image style={focus} source={sourceImage} />;
        },
        tabBarOptions: {
            activeTintColor: 'black',
            inactiveTintColor: 'grey',
            style: {
                borderTopColor: "#E6E6E6",
                backgroundColor:"#F9F9FB",
                borderTopWidth: 0.5,
                paddingBottom: 1,
            },
            showLabel: false
        },   
    }),
})

const TabNavigation = createAppContainer(TabNavigator);
export default TabNavigation;