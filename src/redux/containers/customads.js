import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {getPublisherApplication,getAdverApplication} from '../actions/monetization'
import {getCustomAds,insertCustomAds,deleteCustomAds} from '../actions/customads';
import {searchApplicationData,getViewApplicationDetailsById} from '../actions/createapp';
import CustomAds from '../../views/customads/customads';

class CustomAdsContainer extends Component {
    
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
      const {auth,getPublisherApplication,getViewApplicationDetailsById,getCustomAds,getAdverApplication,insertCustomAds,deleteCustomAds,searchApplicationData} = this.props;
    //   this.id = this.props.location.pathname.split('/')[2];
      return (
        <CustomAds {...this.props} auth={auth} getAdverApplication={getAdverApplication} getViewApplicationDetailsById={getViewApplicationDetailsById} getPublisherApplication={getPublisherApplication} getCustomAds={getCustomAds} insertCustomAds={insertCustomAds} deleteCustomAds={deleteCustomAds} searchApplicationData={searchApplicationData}/>
      );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
    getPublisherApplication:(data) => dispatch(getPublisherApplication(data)),
    getCustomAds:(data) => dispatch(getCustomAds(data)),
    insertCustomAds:(data) => dispatch(insertCustomAds(data)),
    deleteCustomAds:(data) => dispatch(deleteCustomAds(data)),
    searchApplicationData:(data) => dispatch(searchApplicationData(data)),
    getAdverApplication:(data) => dispatch(getAdverApplication(data)),
    getViewApplicationDetailsById:(data) => dispatch(getViewApplicationDetailsById(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CustomAdsContainer));