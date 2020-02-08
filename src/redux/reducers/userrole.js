import * as ACTION from '../constants/userrole';

const initialState = {
    fetching: false,
    user: {},
    auth_data: {},
    count:{},
    error: null
};

const userrole = (state = initialState, action) => {
  
    switch (action.type) {

        // //REGISTER USERROLE
        // case ACTION.REGISTER_USERROLE_REQUEST:
        //     return {
        //         ...state,
        //         fetching: true,
        //     };
        // case ACTION.REGISTER_USERROLE_SUCCESS:
        //     return {
        //         ...state,
        //         fetching: false,
        //         user: action.response.data
        //     };
        // case ACTION.REGISTER_USERROLE_FAILURE:
        //     return {
        //         ...state,
        //         fetching: false,
        //         user: {},
        //         error: action.error
        //     };

        //      //COUNT USERROLE
        // case ACTION.COUNT_USERROLE_REQUEST:
        //     console.log("request",action);
        //         return {
        //             ...state,
        //             fetching: true,
        //         };
        //     case ACTION.COUNT_USERROLE_SUCCESS:
        //         return {
        //             ...state,
        //             fetching: false,
        //             count: action.response.data
        //         };
        //     case ACTION.COUNT_USERROLE_FAILURE:
        //         return {
        //             ...state,
        //             fetching: false,
        //             count: {},
        //             error: action.error
        //         };

    };
}

export default userrole;
