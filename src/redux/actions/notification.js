import { CALL_API } from '../middleware/api';

export const sendNotification = (data) => {
    return {
      [CALL_API]: {
        endpoint: 'Notification/sendPushNotification',
        init: {
          method: 'POST',
          body: JSON.stringify(data),
        },
        types: ["SENDPUSHNOTIFICATION_REQUEST", "SENDPUSHNOTIFICATION_SUCCESS", "SENDPUSHNOTIFICATION_FAILURE"],
      }
    };
  };

  
export const notificationCount = (data) => {
  return {
    [CALL_API]: {
      endpoint: 'Notification/notificationCount',
      init: {
        method: 'POST',
        body: JSON.stringify(data),
      },
      types: ["NOTIFICATIONCOUNT_REQUEST", "NOTIFICATIONCOUNT_SUCCESS", "NOTIFICATIONCOUNT_FAILURE"],
    }
  };
};

export const notificationPGData = (data) => {
  return {
    [CALL_API]: {
      endpoint: 'Notification/notificationByPage',
      init: {
        method: 'POST',
        body: JSON.stringify(data),
      },
      types: ["NOTIFICATIONPG_REQUEST", "NOTIFICATIONPG_SUCCESS", "NOTIFICATIONPG_FAILURE"],
    }
  };
};

export const deleteNotificationData = (data) => {
  return {
    [CALL_API]: {
      endpoint: 'Notification/deleteNotification',
      init: {
        method: 'POST',
        body: JSON.stringify(data),
      },
      types: ["REMOVENOTIFICATION_REQUEST", "REMOVENOTIFICATION_SUCCESS", "REMOVENOTIFICATION_FAILURE"],
    }
  };
};

export const getViewNotificationsDetailsById = (data) => {
  return {
    [CALL_API]: {
      endpoint: 'Notification/notificationByDetailsById',
      init: {
        method: 'POST',
        body: JSON.stringify(data),
      },
      types: ["VIEWNOTIFICATION_REQUEST", "VIEWNOTIFICATION_SUCCESS", "VIEWNOTIFICATION_FAILURE"],
    }
  };
};




