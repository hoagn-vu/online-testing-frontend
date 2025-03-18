import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: localStorage.getItem("accessToken") || null,
  user: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.role = action.payload?.role || null;
    },
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.role = action.payload.user?.role || null;
      localStorage.setItem("accessToken", action.payload.accessToken);
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.role = null;
      localStorage.removeItem("accessToken");
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
