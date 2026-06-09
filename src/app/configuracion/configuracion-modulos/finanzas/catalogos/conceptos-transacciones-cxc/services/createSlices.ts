import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createTransaccionesDXCSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
