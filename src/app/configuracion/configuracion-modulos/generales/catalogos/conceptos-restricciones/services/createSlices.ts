import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createRestrictionConceptSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
