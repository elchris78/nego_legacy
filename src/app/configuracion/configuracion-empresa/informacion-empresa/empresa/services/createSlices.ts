import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createEmpresaSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
