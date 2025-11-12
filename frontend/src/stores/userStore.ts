import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userId: string | null;
  username: string | null;
}

const initialUserState: UserState = {
  userId: null,
  username: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  // reducers are pure functions that determine how a state should change in response to actions
  reducers: {
    login(state, action: PayloadAction<{ userId: string; username: string }>) {
      state.userId = action.payload.userId;
      state.username = action.payload.username;
    },
    resetUser() {
      return initialUserState;
    },
  },
});

// Allows other components to import and use these actions altering the current state
export const userActions = userSlice.actions;

// Exports the reducer for the store.ts to combine with other reducers
export default userSlice.reducer;
