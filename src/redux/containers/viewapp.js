import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getViewApplicationDetailsById} from '../actions/createapp';
import {getAPPMonetization} from '../actions/monetization';
import ViewApp from '../../views/Viewapp/viewapp';

class ViewAppContainer extends Component {
    
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
      const {auth,getViewApplicationDetailsById,getAPPMonetization} = this.props;
      this.id = this.props.location.pathname.split('/')[2];
      return (
        <ViewApp auth={auth} id={this.id} getViewApplicationDetailsById={getViewApplicationDetailsById} getAPPMonetization={getAPPMonetization}/>
      );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
    getViewApplicationDetailsById:(data) => dispatch(getViewApplicationDetailsById(data)),
    getAPPMonetization:(data) => dispatch(getAPPMonetization(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ViewAppContainer));