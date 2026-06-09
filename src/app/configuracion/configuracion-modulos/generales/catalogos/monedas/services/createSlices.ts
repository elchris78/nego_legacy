import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createMonedasSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
