import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createSellersSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
