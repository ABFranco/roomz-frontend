import { createSlice } from '@reduxjs/toolkit';

/**
 * Slice for actions related to Media
 * @see https://redux-toolkit.js.org/api/createSlice
 */
 const mediaSlice = createSlice({
  name: 'media',
  initialState: {
    audioOn: false,
    videoOn: false,
  },
  reducers: {

    /**
     * @reduxAction 'media/setAudioOn' - Set audioOn boolean
     * @param {Object} state - Initial state
     * @param {boolean} action.payload
     */
     setAudioOn: (state, action) => {
      state.audioOn = action.payload;
    },

    /**
     * @reduxAction 'media/setVideoOn' - Set videoOn boolean
     * @param {Object} state - Initial state
     * @param {boolean} action.payload
     */
     setVideoOn: (state, action) => {
      state.videoOn = action.payload;
    },

  },
  extraReducers: {}
});

/**
 * Actions
 */
export const { setAudioOn, setVideoOn } = mediaSlice.actions;

export default mediaSlice;