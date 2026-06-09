 import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
 
 export const createTypesWarehousesSlice = buildCreateSlice({
   creators: { asyncThunk: asyncThunkCreator },
 });