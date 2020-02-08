import React, { Component } from "react";
import {
    HashRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import io from 'socket.io-client';
import { EventEmitter } from './event';
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
import Auth from './redux/Auth'
import { REMOTE_URL } from './redux/constants/index';
import axios from 'axios';

// const SOCKET_URI = 'http://159.65.152.143:4002/';
const SOCKET_URI = 'http://192.168.1.114:4002/';
// const options = { transports: ['websocket'] };

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        props.location.pathname !== '/admin/' ? (
            Auth.isUserAuthenticated() == true ? (
                <Component {...props} />
            ) : (
                    <Redirect to={{
                        pathname: '/login',
                        state: { from: props.location }
                    }} />
                )
        ) : (
                Auth.isUserAuthenticated() == true ? (
                    <Component {...props} />
                ) : (
                        <Redirect to={{
                            pathname: '/admin/',
                            state: { from: props.location }
                        }} />
                    )
            )
    )} />
)

export default class App extends Component {
    constructor(props) {
        super(props);
        this.socket = null;
        this.event = null;
    }

    componentDidMount() {
        this.event = EventEmitter.subscribe('right_updated', () => {
            // console.log("right_updated result \t")
            this.socket.emit("right_updated", (data) => {
                // console.log("right_updated result \t", data)
            });
        });
        this.initSocketConnection();
        //this.setupSocketListeners();
        this.socket.on("new_right_updated", this.new_right_updated.bind(this));
    }

    componentWillUnmount() {
        this.event = null;
        this.socket.emit('disconnect');
    }

    initSocketConnection() {
        this.socket = io.connect(SOCKET_URI);
    }

    new_right_updated() {
        let auth = JSON.parse(window.sessionStorage.getItem('ad_network_auth'));
        axios.defaults.headers.post['Authorization'] = 'Barier ' + (auth ? auth.access_token : '');
        axios.defaults.headers.post['content-md5'] = auth ? auth.secret_key : '';
        let authRight = JSON.parse(window.sessionStorage.getItem('ad_network_user'));
        const obj = {
            userRole: authRight.user_role_id
        }
        axios.post(REMOTE_URL + "UserRole/getUserRoleToRight", obj)
            .then(response => {
                Auth.setRight(response.data.data);
                EventEmitter.dispatch('updated_rights');
                
                // window.sessionStorage.setItem('ad_network_auth_right', JSON.stringify(response.data.data));
            }).catch(error => {
                console.log("error", error);
            });
    }

    setupSocketListeners() {
        this.socket.on("new_right_updated", this.new_right_updated.bind(this));
    }

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Switch>
                        <Route exact path="/login" name="Login Page" component={Login} />
                        <Route exact path="/admin/" name="AdminLogin Page" component={AdminLogin} />
                        <Route exact path="/register" name="Register Page" component={Register} />
                        <Route exact path="/forgot-password" name="Forgot Password" component={ForgotPassword} />
                        <PrivateRoute path="/" name="Home" component={Full} />
                    </Switch>
                </Router>
            </Provider>
        )
    }
}
