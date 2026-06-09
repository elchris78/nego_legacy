import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createAttributeValueSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
