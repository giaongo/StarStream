import { createSlice } from "@reduxjs/toolkit";
import { displayNotification } from "./notificationReducer";

const eventSlice = createSlice({
  name: "event",
  initialState: [],
  reducers: {
    addEvents: (_state, action) => {
      return action.payload.events;
    },
    removeEvent: (state, action) => {
      const newState = state.filter((event) => event.id !== action.payload.id);
      return newState;
    },
  },
});

export const { addEvents, removeEvent } = eventSlice.actions;

export default eventSlice.reducer;

/**
 * React thunk pattern to delete an event from event list by id
 * @param {*} token
 * @param {*} id
 * @param {*} deleteEvent
 * @returns
 */
export const deleteEventById = (token, id, deleteEvent) => {
  return async (dispatch, _getState) => {
    try {
      const deleteResult = await deleteEvent(token, id);
      dispatch(removeEvent({ id }));
      dispatch(
        displayNotification(
          { message: deleteResult.msg, severity: "success" },
          1000
        )
      );
    } catch (error) {
      console.error(error);
      dispatch(
        displayNotification({ message: error.message, severity: "error" }),
        3000
      );
    }
  };
};
