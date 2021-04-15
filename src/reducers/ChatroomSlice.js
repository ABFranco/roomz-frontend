import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import * as apiClient from '../api/RoomzApiServiceClient.js';


/**
 * @function sendChatMessage - thunk to call api for enterChatRoom
 * 
 */
const sendChatMessage = createAsyncThunk(
  'room/sendChatMessage',
  async(data) => {
    // main api call
    const response = await apiClient.chatMessage(data);
    return {}
  }
)


/**
 * Slice for actions related to the Chatroom
 * @see https://redux-toolkit.js.org/api/createSlice
 */
const chatroomSlice = createSlice({
  name: 'chatroom',
  initialState: {
    chatHistory: [],
  },
  reducers: {

    /**
     * @reduxAction 'chatroom/appendChatMessage' - Add additional chat message to history
     * @param {Object} state - Initial state
     * @param {Object} action.payload
     */
    setChatHistory: (state, action) => {
      state.chatHistory = action.payload;
    },

    /**
     * @reduxAction 'chatroom/appendChatMessage' - Add additional chat message to history
     * @param {Object} state - Initial state
     * @param {string} action.payload
     */
    appendChatMessage: (state, action) => {
      state.chatHistory = [
        ...state.chatHistory,
        action.payload,
      ]
    },

    /**
     * @reduxAction 'chatroom/clearChatHistory' - Clear chat message history
     * @param {Object} state - Initial state
     */
    clearChatHistory: (state) => {
      state.chatHistory = [];
    },
  },
  extraReducers: {}
})

/**
 * Actions
 */
export const { setChatHistory, appendChatMessage, clearChatHistory } = chatroomSlice.actions;
export { sendChatMessage }

export default chatroomSlice;