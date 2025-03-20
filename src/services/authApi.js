import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + '/auth',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken || localStorage.getItem('accessToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getProfile: builder.query({
      query: () => '/profile',
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useLoginMutation, useGetProfileQuery } = authApi;



// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { setUser, setCredentials, logout } from '../redux/authSlice';

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// const baseQuery = fetchBaseQuery({
//   baseUrl: BASE_URL + '/auth',
//   prepareHeaders: (headers, { getState }) => {
//     const token = localStorage.getItem('accessToken') || getState().auth.accessToken;
//     // console.log("sending token: ", token);
//     if (token) {
//       headers.set('Authorization', `Bearer ${token}`);
//     }
//     // console.log("headers: ", headers);
//     return headers;
//   },
// });

// const baseQueryWithReauth = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);
  
//   if (result.error && result.error.status === 401) {
//     const refreshToken = localStorage.getItem('refreshToken');
//     if (refreshToken) {
//       const refreshResult = await baseQuery(
//         { url: '/refresh', method: 'POST', body: { refreshToken } },
//         api,
//         extraOptions
//       );

//       if (refreshResult.data) {
//         api.dispatch(setCredentials(refreshResult.data));
//         result = await baseQuery(args, api, extraOptions);
//       } else {
//         api.dispatch(logout());
//       }
//     } else {
//       api.dispatch(logout());
//     }
//   }
//   return result;
// };

// export const authApi = createApi({
//   reducerPath: 'authApi',
//   baseQuery: baseQueryWithReauth,
//   endpoints: (builder) => ({
//     login: builder.mutation({
//       query: (credentials) => ({
//         url: '/login',
//         method: 'POST',
//         body: credentials,
//       }),
//     }),
//     // getProfile: builder.query({
//     //   query: () => '/profile',
//     // }),
//     getProfile: builder.query({
//       query: () => '/profile',
//       keepUnusedDataFor: 0,
//       async onQueryStarted(_, { dispatch, queryFulfilled }) {
//         try {
//           const { data } = await queryFulfilled;
//           dispatch(setUser(data)); // Lưu thông tin người dùng vào Redux
//         } catch (error) {
//           console.error('Lỗi khi lấy profile:', error);
//         }
//       },
//     }),
//   }), 
// });

// export const { useLoginMutation, useGetProfileQuery } = authApi;
