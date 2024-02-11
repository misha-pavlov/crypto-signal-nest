import { createSlice } from "@reduxjs/toolkit";
import { UserType } from "../types/User.type";

const userSlice = createSlice({
  name: "user",
  initialState: {
    storredUser: null,
  } as {
    storredUser: UserType | null;
  },
  reducers: {
    setStoredUser: (state, action) => {
      const { user } = action.payload;
      state.storredUser = user;
    },
  },
});

export const { setStoredUser } = userSlice.actions;
export default userSlice.reducer;
