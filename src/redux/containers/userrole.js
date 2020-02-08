import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { addUserRole,getUserRole,roleCountData,RolePGData,deleteRoleData,updateRole,searchRole} from '../actions/userrole';
import UserRole from '../../views/Userrole/userrole';

class UserRoleContainer extends Component {
    
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
      const {auth,addUserRole,roleCountData,RolePGData,deleteRoleData ,updateRole,searchRole} = this.props;
     
      return (
        <UserRole auth={auth} addUserRole={addUserRole} roleCountData={roleCountData} RolePGData={RolePGData} deleteRoleData={deleteRoleData} updateRole={updateRole} searchRole={searchRole}/>
      );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
    addUserRole:(data) => dispatch(addUserRole(data)),
    // getUserRole:(data) => dispatch(getUserRole(data)),
    roleCountData:() => dispatch(roleCountData()),
    RolePGData:(data) => dispatch(RolePGData(data)),
    deleteRoleData:(data) => dispatch(deleteRoleData(data)),
    updateRole:(data) => dispatch(updateRole(data)),
    searchRole:(data) => dispatch(searchRole(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserRoleContainer));