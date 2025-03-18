export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.accessToken;
export const selectCurrentRole = (state) => state.auth?.role || null;

export const selectIsAuthenticated = (state) => !!state.auth.accessToken;