import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatOpen: false,
};

const selectionReducer = createSlice({
  name: "selectionReducer",
  initialState,
  reducers: {
    setChatOpen(state, { payload }) {
      state.chatOpen = payload;
    },
  },
});

export const { setChatOpen } = selectionReducer.actions;

export default selectionReducer.reducer;
