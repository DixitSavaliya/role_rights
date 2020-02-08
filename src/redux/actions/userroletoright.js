import { CALL_API } from '../middleware/api';

export const getUserRoleData = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'UserRole/getUserRole',
        init: {
          method: 'POST',
          body: JSON.stringify(data),
        },
        types: ["GETUSERSROLE_REQUEST", "GETUSERSROLE_SUCCESS", "GETUSERSROLE_FAILURE"],
      }
    };
  };

  export const getUserRightData = () => {
    return {
      [CALL_API]: {
        endpoint: 'UserRole/getUserRight',
        init: {
          method: 'POST'
        },
        types: ["GETUSERSRIGHT_REQUEST", "GETUSERSRIGHT_SUCCESS", "GETUSERSRIGHT_FAILURE"],
      }
    };
  };

  export const userroletoright = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'UserRole/getUserRoleToRight',
        init: {
          method: 'POST',
          body: JSON.stringify(data)
        },
        types: ["GETUSERROLETORIGHT_REQUEST", "GETUSERROLETORIGHT_SUCCESS", "GETUSERROLETORIGHT_FAILURE"],
      }
    };
  };

  export const edituserroletoright = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'UserRole/registerUserRoleToRight',
        init: {
          method: 'POST',
          body: JSON.stringify(data)
        },
        types: ["UPDATEUSERROLETORIGHT_REQUEST", "UPDATEUSERROLETORIGHT_SUCCESS", "UPDATEUSERROLETORIGHT_FAILURE"],
      }
    };
  };

  export const setUserRights = (data) => {
    return {
      init: {
        body: JSON.stringify(data)
      },
      type: "SETUSERRIGHTS",
    };
  };

  
