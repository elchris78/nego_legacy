import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createFabricantesSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
