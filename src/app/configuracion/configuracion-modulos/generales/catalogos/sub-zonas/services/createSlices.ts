import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createSubZonasSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
