 import { PayloadAction } from "@reduxjs/toolkit";
 
 import { createTiposAlmacenajeSlice } from "./createSlices";  
 import {
   createTiposAlmacenaje,
   getTiposAlmacenaje,
   updateTiposAlmacenaje, 
   deleteTiposAlmacenaje,
   getTipoAlmacenajeById,
   toggleTiposAlmacenajeStatus,
   importTiposAlmacenaje
 } from "./tipoAlmacenajeAction"
 
 import type {
   TipoAlmacenaje,
   TipoAlmacenajeParams,
   GetTiposAlmacenajeResponse,
   GetTipoAlmacenajeResponse,
 } from "./tipoAlmacenaje";
 
 interface TipoAlmacenajeState {
   tipoAlmacenaje: TipoAlmacenaje[] | null;
   currentTipoAlmacenaje: TipoAlmacenaje | null;
   loading: boolean;
   error: string | null;
   totalRegistros: number;
 }
 
 const initialState: TipoAlmacenajeState = {
   tipoAlmacenaje: null,
   currentTipoAlmacenaje: null,
   loading: false,
   error: null,
   totalRegistros: 0,
 };
 
 const tipoAlmacenajeSlice = createTiposAlmacenajeSlice({
   name: "TipoAlmacenaje",
   initialState,
   reducers: (createRx) => ({
     setTipoAlmacenaje: createRx.reducer(
       (state, action: PayloadAction<GetTiposAlmacenajeResponse>) => {
         state.tipoAlmacenaje = action.payload.tipoAlmacenajes;
         state.totalRegistros = action.payload.totalRegistros;
       }
     ),
     setCurrentTipoAlmacenaje: createRx.reducer(
       (state, action: PayloadAction<GetTipoAlmacenajeResponse>) => {
         state.currentTipoAlmacenaje = action.payload.tipoAlmacenaje;
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
       state.tipoAlmacenaje = null;
       state.currentTipoAlmacenaje = null;
       state.loading = false;
       state.error = null;
       state.totalRegistros = 0;
     }),
     getTipoAlmacenaje: createRx.asyncThunk(
       async (
         { token, params }: { token: string | undefined; params?: TipoAlmacenajeParams },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(tipoAlmacenajeSlice.actions.setLoading(true));
         try {
           const estatus = await getTiposAlmacenaje({ token, params });
           dispatch(tipoAlmacenajeSlice.actions.setTipoAlmacenaje(estatus));
           return estatus;
         } catch (error: any) {
           dispatch(tipoAlmacenajeSlice.actions.setError(error.message));
           return rejectWithValue({
             message: error?.message || "Error al obtener estatus",
             stack: error?.stack,
           })
         } finally {
           dispatch(tipoAlmacenajeSlice.actions.setLoading(false));
         }
       }
     ),
     createTipoAlmacenaje: createRx.asyncThunk(
       async (
         { token, estatus }: { token: string; estatus: TipoAlmacenaje },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(tipoAlmacenajeSlice.actions.setLoading(true));
         try {
           const response = await createTiposAlmacenaje({ token, body: estatus });
           return response;
         } catch (error: any) {
           dispatch(tipoAlmacenajeSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(tipoAlmacenajeSlice.actions.setLoading(false));
         }
       }
     ),
     updateTipoAlmacenaje: createRx.asyncThunk(
       async (
         { token, id, estatus }: { token: string; id: string; estatus: TipoAlmacenaje },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(tipoAlmacenajeSlice.actions.setLoading(true));
         try {
           const response = await updateTiposAlmacenaje({ token, id, body: estatus });
           return response;
         } catch (error: any) {
           dispatch(tipoAlmacenajeSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(tipoAlmacenajeSlice.actions.setLoading(false));
         }
       }
     ),
     deleteTipoAlmacenaje: createRx.asyncThunk(
       async (
         { token, id }: { token: string; id: string },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(tipoAlmacenajeSlice.actions.setLoading(true));
         try {
           const response = await deleteTiposAlmacenaje({ token, id });
           await dispatch(tipoAlmacenajeSlice.actions.getTipoAlmacenaje({ token })); // Refresh TipoAlmacenaje list
           return response;
         } catch (error: any) {
           dispatch(tipoAlmacenajeSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(tipoAlmacenajeSlice.actions.setLoading(false));
         }
       }
     ),
     getTipoAlmacenajeById: createRx.asyncThunk(
       async (
         { token, id }: { token: string; id: string },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(tipoAlmacenajeSlice.actions.setLoading(true));
         try {
           const response = await getTipoAlmacenajeById({ token, id });
           dispatch(tipoAlmacenajeSlice.actions.setCurrentTipoAlmacenaje(response));
           return response;
         } catch (error: any) {
           dispatch(tipoAlmacenajeSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(tipoAlmacenajeSlice.actions.setLoading(false));
         }
       }
     ),
     toggleTipoAlmacenajeStatus: createRx.asyncThunk(
       async (
         { token, id, isActive }: { token: string; id: string, isActive: boolean },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(tipoAlmacenajeSlice.actions.setLoading(true));
         try {
           const response = await toggleTiposAlmacenajeStatus({ token, id, isActive  });
           await dispatch(tipoAlmacenajeSlice.actions.getTipoAlmacenaje({ token })); // Refresh estatus list
           return response;
         } catch (error: any) {
           dispatch(tipoAlmacenajeSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(tipoAlmacenajeSlice.actions.setLoading(false));
         }
       }
     ),
     importTipoAlmacenaje: createRx.asyncThunk(
       async (
         { token, file }: { token: string | undefined; file: File },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(tipoAlmacenajeSlice.actions.setLoading(true));
         try {
           const response = await importTiposAlmacenaje({ token, file });
           await dispatch(tipoAlmacenajeSlice.actions.getTipoAlmacenaje({ token, params: {} }));
           return response;
         } catch (error: any) {
           dispatch(tipoAlmacenajeSlice.actions.setError(error.message || "Error al importar"));
           return rejectWithValue(error);
         } finally {
           dispatch(tipoAlmacenajeSlice.actions.setLoading(false));
         }
       }
     ),
   }),
   selectors: {
     selectTipoAlmacenaje: (state: TipoAlmacenajeState) => state.tipoAlmacenaje,
     selectLoading: (state: TipoAlmacenajeState) => state.loading,
     selectError: (state: TipoAlmacenajeState) => state.error,
     selectTotalRegistros: (state:TipoAlmacenajeState) => state.totalRegistros,
   },
 });
 
 export const { actions: tipoAlmacenajeActions, reducer: TipoAlmacenajeReducer } = tipoAlmacenajeSlice;
 