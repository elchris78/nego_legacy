import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createZonasSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
