import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createClaimsSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
