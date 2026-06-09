 import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
 
 export const createTiposAlmacenajeSlice = buildCreateSlice({
   creators: { asyncThunk: asyncThunkCreator },
 });