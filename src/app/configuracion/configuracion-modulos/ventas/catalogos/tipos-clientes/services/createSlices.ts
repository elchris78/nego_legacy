import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createClientTypesSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
