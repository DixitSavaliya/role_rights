import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {countuser,usersPGData,searchUsersData,blockUser} from '../actions/auth';
import Advertiser from '../../views/Advertiser/advertiser';

class AdvertiserContainer extends Component {
    
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
      const {auth,countuser,usersPGData,searchUsersData,blockUser} = this.props;
    //   this.id = this.props.location.pathname.split('/')[2];
      return (
        <Advertiser auth={auth} countuser={countuser} usersPGData={usersPGData} searchUsersData={searchUsersData} blockUser={blockUser}/>
      );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
    countuser:() => dispatch(countuser()),
    usersPGData:(data) => dispatch(usersPGData(data)),
    searchUsersData:(data) => dispatch(searchUsersData(data)),
    blockUser:(data) => dispatch(blockUser(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdvertiserContainer));