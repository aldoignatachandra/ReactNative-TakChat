import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image } from 'react-native';
import { Toast } from 'native-base';
import * as firebase from 'firebase';

const ProfileScreen = () => {

    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [avatar, setAvatar] = useState(null);

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
        const { email, displayName, photoURL } = firebase.auth().currentUser;
        setEmail(email);
        setDisplayName(displayName);
        setAvatar(photoURL);
    }, []);

    const signOutUser = () => {
        setTimeout(() => {
            showToast("Logout Success", "success")
            firebase.auth().signOut();
        }, 1000);
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="white" barStyle="dark-content"></StatusBar>
            <Text>Hi {email}</Text>
            <Text>You Are {displayName}</Text>

            <View style={styles.avatarContainer}>
                <Image source={{uri: avatar}} style={styles.avatar}></Image>
            </View>

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
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 60,
        backgroundColor: "#E1E2E6",
        justifyContent: "center",
        alignItems: "center" 
    },
    avatarContainer: {
        alignItems:"center",
        width:"100%",
        marginTop:30,
        marginBottom:10
    }
})

export default ProfileScreen;