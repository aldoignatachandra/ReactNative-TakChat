import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { 
    View,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { setLoading } from '../redux/actions/loading';
import { Db } from '../../src/services/FirebaseConfig';

const ChatScreen = (props) => {

    const user = useSelector(state => state.user.user);
    const isLoading = useSelector(state => state.loading.isLoading);
    const dispatch = useDispatch();

    const [userList, setUserList] = useState([]);
    const [uid, setUid] = useState('');

    useEffect(() => {
      setUserList([]);
      if (typeof user.id !== "undefined") {
          const uid = user.id
          setUid(uid);
          dispatch(setLoading(true))
          Db.ref('/users').on('child_added', data => {
            let person = data.val();
            if (person.id != uid) {
                setUserList(prevData => [...prevData, person]);
                dispatch(setLoading(false))
            }
          });
      }
    }, [user]);

    const renderItem = ({item}) => {
        return (
          <TouchableOpacity
            onPress={() => props.navigation.navigate('PersonalChatScreen',{item})}
          >
            <View style={styles.row}>
              <Image source={{uri: item.image}} style={styles.pic} />
              <View>
                <View style={styles.nameContainer}>
                  <Text
                    style={styles.nameTxt}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item.name}
                  </Text>
                  {item.status === 'online' ? (
                    <Text style={styles.statusOn}>{item.status}</Text>
                  ) : (
                    <Text style={styles.statusOff}>{item.status}</Text>
                  )}
                </View>
                <View style={styles.msgContainer}>
                  <Text style={styles.email}>{item.email}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
    };

    return (
        <>
          <View style={styles.header}>
            <>
              <View style={{marginLeft: 15}}>
                <Text style={styles.heading}>Chat</Text>
              </View>
            </>
          </View>
            <SafeAreaView>
                {isLoading === true ? (
                    <ActivityIndicator
                        size="large"
                        color="#615414"
                        style={{marginTop: 170}}
                    />
                    ) : (
                    <FlatList
                        data={userList}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    )}
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: '#DCDCDC',
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      padding: 10,
    },
    pic: {
      borderRadius: 20,
      width: 60,
      height: 60,
    },
    nameContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 280,
    },
    nameTxt: {
      marginLeft: 15,
      fontWeight: '600',
      color: '#222',
      fontSize: 18,
      width: 170,
    },
    statusOff: {
      fontWeight: '200',
      color: '#ccc',
      fontSize: 13,
      color: "red"
    },
    statusOn: {
        fontWeight: '200',
        color: '#ccc',
        fontSize: 13,
        color: "green"
    },
    msgContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 15,
    },
    email: {
      fontWeight: '400',
      color: '#615414',
      fontSize: 12,
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
    heading: {
      color: "#615414",
      fontWeight: "bold",
      fontSize: 30
    }
  });

export default ChatScreen;