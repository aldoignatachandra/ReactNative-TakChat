import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import auth from './auth';
import { name } from '../../../app.json';

const persistConfig = {
    key: name,
    storage: AsyncStorage
}

const reducer = combineReducers({
    auth: auth
})

export default persistReducer(persistConfig, reducer);