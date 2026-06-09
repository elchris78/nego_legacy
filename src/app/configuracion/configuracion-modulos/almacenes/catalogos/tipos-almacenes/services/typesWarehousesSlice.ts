 import { PayloadAction } from "@reduxjs/toolkit";
 
 import { createTypesWarehousesSlice } from "./createSlices";  
 import {
   createTypesWarehouses,
   getTypesWarehouses,
   updateTypesWarehouses, 
   deleteTypesWarehouses,
   getTypesWarehousesById,
   toggleTypesWarehousesStatus,
   importTypesWarehouses
 } from "./typesWarehousesAction"
 
 import type {
   TypesWarehouses,
   TypesWarehousesParams,
   GetTypesWarehousesResponse,
   GetTypesWarehouseResponse,
 } from "./typesWarehousesTypes";
 
 interface TypesWarehousesState {
   typesWarehouses: TypesWarehouses[] | null;
   currentTypesWarehouses: TypesWarehouses | null;
   loading: boolean;
   error: string | null;
   totalRegistros: number;
 }
 
 const initialState: TypesWarehousesState = {
   typesWarehouses: null,
   currentTypesWarehouses: null,
   loading: false,
   error: null,
   totalRegistros: 0,
 };
 
 const typesWarehousesSlice = createTypesWarehousesSlice({
   name: "typesWarehouses",
   initialState,
   reducers: (createRx) => ({
     setTypesWarehouses: createRx.reducer(
       (state, action: PayloadAction<GetTypesWarehousesResponse>) => {
         state.typesWarehouses = action.payload.tiposAlmacen;
         state.totalRegistros = action.payload.totalRegistros;
       }
     ),
     setCurrentTypesWarehouses: createRx.reducer(
       (state, action: PayloadAction<GetTypesWarehouseResponse>) => {
         state.currentTypesWarehouses = action.payload.tipoAlmacen;
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
       state.typesWarehouses = null;
       state.currentTypesWarehouses = null;
       state.loading = false;
       state.error = null;
       state.totalRegistros = 0;
     }),
     getTypesWarehouses: createRx.asyncThunk(
       async (
         { token, params }: { token: string | undefined; params?: TypesWarehousesParams },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(typesWarehousesSlice.actions.setLoading(true));
         try {
           const estatus = await getTypesWarehouses({ token, params });
           dispatch(typesWarehousesSlice.actions.setTypesWarehouses(estatus));
           return estatus;
         } catch (error: any) {
           dispatch(typesWarehousesSlice.actions.setError(error.message));
           return rejectWithValue({
             message: error?.message || "Error al obtener estatus",
             stack: error?.stack,
           })
         } finally {
           dispatch(typesWarehousesSlice.actions.setLoading(false));
         }
       }
     ),
     createTypesWarehouses: createRx.asyncThunk(
       async (
         { token, estatus }: { token: string; estatus: TypesWarehouses },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(typesWarehousesSlice.actions.setLoading(true));
         try {
           const response = await createTypesWarehouses({ token, body: estatus });
           return response;
         } catch (error: any) {
           dispatch(typesWarehousesSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(typesWarehousesSlice.actions.setLoading(false));
         }
       }
     ),
     updateTypesWarehouses: createRx.asyncThunk(
       async (
         { token, id, estatus }: { token: string; id: string; estatus: TypesWarehouses },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(typesWarehousesSlice.actions.setLoading(true));
         try {
           const response = await updateTypesWarehouses({ token, id, body: estatus });
           return response;
         } catch (error: any) {
           dispatch(typesWarehousesSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(typesWarehousesSlice.actions.setLoading(false));
         }
       }
     ),
     deleteTypesWarehouses: createRx.asyncThunk(
       async (
         { token, id }: { token: string; id: string },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(typesWarehousesSlice.actions.setLoading(true));
         try {
           const response = await deleteTypesWarehouses({ token, id });
           await dispatch(typesWarehousesSlice.actions.getTypesWarehouses({ token })); // Refresh TypesWarehouses list
           return response;
         } catch (error: any) {
           dispatch(typesWarehousesSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(typesWarehousesSlice.actions.setLoading(false));
         }
       }
     ),
     getTypesWarehousesById: createRx.asyncThunk(
       async (
         { token, id }: { token: string; id: string },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(typesWarehousesSlice.actions.setLoading(true));
         try {
           const response = await getTypesWarehousesById({ token, id });
           dispatch(typesWarehousesSlice.actions.setCurrentTypesWarehouses(response));
           return response;
         } catch (error: any) {
           dispatch(typesWarehousesSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(typesWarehousesSlice.actions.setLoading(false));
         }
       }
     ),
     toggleTypesWarehousesStatus: createRx.asyncThunk(
       async (
         { token, id, isActive }: { token: string; id: string, isActive: boolean },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(typesWarehousesSlice.actions.setLoading(true));
         try {
           const response = await toggleTypesWarehousesStatus({ token, id, isActive  });
           await dispatch(typesWarehousesSlice.actions.getTypesWarehouses({ token })); // Refresh estatus list
           return response;
         } catch (error: any) {
           dispatch(typesWarehousesSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(typesWarehousesSlice.actions.setLoading(false));
         }
       }
     ),
     importTypesWarehouses: createRx.asyncThunk(
       async (
         { token, file }: { token: string | undefined; file: File },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(typesWarehousesSlice.actions.setLoading(true));
         try {
           const response = await importTypesWarehouses({ token, file });
           await dispatch(typesWarehousesSlice.actions.getTypesWarehouses({ token, params: {} }));
           return response;
         } catch (error: any) {
           dispatch(typesWarehousesSlice.actions.setError(error.message || "Error al importar"));
           return rejectWithValue(error);
         } finally {
           dispatch(typesWarehousesSlice.actions.setLoading(false));
         }
       }
     ),
   }),
   selectors: {
     selectTypesWarehouses: (state: TypesWarehousesState) => state.typesWarehouses,
     selectLoading: (state: TypesWarehousesState) => state.loading,
     selectError: (state: TypesWarehousesState) => state.error,
     selectTotalRegistros: (state:TypesWarehousesState) => state.totalRegistros,
   },
 });
 
 export const { actions: typesWarehousesActions, reducer: TypesWarehousesReducer } = typesWarehousesSlice;
 