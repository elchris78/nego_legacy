import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createKeyConfigurationSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
