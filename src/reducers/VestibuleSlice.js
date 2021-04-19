import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import * as apiClient from '../api/RoomzApiServiceClient.js';


/**
 * Slice for actions related to the Vestibule
 * @see https://redux-toolkit.js.org/api/createSlice
 */
const vestibuleSlice = createSlice({
  name: 'vestibule',
  initialState: {
    roomId: null,
    roomPassword: null,
    userName: null,
  },
  reducers: {

    /**
     * @reduxAction 'vestibule/setVestibuleJoin' - State when user is joining a room
     * @param {Object} state - Initial state
     * @param {Object} action.payload
     */
    setVestibuleJoin: (state, action) => {
      state.roomId = action.payload.roomId;
      state.roomPassword = action.payload.roomPassword;
      state.userName = action.payload.userName;
    },
  },
  extraReducers: {}
})

/**
 * Actions
 */
// export const {  } = vestibuleSlice.actions;
// export {  }

export default vestibuleSlice;