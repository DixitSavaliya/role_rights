import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { changepassword } from '../actions/auth';
import ChangePassword from '../../views/Pages/Changepassword/changepassword';

class ChangePasswordContainer extends Component {
    
    transferToDashboardIfLoggedIn(){
        if (!this.props.auth.auth_data.access_token){
            this.props.history.push(this.props.from || {pathname: '/login'});
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
      const { auth, changepassword } = this.props;
      return (
        <ChangePassword auth={auth} changepassword={changepassword}/>
      );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
    changepassword:(data) => dispatch(changepassword(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChangePasswordContainer));