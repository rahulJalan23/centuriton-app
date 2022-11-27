import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  housesCount: null,
  houses: [],
  clustersCount: null,
  clusters: [],
};

const detailsSlice = createSlice({
  name: "detailsSlice",
  initialState,
  reducers: {
    storeHouseCount(state, { payload }) {
      state.housesCount = payload;
    },
    storeClusterCount(state, { payload }) {
      state.clustersCount = payload;
    },
  },
});

export const { storeHouseCount, storeClusterCount } = detailsSlice.actions;

export default detailsSlice.reducer;
