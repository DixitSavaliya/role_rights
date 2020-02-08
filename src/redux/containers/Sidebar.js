import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {userroletoright} from '../actions/userroletoright';
import {getUser } from '../actions/auth';
import { list } from '../actions/sidebar';

import Sidebar from '../../components/Sidebar/Sidebar';

class SidebarContainer extends Component {
    componentDidMount() {
        /* this.props.list(); */
    }

    render() {
      const { auth,sidebar,getUser,userroletoright } = this.props;

        return (
            <Sidebar auth={auth} sidebar={sidebar} userroletoright={userroletoright} getUser={getUser} {...this.props}/>
        );
    }
}

const mapStateToProps = state => ({
    sidebar: state.sidebar, auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
    getUser:(data) => dispatch(getUser(data)),
    userroletoright:(data) => dispatch(userroletoright(data))
});

export default connect(mapStateToProps,mapDispatchToProps)(SidebarContainer);
