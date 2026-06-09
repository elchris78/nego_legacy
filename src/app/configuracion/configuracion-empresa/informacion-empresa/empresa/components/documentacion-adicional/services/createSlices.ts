import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createEmpresaDocumentacionSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
