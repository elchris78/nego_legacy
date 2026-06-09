 import { PayloadAction } from "@reduxjs/toolkit";
 
 import { createPresentacionesSlice } from "./createSlices";  
 import {
   createPresentaciones,
   getPresentaciones,
   updatePresentaciones, 
   deletePresentaciones,
   getPresentacionesById,
   togglePresentacionesStatus,
   importPresentaciones
 } from "./presentacionesAction"
 
 import type {
   Presentaciones,
   PresentacionesParams,
   GetPresentacionesResponse,
   GetPresentacionResponse,
 } from "./presentacionesTypes";
 
 interface PresentacionesState {
   presentaciones: Presentaciones[] | null;
   currentPresentaciones: Presentaciones | null;
   loading: boolean;
   error: string | null;
   totalRegistros: number;
 }
 
 const initialState: PresentacionesState = {
   presentaciones: null,
   currentPresentaciones: null,
   loading: false,
   error: null,
   totalRegistros: 0,
 };
 
 const presentacionesSlice = createPresentacionesSlice({
   name: "Presentaciones",
   initialState,
   reducers: (createRx) => ({
     setPresentaciones: createRx.reducer(
       (state, action: PayloadAction<GetPresentacionesResponse>) => {
         state.presentaciones = action.payload.presentaciones;
         state.totalRegistros = action.payload.totalRegistros;
       }
     ),
     setCurrentPresentaciones: createRx.reducer(
       (state, action: PayloadAction<GetPresentacionResponse>) => {
         state.currentPresentaciones = action.payload.presentacion;
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
       state.presentaciones = null;
       state.currentPresentaciones = null;
       state.loading = false;
       state.error = null;
       state.totalRegistros = 0;
     }),
     getPresentaciones: createRx.asyncThunk(
       async (
         { token, params }: { token: string | undefined; params?: PresentacionesParams },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(presentacionesSlice.actions.setLoading(true));
         try {
           const estatus = await getPresentaciones({ token, params });
           dispatch(presentacionesSlice.actions.setPresentaciones(estatus));
           return estatus;
         } catch (error: any) {
           dispatch(presentacionesSlice.actions.setError(error.message));
           return rejectWithValue({
             message: error?.message || "Error al obtener estatus",
             stack: error?.stack,
           })
         } finally {
           dispatch(presentacionesSlice.actions.setLoading(false));
         }
       }
     ),
     createPrestaciones: createRx.asyncThunk(
       async (
         { token, estatus }: { token: string; estatus: Presentaciones },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(presentacionesSlice.actions.setLoading(true));
         try {
           const response = await createPresentaciones({ token, body: estatus });
           return response;
         } catch (error: any) {
           dispatch(presentacionesSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(presentacionesSlice.actions.setLoading(false));
         }
       }
     ),
     updatePrestaciones: createRx.asyncThunk(
       async (
         { token, id, estatus }: { token: string; id: string; estatus: Presentaciones },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(presentacionesSlice.actions.setLoading(true));
         try {
           const response = await updatePresentaciones({ token, id, body: estatus });
           return response;
         } catch (error: any) {
           dispatch(presentacionesSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(presentacionesSlice.actions.setLoading(false));
         }
       }
     ),
     deletePrestaciones: createRx.asyncThunk(
       async (
         { token, id }: { token: string; id: string },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(presentacionesSlice.actions.setLoading(true));
         try {
           const response = await deletePresentaciones({ token, id });
           await dispatch(presentacionesSlice.actions.getPresentaciones({ token })); // Refresh EstatusProd list
           return response;
         } catch (error: any) {
           dispatch(presentacionesSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(presentacionesSlice.actions.setLoading(false));
         }
       }
     ),
     getPrestacionesById: createRx.asyncThunk(
       async (
         { token, id }: { token: string; id: string },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(presentacionesSlice.actions.setLoading(true));
         try {
           const response = await getPresentacionesById({ token, id });
           dispatch(presentacionesSlice.actions.setCurrentPresentaciones(response));
           return response;
         } catch (error: any) {
           dispatch(presentacionesSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(presentacionesSlice.actions.setLoading(false));
         }
       }
     ),
     togglePrestacionesStatus: createRx.asyncThunk(
       async (
         { token, id, isActive }: { token: string; id: string, isActive: boolean },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(presentacionesSlice.actions.setLoading(true));
         try {
           const response = await togglePresentacionesStatus({ token, id, isActive  });
           await dispatch(presentacionesSlice.actions.getPresentaciones({ token })); // Refresh estatus list
           return response;
         } catch (error: any) {
           dispatch(presentacionesSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(presentacionesSlice.actions.setLoading(false));
         }
       }
     ),
     importPresentaciones: createRx.asyncThunk(
       async (
         { token, file }: { token: string | undefined; file: File },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(presentacionesSlice.actions.setLoading(true));
         try {
           const response = await importPresentaciones({ token, file });
           await dispatch(presentacionesSlice.actions.getPresentaciones({ token, params: {} }));
           return response;
         } catch (error: any) {
           dispatch(presentacionesSlice.actions.setError(error.message || "Error al importar"));
           return rejectWithValue(error);
         } finally {
           dispatch(presentacionesSlice.actions.setLoading(false));
         }
       }
     ),
   }),
   selectors: {
     selectPresentaciones: (state: PresentacionesState) => state.presentaciones,
     selectLoading: (state: PresentacionesState) => state.loading,
     selectError: (state: PresentacionesState) => state.error,
     selectTotalRegistros: (state: PresentacionesState) => state.totalRegistros,
   },
 });
 
 export const { actions: presentacionesActions, reducer: PresentacionesReducer } = presentacionesSlice;
 