import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createSucursalesSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
