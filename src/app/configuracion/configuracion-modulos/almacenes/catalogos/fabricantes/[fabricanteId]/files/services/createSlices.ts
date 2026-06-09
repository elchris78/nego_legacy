import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createFabricantesDocumentosSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
