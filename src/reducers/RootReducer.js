import { combineReducers } from 'redux';
import userSlice from './UserSlice';
import roomSlice from './RoomSlice';
import chatroomSlice from './ChatroomSlice';


/**
 * Root Reducer
 * 
 * @see https://redux.js.org/api/combinereducers
 */
export const rootReducer = combineReducers({
  user: userSlice.reducer,
  room: roomSlice.reducer,
  chatroom: chatroomSlice.reducer,
})