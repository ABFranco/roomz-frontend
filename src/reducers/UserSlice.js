import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import * as apiClient from '../api/RoomzApiServiceClient.js';


/**
 * @function accountLogin - thunk to call api for signIn
 * 
 * @see https://redux-toolkit.js.org/api/createAsyncThunk
 */
const accountLogin = createAsyncThunk(
  'user/accountLogin',
  async(data) => {
    // main api call
    const response = await apiClient.signIn(data);
    
    // thunk payload
    const payload = {
      userId: response.getUserId(), 
      firstName: response.getFirstName(), 
      lastName: response.getLastName(), 
      email: data['email'],
    }
    return payload
  }
)


/**
 * @function accountCreate - thunk to call api for createAccount
 * 
 */
const accountCreate = createAsyncThunk(
  'user/accountCreate',
  async(data) => {
    // main api call
    const response = await apiClient.createAccount(data);
    
    // thunk payload
    const payload = {
      userId: response.getUserId(),
    }
    return payload
  }
)


/**
 * Slice for main user data
 * @see https://redux-toolkit.js.org/api/createSlice
 */
const userSlice = createSlice({
  name: 'user',
  initialState: {
    userId: null, 
    firstName: null, 
    lastName: null, 
    email: null,
  },
  reducers: {
    /**
     * @reduxAction 'user/clearSignInData' - Set `user` state back to default values
     * @param {Object} state - Initial state
     */
    clearSignInData: (state) => {
      state.userId = null;
      state.firstName = null;
      state.lastName = null;
      state.email = null;
    },
  },
  extraReducers: {
    [accountLogin.pending]: () => {},

    /**
     * @reduxAction 'user/accountLogin/fulfilled' - set `user` state upon successful login
     * @param {Object} state - Initial state
     * @param {Object} action.payload
     * @param {number} action.payload.userId
     * @param {string} action.payload.firstName
     * @param {string} action.payload.lastName
     * @param {string} action.payload.email
     */
    [accountLogin.fulfilled]: (state, action) => {
      state.userId = action.payload.userId;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
    },
    
    [accountLogin.rejected]: (action) => {}
  }
})

/**
 * Actions
 */
export const { clearSignInData } = userSlice.actions;
export { accountLogin, accountCreate }

export default userSlice;