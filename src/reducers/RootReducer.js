import { combineReducers } from 'redux';
import userSlice from './UserSlice';


/**
 * Root Reducer
 * 
 * @see https://redux.js.org/api/combinereducers
 */
export const rootReducer = combineReducers({
  user: userSlice.reducer,
})