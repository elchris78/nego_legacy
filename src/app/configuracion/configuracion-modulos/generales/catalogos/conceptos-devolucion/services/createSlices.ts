import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createReturnConceptSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
