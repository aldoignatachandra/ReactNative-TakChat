import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { name } from '../../../app.json';
import AsyncStorage from '@react-native-community/async-storage';
import loading from './loading';

const persistConfig = {
    key: name,
    storage: AsyncStorage
}

const reducers = combineReducers({
    loading: loading
})

export default reducers;