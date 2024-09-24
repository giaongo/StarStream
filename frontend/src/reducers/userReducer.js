import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAdmin: false,
  token: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.isAdmin = action.payload.isAdmin;
      state.token = action.payload.token;
      console.log("current state is ", action);
    },
    removeAdmin: (_state) => {
      return initialState;
    },
  },
});

export const { setAdmin } = userSlice.actions;
export default userSlice.reducer;

// React thunk pattern
export const checkAndSetAdminUser = () => {
  return async (dispatch, _getState) => {
    const token = localStorage.getItem("starStreamToken");
    token && dispatch(setAdmin({ token: token, isAdmin: true }));
  };
};
