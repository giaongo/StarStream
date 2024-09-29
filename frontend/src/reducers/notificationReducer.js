import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  show: false,
  message: "",
  severity: "",
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showNotification: (state, action) => {
      state.show = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
    hideNotification: (_state) => {
      return initialState;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;

export default notificationSlice.reducer;

/**
 * React thunk pattern to display a notification and hide notification after timeout
 * @param {*} data
 * @param {*} timeout
 * @returns
 */
export const displayNotification = (data, timeout) => {
  return async (dispatch, _getState) => {
    dispatch(showNotification(data));
    setTimeout(() => {
      dispatch(hideNotification());
    }, timeout);
  };
};
