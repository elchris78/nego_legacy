import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createClientClassificationSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
