import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import * as apiClient from '../api/RoomzApiServiceClient.js';


/**
 * @function updateJoinRequests - thunk to call api for chatMessage
 * 
 */
const updateJoinRequests = createAsyncThunk(
  'joinRequests/updateJoinRequests',
  async(data) => {
    const response = await apiClient.getJoinRequests(data);

    let joinRequests = [];
    let incomingJoinRequests = response.getJoinRequestsList();

    for (var i = 0; i < incomingJoinRequests.length; i++) {
      joinRequests.push({
        userId: incomingJoinRequests[i].getUserId(),
        name: incomingJoinRequests[i].getUserName(),
      });
    }

    const payload = {
      pending: joinRequests,
    };
    return payload;
  }
);


/**
 * Slice for actions related to the JoinRequests component
 * @see https://redux-toolkit.js.org/api/createSlice
 */
const joinRequestsSlice = createSlice({
  name: 'joinRequests',
  initialState: {
    pending: [],
  },
  reducers: {

    /**
     * @reduxAction 'joinRequests/pending' - Set current join requests that are pending
     * @param {Object} state - Initial state
     * @param {Object} action.payload
     */
    setJoinRequests: (state, action) => {
      state.pending = action.payload;
    },


    /**
     * @reduxAction 'joinRequests/clearJoinRequests' - Clear join requests
     * @param {Object} state - Initial state
     */
    clearJoinRequests: (state) => {
      state.pending = [];
    },
  },
  extraReducers: {
    /**
     * @reduxAction 'joinRequests/updateJoinRequests/fulfilled' - update `pending` to retrieved join requests
     * @param {Object} state - Initial state
     * @param {Object} action.payload
     * @param {Array} action.payload.pending
     */
    [updateJoinRequests.fulfilled]: (state, action) => {
      state.pending = action.payload.pending;
    },
  }
});

/**
 * Actions
 */
export const { setJoinRequests, clearJoinRequests } = joinRequestsSlice.actions;
export { updateJoinRequests }

export default joinRequestsSlice;