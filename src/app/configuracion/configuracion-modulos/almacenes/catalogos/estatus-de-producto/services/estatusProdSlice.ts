 import { PayloadAction } from "@reduxjs/toolkit";
 
 import { createEstatusProdSlice } from "./createSlices";  
 import {
   createEstatusProd,
   getEstatusProd,
   updateEstatusProd, 
   deleteEstatusProd,
   getEstatusProdById,
   toggleEstatusProdStatus,
   importEstatusProd
 } from "./estatusProdAction"
 
 import type {
   Estatus,
   EstatusProdParams,
   GetEstatusResponse,
   GetEstatuResponse,
 } from "./estatusProdTypes";
 
 interface EstatusState {
   estatusProd: Estatus[] | null;
   currentEstatusProd: Estatus | null;
   loading: boolean;
   error: string | null;
   totalRegistros: number;
 }
 
 const initialState: EstatusState = {
   estatusProd: null,
   currentEstatusProd: null,
   loading: false,
   error: null,
   totalRegistros: 0,
 };
 
 const estatusProdSlice = createEstatusProdSlice({
   name: "estatusProd",
   initialState,
   reducers: (createRx) => ({
     setEstatusProd: createRx.reducer(
       (state, action: PayloadAction<GetEstatusResponse>) => {
         state.estatusProd = action.payload.estatusProductos;
         state.totalRegistros = action.payload.totalRegistros;
       }
     ),
     setCurrentEstatusProd: createRx.reducer(
       (state, action: PayloadAction<GetEstatuResponse>) => {
         state.currentEstatusProd = action.payload.estatusProducto;
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
       state.estatusProd = null;
       state.currentEstatusProd = null;
       state.loading = false;
       state.error = null;
       state.totalRegistros = 0;
     }),
     getEstatusProd: createRx.asyncThunk(
       async (
         { token, params }: { token: string | undefined; params?: EstatusProdParams },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(estatusProdSlice.actions.setLoading(true));
         try {
           const estatus = await getEstatusProd({ token, params });
           dispatch(estatusProdSlice.actions.setEstatusProd(estatus));
           return estatus;
         } catch (error: any) {
           dispatch(estatusProdSlice.actions.setError(error.message));
           return rejectWithValue({
             message: error?.message || "Error al obtener estatus",
             stack: error?.stack,
           })
         } finally {
           dispatch(estatusProdSlice.actions.setLoading(false));
         }
       }
     ),
     createEstatusProd: createRx.asyncThunk(
       async (
         { token, estatus }: { token: string; estatus: Estatus },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(estatusProdSlice.actions.setLoading(true));
         try {
           const response = await createEstatusProd({ token, body: estatus });
           return response;
         } catch (error: any) {
           dispatch(estatusProdSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(estatusProdSlice.actions.setLoading(false));
         }
       }
     ),
     updateEstatusProd: createRx.asyncThunk(
       async (
         { token, id, estatus }: { token: string; id: string; estatus: Estatus },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(estatusProdSlice.actions.setLoading(true));
         try {
           const response = await updateEstatusProd({ token, id, body: estatus });
           return response;
         } catch (error: any) {
           dispatch(estatusProdSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(estatusProdSlice.actions.setLoading(false));
         }
       }
     ),
     deleteEstatusProd: createRx.asyncThunk(
       async (
         { token, id }: { token: string; id: string },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(estatusProdSlice.actions.setLoading(true));
         try {
           const response = await deleteEstatusProd({ token, id });
           await dispatch(estatusProdSlice.actions.getEstatusProd({ token })); // Refresh EstatusProd list
           return response;
         } catch (error: any) {
           dispatch(estatusProdSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(estatusProdSlice.actions.setLoading(false));
         }
       }
     ),
     getEstatusProdById: createRx.asyncThunk(
       async (
         { token, id }: { token: string; id: string },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(estatusProdSlice.actions.setLoading(true));
         try {
           const response = await getEstatusProdById({ token, id });
           dispatch(estatusProdSlice.actions.setCurrentEstatusProd(response));
           return response;
         } catch (error: any) {
           dispatch(estatusProdSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(estatusProdSlice.actions.setLoading(false));
         }
       }
     ),
     toggleEstatusProdStatus: createRx.asyncThunk(
       async (
         { token, id, isActive }: { token: string; id: string, isActive: boolean },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(estatusProdSlice.actions.setLoading(true));
         try {
           const response = await toggleEstatusProdStatus({ token, id, isActive  });
           await dispatch(estatusProdSlice.actions.getEstatusProd({ token })); // Refresh estatus list
           return response;
         } catch (error: any) {
           dispatch(estatusProdSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(estatusProdSlice.actions.setLoading(false));
         }
       }
     ),
     importEstatusProd: createRx.asyncThunk(
       async (
         { token, file }: { token: string | undefined; file: File },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(estatusProdSlice.actions.setLoading(true));
         try {
           const response = await importEstatusProd({ token, file });
           await dispatch(estatusProdSlice.actions.getEstatusProd({ token, params: {} }));
           return response;
         } catch (error: any) {
           dispatch(estatusProdSlice.actions.setError(error.message || "Error al importar"));
           return rejectWithValue(error);
         } finally {
           dispatch(estatusProdSlice.actions.setLoading(false));
         }
       }
     ),
   }),
   selectors: {
     selectEstatusProd: (state: EstatusState) => state.estatusProd,
     selectLoading: (state: EstatusState) => state.loading,
     selectError: (state: EstatusState) => state.error,
     selectTotalRegistros: (state: EstatusState) => state.totalRegistros,
   },
 });
 
 export const { actions: estatusProdActions, reducer: EstatusProdReducer } = estatusProdSlice;
 