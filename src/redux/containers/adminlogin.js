import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';
import { login,getUser } from '../actions/auth';
import {userroletoright} from '../actions/userroletoright';

import AdminLogin from '../../views/adminlogin/adminlogin';
import Auth from '../Auth';

class AdminLoginContainer extends Component {
    
    
    transferToDashboardIfLoggedIn(){
        if (!this.props.auth.auth_data.access_token){
            this.props.history.push(this.props.from || {pathname: '/admin/'});
        } else {
            this.props.history.push(this.props.from || {pathname: '/'});
        }
    }

    componentWillMount() {
        // if (this.props.auth.auth_data.access_token){
        //     this.transferToDashboardIfLoggedIn();
        // }
    }
    
    componentDidUpdate() {        
        if (this.props.auth.auth_data.access_token){
            this.transferToDashboardIfLoggedIn();
        }
    }

    componentDidMount() {
        const { login } = this.props;
        const auth = Auth.getAuth();
        if (auth && auth.access_token) {
            login();
        }
    }


    render() {
      const { auth, login , getUser,userroletoright } = this.props;
      return (
        <AdminLogin auth={auth} login={login} getUser={getUser} userroletoright={userroletoright} {...this.props} />
      );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});
const mapDispatchToProps = (dispatch) => ({
    login:(info) => dispatch(login(info)),
    getUser:(info) => dispatch(getUser(info)),
    userroletoright:(data) => dispatch(userroletoright(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminLoginContainer);