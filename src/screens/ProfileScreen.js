import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, StatusBar } from 'react-native';
import { Toast } from 'native-base';
import * as firebase from 'firebase';

const ProfileScreen = () => {

    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");

    const showToast = (message, types) => {
        Toast.show({
            text: message,
            buttonText: "Okay",
            type: types == "danger" ? "danger" : "success",
            duration: 3000,
            position: "bottom"
        })
    }   

    useEffect(() => {
        const { email, displayName } = firebase.auth().currentUser;
        setEmail(email);
        setDisplayName(displayName);
    }, []);

    const signOutUser = () => {
        setTimeout(() => {
            showToast("Logout Success", "success")
            firebase.auth().signOut();
        }, 1000);
    }

    LayoutAnimation.easeInEaseOut();

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="white" barStyle="dark-content"></StatusBar>
            <Text>Hi {email}</Text>
            
            <TouchableOpacity  style={{marginTop: 32}} onPress={() => signOutUser()}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
    }
})

export default ProfileScreen;