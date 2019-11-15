import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, TextInput, ToastAndroid } from 'react-native';
import { Toast, Spinner } from 'native-base';
import { Db, Auth } from '../services/FirebaseConfig';
import { setUser, setUserNull } from '../redux/actions/user';
import { setLoading } from '../redux/actions/loading';
import { Dialog } from 'react-native-simple-dialogs';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileScreen = (props) => {

    const user = useSelector(state => state.user.user);
    const isLoading = useSelector(state => state.loading.isLoading);
    const dispatch = useDispatch();
    const [dialogSignOut, setDialogSignOut] = useState(false);
    const [dialogEditName, setDialogEditName] = useState(false);
    const [dialogEditImage, setDialogEditImage] = useState(false);
    const [username, setUsername] = useState("");

    const showToast = (message, types) => {
        Toast.show({
            text: message,
            buttonText: "Okay",
            type: types == "danger" ? "danger" : "success",
            duration: 3000,
            position: "bottom"
        })
    }   

    const signOutUser = () => {
        Db.ref('users/' + user.id).update({status: 'offline'});
        dispatch(setUserNull());
        Auth.signOut();
        setTimeout(() => {
            props.navigation.navigate('Login');
            showToast("Success Logout", "success");
        }, 500);
    }

    const editImage = () => {
        
    }

    const editName = () => {
        if (username === "") {
            setUsername(user.name);
            ToastAndroid.show(
                `Username Cannot Be Empty`,
                ToastAndroid.SHORT,
            );
        } else {
            //Update Username in Current User and Database
            Promise.all([
                Auth.currentUser.updateProfile({displayName: username}),
                Db.ref('users/' + user.id).update({ name: username })
            ])

            //Update Username in asyncStorage  
            dispatch(setUser( user.id, username, user.email, user.image))

            ToastAndroid.show(
                `Success edit username to ${username}`,
                ToastAndroid.SHORT,
            );

            setDialogEditName(false);
        }
    }

    useEffect(() => {
        setUsername(user.name);
    }, [user]);

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
            
            {/* Image Account */}
            <View style={styles.avatarContainer}>
                <Image source={{uri: user.image}} style={styles.avatar}></Image>
            </View>

            {/* Button Edit Username */}
            <View style={styles.usernameEditContainer}>
                <TouchableOpacity onPress={() => setDialogEditName(true)}>
                    <Icon name={'md-create'} size={25} color={"#615414"}></Icon>
                </TouchableOpacity>
            </View>

            {/* Button Edit Image */}
            <View style={styles.avatarEditContainer}>
                <TouchableOpacity onPress={() => setDialogEditImage(true)}>
                    <Icon name={'md-camera'} size={30} color={"#615414"}></Icon>
                </TouchableOpacity>
            </View>

            {/* Button Logout */}
            <TouchableOpacity  style={styles.logoutButton} onPress={() => setDialogSignOut(true)}>
                <Text style={{color:"#615414", fontSize:17, fontWeight:"bold"}}>Logout</Text>
            </TouchableOpacity>

            {/* Dialog Box Sign Out */}
            <Dialog
                visible={dialogSignOut}
                title="Are You Sure Want To Logout ?"
                titleStyle={{textAlign:"center"}}
                onTouchOutside={() => setDialogSignOut(false)}
                >
                <View style={styles.signOutDialogBox} >
                    <TouchableOpacity onPress={() => setDialogSignOut(false)} style={styles.buttonNo}>
                        <Text style={styles.textNo}>No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonYes} onPress={() => signOutUser()}>
                        <Text style={styles.textYes}>Yes</Text>
                    </TouchableOpacity>
                </View>
            </Dialog>

            {/* Dialog Box Edit Name */}
            <Dialog
                visible={dialogEditName}
                title="Input Your New Username ?"
                titleStyle={{textAlign:"center"}}
                onTouchOutside={() => setDialogSignOut(false)}
                >
                <TextInput style={styles.textInput}
                    autoCapitalize='none'
                    maxLength={25}
                    onChangeText={value => setUsername(value)}
                    value={username}  
                >
                </TextInput>
                <View style={styles.signOutDialogBox} >
                    <TouchableOpacity onPress={() => setDialogEditName(false)} style={styles.buttonNo}>
                        <Text style={styles.textNo}>Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonYes} onPress={editName}>
                        <Text style={styles.textYes}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </Dialog>

            {/* Dialog Box Edit Image */}
            <Dialog
                visible={dialogEditImage}
                title="Feature Edit Image In Progress, Wait for next update"
                titleStyle={{textAlign:"center"}}
                onTouchOutside={() => setDialogEditImage(false)}
                >
                <View style={styles.signOutDialogBox} >
                    <TouchableOpacity onPress={() => setDialogEditImage(false)} style={styles.buttonNo}>
                        <Text style={styles.textNo}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Dialog>

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
    avatarEditContainer: {
        backgroundColor:"white",
        borderWidth:1,
        borderRadius: 30,
        borderColor: "#615414",
        position:'absolute',
        alignItems:"center",
        justifyContent:'center',
        width: '12%',
        height: 40,
        marginHorizontal: 205,
        marginVertical: 210
    },
    avatarEdit: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#E1E2E6",
        borderWidth: 1,
        borderColor: "white"
    },
    usernameEditContainer: {
        borderColor: "#615414",
        position:'absolute',
        alignItems:"center",
        justifyContent:'center',
        width: '10%',
        height: 40,
        marginHorizontal: 85,
        marginVertical: 240
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
    signOutDialogBox: {
        marginTop: 20, 
        flexDirection:'row', 
        alignItems:"center", 
        justifyContent:"center"
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
    },
    buttonNo: {
        width:100, 
        height: 50, 
        borderRadius: 8, 
        borderWidth: 1, 
        borderColor: '#615414', 
        alignItems:'center', 
        justifyContent:'center'
    },
    buttonYes: {
        marginLeft:10,
        width:100, 
        height: 50, 
        borderRadius: 8, 
        backgroundColor: '#615414', 
        alignItems:'center', 
        justifyContent:'center'
    },
    textYes: {
        fontWeight:'bold', 
        color:'#FFF', 
        fontSize:18
    },
    textNo: {
        fontWeight:'bold', 
        fontSize:18
    },
    textInput: {
        borderBottomColor: '#615414', 
        borderBottomWidth: 3, 
        height: 40, 
        width: 220, 
        fontSize: 15,
        color: '#615414',
        textAlign:"center",
        marginHorizontal:22
    }
})

export default ProfileScreen;