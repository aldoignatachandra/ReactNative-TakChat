import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TabNavigation from './TabNavigation';

const AppStack = createStackNavigator(
    {
      TabNavigation,
    },
    {
      initialRouteName: 'TabNavigation',
      headerMode: 'none',
    }
)
  
const AuthStack = createStackNavigator(
    {
      Login: LoginScreen,
      Register: RegisterScreen,
    },
    {
      initialRouteName: 'Login',
      headerMode: 'none',
    }
)
  
const AppNavigation = createSwitchNavigator(
    {
          Loading: LoadingScreen,
          App: AppStack,
          Auth: AuthStack
    },
    {
          initialRouteName: "Loading",
          headerMode: 'none',
    }
)

export default createAppContainer(AppNavigation);