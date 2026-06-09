 import { PayloadAction } from "@reduxjs/toolkit";
 
 import { createMarcasSlice } from "./createSlices";  
 import {
   createMarcas,
   getMarcas,
   updateMarcas, 
   deleteMarcas,
   getMarcasById,
   toggleMarcasStatus,
   importMarcas
 } from "./MarcaAction"
 
 import type {
   Marcas,
   MarcasParams,
   GetMarcasResponse,
   GetMarcaResponse,
 } from "./MarcasTypes";
 
 interface MarcasState {
   marcas: Marcas[] | null;
   currentMarcas: Marcas | null;
   loading: boolean;
   error: string | null;
   totalRegistros: number;
 }
 
 const initialState: MarcasState = {
   marcas: null,
   currentMarcas: null,
   loading: false,
   error: null,
   totalRegistros: 0,
 };
 
 const marcasSlice = createMarcasSlice({
   name: "Marcas",
   initialState,
   reducers: (createRx) => ({
     setMarcas: createRx.reducer(
       (state, action: PayloadAction<GetMarcasResponse>) => {
         state.marcas = action.payload.marcas;
         state.totalRegistros = action.payload.totalRegistros;
       }
     ),
     setCurrentMarcas: createRx.reducer(
       (state, action: PayloadAction<GetMarcaResponse>) => {
         state.currentMarcas = action.payload.marca;
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
       state.marcas = null;
       state.currentMarcas = null;
       state.loading = false;
       state.error = null;
       state.totalRegistros = 0;
     }),
     getMarcas: createRx.asyncThunk(
       async (
         { token, params }: { token: string | undefined; params?: MarcasParams },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(marcasSlice.actions.setLoading(true));
         try {
           const estatus = await getMarcas({ token, params });
           dispatch(marcasSlice.actions.setMarcas(estatus));
           return estatus;
         } catch (error: any) {
           dispatch(marcasSlice.actions.setError(error.message));
           return rejectWithValue({
             message: error?.message || "Error al obtener estatus",
             stack: error?.stack,
           })
         } finally {
           dispatch(marcasSlice.actions.setLoading(false));
         }
       }
     ),
     createMarcas: createRx.asyncThunk(
       async (
         { token, estatus }: { token: string; estatus: Marcas },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(marcasSlice.actions.setLoading(true));
         try {
           const response = await createMarcas({ token, body: estatus });
           return response;
         } catch (error: any) {
           dispatch(marcasSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(marcasSlice.actions.setLoading(false));
         }
       }
     ),
     updateMarcas: createRx.asyncThunk(
       async (
         { token, id, estatus }: { token: string; id: string; estatus: Marcas },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(marcasSlice.actions.setLoading(true));
         try {
           const response = await updateMarcas({ token, id, body: estatus });
           return response;
         } catch (error: any) {
           dispatch(marcasSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(marcasSlice.actions.setLoading(false));
         }
       }
     ),
     deleteMarcas: createRx.asyncThunk(
       async (
         { token, id }: { token: string; id: string },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(marcasSlice.actions.setLoading(true));
         try {
           const response = await deleteMarcas({ token, id });
           await dispatch(marcasSlice.actions.getMarcas({ token })); // Refresh EstatusProd list
           return response;
         } catch (error: any) {
           dispatch(marcasSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(marcasSlice.actions.setLoading(false));
         }
       }
     ),
     getMarcasById: createRx.asyncThunk(
       async (
         { token, id }: { token: string; id: string },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(marcasSlice.actions.setLoading(true));
         try {
           const response = await getMarcasById({ token, id });
           dispatch(marcasSlice.actions.setCurrentMarcas(response));
           return response;
         } catch (error: any) {
           dispatch(marcasSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(marcasSlice.actions.setLoading(false));
         }
       }
     ),
     toggleMarcasStatus: createRx.asyncThunk(
       async (
         { token, id, isActive }: { token: string; id: string, isActive: boolean },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(marcasSlice.actions.setLoading(true));
         try {
           const response = await toggleMarcasStatus({ token, id, isActive  });
           await dispatch(marcasSlice.actions.getMarcas({ token })); // Refresh estatus list
           return response;
         } catch (error: any) {
           dispatch(marcasSlice.actions.setError(error.message));
           return rejectWithValue(error.message);
         } finally {
           dispatch(marcasSlice.actions.setLoading(false));
         }
       }
     ),
     importMarcas: createRx.asyncThunk(
       async (
         { token, file }: { token: string | undefined; file: File },
         { dispatch, rejectWithValue }
       ) => {
         dispatch(marcasSlice.actions.setLoading(true));
         try {
           const response = await importMarcas({ token, file });
           await dispatch(marcasSlice.actions.getMarcas({ token, params: {} }));
           return response;
         } catch (error: any) {
           dispatch(marcasSlice.actions.setError(error.message || "Error al importar"));
           return rejectWithValue(error);
         } finally {
           dispatch(marcasSlice.actions.setLoading(false));
         }
       }
     ),
   }),
   selectors: {
     selectMarcas: (state: MarcasState) => state.marcas,
     selectLoading: (state: MarcasState) => state.loading,
     selectError: (state: MarcasState) => state.error,
     selectTotalRegistros: (state: MarcasState) => state.totalRegistros,
   },
 });
 
 export const { actions: MarcasActions, reducer: MarcasReducer } = marcasSlice;
