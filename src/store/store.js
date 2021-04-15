import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../reducers/RootReducer.js';

import { getCachedObject, setCachedObject } from '../util/cache';


/**
 * @function retrieveCachedState - Retrieve state data from cache if it exists
 * @returns {Object} state data for store's preloadedState
 */
function retrieveCachedState() {
  let cachedState = {}
  const cachedUser = getCachedObject('user');
  const cachedRoom = getCachedObject('room');
  const cachedChatroom = getCachedObject('chatroom');

  // at the moment, only user data exists
  if (cachedUser) {
    cachedState = {
      ...cachedState,
      user: cachedUser,
    }
  }
  if (cachedRoom) {
    cachedState = {
      ...cachedState,
      room: cachedRoom,
    }
  }
  if (cachedChatroom) {
    cachedState = {
      ...cachedState,
      chatroom: cachedChatroom,
    }
  }

  return cachedState;
}


/**
 * Initialize the store
 * @see https://redux-toolkit.js.org/api/configureStore
 */
const store = configureStore({
  
  // the single, root reducer
  reducer: rootReducer,
  
  // (optional) array of Redux middleware
  // middleware: 

  // preloaded state - the initial state of the store
  preloadedState: retrieveCachedState(),
  
  // whether to enable Redux DevTools integration (i.e. the DevTools Extension), defaults to `true`
  devTools: true,

});


/**
 * Preserve state of user info via cache and store.subscribe
 * 
 * @see https://redux.js.org/api/store#subscribelistener
 */
store.subscribe(() => {
  setCachedObject('user', store.getState().user);
  setCachedObject('room', store.getState().room);
  setCachedObject('chatroom', store.getState().chatroom);
})


export default store;