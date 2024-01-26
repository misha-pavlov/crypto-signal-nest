import { createSlice } from "@reduxjs/toolkit";
import { UserType } from "../types/User.type";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    userData: null,
    didTryAutoLogin: false,
  } as {
    token: null | string;
    userData: null | UserType;
  },
  reducers: {
    authenticate: (state, action) => {
      const { payload } = action;
      state.token = payload.token;
      state.userData = payload.userData;
    },

    logout: (state) => {
      state.token = null;
      state.userData = null;
    },

    updateUserDataRedux: (state, action) => {
      state.userData = { ...state.userData, ...action.payload.newData };
    },
  },
});

export const { authenticate, logout, updateUserDataRedux } = authSlice.actions;
export default authSlice.reducer;
