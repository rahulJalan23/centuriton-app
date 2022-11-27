import { configureStore } from "@reduxjs/toolkit";
import detailsSlice from "./detailsReducer";
import authSlice from "./authReducer";
import selectionSlice from "./selectionReducer";

const reducer = {
  details: detailsSlice,
  auth: authSlice,
  selection: selectionSlice,
};

const store = configureStore({
  reducer: reducer,
});

export default store;
