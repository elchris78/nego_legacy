import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createConfigSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
