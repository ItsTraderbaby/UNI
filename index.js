// index.js

import 'react-native-gesture-handler';  // required if you use react-navigation
import registerRootComponent from 'expo/build/launch/registerRootComponent';
import App from './App';

// This will ensure the app is registered properly and starts here
registerRootComponent(App);
