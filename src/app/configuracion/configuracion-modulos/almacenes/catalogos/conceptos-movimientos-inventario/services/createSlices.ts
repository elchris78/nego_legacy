import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createMovimientosInventarioSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
