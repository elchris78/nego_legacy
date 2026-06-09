import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const catalogSatCreateSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
