import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    ScrollView, 
    Image, 
    StatusBar,
    PermissionsAndroid, 
    Platform  
} from 'react-native';
import { Toast, Spinner } from 'native-base';
import { setLoading } from '../redux/actions/loading';
import { Auth, Db } from '../services/FirebaseConfig';
import ImagePicker from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';

const RegisterScreen = (props) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState('');
    const [imgData, setImgData] = useState(null);
    const [imgLoading, setImgLoading] = useState(false);
    const [location, setLocation] = useState({});

    const isLoading = useSelector(state => state.loading.isLoading);
    const dispatch = useDispatch();

    const options = {
        title: 'Select Photo',
        tintColor: '#1abc9c',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
    };

    const getCamera = () => {
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const source = {uri: 'data:image/jpeg;base64,' + response.data};

                setImage(response.uri);
                setImgData(source.uri);
            }
        });
    };

    const unpickImage = () => {
        setImage("");
        setImgData(null);
    }

    const hasLocationPermission = async () => {
        if ( Platform.OS === 'ios' || (Platform.OS === 'android' && Platform.Version < 23)) {
          return true;
        }
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (hasPermission) {
          return true;
        }
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (status === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        }
        if (status === PermissionsAndroid.RESULTS.DENIED) {
          ToastAndroid.show(
            'Location Permission Denied By User.',
            ToastAndroid.LONG,
          );
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          ToastAndroid.show(
            'Location Permission Revoked By User.',
            ToastAndroid.LONG,
          );
        }
        return false;
    };
    
    const getLocation = async () => {
        const hasLocationPermissions = await hasLocationPermission();
        
        if (!hasLocationPermissions) {
          return;
        }

        await Geolocation.getCurrentPosition(
            position => {
            let {longitude, latitude} = position.coords;
            setLocation({longitude, latitude});
            console.log("Location",location);
          },
          err => {
            console.log(err);
          },
          {
            showLocationDialog: true,
            forceRequestLocation: true,
            enableHighAccuracy: false,
            distanceFilter: 50,
            fastestInterval: 5000,
            timeout: 10000,
            maximumAge: 8000,
          },
        );
    };

    const register = async () => {
        await getLocation();
        if (Object.keys(location).length !== 2) {
            return showToast("Not Get Location yet", "danger");
        } else {
            dispatch(setLoading(true))

            if (imgData == null) {setImgData("https://image.flaticon.com/icons/png/512/64/64572.png")}

            const data = new FormData();
            data.append('file', imgData);
            data.append('upload_preset', 'p3se2auy');
        
            const res = await fetch(
                'https://api.cloudinary.com/v1_1/tak-chat/image/upload',
                {
                method: 'POST',
                body: data,
                },
            );
            
            const file = await res.json();
        
            if (name !== "") {  
                dispatch(setLoading(true))
                await Auth.createUserWithEmailAndPassword(email, password)
                .then(async result => {
                    var userPro = Auth.currentUser;
                    userPro.updateProfile({
                        displayName: name,
                        photoURL: file.secure_url,
                    });
                    await Db.ref('users/' + result.user.uid)
                    .set({
                        id: result.user.uid,
                        name: name,
                        email: email,
                        password: password,
                        image: file.secure_url,
                        status: 'offline',
                        location,
                    })
                    .then(() => {
                        dispatch(setLoading(false))
                        showToast("Register Success", "success");
                        props.navigation.navigate("Login");
                    });
                })
                .catch(error => {
                    dispatch(setLoading(false))
                    showToast(error.message, "danger");
                });
            } else {
                dispatch(setLoading(false))
                showToast("Username Cannot be empty", "danger");  
            }
        }
    };

    const showToast = (message, types) => {
        Toast.show({
            text: message,
            buttonText: "Okay",
            type: types == "danger" ? "danger" : "success",
            duration: 3000,
            position: "bottom"
        })
    }  

    return (
        <View style={styles.container}>
            <ScrollView>
                <StatusBar backgroundColor="#FFEB00" barStyle="dark-content"></StatusBar>
                <Text style={styles.textRegister}>REGISTER ACCOUNT</Text>

                <View style={styles.avatarContainer}>
                    {image ? (
                        <Image style={styles.avatar} source={{uri: image}} />
                    ) : (
                        <TouchableOpacity onPress={() => getCamera()} style={styles.avatar} disabled={isLoading}>
                            {imgLoading ? (
                                <Spinner color="#FFEB00" style={{margin: 0, padding: 0}} />
                            ) : (
                                <Text style={styles.imgDummyText}>+</Text>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
                <View>
                    <TouchableOpacity onPress={() => unpickImage()} disabled={isLoading}>
                        {image ? (
                            <Text style={{textAlign:"center"}}>Clear Image</Text>
                        ) : 
                            <Text style={{textAlign:"center"}}></Text>
                        }
                    </TouchableOpacity>
                </View>

                <View style={styles.form}>
                    <View>
                        <TextInput
                            disabled={isLoading}
                            style={styles.inputUsername}
                            returnKeyLabel="name"
                            returnKeyType="next"
                            placeholder="Input Name....."
                            autoCapitalize="none"
                            onChangeText={name => setName(name)}
                            value={name}
                        ></TextInput>
                    </View>

                    <View>
                        <TextInput
                            disabled={isLoading}
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
                            disabled={isLoading}
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

                <TouchableOpacity style={styles.button} onPress={register} disabled={isLoading}>
                    {isLoading ? <Spinner color='#FFEB00' /> : <Text style={styles.textLogin}>SIGN UP</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonText} onPress={() => props.navigation.navigate("Login")} disabled={isLoading}>
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
    },
    imgDummyText: {
        fontWeight: 'normal',
        fontSize: 24,
        color: '#2c3e50',
    },
})

export default RegisterScreen;