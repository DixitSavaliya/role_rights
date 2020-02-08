import React from 'react';
import ReactDOM from 'react-dom';
import {
    HashRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
// import history from './history';

import { Provider } from 'react-redux';
import {
    createStore,
    applyMiddleware
} from 'redux';

import thunk from 'redux-thunk';
import api from './redux/middleware/api';
const middleware = [thunk, api];
import reducers from './redux/reducers';
const store = createStore(
    reducers,
    applyMiddleware(...middleware)
);

import Auth from './redux/Auth'
import App from './socket';






// Styles
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../scss/style.scss'
// Temp fix for reactstrap
import '../scss/core/_dropdown-menu-right.scss'
// Containers
import Full from './redux/containers/Full'

// Views
import Login from './redux/containers/login';
import AdminLogin from './redux/containers/adminlogin'
import Register from './redux/containers/register'
import ForgotPassword from './redux/containers/forgot'
import checkRights from './rights.js';
// import PageNotFound from './views/Pages/Page404/Page404';

// function requireLogin() {
//     console.log("msg")
//     console.log(" Auth.isUserAuthenticated()", Auth.isUserAuthenticated());
//     console.log("props",this.props)
//     if (Auth.isUserAuthenticated() == false) {
//         this.props.history.push(this.props.from || {pathname: '/login'});
//         // browserHistory.push('#/login');
//         // hashHistory.push('/login');
//     }
// }

ReactDOM.render(<App/>,document.getElementById('root'));
