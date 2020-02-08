import { CALL_API } from '../middleware/api';

export const addUserRight = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'UserRole/registerUserRight',
        init: {
          method: 'POST',
          body: JSON.stringify(data),
        },
        types: ["REGISTER_USERRIGHT_REQUEST", "REGISTER_USERRIGHT_SUCCESS", "REGISTER_USERRIGHT_FAILURE"],
      }
    };
  };

  export const rightCountData = () => {
    return {
      [CALL_API]: {
        endpoint: 'UserRole/countUserRight',
        init: {
          method: 'POST'
        },
        types: ["COUNT_USERRIGHT_REQUEST", "COUNT_USERRIGHT_SUCCESS", "COUNT_USERRIGHT_FAILURE"],
      }
    };
  };

  
  export const RightPGData = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'UserRole/getUserRightDetailsPg',
        init: {
          method: 'POST',
          body: JSON.stringify(data)
        },
        types: ["GETUSERRIGHT_REQUEST", "GETUSERRIGHT_SUCCESS", "GETUSERRIGHT_FAILURE"],
      }
    };
  };

  
  export const deleteRightData = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'UserRole/deleteUserRight',
        init: {
          method: 'POST',
          body: JSON.stringify(data)
        },
        types: ["DELETEUSERRIGHT_REQUEST", "DELETEUSERRIGHT_SUCCESS", "DELETEUSERRIGHT_FAILURE"],
      }
    };
  };

  export const updateRight = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'UserRole/updateUserRight',
        init: {
          method: 'POST',
          body: JSON.stringify(data)
        },
        types: ["UPDATEUSERRIGHT_REQUEST", "UPDATEUSERRIGHT_SUCCESS", "UPDATEUSERRIGHT_FAILURE"],
      }
    };
  };

  export const searchRight = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'UserRole/searchUserRight',
        init: {
          method: 'POST',
          body: JSON.stringify(data)
        },
        types: ["SEARCHUSERRIGHT_REQUEST", "SEARCHUSERRIGHT_SUCCESS", "SEARCHUSERRIGHT_FAILURE"],
      }
    };
  };

//   export const getUSERRIGHT = (data) => {
//     console.log("getUSERRIGHT data", data)
//     return {
//       [CALL_API]: {
//         endpoint: 'USERRIGHT/getUSERRIGHTDetailsPg',
//         init: {
//           method: 'POST',
//           body: JSON.stringify(data),
//         },
//         types: ["REGISTER_USERRIGHT_REQUEST", "REGISTER_USERRIGHT_SUCCESS", "REGISTER_USERRIGHT_FAILURE"],
//       }
//     };
//   };
  
  