 import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
 
 export const createEstatusProdSlice = buildCreateSlice({
   creators: { asyncThunk: asyncThunkCreator },
 });