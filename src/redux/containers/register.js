import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';
import { register,getUserRoleId } from '../actions/auth';

import RegisterForm from '../../views/Pages/Register/Register';

class Register extends Component {

    render() {
        const { auth, register, getUserRoleId } = this.props;

        return (
            <RegisterForm auth={auth} register={register} getUserRoleId={getUserRoleId} {...this.props} />
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
});
const mapDispatchToProps = (dispatch) => ({
    register:(info) => dispatch(register(info)),
    getUserRoleId:(data) => dispatch(getUserRoleId(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Register));
