import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createPlantillasComppanySlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
