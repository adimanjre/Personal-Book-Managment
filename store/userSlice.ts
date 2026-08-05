import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  fullName: string | null;
  email: string | null;
}

const initialState: UserState = {
  fullName: null,
  email: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ fullName: string; email: string }>,
    ) => {
      state.fullName = action.payload.fullName;
      state.email = action.payload.email;
    },
    clearUser: (state) => {
      state.fullName = null;
      state.email = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
