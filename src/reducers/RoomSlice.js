import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import * as apiClient from '../api/RoomzApiServiceClient.js';


/**
 * @function roomCreate - thunk to call api for createRoom
 * 
 */
const roomCreate = createAsyncThunk(
  'room/roomCreate',
  async(data) => {
    // main api call
    const response = await apiClient.createRoom(data);

    // thunk payload
    const payload = {
      roomId: response.getRoomId(), 
      token: response.getToken(), 
      isStrict: response.getIsStrict(),
    }
    return payload
  }
)

/**
 * @function roomDelete - thunk to call api for closeRoom
 * 
 */
const roomDelete = createAsyncThunk(
  'room/roomDelete',
  async(data) => {
    // main api call
    const response = await apiClient.closeRoom(data);
    return {}
  }
)


/**
 * Slice for actions related to creating and joining a Room
 * @see https://redux-toolkit.js.org/api/createSlice
 */
const roomSlice = createSlice({
  name: 'room',
  initialState: {
    roomId: null, 
    token: null, 
    isStrict: false, 
    userIsHost: false,
    userInRoom: false,
    userIsJoining: false,
    roomUserName: null
  },
  reducers: {
    /**
     * @reduxAction 'room/setRoomUserName' - Set user's username for a specific room
     * @param {Object} state - Initial state
     * @param {string} action.payload
     */
    setRoomUserName: (state, action) => {
      state.roomUserName = action.payload;
    },

    /**
     * @reduxAction 'room/setJoinedRoom - Set room as joined as non-host
     * @param {Object} state - Initial state
     * @param {Object} action.payload
     * @param {number} action.payload.roomId
     * @param {string} action.payload.token
     * @param {boolean} action.payload.isStrict
     */
    setJoinedRoom: (state, action) => {
      state.roomId = action.payload.roomId;
      state.token = action.payload.token;
      state.isStrict = action.payload.isStrict;;
      state.userIsHost = false;
      state.userInRoom = true;
      state.userIsJoining = false;
    },

    /**
     * @reduxAction 'room/setWaitingRoom - Set room as waiting room state
     * @param {Object} state - Initial state
     * @param {Object} action.payload
     * @param {number} action.payload.roomId
     */
    setWaitingRoom: (state, action) => {
      state.roomId = action.payload.roomId;
      state.isStrict = true;
      state.userIsHost = false;
      state.userInRoom = false;
      state.userIsJoining = true;
    },

    /**
     * @reduxAction 'room/clearRoomData - Reset all room data to initial state
     * @param {Object} state - Initial state
     */
    clearRoomData: (state) => {
      state.roomId = null;
      state.token = null;
      state.isStrict = false;
      state.userIsHost = false;
      state.userInRoom = false;
      state.userIsJoining = false;
      state.roomUserName = null;
    },

    
  },
  extraReducers: {
    
    /**
     * @reduxAction 'room/roomCreate/fulfilled' - set `room` state upon successful creation
     * @param {Object} state - Initial state
     * @param {Object} action.payload
     * @param {number} action.payload.roomId
     * @param {string} action.payload.token
     * @param {boolean} action.payload.isStrict
     */
    [roomCreate.fulfilled]: (state, action) => {
      state.roomId = action.payload.roomId;
      state.token = action.payload.token;
      state.isStrict = action.payload.isStrict;
      state.userIsHost = true;
      state.userInRoom = true;
      state.userIsJoining = false;
    },
    [roomCreate.pending]: () => {},
    [roomCreate.rejected]: (action) => {},
    
    /**
     * @reduxAction 'room/roomDelete/fulfilled' - set `room` state upon successful deletion
     * @param {Object} state - Initial state
     */
    [roomDelete.fulfilled]: (state) => {
      state.roomId = null;
      state.token = null;
      state.isStrict = false;
      state.userIsHost = false;
      state.userInRoom = false;
      state.userIsJoining = false;
      state.roomUserName = null;
    },

  }
})

/**
 * Actions
 */
export const { setRoomUserName, setJoinedRoom, setWaitingRoom, clearRoomData } = roomSlice.actions;
export { roomCreate, roomDelete }

export default roomSlice;