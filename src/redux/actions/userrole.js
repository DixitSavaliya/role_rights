import { CALL_API } from '../middleware/api';

export const addUserRole = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'UserRole/registerUserRole',
        init: {
          method: 'POST',
          body: JSON.stringify(data),
        },
        types: ["REGISTER_USERROLE_REQUEST", "REGISTER_USERROLE_SUCCESS", "REGISTER_USERROLE_FAILURE"],
      }
    };
  };

  export const roleCountData = () => {
    return {
      [CALL_API]: {
        endpoint: 'UserRole/countUserRole',
        init: {
          method: 'POST'
        },
        types: ["COUNT_USERROLE_REQUEST", "COUNT_USERROLE_SUCCESS", "COUNT_USERROLE_FAILURE"],
      }
    };
  };

  
  export const RolePGData = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'UserRole/getUserRoleDetailsPg',
        init: {
          method: 'POST',
          body: JSON.stringify(data)
        },
        types: ["GETUSERROLE_REQUEST", "GETUSERROLE_SUCCESS", "GETUSERROLE_FAILURE"],
      }
    };
  };

  
  export const deleteRoleData = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'UserRole/deleteUserRole',
        init: {
          method: 'POST',
          body: JSON.stringify(data)
        },
        types: ["DELETEUSERROLE_REQUEST", "DELETEUSERROLE_SUCCESS", "DELETEUSERROLE_FAILURE"],
      }
    };
  };

  export const updateRole = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'UserRole/updateUserRole',
        init: {
          method: 'POST',
          body: JSON.stringify(data)
        },
        types: ["UPDATEUSERROLE_REQUEST", "UPDATEUSERROLE_SUCCESS", "UPDATEUSERROLE_FAILURE"],
      }
    };
  };

  export const searchRole = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'UserRole/searchUserRole',
        init: {
          method: 'POST',
          body: JSON.stringify(data)
        },
        types: ["SEARCHUSERROLE_REQUEST", "SEARCHUSERROLE_SUCCESS", "SEARCHUSERROLE_FAILURE"],
      }
    };
  };

//   export const getUserRole = (data) => {
//     console.log("getUserRole data", data)
//     return {
//       [CALL_API]: {
//         endpoint: 'UserRole/getUserRoleDetailsPg',
//         init: {
//           method: 'POST',
//           body: JSON.stringify(data),
//         },
//         types: ["REGISTER_USERROLE_REQUEST", "REGISTER_USERROLE_SUCCESS", "REGISTER_USERROLE_FAILURE"],
//       }
//     };
//   };
  
  