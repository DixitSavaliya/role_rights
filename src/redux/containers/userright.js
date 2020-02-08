import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { addUserRight,rightCountData,RightPGData,deleteRightData,updateRight,searchRight} from '../actions/userright';
import UserRight from '../../views/Userright/userright';

class UserRightContainer extends Component {
    
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
      const {auth,addUserRight,rightCountData,RightPGData,deleteRightData ,updateRight,searchRight} = this.props;
      return (
        <UserRight auth={auth} addUserRight={addUserRight} rightCountData={rightCountData} RightPGData={RightPGData} deleteRightData={deleteRightData} updateRight={updateRight} searchRight={searchRight}/>
      );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
    addUserRight:(data) => dispatch(addUserRight(data)),
    // getUserRole:(data) => dispatch(getUserRole(data)),
    rightCountData:() => dispatch(rightCountData()),
    RightPGData:(data) => dispatch(RightPGData(data)),
    deleteRightData:(data) => dispatch(deleteRightData(data)),
    updateRight:(data) => dispatch(updateRight(data)),
    searchRight:(data) => dispatch(searchRight(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserRightContainer));