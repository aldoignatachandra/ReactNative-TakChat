import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image } from 'react-native';
import { Toast } from 'native-base';
import {Db, Auth} from '../services/FirebaseConfig';
import AsyncStorage from '@react-native-community/async-storage';

const ProfileScreen = (props) => {

    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [image, setImage] = useState(null);

    const showToast = (message, types) => {
        Toast.show({
            text: message,
            buttonText: "Okay",
            type: types == "danger" ? "danger" : "success",
            duration: 3000,
            position: "bottom"
        })
    }   

    const signOutUser = async() => {
        const ID = await AsyncStorage.getItem('id');
        Db.ref('users/' + ID).update({status: 'offline'});
        AsyncStorage.clear();
        Auth.signOut();
        setTimeout(() => {
            props.navigation.navigate('Login');
        }, 1000);
    }

    useEffect(() => {
        const getid = async () => {
            try {
                const getName = await AsyncStorage.getItem('name')
                const getEmail = await AsyncStorage.getItem('email');
                const getImage = await AsyncStorage.getItem('image');
    
                setDisplayName(getName);
                setEmail(getEmail);
                setImage(getImage);

            } catch (e) {
                console.log(e);
            }
        };

        const timeOut = setTimeout(() => {
            getid();
        }, 0);

        return () => {
            clearTimeout(timeOut);
        }
    }, []);

    return (
        <View style={styles.container}>
            {console.log("RESPONSE",displayName, email, image)}
            <StatusBar backgroundColor="#FFEB00" barStyle="dark-content"></StatusBar>
            <Text>Hi {email}</Text>
            <Text>You Are {displayName}</Text>

            <View style={styles.avatarContainer}>
                <Image source={{uri: image}} style={styles.avatar}></Image>
            </View>

            <TouchableOpacity  style={{marginTop: 32, backgroundColor:"red", width:100}} onPress={() => signOutUser()}>
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