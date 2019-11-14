import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image } from 'react-native';
import { Toast, Spinner } from 'native-base';
import { Db, Auth } from '../services/FirebaseConfig';
import { setUserNull } from '../redux/actions/user';

const ProfileScreen = (props) => {

    const user = useSelector(state => state.user.user);
    const isLoading = useSelector(state => state.loading.isLoading);
    const dispatch = useDispatch();

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
        Db.ref('users/' + user.id).update({status: 'offline'});
        dispatch(setUserNull());
        Auth.signOut();
        setTimeout(() => {
            props.navigation.navigate('Login');
            showToast("Success Logout", "success");
        }, 1000);
    }

    return (
        <View>
            <View style={{backgroundColor:'#FFEB00', height: 190}}>
                <StatusBar backgroundColor="#FFEB00" barStyle="dark-content"></StatusBar>
                <View style={{height:280}}>
                    <Text style={{alignSelf:"center", marginTop:40, fontWeight:"bold", color:"#615414", fontSize:40}}>PROFILE</Text>
                </View>
            </View>

            <View style={{marginTop:50}}>
                <Text style={styles.textField}>Username</Text>
                <View style={styles.boxField}>
                    <Text style={styles.textInsideBox}>{user.name}</Text>
                </View>
                <Text style={styles.textField}>Email</Text>
                <View style={styles.boxField}>
                    <Text style={styles.textInsideBox}>{user.email}</Text>
                </View>
            </View>
            
            <View style={styles.avatarContainer}>
                <Image source={{uri: user.image}} style={styles.avatar}></Image>
            </View>

            <TouchableOpacity  style={styles.logoutButton} onPress={() => signOutUser()}>
                <Text style={{color:"#615414", fontSize:17, fontWeight:"bold"}}>Logout</Text>
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
        borderRadius: 90,
        backgroundColor: "#E1E2E6",
        borderWidth: 5,
        borderColor: "white"
    },
    avatarContainer: {
        position:'absolute',
        alignItems:"center",
        justifyContent:'center',
        width: '100%',
        height: 370,
        marginBottom:10,
    },
    logoutButton: {
        marginVertical:100,
        alignSelf:"center",
        backgroundColor:"#FFEB00", 
        width:120,
        height:40,
        borderRadius: 50,
        borderWidth:2,
        borderColor: "#615414", 
        alignContent:"center", 
        justifyContent:"center",
        alignItems: "center"
    },
    textField: {
        marginHorizontal:25, 
        marginTop:15,
        fontSize:13, 
        fontWeight:"bold"
    },
    textInsideBox: {
        textAlign:"center",
        fontWeight:"bold",
        fontSize:17
    },
    boxField: {
        borderColor:"#615414", 
        borderWidth:2, 
        marginHorizontal:20, 
        justifyContent:"center", 
        alignItems:"center",
        height:40,
        borderRadius: 12,
        marginTop: 5
    }
})

export default ProfileScreen;