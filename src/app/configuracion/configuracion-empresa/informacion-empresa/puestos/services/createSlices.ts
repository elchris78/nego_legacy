import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createPuestosSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
