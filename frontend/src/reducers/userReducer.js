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
    },
    removeAdmin: (_state) => {
      return initialState;
    },
  },
});

export const { setAdmin, removeAdmin } = userSlice.actions;
export default userSlice.reducer;

/**
 * React thunk pattern to check and set the admin user
 * @param {*} userToken
 * @returns
 */
export const checkAndSetAdminUser = (userToken) => {
  return async (dispatch, _getState) => {
    userToken && dispatch(setAdmin({ token: userToken, isAdmin: true }));
  };
};

/**
 * React thunk pattern to logout and remove the admin user
 * @returns
 */
export const logoutAndRemoveAdmin = () => {
  return async (dispatch, _getState) => {
    dispatch(removeAdmin());
    localStorage.removeItem("starStreamToken");
  };
};
