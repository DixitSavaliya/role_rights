import { CALL_API } from '../middleware/api';

export const createApp = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'Application/insertApplication',
        init: {
          method: 'POST',
          body: JSON.stringify(data),
        },
        types: ["CREATEAPP_REQUEST", "CREATEAPP_SUCCESS", "CREATEAPP_FAILURE"],
      }
    };
  };

  export const applicationCount = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'Application/countApplication',
        init: {
          method: 'POST',
          body: JSON.stringify(data)
        },
        types: ["APPCOUNT_REQUEST", "APPCOUNT_SUCCESS", "APPCOUNT_FAILURE"],
      }
    };
  };


  export const applicationPGData = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'Application/applicationByPg',
        init: {
          method: 'POST',
          body: JSON.stringify(data)
        },
        types: ["APPPGDATA_REQUEST", "APPPGDATA_SUCCESS", "APPPGDATA_FAILURE"],
      }
    };
  };

  export const getAppDataById = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'Application/getApplication',
        init: {
          method: 'POST',
          body: JSON.stringify(data)
        },
        types: ["APPDATABYID_REQUEST", "APPDATABYID_SUCCESS", "APPDATABYID_FAILURE"],
      }
    };
  };

  export const getViewApplicationDetailsById = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'Application/getViewApplicationDetailsById',
        init: {
          method: 'POST',
          body: JSON.stringify(data)
        },
        types: ["APPDATABYID_REQUEST", "APPDATABYID_SUCCESS", "APPDATABYID_FAILURE"],
      }
    };
  };

  export const editApp = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'Application/updateApplication',
        init: {
          method: 'POST',
          body: JSON.stringify(data)
        },
        types: ["UPDATEAPP_REQUEST", "UPDATEAPP_SUCCESS", "UPDATEAPP_FAILURE"],
      }
    };
  };

  export const deleteApp = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'Application/deleteApplication',
        init: {
          method: 'POST',
          body: JSON.stringify(data)
        },
        types: ["DELETEAPP_REQUEST", "DELETEAPP_SUCCESS", "DELETEAPP_FAILURE"],
      }
    };
  };

  export const searchApplicationData = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'Application/applicationBySearch',
        init: {
          method: 'POST',
          body: JSON.stringify(data)
        },
        types: ["SEARCHAPP_REQUEST", "SEARCHAPP_SUCCESS", "SEARCHAPP_FAILURE"],
      }
    };
  };

  

  

  

  
  

