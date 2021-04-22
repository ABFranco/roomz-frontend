import { createSlice } from '@reduxjs/toolkit';


/**
 * Slice for actions related to the Notifications
 * @see https://redux-toolkit.js.org/api/createSlice
 */
const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    error: null,
  },
  reducers: {

    /**
     * @reduxAction 'notification/setErrorMessage' - Set error message for notification
     * @param {Object} state - Initial state
     * @param {string} action.payload
     */
    setErrorMessage: (state, action) => {
      state.error = action.payload;
    },

    /**
     * @reduxAction 'notification/clearErrorMessage' - Clear error message for notification
     * @param {Object} state - Initial state
     */
    clearErrorMessage: (state) => {
      state.error = null;
    },

  },
  extraReducers: {}
});

/**
 * Actions
 */
export const { setErrorMessage, clearErrorMessage } = notificationSlice.actions;

export default notificationSlice;