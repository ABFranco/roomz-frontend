import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import * as apiClient from '../api/RoomzApiServiceClient.js';


/**
 * @function roomCreate - thunk to call api for createRoom
 * 
 */
const roomCreate = createAsyncThunk(
  'room/roomCreate',
  async(data) => {
    const response = await apiClient.createRoom(data);
    
    // Konner: Bad API, unnecessary roomId and isStrict. Remove?
    const payload = {
      roomId: response.getRoomId(), 
      token: response.getToken(), 
      isStrict: response.getIsStrict(),
      roomUserName: data['userName'],
      roomPassword: data['password'],
    };
    return payload;
  }
);

/**
 * @function roomDelete - thunk to call api for closeRoom
 * 
 */
const roomDelete = createAsyncThunk(
  'room/roomDelete',
  async(data) => {
    await apiClient.closeRoom(data);
    return {};
  }
);

/**
 * @function roomLeave - thunk to call api for leaveRoom
 * 
 */
const roomLeave = createAsyncThunk(
  'room/roomLeave',
  async(data) => {
    await apiClient.leaveRoom(data);
    return {};
  }
);

/**
 * @function roomJoinCancel - thunk to call api for cancelJoinRequest
 * 
 */
const roomJoinCancel = createAsyncThunk(
  'room/roomJoinCancel',
  async(data) => {
    await apiClient.cancelJoinRequest(data);
    return {};
  }
);


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
    userInVestibule: false,
    roomUserName: null,
    roomPassword: null,
    roomJoinRequestAccepted: false,
  },
  reducers: {
    /**
     * @reduxAction 'room/setInVestibule' - Set if user is in the vestibule or not
     * @param {Object} state - Initial state
     * @param {string} action.payload
     */
    setInVestibule: (state, action) => {
      state.userInRoom = false;
      state.userInVestibule = action.payload;
    },
    
    /**
     * @reduxAction 'room/setRoomUserName' - Set user's username for a specific room
     * @param {Object} state - Initial state
     * @param {string} action.payload
     */
    setRoomUserName: (state, action) => {
      state.roomUserName = action.payload;
    },

    /**
     * @reduxAction 'room/setRoomJoinRequestAccepted' - Set user's username for a specific room
     * @param {Object} state - Initial state
     * @param {string} action.payload
     */
    setRoomJoinRequestAccepted: (state, action) => {
      state.roomJoinRequestAccepted = action.payload;
    },

    /**
     * @reduxAction 'room/setToken' - Set a user's token for a room
     * @param {Object} state - Initial state
     * @param {string} action.payload
     */
    setToken: (state, action) => {
      state.token = action.payload;
    },


    /**
     * @reduxAction 'room/setEnteredRoom - State when user enters a room
     * @param {Object} state - Initial state
     */
    setEnteredRoom: (state) => {
      state.userInRoom = true;
      state.userInVestibule = false;
      state.roomJoinRequestAccepted = true;
    },

    /**
     * @reduxAction 'room/setVestibuleJoin' - State when user first enters the vestibule
     * @param {Object} state - Initial state
     * @param {Object} action.payload
     * @param {number} action.payload.roomId
     * @param {string} action.payload.roomPassword
     * @param {string} action.payload.userName
     */
    setVestibuleJoin: (state, action) => {
      state.roomId = action.payload.roomId;
      state.token = action.payload.token;
      state.isStrict = action.payload.isStrict;
      state.userIsHost = action.payload.userIsHost;
      state.userInRoom = false;
      state.userInVestibule = true;
      state.roomPassword = action.payload.roomPassword;
      state.roomUserName = action.payload.user;
      state.roomJoinRequestAccepted = false;
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
      state.userInVestibule = false;
      state.roomUserName = null;
      state.roomPassword = null;
      state.roomJoinRequestAccepted = false;
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
      state.userInRoom = false;
      state.userInVestibule = true;
      state.roomUserName = action.payload.roomUserName;
      state.roomPassword = action.payload.roomPassword;
      state.roomJoinRequestAccepted = true;
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
      state.userInVestibule = false;
      state.roomUserName = null;
      state.roomPassword = null;
      state.roomJoinRequestAccepted = false;
    },

    /**
     * @reduxAction 'room/roomLeave/fulfilled' - set `room` state upon successful leave
     * @param {Object} state - Initial state
     */
    [roomLeave.fulfilled]: (state) => {
      state.roomId = null;
      state.token = null;
      state.isStrict = false;
      state.userIsHost = false;
      state.userInRoom = false;
      state.userInVestibule = false;
      state.roomUserName = null;
      state.roomPassword = null;
      state.roomJoinRequestAccepted = false;
    },

    /**
     * @reduxAction 'room/roomJoinCancel/fulfilled' - set `room` state upon successful join cancel
     * @param {Object} state - Initial state
     */
    [roomJoinCancel.fulfilled]: (state) => {
      state.roomId = null;
      state.token = null;
      state.isStrict = false;
      state.userIsHost = false;
      state.userInRoom = false;
      state.userInVestibule = false;
      state.roomUserName = null;
      state.roomPassword = null;
      state.roomJoinRequestAccepted = false;
    },

  }
});

/**
 * Actions
 */
export const { setRoomUserName, setToken, setInVestibule, setVestibuleJoin, setEnteredRoom, setJoinRequestAccepted, clearRoomData } = roomSlice.actions;
export { roomCreate, roomDelete, roomLeave, roomJoinCancel }

export default roomSlice;