import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createSellersTypesSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
