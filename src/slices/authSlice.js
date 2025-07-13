import { createSlice } from "@reduxjs/toolkit";

function getTokenFromStorage() {
  const raw = localStorage.getItem("token");
  if (!raw) return null;
  try {
    // Try to parse as JSON
    return JSON.parse(raw);
  } catch {
    // Fallback to plain string
    return raw;
  }
}

const initialState = {
  signupData: null,
  loading: false,
  token: getTokenFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;