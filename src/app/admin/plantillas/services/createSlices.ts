import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createPlantillasSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
