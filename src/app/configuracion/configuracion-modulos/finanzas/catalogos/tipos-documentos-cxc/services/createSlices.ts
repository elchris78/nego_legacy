import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createCXCSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
