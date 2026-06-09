import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createClientSubclassificationSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
