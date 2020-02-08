import { combineReducers } from 'redux';

import auth from './auth';
import sidebar from './sidebar';
// import userrole from './userrole';


const rootReducer = combineReducers({
  auth,
  sidebar,
  // userrole
});

export default rootReducer;
