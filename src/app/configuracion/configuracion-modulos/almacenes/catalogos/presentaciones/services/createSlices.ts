 import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
 
 export const createPresentacionesSlice = buildCreateSlice({
   creators: { asyncThunk: asyncThunkCreator },
 });