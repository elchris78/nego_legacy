import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createEmpaquesSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
