import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createAttributeSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
