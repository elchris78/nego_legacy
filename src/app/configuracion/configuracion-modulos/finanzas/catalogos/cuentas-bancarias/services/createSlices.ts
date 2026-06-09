import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createCuentaBancariaSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
