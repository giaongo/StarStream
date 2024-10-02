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
 */
export const checkAndSetAdminUser = (userToken, checkToken = null) => {
  return async (dispatch) => {
    try {
      let isAdmin = true;
      if (checkToken) {
        const response = await checkToken(userToken);
        if (!response) {
          dispatch(removeAdmin());
          console.log("Invalid token, removing admin");
          return;
        }
      }
      console.log("Valid token, setting admin");
      dispatch(setAdmin({ token: userToken, isAdmin }));
    } catch (error) {
      console.error(`checkAndSetAdminUser: ${error.message}`);
    }
  };
};

/**
 * React thunk pattern to logout and remove the admin user
 * @returns
 */
export const logoutAndRemoveAdmin = () => {
  return async (dispatch) => {
    dispatch(removeAdmin());
    localStorage.removeItem("starStreamToken");
  };
};
