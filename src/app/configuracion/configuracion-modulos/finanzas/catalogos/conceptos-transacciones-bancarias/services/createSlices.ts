import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createConceptosTransaccionesBancariasSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
