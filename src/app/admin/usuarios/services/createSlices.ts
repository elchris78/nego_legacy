import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createUsersSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
