import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createUserActivitySlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
