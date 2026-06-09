 import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
 
 export const createMarcasSlice = buildCreateSlice({
   creators: { asyncThunk: asyncThunkCreator },
 });