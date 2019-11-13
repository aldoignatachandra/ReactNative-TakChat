import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, StatusBar } from 'react-native';
import { Toast, Spinner } from 'native-base';
import { setLoading } from '../redux/actions/loading';
import * as firebase from 'firebase';
import ImagePicker from 'react-native-image-picker';

const RegisterScreen = (props) => {

    const [user, setUser] = useState({username:"", email:"", password: "", avatar:null})
    const [errorMessage, setErrorMessage] = useState(null);

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
    
    const handleSignUp = async() => {

        if (user.username !== "") {
            try {
                dispatch(setLoading(true))
                const response = await firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                
                //SAVE PROFILE
                response.user.updateProfile({ 
                    displayName : user.username,
                    photoURL : (user.avatar ? user.avatar.uri : null) 
                })
                
                console.log(response);

                // SEND EMAIL VERIFY
                const userDetails = firebase.auth().currentUser;
                userDetails.sendEmailVerification()
                .then(() => {
                    props.navigation.navigate("Login");
                    showToast("Success Register", "success")
                })
                .catch(function(error) {
                    setErrorMessage(error.message)
                    showToast(errorMessage, "danger")
                });
            } catch (error) {
                setErrorMessage(error.message);
                showToast(errorMessage, "danger");
            } finally {
                dispatch(setLoading(false));
            }
        } else {
            showToast("Username Cannot be empty", "danger");
        }
    }
    
    const handleUnpickAvatar = () => {
        setUser({...user, avatar: null})
    }

    const handlePickAvatar = () => {
        const option = {
            noData: true
        };

        ImagePicker.launchImageLibrary(option, response => {
            if(response.uri){
                setUser({...user, avatar: response})
            }
        })
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <StatusBar backgroundColor="#FFEB00" barStyle="dark-content"></StatusBar>
                <Text style={styles.textRegister}>REGISTER ACCOUNT</Text>

                <View style={styles.avatarContainer}>
                    <TouchableOpacity onPress={handlePickAvatar}>
                        { user.avatar ? (
                            <Image source={{uri: user.avatar.uri}} style={styles.avatar}></Image>
                        ) : (
                            <Image source={{uri: user.avatar}} style={styles.avatar}></Image>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleUnpickAvatar}>
                        { user.avatar ? (
                            <Text style={{marginTop:15}}>Clear Image</Text>
                        ) : (
                            <Text style={{marginTop:15}}></Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.form}>
                    <View>
                        <TextInput
                            style={styles.inputUsername}
                            returnKeyLabel="Username"
                            returnKeyType="next"
                            placeholder="Input Username....."
                            autoCapitalize="none"
                            onChangeText={username => setUser({...user, username: username})}
                            value={user.username}
                        ></TextInput>
                    </View>

                    <View>
                        <TextInput
                            style={styles.inputEmail}
                            returnKeyLabel="Email"
                            returnKeyType="next"
                            placeholder="Input Email....."
                            autoCapitalize="none"
                            keyboardType="email-address"
                            onChangeText={email => setUser({...user, email: email})}
                            value={user.email}
                        ></TextInput>
                    </View>

                    <View>
                        <TextInput 
                            style={styles.inputPassword}
                            returnKeyLabel="Password"
                            returnKeyType="done"
                            placeholder="Input Password....."
                            secureTextEntry
                            autoCapitalize="none"
                            onChangeText={password => setUser({...user, password: password})}
                            value={user.password}
                        ></TextInput>
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    {isLoading ? <Spinner color='#FFEB00' /> : <Text style={styles.textLogin}>SIGN UP</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonText} onPress={() => props.navigation.navigate("Login")}>
                    <Text style={{ color: "#414959", fontSize: 13 }}>
                        Already have an account ? <Text style={styles.textSignUp}>Login</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#FFEB00"
    },
    logo: {
        width:210, 
        height:210, 
        alignSelf:"center", 
        marginTop:70
    },
    form: {
        marginTop:10,
        marginBottom: 48,
        marginHorizontal: 30
    },
    inputUsername: {
        paddingLeft:20,
        borderWidth: 0.5,
        borderColor: "#fbfbfb",
        backgroundColor: "#fbfbfb",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: 50,
        fontSize: 15,
        color: "black"
    },
    inputEmail: {
        borderTopColor:"black",
        paddingLeft:20,
        borderWidth: 0.5,
        borderColor: "#fbfbfb",
        backgroundColor: "#fbfbfb",
        height: 50,
        fontSize: 15,
        color: "black"
    },
    inputPassword: {
        borderTopColor:"black",
        paddingLeft:20,
        borderWidth: 0.5,
        borderColor: "#fbfbfb",
        backgroundColor: "#fbfbfb",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        height: 50,
        fontSize: 15,
        color: "black"
    },
    button: {
        marginTop: -20,
        marginHorizontal: 80,
        backgroundColor: "#3B1E1E",
        borderRadius: 10,
        height: 55,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        alignSelf: "center",
        marginTop: 32
    },
    textLogin: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 17
    },
    textSignUp: {
        color:"#615414", 
        fontWeight: "bold",
        fontSize: 15 
    },
    textRegister: {
        color:"#615414", 
        fontWeight: "bold",
        fontSize: 30,
        alignSelf: "center",
        marginTop: 65
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

export default RegisterScreen;