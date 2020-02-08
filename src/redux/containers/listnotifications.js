import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {notificationCount,notificationPGData,deleteNotificationData} from '../actions/notification';
import ListNotifications from '../../views/listnotifications/listnotifications';

class ListNotificationsContainer extends Component {
    
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
        // this.props.getUserRole();
    }

    render() {
      const {auth,notificationCount,notificationPGData,deleteNotificationData} = this.props;
      return (
        <ListNotifications auth={auth} notificationCount={notificationCount} notificationPGData={notificationPGData} deleteNotificationData={deleteNotificationData} {...this.props}/>
      );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
    notificationCount:(obj) => dispatch(notificationCount(obj)),
    notificationPGData:(data) => dispatch(notificationPGData(data)),
    deleteNotificationData:(data) => dispatch(deleteNotificationData(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ListNotificationsContainer));