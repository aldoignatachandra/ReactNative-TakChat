import React from 'react';
import AppNavigation from './src/routes/AppNavigation';
import { Root } from "native-base";
import { store, persistor } from './src/redux/store';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {

  return(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Root>
          <AppNavigation/>
        </Root>
      </PersistGate>
    </Provider>  
  )
}

export default App;