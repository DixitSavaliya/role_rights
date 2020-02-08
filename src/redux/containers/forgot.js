import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';
import { ForgotPassword } from '../actions/auth';

import Forgot from '../../views/Pages/Forgot/Forgot';
import Auth from '../Auth';

class ForgotContainer extends Component {
    
    transferToDashboardIfLoggedIn(){
        if (this.props.auth.auth_data.access_token){
            this.props.history.push(this.props.from || {pathname: '/'});
        }
    }

    componentWillMount() {
        this.transferToDashboardIfLoggedIn();
    }
    
    componentDidUpdate() {        
        this.transferToDashboardIfLoggedIn();
    }

    componentDidMount() {
       
    }

    render() {
      const { auth, ForgotPassword } = this.props;
     
      return (
        <Forgot auth={auth} ForgotPassword={ForgotPassword}/>
      );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
    ForgotPassword:(data) => dispatch(ForgotPassword(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ForgotContainer));