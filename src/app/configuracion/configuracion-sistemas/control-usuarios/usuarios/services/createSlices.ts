import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createCompanyUsersSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
