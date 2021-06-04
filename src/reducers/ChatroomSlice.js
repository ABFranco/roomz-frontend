import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import * as apiClient from '../api/RoomzApiServiceClient.js';


/**
 * @function sendChatMessage - thunk to call api for chatMessage
 * 
 */
const sendChatMessage = createAsyncThunk(
  'room/sendChatMessage',
  async(data) => {
    await apiClient.chatMessage(data);
    return {};
  }
);


/**
 * Slice for actions related to the Chatroom
 * @see https://redux-toolkit.js.org/api/createSlice
 */
const chatroomSlice = createSlice({
  name: 'chatroom',
  initialState: {
    chatHistory: [],
    isVisible: false,
    inChatroom: false,
  },
  reducers: {

    /**
     * @reduxAction 'chatroom/toggleChatroom' - Toggle visibility of the chatroom
     * @param {Object} state - Initial state
     */
     toggleChatroom: (state) => {
      state.isVisible = !state.isVisible;
    },

    /**
     * @reduxAction 'chatroom/setInChatroom' - Set inChatroom boolean
     * @param {Object} state - Initial state
     * @param {boolean} action.payload
     */
     setInChatroom: (state, action) => {
      state.inChatroom = action.payload;
      state.isVisible = false;
    },


    /**
     * @reduxAction 'chatroom/setChatHistory' - Set chat message history
     * @param {Object} state - Initial state
     * @param {Object} action.payload
     */
    setChatHistory: (state, action) => {
      state.chatHistory = action.payload;
    },

    /**
     * @reduxAction 'chatroom/appendChatMessage' - Add additional chat message to history
     * @param {Object} state - Initial state
     * @param {Object} action.payload
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
      state.inChatroom = false;
    },
  },
  extraReducers: {}
});

/**
 * Actions
 */
export const { toggleChatroom, setInChatroom, setChatHistory, appendChatMessage, clearChatHistory } = chatroomSlice.actions;
export { sendChatMessage }

export default chatroomSlice;