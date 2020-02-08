import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {getViewApplicationDetailsById,searchApplicationData} from '../actions/createapp';
import {getPublisherApplication,AddAppMonetization,getAPPMonetization,updateAppMonetization,RemoveAppMonetization} from '../actions/monetization';
import MonetizationNetwork from '../../views/monetizationnetwork/monetizationnetwork';

class MonetizationNetworkContainer extends Component {
    
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
      const {auth,searchApplicationData,getPublisherApplication,getViewApplicationDetailsById,AddAppMonetization,getAPPMonetization,updateAppMonetization,RemoveAppMonetization} = this.props;
    //   this.id = this.props.location.pathname.split('/')[2];
      return (
        <MonetizationNetwork {...this.props} auth={auth} getViewApplicationDetailsById={getViewApplicationDetailsById} searchApplicationData={searchApplicationData} getPublisherApplication={getPublisherApplication} AddAppMonetization={AddAppMonetization} getAPPMonetization={getAPPMonetization} updateAppMonetization={updateAppMonetization} RemoveAppMonetization={RemoveAppMonetization}/>
      );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
    getPublisherApplication:(data) => dispatch(getPublisherApplication(data)),
    AddAppMonetization:(data) => dispatch(AddAppMonetization(data)),
    getAPPMonetization:(data) => dispatch(getAPPMonetization(data)),
    updateAppMonetization:(data) => dispatch(updateAppMonetization(data)),
    RemoveAppMonetization:(data) =>dispatch(RemoveAppMonetization(data)),
    searchApplicationData:(data) => dispatch(searchApplicationData(data)),
    getViewApplicationDetailsById:(data) => dispatch(getViewApplicationDetailsById(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MonetizationNetworkContainer));