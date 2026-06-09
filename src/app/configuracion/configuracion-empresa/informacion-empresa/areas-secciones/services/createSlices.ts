import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createAreasSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
