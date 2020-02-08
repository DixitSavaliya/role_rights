import React, { Component } from 'react';
import { connect } from 'react-redux';
import Auth from '../Auth';
import Intercept from '../../auth';
import Full from '../../containers/Full/Full';

function requireLoginToFull() {
  
    if ( Auth.isUserAuthenticated() == false && (this.props.auth.auth_data.user_group != "admin" || this.props.auth.auth_data.user_group != "admin_staff")) {

        this.props.history.push(this.props.from || {pathname: '/login'});
    }else {
        if(Auth.isUserAuthenticated() == false){
            this.props.history.push(this.props.from || {pathname: '/admin/'});
        }
    }
}

class FullContainer extends Component {
    render() {
        let auth = Auth.getAuth();
        auth = auth ? JSON.parse(auth) : '';
        this.props.auth.auth_data = auth;
        return (
            <Full {...this.props} onEnter={requireLoginToFull}/>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    user:state.auth.user
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(FullContainer);
