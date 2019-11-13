import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { name } from '../../../app.json';
import AsyncStorage from '@react-native-community/async-storage';
import auth from './auth';
import loading from './loading';

const persistConfig = {
    key: name,
    storage: AsyncStorage
}

const reducers = combineReducers({
    auth: auth,
    loading: loading
})

export default persistReducer(persistConfig, reducers);