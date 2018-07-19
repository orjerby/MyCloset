import React from 'react';
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator, StackNavigator } from 'react-navigation';
import { StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import { Button, ThemeProvider } from 'react-native-material-ui';
import Register from './components/Register';
import Profile from './components/Profile';
import Login from './components/Login';
import Home from './components/Home';
import MyCloset from './components/MyCloset';
import ItemEdit from './components/ItemEdit';
import AddItem from './components/AddItem';
import ItemCard from './components/ItemCard';
import allReducers from './reducers/index';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxPromise from "redux-promise";
import { AppLoading, Font } from 'expo';
import FontAwesome from './node_modules/@expo/vector-icons/fonts/FontAwesome.ttf';
import FontAwesome1, { Icons } from 'react-native-fontawesome';
import Arial from './fonts/Arial.ttf';
import MaterialIcons from './node_modules/@expo/vector-icons/fonts/MaterialIcons.ttf';

const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);

export default class App extends React.Component {

  state = {
    fontLoaded: false
  };

  async componentWillMount() {
    try {
      await Font.loadAsync({
        FontAwesome,
        MaterialIcons,
        Arial
      });
      this.setState({ fontLoaded: true });
    } catch (error) {
      console.log('error loading icon fonts', error);
    }
  }

  render() {
    if (!this.state.fontLoaded) {
      return <AppLoading />;
    }
    return (
      <Provider store={createStoreWithMiddleware(allReducers)}>
        <AppNavigator />
      </Provider>
    );
  }
}

const HomeStack = createStackNavigator({
  Home,
  MyCloset,
  ItemEdit,
  AddItem,
  ItemCard,
  Profile
},
  {
    headerMode: 'none',
    initialRouteName: 'Home',
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,
      },
    })
  });

const next = createBottomTabNavigator({
  Home: {
    screen: HomeStack,
    navigationOptions: {
      tabBarLabel: 'בית',
      tabBarIcon: () => (
        <FontAwesome1 style={{ fontSize: 25 }}>{Icons.home}</FontAwesome1>
      )
    },
  },
  MyCloset: {
    screen: MyCloset,
    navigationOptions: {
      tabBarLabel: 'הארון שלי',
      tabBarIcon: () => (
        <FontAwesome1 style={{ fontSize: 25 }}>{Icons.columns}</FontAwesome1>
      )
    }
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      tabBarLabel: 'פרופיל',
      tabBarIcon: () => (
        <FontAwesome1 style={{ fontSize: 25 }}>{Icons.user}</FontAwesome1>
      )
    }
  },
},
  {
    initialRouteName: 'Home',
    tabBarOptions: {
      style: {
        backgroundColor: '#DEB887',
      }
    }
  }
);

const AppNavigator = createSwitchNavigator(
  {
    Login,
    Register,
    next
  },
  {
    initialRouteName: 'Login',
    backBehavior: 'initialRoute'
  }
);