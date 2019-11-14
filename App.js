import React from 'react';
import AppNavigation from './src/routes/AppNavigation';
import { Root } from "native-base";
import { store, persistor } from './src/redux/store';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {

  return(
    <Provider store={store}>
        <Root>
          <AppNavigation/>
        </Root>
    </Provider>  
  )
}

export default App;