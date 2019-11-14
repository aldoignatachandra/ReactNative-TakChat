import React,{ useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';

const LoadingScreen = (props) => {

    useEffect(() => {

        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
            firebase.auth().onAuthStateChanged( user => {
                console.log("User",user);
                props.navigation.navigate(user !== null ? "App" : "Auth")
            })
        })
        .catch(console.log);

    }, []);

    return (
        <View>
            <Image source={require('../images/bg_icon.jpg')}/>
            <Image style={styles.logo} source={require('../images/icon.png')}/>
            <ActivityIndicator size="large"></ActivityIndicator>
        </View>
    )
}

const styles = StyleSheet.create({
    logo: {
        position:"absolute",
        width:220,
        height: 220,
        marginHorizontal: 70,
        marginVertical: 170
    },
})

export default LoadingScreen;