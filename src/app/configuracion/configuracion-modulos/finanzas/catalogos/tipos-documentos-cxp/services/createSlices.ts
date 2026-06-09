import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createCXPSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
