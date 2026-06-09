import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createConceptosCancelSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
