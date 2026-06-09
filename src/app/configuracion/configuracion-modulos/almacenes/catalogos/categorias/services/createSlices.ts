 import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
 
 export const createCategoriesSlice = buildCreateSlice({
   creators: { asyncThunk: asyncThunkCreator },
 });