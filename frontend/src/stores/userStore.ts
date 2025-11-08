import { createSlice } from "@reduxjs/toolkit";

const initialUserState = {
  userId: null,
  username: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    login(state, action) {
      return {
        ...state,
        userId: action.payload.userId,
        username: action.payload.username,
      };
    },
    resetUser() {
      return initialUserState;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
