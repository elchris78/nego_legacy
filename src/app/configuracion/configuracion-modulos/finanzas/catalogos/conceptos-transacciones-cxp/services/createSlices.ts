import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createTransaccionesDXPSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
