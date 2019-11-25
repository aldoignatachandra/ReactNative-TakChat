import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {
  View,
  Text,
  Image,
  ToastAndroid,
  Platform,
  PermissionsAndroid,
  Dimensions,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { Db, Auth } from '../services/FirebaseConfig';
import { setLoading } from '../redux/actions/loading';

const {  width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


const MapsScreen = (props) => {
    
    const user = useSelector(state => state.user.user);
    const isLoading = useSelector(state => state.loading.isLoading);
    const dispatch = useDispatch();

    const [mapRegion, setMapRegion] = useState(null);
    const [userList, setUserList] = useState([]);
    const [uid, setUid] = useState('');

    useEffect(() => {
        const timeOut = setTimeout(async() => {
            await getUser();
            // await getLocation();
        }, 0);

        return () => {
            clearTimeout(timeOut);
        }
    }, []);

    const getUser = async () => {
        const uid = user.id
        setUid(uid);
        Db.ref('/users').on('child_added', result => {
            let data = result.val();
            if (data !== null && data.id != uid) {
                setUserList(prevData => [...prevData, data]);
            }
        });
    };

    // const hasLocationPermission = async () => {
    //     if ( Platform.OS === 'ios' || (Platform.OS === 'android' && Platform.Version < 23)) {
    //       return true;
    //     }
    //     const hasPermission = await PermissionsAndroid.check(
    //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //     );
    //     if (hasPermission) {
    //       return true;
    //     }
    //     const status = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //     );
    //     if (status === PermissionsAndroid.RESULTS.GRANTED) {
    //       return true;
    //     }
    //     if (status === PermissionsAndroid.RESULTS.DENIED) {
    //       ToastAndroid.show(
    //         'Location Permission Denied By User.',
    //         ToastAndroid.LONG,
    //       );
    //     } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    //       ToastAndroid.show(
    //         'Location Permission Revoked By User.',
    //         ToastAndroid.LONG,
    //       );
    //     }
    //     return false;
    // };

    // const getLocation = async () => {
    //     const hasLocationPermissions = await hasLocationPermission();

    //     if (!hasLocationPermissions) {
    //         return;
    //     }

    //     dispatch(setLoading(true)), () => {
    //         Geolocation.getCurrentPosition(
    //             position => {
    //                 let region = {
    //                     latitude: position.coords.latitude,
    //                     longitude: position.coords.longitude,
    //                     latitudeDelta: 0.00922,
    //                     longitudeDelta: 0.00421 * 1.5,
    //                 };

    //                 setMapRegion(region);
    //                 setLatitude(position.coords.latitude);
    //                 setLongitude(position.coords.longitude);
    //                 // setLocation({longitude, latitude});
    //                 dispatch(setLoading(false))
    //             },
    //             error => {
    //                 console.log(error);
    //             },
    //             {
    //                 showLocationDialog: true,
    //                 forceRequestLocation: true,
    //                 enableHighAccuracy: false,
    //                 distanceFilter: 50,
    //                 fastestInterval: 5000,
    //                 timeout: 10000,
    //                 maximumAge: 8000,
    //             },
    //         );
    //     };
    // };
    
    return (
        <View
          style={[
            styles.container,
            {
              justifyContent: 'flex-start',
              paddingHorizontal: 0,
              paddingTop: 0,
              paddingBottom: 10
            },
          ]}>
        <View style={styles.header}>
            <View style={{marginLeft: 15}}>
                <Text style={styles.heading}>Friend Location</Text>
            </View>
        </View>
          <MapView
            style={{width: '100%', height: '90%'}}
            showsMyLocationButton={true}
            showsIndoorLevelPicker={true}
            showsUserLocation={true}
            zoomControlEnabled={true}
            showsCompass={true}
            showsTraffic={true}
            region={mapRegion}
            initialRegion={{
                latitude: -7.755322,
                longitude: 110.381174,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            }}>
            {userList.map(item => {
              return (
                <Marker
                  key={item.id}
                  title={item.name}
                  description={item.status}
                  draggable
                  coordinate={{
                    latitude: item.location.latitude || 0,
                    longitude: item.location.longitude || 0,
                  }}
                  onCalloutPress={() => {
                    props.navigation.navigate('PersonalChatScreen', { item });
                  }}>
                  <View>
                    <Image
                      source={{uri: item.image}}
                      style={{width: 40, height: 40, borderRadius: 50}}
                    />
                    <Text>{item.name}</Text>
                  </View>
                </Marker>
              );
            })}
          </MapView>
        </View>
    );
}

export default MapsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FCF5FF',
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#ddd6f3',
    width: '70%',
    borderRadius: 10,
    marginBottom: 15,
  },
  icon: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 22,
    color: '#5F6D7A',
  },
  description: {
    marginTop: 10,
    textAlign: 'center',
    color: '#A9A9A9',
    fontSize: 16,
    margin: 40,
  },
  options: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  buttonContainer: {
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 160,
    borderRadius: 20,
  },
  authButton: {
    backgroundColor: '#6441A5',
  },
  loginButton: {
    backgroundColor: '#480048',
    height: 40,
    fontSize: 20,
    marginVertical: 15,
  },
  registerButton: {
    backgroundColor: '#44a08d',
    height: 40,
    fontSize: 20,
    marginVertical: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  bottomText: {
    fontSize: 16,
    color: '#ccc',
  },
  center: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bottomTextLink: {
    color: '#fff',
    fontWeight: 'bold',
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
    fontSize: 25
  }
});