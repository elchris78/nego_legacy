import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createColaboradoresSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
