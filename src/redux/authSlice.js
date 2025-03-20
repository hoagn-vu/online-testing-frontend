import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../services/authApi';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: localStorage.getItem('accessToken') || null,
    user: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      localStorage.setItem('accessToken', action.payload.accessToken);
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      localStorage.removeItem('accessToken');
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.getProfile.matchFulfilled, (state, { payload }) => {
      state.user = payload; // Cập nhật user khi lấy profile thành công
    });
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;



// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   accessToken: localStorage.getItem("accessToken") || null,
//   user: null,
//   role: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setUser: (state, action) => {
//       state.user = action.payload;
//       state.role = action.payload?.role || null;
//     },
//     setCredentials: (state, action) => {
//       state.accessToken = action.payload.accessToken;
//       state.user = action.payload.user;
//       state.role = action.payload.user?.role || null;
//       localStorage.setItem("accessToken", action.payload.accessToken);
//     },
//     logout: (state) => {
//       state.accessToken = null;
//       state.user = null;
//       state.role = null;
//       localStorage.removeItem("accessToken");
//     },
//   },
// });

// export const { setCredentials, setUser, logout } = authSlice.actions;
// export default authSlice.reducer;
