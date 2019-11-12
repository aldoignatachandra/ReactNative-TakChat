import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, LayoutAnimation } from 'react-native';
import * as firebase from 'firebase';
import { Toast } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';

const RegisterScreen = (props) => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const showToast = (message, types) => {
        Toast.show({
            text: message,
            buttonText: "Okay",
            type: types == "danger" ? "danger" : "success",
            duration: 3000,
            position: "bottom"
        })
    }  

    const handleSignUp = () => {

        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((response) => {
                const user = firebase.auth().currentUser;
                user.sendEmailVerification()
                .then(() => {
                    props.navigation.navigate("Login");
                    showToast("Success Register", "success")
                })
                .catch(function(error) {
                    setErrorMessage(error.message)
                    showToast(errorMessage, "danger")
                });
            })
            .catch((error) => {
                setErrorMessage(error.message)
                showToast(errorMessage, "danger")   
            })
    }

    LayoutAnimation.easeInEaseOut();

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.textRegister}>REGISTER ACCOUNT</Text>

                <View style={styles.avatarContainer}>
                    <TouchableOpacity style={styles.avatar}>
                        <Icon name={'ios-add'} size={40} color={'white'}/>
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
                            onChangeText={username => setUsername(username)}
                            value={username}
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
                            onChangeText={email => setEmail(email)}
                            value={email}
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
                            onChangeText={password => setPassword(password)}
                            value={password}
                        ></TextInput>
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.textLogin}>SIGN UP</Text>
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
        marginTop:40,
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