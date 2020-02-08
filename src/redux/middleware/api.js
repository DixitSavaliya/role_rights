import { REMOTE_URL } from '../constants/';
import Auth from '../Auth';

// middleware： 简化fetch处理， 并且加上token
function callApi(endpoint, init, token) {
  // console.log("endpoint",endpoint)
  let auth1 = Auth.getAuth();
  let auth = auth1 ? JSON.parse(auth1) : null;
  //console.log("auth", auth)
  let headers = {};
  if(endpoint == 'User/uploadUserImage'){
    
  }else {
    headers = {
      "Content-Type": "application/json",
    };
  }
  headers = {
    ...headers,
    'Authorization': `Bearer ${auth ? auth.access_token: ''}`,
    'content-md5': auth ? auth.secret_key: '',
  };

  

  /* if(token) {
    headers = {
      ...headers,
      'Authorization': `Bearer ${token}`,
    };
  } else {
    headers = {
      ...headers,
      'Authorization': `Bearer ${auth ? auth.access_token: ''}`,
      'content-md5': auth ? auth.secret_key: '',
    };
  } */
  
  init.headers = new Headers(headers);
  let body = init.body ? JSON.parse(init.body) : {};
  body['end_user_key'] = auth ? auth.secret_key: '';
  init.body = JSON.stringify(body);
  if (!endpoint.startsWith(REMOTE_URL)) {
    endpoint = `${REMOTE_URL}${endpoint}`;
  }
  return fetch(endpoint, init)
    .then(response => response.json().then(json => {
      // console.log("json ",json);
      if (!response.ok) {
        return Promise.reject(json);
      } else if (!json.status) {
        throw new Error(json.message);
      }
      return json;
    }));
}

export const CALL_API = 'Call_API';

export default store => next => action => {
  const callAPI = action[CALL_API];
  //console.log("callAPI", callAPI)
  // So the middleware doesn't get applied to every single action
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let { endpoint, init = {}, types } = callAPI;
  const [ requestType, successType, errorType ] = types;
  next({ type: requestType });

  let token = null;
  let auth1 = Auth.getAuth();
  let auth = auth1 ? JSON.parse(auth1) : null;
  if (auth && auth.access_token) {
    token = auth.access_token;
  }
  return callApi(endpoint, init, token).then(
    response => {
      return next({
        response,
        type: successType,
      });
    },
    error => next({
      error: error.message || 'There was an error.',
      type: errorType
    })
  );
}
