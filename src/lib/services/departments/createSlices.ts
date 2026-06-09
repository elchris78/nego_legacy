import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createDepartmentsSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
