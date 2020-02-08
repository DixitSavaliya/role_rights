import { CALL_API } from '../middleware/api';

export const getCustomAds = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'Application/getCustomAds',
        init: {
          method: 'POST',
          body: JSON.stringify(data),
        },
        types: ["GETCUSTOMADS_REQUEST", "GETCUSTOMADS_SUCCESS", "GETCUSTOMADS_FAILURE"],
      }
    };
  };

  export const insertCustomAds = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'Application/insertCustomAds',
        init: {
          method: 'POST',
          body: JSON.stringify(data),
        },
        types: ["INSERTCUSTOMADS_REQUEST", "INSERTCUSTOMADS_SUCCESS", "INSERTCUSTOMADS_FAILURE"],
      }
    };
  };

  export const deleteCustomAds = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'Application/removeCustomAds',
        init: {
          method: 'POST',
          body: JSON.stringify(data),
        },
        types: ["REMOVECUSTOMADS_REQUEST", "REMOVECUSTOMADS_SUCCESS", "REMOVECUSTOMADS_FAILURE"],
      }
    };
  };

  

  