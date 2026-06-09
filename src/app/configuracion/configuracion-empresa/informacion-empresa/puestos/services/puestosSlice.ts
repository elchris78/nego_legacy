import { PayloadAction } from "@reduxjs/toolkit";

import { createPuestosSlice } from "./createSlices"; 
import {
  createPuestos,
  getPuestos,
  updatePuestos,
  deletePuestos,
  getPuestosById,
  togglePuestosStatus,
  importPuestos
} from "./puestosAction"

import type {
  Puestos,
  PuestosParams,
  GetPuestosResponse,
  GetPuestoResponse,
} from "./puestosTypes";

interface PuestosState {
  puestos: Puestos[] | null;
  currentPuestos: Puestos | null;
  loading: boolean;
  error: string | null;
  totalRegistros: number;
}

const initialState: PuestosState = {
  puestos: null,
  currentPuestos: null,
  loading: false,
  error: null,
  totalRegistros: 0,
};

const puestosSlice = createPuestosSlice({
  name: "puestos",
  initialState,
  reducers: (createRx) => ({
    setPuestos: createRx.reducer(
      (state, action: PayloadAction<GetPuestosResponse>) => {
        state.puestos = action.payload.puestos;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentPuestos: createRx.reducer(
      (state, action: PayloadAction<GetPuestoResponse>) => {
        state.currentPuestos = action.payload.puesto;
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
      state.puestos = null;
      state.currentPuestos = null;
      state.loading = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    getPuestos: createRx.asyncThunk(
      async (
        { token, params }: { token: string | undefined; params?: PuestosParams },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(puestosSlice.actions.setLoading(true));
        try {
          const puestos = await getPuestos({ token, params });
          dispatch(puestosSlice.actions.setPuestos(puestos));
          return puestos;
        } catch (error: any) {
          dispatch(puestosSlice.actions.setError(error.message));
          return rejectWithValue({
            message: error?.message || "Error al obtener áreas",
            stack: error?.stack,
          })
        } finally {
          dispatch(puestosSlice.actions.setLoading(false));
        }
      }
    ),
    createPuestos: createRx.asyncThunk(
      async (
        { token, puestos }: { token: string; puestos: Puestos },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(puestosSlice.actions.setLoading(true));
        try {
          const response = await createPuestos({ token, body: puestos });
          return response;
        } catch (error: any) {
          dispatch(puestosSlice.actions.setError(error.message));
          return rejectWithValue(error.message);
        } finally {
          dispatch(puestosSlice.actions.setLoading(false));
        }
      }
    ),
    updatePuestos: createRx.asyncThunk(
      async (
        { token, id, puestos }: { token: string; id: string; puestos: Puestos },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(puestosSlice.actions.setLoading(true));
        try {
          const response = await updatePuestos({ token, id, body: puestos });
          return response;
        } catch (error: any) {
          dispatch(puestosSlice.actions.setError(error.message));
          return rejectWithValue(error.message);
        } finally {
          dispatch(puestosSlice.actions.setLoading(false));
        }
      }
    ),
    deletePuestos: createRx.asyncThunk(
      async (
        { token, id }: { token: string; id: string },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(puestosSlice.actions.setLoading(true));
        try {
          const response = await deletePuestos({ token, id });
          await dispatch(puestosSlice.actions.getPuestos({ token })); // Refresh Puestos list
          return response;
        } catch (error: any) {
          dispatch(puestosSlice.actions.setError(error.message));
          return rejectWithValue(error.message);
        } finally {
          dispatch(puestosSlice.actions.setLoading(false));
        }
      }
    ),
    getPuestosById: createRx.asyncThunk(
      async (
        { token, id }: { token: string; id: string },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(puestosSlice.actions.setLoading(true));
        try {
          const response = await getPuestosById({ token, id });
          dispatch(puestosSlice.actions.setCurrentPuestos(response));
          return response;
        } catch (error: any) {
          dispatch(puestosSlice.actions.setError(error.message));
          return rejectWithValue(error.message);
        } finally {
          dispatch(puestosSlice.actions.setLoading(false));
        }
      }
    ),
    togglePuestosStatus: createRx.asyncThunk(
      async (
        { token, id, isActive }: { token: string; id: string, isActive: boolean },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(puestosSlice.actions.setLoading(true));
        try {
          const response = await togglePuestosStatus({ token, id, isActive  });
          await dispatch(puestosSlice.actions.getPuestos({ token })); // Refresh Puestos list
          return response;
        } catch (error: any) {
          dispatch(puestosSlice.actions.setError(error.message));
          return rejectWithValue(error.message);
        } finally {
          dispatch(puestosSlice.actions.setLoading(false));
        }
      }
    ),
    importPuestos: createRx.asyncThunk(
      async (
        { token, file }: { token: string | undefined; file: File },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(puestosSlice.actions.setLoading(true));
        try {
          const response = await importPuestos({ token, file });
          await dispatch(puestosSlice.actions.getPuestos({ token, params: {} }));
          return response;
        } catch (error: any) {
          dispatch(puestosSlice.actions.setError(error.message || "Error al importar"));
          return rejectWithValue(error);
        } finally {
          dispatch(puestosSlice.actions.setLoading(false));
        }
      }
    ),
  }),
  selectors: {
    selectPuestos: (state: PuestosState) => state.puestos,
    selectLoading: (state: PuestosState) => state.loading,
    selectError: (state: PuestosState) => state.error,
    selectTotalRegistros: (state: PuestosState) => state.totalRegistros,
  },
});

export const { actions: puestosActions, reducer: puestosReducer } = puestosSlice;
