import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  token: null,
  userLocation: null,
  isFirstTime: false,
};

const authReducer = createSlice({
  name: "authReducer",
  initialState,
  reducers: {
    storeFirstTimeState(state, { payload }) {
      // AsyncStorage.setItem("isFirstTime", String(payload));
      state.isFirstTime = Boolean(payload);
    },
    storeToken(state, { payload }) {
      AsyncStorage.setItem("token", payload);
      state.token = payload;
    },
    logout(state, { payload }) {
      AsyncStorage.removeItem("token");
      state.token = null;
    },
  },
});

export const { storeToken, logout, storeFirstTimeState } = authReducer.actions;

export default authReducer.reducer;
