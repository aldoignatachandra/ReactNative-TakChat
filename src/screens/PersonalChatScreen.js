import React, { useState, useEffect, Fragment } from 'react';
import { View, Image, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { useSelector } from 'react-redux';
import { GiftedChat, Bubble, Send, Time } from 'react-native-gifted-chat';
import { Db } from '../services/FirebaseConfig';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/Ionicons';

const PersonalChatScreen = (props) => {

    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [person, setPerson] = useState(props.navigation.getParam('item'));

    const user = useSelector(state => state.user.user);

    const send = () => {
        if (message.length > 0) {
            let msgId = Db
            .ref('messages')
            .child(user.id)
            .child(person.id)
            .push().key;
            let updates = {};
            let messages = {
                _id: msgId,
                text: message,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                user: {
                    _id: user.id,
                    name: user.name,
                    avatar: user.image,
                },
            };
            updates['messages/' + user.id + '/' + person.id + '/' + msgId ] = messages;
            updates['messages/' + person.id + '/' + user.id + '/' + msgId ] = messages;
            Db.ref().update(updates);
            setMessage('')
        }
    };

    useEffect(() => {
        const timeOut = setTimeout(() => {
            console.log('props',props.navigation.getParam('item', {}));
            console.log("PERSON", person);
            console.log("USER", user.id);
            Db.ref('messages')
            .child(user.id)
            .child(person.id)
            .on('child_added', val => {
                setMessageList(previousState => GiftedChat.append(previousState, val.val()))
            });
        }, 0);

        return () => {
            clearTimeout(timeOut);
        }

    }, []);

    const renderBubble = (props) => {
        return (
            <Bubble 
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#FFEB00',
                        borderRadius: 10,
                    },
                    left: {
                        backgroundColor: 'white',
                        borderRadius: 10
                    },
                }}
                textStyle={{
                    right: {
                        color: "black",
                    },
                    left: {
                        color: "black"
                    }
                }}
            />
        );
    }

    const renderSend = (props) => {
        return (
            <Send {...props}>
                <View
                    style={{
                        width: 45,
                        height: 42,
                        backgroundColor: "#FFEB00",
                        marginRight: 0,
                        marginBottom: 2,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Icon name={'md-send'} size={25} color={"#615414"}></Icon>
                </View>
            </Send>
        );
    }
    
    const renderTime = (props) => {
        return (
            <Time
                {...props}
                timeTextStyle={{
                    right: {
                        color : "black",
                    },
                    left: {
                        color: "black"
                    },
                }}
            />
        );
    }  


    return (
        <Fragment>
        <TouchableWithoutFeedback onPress={() => props.navigation.navigate('FriendProfileScreen',{item: person})}>
            <View style={styles.header}>
                <>
                    <View style={styles.img}>
                        <Image source={{uri: person.image}} style={styles.photo} />
                    </View>
                    <View style={{marginLeft: 5}}>
                    <Text style={styles.heading}>{person.name}</Text>
                    {person.status == 'online' ? (
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Icon name={'ios-disc'} size={10} color={'green'}/>
                        <Text style={styles.on}>{person.status}</Text>
                        </View>
                    ) : (
                        <View style={{flexDirection:'row',  alignItems:'center'}}>
                        <Icon name={'ios-disc'} size={10} color={'red'}/>
                        <Text style={styles.off}>{person.status}</Text>
                        </View>
                    )}
                    </View>
                </>
            </View>
        </TouchableWithoutFeedback>
        
        <View style={{flex:1,backgroundColor:"#9FCDE5"}}>
            <GiftedChat
                text = {message}
                renderSend={renderSend}
                renderBubble={renderBubble}
                renderTime={renderTime}
                onInputTextChanged = {val => setMessage(val)}
                messages = {messageList}
                onSend = {() => send()}
                user = {{_id: user.id}}
                showUserAvatar={false}
                renderUsernameOnMessage={true} 
                onPressAvatar={() => props.navigation.navigate('FriendProfileScreen',{item: person})}
            />
        </View>
        </Fragment>
    )
}

const styles = StyleSheet.create({
    photo: {
      flex: 1,
      width: '100%',
      resizeMode: 'cover',
    },
    img: {
      backgroundColor: 'silver',
      width: 41,
      height: 41,
      borderRadius: 50,
      marginHorizontal: 5,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    heading: {
      color: '#615414',
      fontSize: 21,
      fontWeight: '700',
      width: 'auto',
    },
    header: {
      backgroundColor: '#FFEB00',
      height: 70,
      width: '100%',
      paddingHorizontal: 12,
      zIndex: 2,
      flexDirection: 'row',
      alignItems: 'center',
    },
    off:{
      fontWeight: '200',
      color: 'red',
      fontSize: 13,
      paddingLeft: 5
    },
    off:{
        fontWeight: '200',
        color: 'green',
        fontSize: 13,
        paddingLeft: 5
    },
});

export default PersonalChatScreen;