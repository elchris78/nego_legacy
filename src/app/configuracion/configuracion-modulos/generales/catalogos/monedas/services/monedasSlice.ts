import { PayloadAction } from "@reduxjs/toolkit";

import { createMonedasSlice } from "./createSlices";
import {
  createMonedas,
  updateMonedas,
  deleteMonedas,
  getMonedasById,
  getMonedas,
  importMonedasFromExcel,
  toggleMonedasStatus,
  getMonedasCat,
} from "./monedasActions";

import type {
  Monedas,
  MonedasParams,
  GetMonedaByIdResponse,
  GetMonedasResponse,
} from "./monedasTypes";
import { Option } from "@/components/ui/multiselect";

interface MonedasState {
  monedas: Monedas[] | null;
  currentMonedas: Monedas | null;
  loading: boolean;
  error: string | null;
  totalRegistros: number;
  monedasSat: Option[];
}

const initialState: MonedasState = {
  monedas: null,
  currentMonedas: null,
  loading: false,
  error: null,
  totalRegistros: 0,
  monedasSat: []
};

const monedasSlice = createMonedasSlice({
  name: "monedas",
  initialState,
  reducers: (createRx) => ({
    setMonedas: createRx.reducer(
      (state, action: PayloadAction<GetMonedasResponse>) => {
        state.monedas = action.payload.monedas;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentMonedas: createRx.reducer(
      (state, action: PayloadAction<GetMonedaByIdResponse>) => {
        state.currentMonedas = action.payload.moneda;
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
    setMonedasSat: createRx.reducer(
      (state, action: PayloadAction<{ value: string; label: string }[]>) => {
        state.monedasSat = action.payload;
      }
    ),
    flushAll: createRx.reducer((state) => {
      state.monedas = null;
      state.currentMonedas = null;
      state.loading = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    getCatalogoMonedas: createRx.asyncThunk(
      async (
        { token }: { token: string },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(monedasSlice.actions.setLoading(true));
          const result = await getMonedasCat(token);
          dispatch(monedasSlice.actions.setMonedasSat(result));
          return result;
        } catch (error: any) {
          dispatch(
            monedasSlice.actions.setError(error?.message || "Error al obtener catálogo de monedas")
          );
          return rejectWithValue(error);
        } finally {
          dispatch(monedasSlice.actions.setLoading(false));
        }
      }
    ),
    getMonedas: createRx.asyncThunk(
      async (
        {
          token,
          params,
        }: {
          token: string | undefined;
          params: MonedasParams;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(monedasSlice.actions.setLoading(true));
          const response = await getMonedas({ token, params });
          dispatch(monedasSlice.actions.setMonedas(response));
        } catch (error: any) {
          dispatch(
            monedasSlice.actions.setError(
              error?.message || "Error al obtener monedas"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(monedasSlice.actions.setLoading(false));
        }
      }
    ),
    getMonedaById: createRx.asyncThunk(
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
        try {
          dispatch(monedasSlice.actions.setLoading(true));
          const response = await getMonedasById({ token, id });
          dispatch(monedasSlice.actions.setCurrentMonedas(response));
          return response;
        } catch (error: any) {
          dispatch(
            monedasSlice.actions.setError(
              error?.message || "Error al obtener monedas"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(monedasSlice.actions.setLoading(false));
        }
      }
    ),
    createMonedas: createRx.asyncThunk(
      async (
        {
          token,
          monedas,
        }: {
          token: string | undefined;
          monedas: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(monedasSlice.actions.setLoading(true));
          const response = await createMonedas({ token, body: monedas });
          return response;
        } catch (error: any) {
          dispatch(
            monedasSlice.actions.setError(
              error?.message || "Error al crear Monedas"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(monedasSlice.actions.setLoading(false));
        }
      }
    ),
    updateMonedas: createRx.asyncThunk(
      async (
        {
          token,
          id,
          monedas,
        }: {
          token: string | undefined;
          id: string | null;
          monedas: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(monedasSlice.actions.setLoading(true));
          const response = await updateMonedas({
            token,
            id,
            body: monedas,
          });
          return response;
        } catch (error: any) {
          dispatch(
            monedasSlice.actions.setError(
              error?.message || "Error al editar Monedas"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(monedasSlice.actions.setLoading(false));
        }
      }
    ),
    deleteMonedas: createRx.asyncThunk(
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
        try {
          dispatch(monedasSlice.actions.setLoading(true));
          const response = await deleteMonedas({ token, id });
          await dispatch(
            monedasSlice.actions.getMonedas({
              token,
              params: {
                page: 1,
                size: 20,
              },
            })
          );
          return response;
        } catch (error: any) {
          dispatch(
            monedasSlice.actions.setError(
              error?.message || "Error al eliminar el tipo de vendedor"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(monedasSlice.actions.setLoading(false));
        }
      }
    ),
    importMonedasFromExcel: createRx.asyncThunk(
      async (
        {
          token,
          file,
        }: {
          token: string | undefined;
          file: File;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(monedasSlice.actions.setLoading(true));
          const response = await importMonedasFromExcel({ token, file });
          await dispatch(
            monedasSlice.actions.getMonedas({
              token,
              params: {
                page: 1,
                size: 20,
              },
            })
          );
          return response;
        } catch (error: any) {
          dispatch(
            monedasSlice.actions.setError(
              error?.message || "Error al importar  monedas"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(monedasSlice.actions.setLoading(false));
        }
      }
    ),
    toggleMonedasStatus: createRx.asyncThunk(
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
        try {
          dispatch(monedasSlice.actions.setLoading(true));
          const response = await toggleMonedasStatus({
            token,
            id,
          });
          await dispatch(
            monedasSlice.actions.getMonedas({
              token,
              params: {
                page: 1,
                size: 20,
              },
            })
          );
          return response;
        } catch (error: any) {
          dispatch(
            monedasSlice.actions.setError(
              error?.message || "Error al cambiar el estado monedas"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(monedasSlice.actions.setLoading(false));
        }
      }
    ),
  }),
  selectors: {
    getMonedas: (state) => state.monedas,
    getCurrentMonedas: (state) => state.currentMonedas,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    getTotalRegistros: (state) => state.totalRegistros,
  },
});

export const { actions: monedasActions, reducer: monedasReducer } =
  monedasSlice;
