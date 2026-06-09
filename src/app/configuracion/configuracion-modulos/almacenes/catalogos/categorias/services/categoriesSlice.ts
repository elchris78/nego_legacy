 import { PayloadAction } from "@reduxjs/toolkit";
 
 import { createCategoriesSlice } from "./createSlices";  
 import {
   createCategories,
   getCategories,
   updateCategories, 
   deleteCategories,
   getCategoriesById,
   toggleCategoriesStatus,
   importCategories,
   createSubCategories
 } from "./categoriesAction"
 
 import type {
   Categories,
   CategoriesParams,
   GetCategoriesResponse,
   GetCategorieResponse,
 } from "./categoriesTypes";
 
 interface CategoriesState {
   categories: Categories[] | null;
   currentCategories: Categories | null;
   loading: boolean;
   error: string | null;
   totalRegistros: number;
 }
 
 const initialState: CategoriesState = {
   categories: null,
   currentCategories: null,
   loading: false,
   error: null,
   totalRegistros: 0,
 };
 
 const categoriesSlice = createCategoriesSlice({
   name: "Categories",
   initialState,
   reducers: (createRx) => ({
     setCategories: createRx.reducer(
       (state, action: PayloadAction<GetCategoriesResponse>) => {
         state.categories = action.payload.categorias;
         state.totalRegistros = action.payload.totalRegistros;
       }
     ),
     setCurrentCategories: createRx.reducer(
       (state, action: PayloadAction<GetCategorieResponse>) => {
         state.currentCategories = action.payload.categoria;
       }
     ),
     setLoading: createRx.reducer((state, action: PayloadAction<boolean>) => {
       state.loading = action.payload;
     }),
     setError: createRx.reducer(
       (state, action: PayloadAction<string | null>) => {
         state.error = action.payload;
       }
     ),
     flushAll: createRx.reducer((state) => {
       state.categories = null;
       state.currentCategories = null;
       state.loading = false;
       state.error = null;
       state.totalRegistros = 0;
     }),
     getCategories: createRx.asyncThunk(
       async (
         { token, params 

         }: { 
          token: string | undefined; 
          params: CategoriesParams 
        },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(categoriesSlice.actions.setLoading(true));
         try {
           const response = await getCategories({ token, params });
           dispatch(categoriesSlice.actions.setCategories(response));
           return response;
         } catch (error: any) {
           dispatch(categoriesSlice.actions.setError(error.message));
           return rejectWithValue({
             message: error?.message || "Error al obtener response",
             stack: error?.stack,
           })
         } finally {
           dispatch(categoriesSlice.actions.setLoading(false));
         }
       }
     ),
     createCategories: createRx.asyncThunk(
       async (
         { token, estatus }: { token: string; estatus: Categories },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(categoriesSlice.actions.setLoading(true));
         try {
           const response = await createCategories({ token, body: estatus });
           return response;
         } catch (error: any) {
           dispatch(categoriesSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(categoriesSlice.actions.setLoading(false));
         }
       }
     ),
      createSubCategories: createRx.asyncThunk(
       async (
         { token, parentId, estatus }: { token: string; parentId: string; estatus: Categories },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(categoriesSlice.actions.setLoading(true));
         try {
           const response = await createSubCategories({ token, parentId, body: estatus });
           return response;
         } catch (error: any) {
           dispatch(categoriesSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(categoriesSlice.actions.setLoading(false));
         }
       }
     ),
     updateCategories: createRx.asyncThunk(
       async (
         { token, id, estatus }: { token: string; id: string; estatus: Categories },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(categoriesSlice.actions.setLoading(true));
         try {
           const response = await updateCategories({ token, id, body: estatus });
           return response;
         } catch (error: any) {
           dispatch(categoriesSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(categoriesSlice.actions.setLoading(false));
         }
       }
     ),
     deleteCategories: createRx.asyncThunk(
       async (
         { token, id }: { token: string | undefined; id: string },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(categoriesSlice.actions.setLoading(true));
         try {
           const response = await deleteCategories({ token, id });
           await dispatch(categoriesSlice.actions.getCategories({ token, params: {
                page: 1,
                size: 10,
              }, })); // Refresh EstatusProd list
           return response;
         } catch (error: any) {
           dispatch(categoriesSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(categoriesSlice.actions.setLoading(false));
         }
       }
     ),
     getCategoriesById: createRx.asyncThunk(
       async (
         { token, id }: { token: string; id: string },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(categoriesSlice.actions.setLoading(true));
         try {
           const response = await getCategoriesById({ token, id });
           dispatch(categoriesSlice.actions.setCurrentCategories(response));
           return response;
         } catch (error: any) {
           dispatch(categoriesSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(categoriesSlice.actions.setLoading(false));
         }
       }
     ),
     toggleCategoriesStatus: createRx.asyncThunk(
        async (
          { token, id, isActive, activateSubcategories }: { token: string; id: string; isActive: boolean; activateSubcategories: boolean },
          { dispatch, rejectWithValue }
        ) => {
          dispatch(categoriesSlice.actions.setLoading(true));
          try {
            const response = await toggleCategoriesStatus({ token, id, isActive, activateSubcategories });
            await dispatch(categoriesSlice.actions.getCategories({ token, params: { page: 1, size: 10 } }));
            return response;
          } catch (error: any) {
            dispatch(categoriesSlice.actions.setError(error.message));
            return rejectWithValue(error.message);
          } finally {
            dispatch(categoriesSlice.actions.setLoading(false));
          }
        }
      ),
     importCategories: createRx.asyncThunk(
       async (
         { token, file }: { token: string | undefined; file: File },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(categoriesSlice.actions.setLoading(true));
         try {
           const response = await importCategories({ token, file });
           await dispatch(categoriesSlice.actions.getCategories({ token, params: {} }));
           return response;
         } catch (error: any) {
           dispatch(categoriesSlice.actions.setError(error.message || "Error al importar"));
           return rejectWithValue(error);
         } finally {
           dispatch(categoriesSlice.actions.setLoading(false));
         }
       }
     ),
   }),
   selectors: {
     selectCategories: (state: CategoriesState) => state.categories,
     selectLoading: (state: CategoriesState) => state.loading,
     selectError: (state: CategoriesState) => state.error,
     selectTotalRegistros: (state: CategoriesState) => state.totalRegistros,
   },
 });
 
 export const { actions: CategoriesActions, reducer: CategoriesReducer } = categoriesSlice;
