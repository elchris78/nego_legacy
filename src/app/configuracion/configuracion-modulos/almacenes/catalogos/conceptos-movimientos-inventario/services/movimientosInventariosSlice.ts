import { PayloadAction } from "@reduxjs/toolkit";

import { createMovimientosInventarioSlice } from "./createSlices";
import {
  createMovimientoInventario,
  updateMovimientoInventario,
  deleteMovimientoInventario,
  getMovimientosInventario,
  toggleMovimientoInventarioStatus,
  importMovimientosInventarioFromExcel,
  getMovimientoInventarioById,
} from "./movimientosInventarioActions";

import type {
  MovimientoInventario,
  MovimientoInventarioTypeParams,
  GetMovimientosInventarioResponse,
} from "./movimientosInventarioTypes";

interface MovimientosInventarioState {
  movimientosInventario: MovimientoInventario[] | null;
  currentMovimientoInventario: MovimientoInventario | null;
  loading: boolean;
  pending: boolean;
  error: string | null;
  totalRegistros: number;
}

const initialState: MovimientosInventarioState = {
  movimientosInventario: null,
  currentMovimientoInventario: null,
  loading: false,
  pending: false,
  error: null,
  totalRegistros: 0,
};

const movimientosInventarioSlice = createMovimientosInventarioSlice({
  name: "movimientosInventario",
  initialState,
  reducers: (createRx) => ({
    setMovimientosInventario: createRx.reducer(
      (state, action: PayloadAction<GetMovimientosInventarioResponse>) => {
        state.movimientosInventario =
          action.payload.conceptosMovimientoInventario;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentMovimientoInventario: createRx.reducer(
      (state, action: PayloadAction<MovimientoInventario | null>) => {
        state.currentMovimientoInventario = action.payload;
      }
    ),
    setLoading: createRx.reducer((state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }),
    setPending: createRx.reducer((state, action: PayloadAction<boolean>) => {
      state.pending = action.payload;
    }),
    setError: createRx.reducer(
      (state, action: PayloadAction<string | null>) => {
        state.error = action.payload;
      }
    ),
    flushAll: createRx.reducer((state) => {
      state.movimientosInventario = null;
      state.currentMovimientoInventario = null;
      state.loading = false;
      state.pending = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    getMovimientosInventario: createRx.asyncThunk(
      async (
        {
          token,
          params,
        }: {
          token: string | undefined;
          params: MovimientoInventarioTypeParams;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(movimientosInventarioSlice.actions.setLoading(true));
        try {
          const response = await getMovimientosInventario({ token, params });
          dispatch(
            movimientosInventarioSlice.actions.setMovimientosInventario(
              response
            )
          );
          return response;
        } catch (error: any) {
          dispatch(movimientosInventarioSlice.actions.setError(error.message));
          return rejectWithValue(error);
        } finally {
          dispatch(movimientosInventarioSlice.actions.setLoading(false));
        }
      }
    ),
    getMovimientoInventarioById: createRx.asyncThunk(
      async (
        { token, id }: { token: string | undefined; id: string | null },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(movimientosInventarioSlice.actions.setLoading(true));
        try {
          const response = await getMovimientoInventarioById({ token, id });
          dispatch(
            movimientosInventarioSlice.actions.setCurrentMovimientoInventario(
              response.concepto
            )
          );
          return response;
        } catch (error: any) {
          dispatch(movimientosInventarioSlice.actions.setError(error.message));
          return rejectWithValue(error);
        } finally {
          dispatch(movimientosInventarioSlice.actions.setLoading(false));
        }
      }
    ),
    createMovimientoInventario: createRx.asyncThunk(
      async (
        { token, body }: { token: string | undefined; body: any },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(movimientosInventarioSlice.actions.setPending(true));
        try {
          const response = await createMovimientoInventario({ token, body });
          return response;
        } catch (error: any) {
          dispatch(movimientosInventarioSlice.actions.setError(error.message));
          return rejectWithValue(error);
        } finally {
          dispatch(movimientosInventarioSlice.actions.setPending(false));
        }
      }
    ),
    updateMovimientoInventario: createRx.asyncThunk(
      async (
        {
          token,
          id,
          body,
        }: { token: string | undefined; id: string | null; body: any },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(movimientosInventarioSlice.actions.setPending(true));
        try {
          const response = await updateMovimientoInventario({
            token,
            id,
            body,
          });
          return response;
        } catch (error: any) {
          dispatch(movimientosInventarioSlice.actions.setError(error.message));
          return rejectWithValue(error);
        } finally {
          dispatch(movimientosInventarioSlice.actions.setPending(false));
        }
      }
    ),
    deleteMovimientoInventario: createRx.asyncThunk(
      async (
        { token, id }: { token: string | undefined; id: string | null },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(movimientosInventarioSlice.actions.setPending(true));
        try {
          const response = await deleteMovimientoInventario({ token, id });
          return response;
        } catch (error: any) {
          dispatch(movimientosInventarioSlice.actions.setError(error.message));
          return rejectWithValue(error);
        } finally {
          dispatch(movimientosInventarioSlice.actions.setPending(false));
        }
      }
    ),
    toggleMovimientoInventarioStatus: createRx.asyncThunk(
      async (
        {
          token,
          id,
        }: {
          token: string | undefined;
          id: string | null;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(movimientosInventarioSlice.actions.setPending(true));
        try {
          const response = await toggleMovimientoInventarioStatus({
            token,
            id,
          });
          return response;
        } catch (error: any) {
          dispatch(movimientosInventarioSlice.actions.setError(error.message));
          return rejectWithValue(error);
        } finally {
          dispatch(movimientosInventarioSlice.actions.setPending(false));
        }
      }
    ),
    importMovimientosInventarioFromExcel: createRx.asyncThunk(
      async (
        { token, file }: { token: string | undefined; file: File },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(movimientosInventarioSlice.actions.setPending(true));
        try {
          const response = await importMovimientosInventarioFromExcel({
            token,
            file,
          });
          return response;
        } catch (error: any) {
          dispatch(movimientosInventarioSlice.actions.setError(error.message));
          return rejectWithValue(error);
        } finally {
          dispatch(movimientosInventarioSlice.actions.setPending(false));
        }
      }
    ),
  }),
  selectors: {
    getMovimientosInventario: (state) => state.movimientosInventario,
    getCurrentMovimientoInventario: (state) =>
      state.currentMovimientoInventario,
    isLoading: (state) => state.loading,
    isPending: (state) => state.pending,
    getError: (state) => state.error,
    getTotalRegistros: (state) => state.totalRegistros,
  },
});

export const {
  actions: movimientosInventarioActions,
  reducer: movimientosInventarioReducer,
} = movimientosInventarioSlice;
