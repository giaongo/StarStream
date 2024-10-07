import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  popularStream: [],
  latestStream: [],
};

const archiveSlice = createSlice({
  name: "archive",
  initialState,
  reducers: {
    addArchives: (state, action) => {
      state.popularStream = action.payload.popularStream;
      state.latestStream = action.payload.latestStream;
    },
  },
});

export const { addArchives } = archiveSlice.actions;

export default archiveSlice.reducer;
