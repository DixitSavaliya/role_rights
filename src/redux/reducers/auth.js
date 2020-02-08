import * as ACTION from '../constants/auth';
import Swal from 'sweetalert2';

import Auth from '../Auth';

const initialState = {
    fetching: false,
    user: {},
    avatar: {},
    auth_data: {},
    user_data: {},
    rights: [],
    count: {},
    userrole: {},
    userroledata: {},
    userrightdata: {},
    userroletoright: {},
    error: null,
    userright: {},
    searchdata: {},
    appCount: {},
    appData: {},
    userdata: {}
};

const auth = (state = initialState, action) => {
    switch (action.type) {

        //REGISTER USER
        case ACTION.REGISTER_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.REGISTER_SUCCESS:
            return {
                ...state,
                fetching: false,
                userdata: action.response.data,
            };
        case ACTION.REGISTER_FAILURE:
            return {
                ...state,
                fetching: false,
                userdata: {},
                error: action.error
            };

        /** change_name */
        case ACTION.CHANGE_NAME:
            Auth.authenticateUser(action.payload);
            return {
                ...state,
                fetching: false,
                user: action.payload
            };

        case ACTION.LOGIN_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.LOGIN_SUCCESS:
            Auth.setAuth(action.response.data);
            return {
                ...state,
                fetching: false,
                auth_data: action.response.data
            };
        case ACTION.LOGIN_FAILURE:
            Auth.removeAuth();
            Auth.removeAuthenticateUser();

            return {
                ...state,
                fetching: false,
                user: {},
                auth_data: {},
                error: action.error
            };



        //profile
        case ACTION.PROFILE_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.PROFILE_SUCCESS:
            Auth.authenticateUser(action.response.data);
            return {
                ...state,
                fetching: false,
                user: action.response.data
            };
        case ACTION.PROFILE_FAILURE:
            Auth.removeAuthenticateUser();
            return {
                ...state,
                fetching: false,
                user: {},
                error: action.error
            };

        //UPDATE PROFILE DATA   
        case ACTION.UPDATEPROFILE:
            // Auth.authenticateUser(action.data);
            return {
                ...state,
                fetching: false,
                user: action.data
            };

        //Upload Image
        case ACTION.AVATAR_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.AVATAR_SUCCESS:
            return {
                ...state,
                fetching: false,
                avatar: action.response.data
            };
        case ACTION.AVATAR_FAILURE:
            return {
                ...state,
                fetching: false,
                avatar: {},
                error: action.error
            };



        //REMOVE Image
        case ACTION.REMOVEUSERIMAGE_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.REMOVEUSERIMAGE_SUCCESS:

            return {
                ...state,
                fetching: false
            };
        case ACTION.REMOVEUSERIMAGE_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                error: action.error
            };



        //Update Profile
        case ACTION.UPDATE_PROFILE_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.UPDATE_PROFILE_SUCCESS:

            return {
                ...state,
                fetching: false,
                user: action.response.data
            };
        case ACTION.UPDATE_PROFILE_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                user: {},
                error: action.error
            };


        //FORGOT PASSWORD
        case ACTION.FORGOTPASSWORD_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.FORGOTPASSWORD_SUCCESS:
            return {
                ...state,
                fetching: false,
                user: action.response.data
            };
        case ACTION.FORGOTPASSWORD_FAILURE:
            return {
                ...state,
                fetching: false,
                user: {},
                error: action.error
            };


        //CHANGE PASSWORD
        case ACTION.CHANGEPASSWORD_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.CHANGEPASSWORD_SUCCESS:
            return {
                ...state,
                fetching: false,
                user: action.response.data
            };
        case ACTION.CHANGEPASSWORD_FAILURE:
            return {
                ...state,
                fetching: false,
                user: {},
                error: action.error
            };


        //REGISTER USERROLE
        case ACTION.REGISTER_USERROLE_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.REGISTER_USERROLE_SUCCESS:

            return {
                ...state,
                fetching: false,
                user: action.response.data
            };
        case ACTION.REGISTER_USERROLE_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                user: {},
                error: action.error
            };

        //COUNT USERROLE
        case ACTION.COUNT_USERROLE_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.COUNT_USERROLE_SUCCESS:
            return {
                ...state,
                fetching: false,
                count: action.response.data
            };
        case ACTION.COUNT_USERROLE_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                count: {},
                error: action.error
            };


        //GETUSERROLE
        case ACTION.GETUSERROLE_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.GETUSERROLE_SUCCESS:
            return {
                ...state,
                fetching: false,
                userrole: action.response.data
            };
        case ACTION.GETUSERROLE_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                userrole: {},
                error: action.error
            };


        //DELETE USERROLE
        case ACTION.DELETEUSERROLE_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.DELETEUSERROLE_SUCCESS:

            return {
                ...state,
                fetching: false,
                userrole: action.response.data
            };
        case ACTION.DELETEUSERROLE_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                userrole: {},
                error: action.error
            };


        //UPDATE USERROLE
        case ACTION.UPDATEUSERROLE_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.UPDATEUSERROLE_SUCCESS:

            return {
                ...state,
                fetching: false,
                userrole: action.response.data
            };
        case ACTION.UPDATEUSERROLE_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                userrole: {},
                error: action.error
            };

        //SEARCH USERROLE
        case ACTION.SEARCHUSERROLE_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.SEARCHUSERROLE_SUCCESS:
            return {
                ...state,
                fetching: false,
                searchdata: action.response.data
            };
        case ACTION.SEARCHUSERROLE_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                searchdata: {},
                error: action.error
            };



        //REGISTER USERRIGHT
        case ACTION.REGISTER_USERRIGHT_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.REGISTER_USERRIGHT_SUCCESS:

            return {
                ...state,
                fetching: false,
                user: action.response.data
            };
        case ACTION.REGISTER_USERRIGHT_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                user: {},
                error: action.error
            };

        //COUNT USERRIGHT
        case ACTION.COUNT_USERRIGHT_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.COUNT_USERRIGHT_SUCCESS:
            return {
                ...state,
                fetching: false,
                count: action.response.data
            };
        case ACTION.COUNT_USERRIGHT_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                count: {},
                error: action.error
            };


        //GETUSERRIGHT
        case ACTION.GETUSERRIGHT_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.GETUSERRIGHT_SUCCESS:
            return {
                ...state,
                fetching: false,
                userright: action.response.data
            };
        case ACTION.GETUSERRIGHT_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                userright: {},
                error: action.error
            };


        //DELETE USERRIGHT
        case ACTION.DELETEUSERRIGHT_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.DELETEUSERRIGHT_SUCCESS:

            return {
                ...state,
                fetching: false,
                userright: action.response.data
            };
        case ACTION.DELETEUSERRIGHT_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                userright: {},
                error: action.error
            }

        //UPDATE USERRIGHT
        case ACTION.UPDATEUSERRIGHT_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.UPDATEUSERRIGHT_SUCCESS:

            return {
                ...state,
                fetching: false,
                userright: action.response.data
            };
        case ACTION.UPDATEUSERRIGHT_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                userright: {},
                error: action.error
            };

        //SEARCH USERRIGHT
        case ACTION.SEARCHUSERRIGHT_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.SEARCHUSERRIGHT_SUCCESS:
            return {
                ...state,
                fetching: false,
                searchdata: action.response.data
            };
        case ACTION.SEARCHUSERRIGHT_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                searchdata: {},
                error: action.error
            };

        //GETUSERS USERRIGHT
        case ACTION.GETUSERSROLE_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.GETUSERSROLE_SUCCESS:
            return {
                ...state,
                fetching: false,
                userroledata: action.response.data
            };
        case ACTION.GETUSERSROLE_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                userroledata: {},
                error: action.error
            };


        //GETUSERS USERRIGHT
        case ACTION.GETUSERSRIGHT_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.GETUSERSRIGHT_SUCCESS:
            return {
                ...state,
                fetching: false,
                userrightdata: action.response.data
            };
        case ACTION.GETUSERSRIGHT_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                userrightdata: {},
                error: action.error
            };


        //GETUSERROLETORIGHT
        case ACTION.GETUSERROLETORIGHT_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.GETUSERROLETORIGHT_SUCCESS:
            Auth.setRight(action.response.data);
            return {
                ...state,
                fetching: false,
                rights: action.response.data
            };
        case ACTION.GETUSERROLETORIGHT_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                userroletoright: {},
                error: action.error
            };

        case ACTION.GETUSERRIGHTS:
            Auth.setRight(action.response.data);
            return {
                ...state,
                fetching: false,
                rights: JSON.parse(Auth.getRight())
            };


        //UPDATEUSERROLETORIGHT
        case ACTION.UPDATEUSERROLETORIGHT_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.UPDATEUSERROLETORIGHT_SUCCESS:
            
            return {
                ...state,
                fetching: false,
                userroletoright: action.response.data
            };
        case ACTION.UPDATEUSERROLETORIGHT_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                userroletoright: {},
                error: action.error
            };

            case ACTION.SETUSERRIGHTS:
                Auth.setRight(JSON.parse(action.init.body));
                return {
                    ...state,
                    fetching: false,
                    rights: JSON.parse(action.init.body)
                };

        //CREATEAPP
        case ACTION.CREATEAPP_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.CREATEAPP_SUCCESS:
            return {
                ...state,
                fetching: false
            };
        case ACTION.CREATEAPP_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                error: action.error
            };


        //APPCOUNT
        case ACTION.APPCOUNT_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.APPCOUNT_SUCCESS:
            return {
                ...state,
                fetching: false,
                appCount: action.response.data
            };
        case ACTION.APPCOUNT_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                appCount: {},
                error: action.error
            };



        //APPPGDATA
        case ACTION.APPPGDATA_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.APPPGDATA_SUCCESS:
            return {
                ...state,
                fetching: false,
                appData: action.response.data

            };
        case ACTION.APPPGDATA_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                appData: {},
                error: action.error
            };



        //APPDATABYID
        case ACTION.APPDATABYID_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.APPDATABYID_SUCCESS:
            return {
                ...state,
                fetching: false,
                appData: action.response.data

            };
        case ACTION.APPDATABYID_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                appData: {},
                error: action.error
            };

        //UPDATEAPP
        case ACTION.UPDATEAPP_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.UPDATEAPP_SUCCESS:
            return {
                ...state,
                fetching: false,
                appData: action.response.data

            };
        case ACTION.UPDATEAPP_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                appData: {},
                error: action.error
            };

        //DELETEAPP
        case ACTION.DELETEAPP_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.DELETEAPP_SUCCESS:
            return {
                ...state,
                fetching: false,
                appData: action.response.data
            };
        case ACTION.DELETEAPP_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                appData: {},
                error: action.error
            };


        //SEARCHAPP
        case ACTION.SEARCHAPP_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.SEARCHAPP_SUCCESS:
            return {
                ...state,
                fetching: false,
                appData: action.response.data
            };
        case ACTION.SEARCHAPP_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                appData: {},
                error: action.error
            };


        //SEARCHUSERROLEID
        case ACTION.SEARCHUSERROLEID_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.SEARCHUSERROLEID_SUCCESS:
            return {
                ...state,
                fetching: false
            };
        case ACTION.SEARCHUSERROLEID_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                error: action.error
            };


        //GETAPPBYPUBLISHERID
        case ACTION.GETAPPBYPUBLISHERID_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.GETAPPBYPUBLISHERID_SUCCESS:
            return {
                ...state,
                fetching: false
            };
        case ACTION.GETAPPBYPUBLISHERID_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                error: action.error
            };



        //INSERTAPPMONETIZATION
        case ACTION.INSERTAPPMONETIZATION_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.INSERTAPPMONETIZATION_SUCCESS:

            return {
                ...state,
                fetching: false
            };
        case ACTION.INSERTAPPMONETIZATION_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                error: action.error
            };

        //GETAPPMONETIZATION
        case ACTION.GETAPPMONETIZATION_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.GETAPPMONETIZATION_SUCCESS:
            return {
                ...state,
                fetching: false
            };
        case ACTION.GETAPPMONETIZATION_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                error: action.error
            };

        //UPDATEAPPMONETIZATION
        case ACTION.UPDATEAPPMONETIZATION_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.UPDATEAPPMONETIZATION_SUCCESS:
            return {
                ...state,
                fetching: false
            };
        case ACTION.UPDATEAPPMONETIZATION_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                error: action.error
            };

        //REMOVEAPPMONETIZATION
        case ACTION.REMOVEAPPMONETIZATION_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.REMOVEAPPMONETIZATION_SUCCESS:

            return {
                ...state,
                fetching: false
            };
        case ACTION.REMOVEAPPMONETIZATION_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                error: action.error
            };

        //ACTIVEAPPMONETIZATION
        case ACTION.ACTIVEAPPMONETIZATION_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.ACTIVEAPPMONETIZATION_SUCCESS:
            Swal.fire("AppMonetization Inactive Successfully!", "", "success");
            return {
                ...state,
                fetching: false
            };
        case ACTION.ACTIVEAPPMONETIZATION_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                error: action.error
            };

        //INACTIVEAPPMONETIZATION
        case ACTION.INACTIVEAPPMONETIZATION_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.INACTIVEAPPMONETIZATION_SUCCESS:
            Swal.fire("AppMonetization Active Successfully!", "", "success");
            return {
                ...state,
                fetching: false
            };
        case ACTION.INACTIVEAPPMONETIZATION_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                error: action.error
            };

        //GETCUSTOMADS
        case ACTION.GETCUSTOMADS_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.GETCUSTOMADS_SUCCESS:

            return {
                ...state,
                fetching: false
            };
        case ACTION.GETCUSTOMADS_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                error: action.error
            };

        //INSERTCUSTOMADS
        case ACTION.INSERTCUSTOMADS_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.INSERTCUSTOMADS_SUCCESS:
            return {
                ...state,
                fetching: false
            };
        case ACTION.INSERTCUSTOMADS_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                error: action.error
            };

        //REMOVECUSTOMADS
        case ACTION.REMOVECUSTOMADS_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.REMOVECUSTOMADS_SUCCESS:

            return {
                ...state,
                fetching: false
            };
        case ACTION.REMOVECUSTOMADS_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                error: action.error
            };

        //SENDPUSHNOTIFICATION                       
        case ACTION.SENDPUSHNOTIFICATION_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.SENDPUSHNOTIFICATION_SUCCESS:
            return {
                ...state,
                fetching: false
            };
        case ACTION.SENDPUSHNOTIFICATION_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                error: action.error
            };


        //NOTIFICATIONCOUNT                       
        case ACTION.NOTIFICATIONCOUNT_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.NOTIFICATIONCOUNT_SUCCESS:
            return {
                ...state,
                fetching: false
            };
        case ACTION.NOTIFICATIONCOUNT_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                error: action.error
            };



        //NOTIFICATIONPG                       
        case ACTION.NOTIFICATIONPG_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.NOTIFICATIONPG_SUCCESS:
            return {
                ...state,
                fetching: false
            };
        case ACTION.NOTIFICATIONPG_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                error: action.error
            };

        //REMOVENOTIFICATION                       
        case ACTION.REMOVENOTIFICATION_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.REMOVENOTIFICATION_SUCCESS:
            return {
                ...state,
                fetching: false
            };
        case ACTION.REMOVENOTIFICATION_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                error: action.error
            };

        //VIEWNOTIFICATION                       
        case ACTION.VIEWNOTIFICATION_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.VIEWNOTIFICATION_SUCCESS:
            return {
                ...state,
                fetching: false
            };
        case ACTION.VIEWNOTIFICATION_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                error: action.error
            };


        //GETUSERSCOUNTS                       
        case ACTION.GETUSERSCOUNTS_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.GETUSERSCOUNTS_SUCCESS:
            return {
                ...state,
                fetching: false
            };
        case ACTION.GETUSERSCOUNTS_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                error: action.error
            };

        //GETUSERSPG                       
        case ACTION.GETUSERSPG_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.GETUSERSPG_SUCCESS:
            return {
                ...state,
                fetching: false
            };
        case ACTION.GETUSERSPG_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                error: action.error
            };


        //SEARCHUSERS                       
        case ACTION.SEARCHUSERS_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.SEARCHUSERS_SUCCESS:
            return {
                ...state,
                fetching: false
            };
        case ACTION.SEARCHUSERS_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                error: action.error
            };


        //INACTIVEUSER                       
        case ACTION.INACTIVEUSER_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.INACTIVEUSER_SUCCESS:
            return {
                ...state,
                fetching: false
            };
        case ACTION.INACTIVEUSER_FAILURE:
            Swal.fire("Something went wrong!", "", "warning");
            return {
                ...state,
                fetching: false,
                error: action.error
            };








        case ACTION.LOGOUT_REQUEST:
            return {
                ...state,
                fetching: true,
            };
        case ACTION.LOGOUT_SUCCESS:
            Auth.removeAuth();
            Auth.removeAuthenticateUser();
            return {
                ...state,
                fetching: false,
                user: {},
                auth_data: {}
            };

        case ACTION.LOGOUT_FAILURE:
            Auth.removeAuth();
            Auth.removeAuthenticateUser();

            return {
                ...state,
                fetching: false,
                user: {},
                auth_data: {},
                error: action.error
            };
        default:
            return state;
    }
};
export default auth;
