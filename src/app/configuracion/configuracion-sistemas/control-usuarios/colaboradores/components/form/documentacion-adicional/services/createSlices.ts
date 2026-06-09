import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createColaboradorDocumentacionSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
