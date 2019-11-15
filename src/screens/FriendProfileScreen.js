import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';

const FriendProfileScreen = (props) => {

    const [person, setPerson] = useState(props.navigation.getParam('item'));

    return (
        <View>
            <View style={{backgroundColor:'#FFEB00', height: 190}}>
                <StatusBar backgroundColor="#FFEB00" barStyle="dark-content"></StatusBar>
                <View style={{height:280}}>
                    <Text style={{alignSelf:"center", marginTop:40, fontWeight:"bold", color:"#615414", fontSize:30}}>FRIEND'S PROFILE</Text>
                </View>
            </View>

            <View style={{marginTop:50}}>
                <Text style={styles.textField}>Friend's Username</Text>
                <View style={styles.boxField}>
                    <Text style={styles.textInsideBox}>{person.name}</Text>
                </View>
                <Text style={styles.textField}>Friend's Email</Text>
                <View style={styles.boxField}>
                    <Text style={styles.textInsideBox}>{person.email}</Text>
                </View>
            </View>
            
            {/* Image Account */}
            <View style={styles.avatarContainer}>
                <Image source={{uri: person.image}} style={styles.avatar}></Image>
            </View>

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
})

export default FriendProfileScreen;