// import { CALL_API } from '../middleware/api';
import { REMOTE_URL } from '../constants/index';
import * as ACTION from '../constants/auth';
import axios from 'axios';
import Auth from '../Auth';
let auth = Auth.getAuth();
auth = auth ? JSON.parse(auth) : '';
axios.defaults.headers.post['Authorization'] = 'Barier ' + (auth ? auth.access_token : '');
axios.defaults.headers.post['content-md5'] = auth ? auth.secret_key : '';

export function profileData(data) {
    return (dispatch) => {
        return axios.post(REMOTE_URL + "User/currentUser", { id: data })
            .then(response => {
                dispatch(returnProfileAction(response));
            }).catch( error => {
                dispatch(profileFailure(error));
            });
    }
}

export function returnProfileAction(data) {
    return {
        type:"PROFILE_SUCCESS",
        user: data
    }
}

export function profileFailure(data) {
    return {
        type: "PROFILE_FAILURE",
        user: {}
    }
}
