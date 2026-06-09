import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createTiposContratosBSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
