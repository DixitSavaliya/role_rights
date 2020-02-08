import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getViewNotificationsDetailsById} from '../actions/notification';
import ViewNotifications from '../../views/viewnotifications/viewnotifications';

class ViewNotificationsContainer extends Component {
    
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
      const {auth,getViewNotificationsDetailsById} = this.props;
      this.id = this.props.location.pathname.split('/')[2];
      return (
        <ViewNotifications auth={auth} id={this.id} getViewNotificationsDetailsById={getViewNotificationsDetailsById}/>
      );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
    getViewNotificationsDetailsById:(data) => dispatch(getViewNotificationsDetailsById(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ViewNotificationsContainer));