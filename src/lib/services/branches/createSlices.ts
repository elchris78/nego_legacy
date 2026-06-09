import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createBranchesSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
