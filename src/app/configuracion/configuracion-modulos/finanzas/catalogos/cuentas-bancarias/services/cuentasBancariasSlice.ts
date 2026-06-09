import { PayloadAction } from "@reduxjs/toolkit";

import { createCuentaBancariaSlice } from "./createSlices";
import {
  createCuentaBancaria,
  updateCuentaBancaria,
  deleteCuentaBancaria,
  getCuentasBancarias,
  toggleCuentaBancariaStatus,
  importCuentasBancariasFromExcel,
  getCuentaBancariaById,
} from "./cuentasBancariasActions";

import type {
  CuentaBancaria,
  CuentaBancariaTypeParams,
  GetCuentasBancariasResponse,
} from "./cuentasBancariasTypes";

interface CuentasBancariasState {
  cuentasBancarias: CuentaBancaria[] | null;
  currentCuentaBancaria: CuentaBancaria | null;
  loading: boolean;
  pending: boolean;
  error: string | null;
  totalRegistros: number;
}

const initialState: CuentasBancariasState = {
  cuentasBancarias: null,
  currentCuentaBancaria: null,
  loading: false,
  pending: false,
  error: null,
  totalRegistros: 0,
};

const cuentasBancariasSlice = createCuentaBancariaSlice({
  name: "cuentasBancarias",
  initialState,
  reducers: (createRx) => ({
    setCuentasBancarias: createRx.reducer(
      (state, action: PayloadAction<GetCuentasBancariasResponse>) => {
        state.cuentasBancarias = action.payload.cuentasBancarias;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentCuentaBancaria: createRx.reducer(
      (state, action: PayloadAction<CuentaBancaria | null>) => {
        state.currentCuentaBancaria = action.payload;
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
    setTotalRegistros: createRx.reducer(
      (state, action: PayloadAction<number>) => {
        state.totalRegistros = action.payload;
      }
    ),
    flushAll: createRx.reducer((state) => {
      state.cuentasBancarias = null;
      state.currentCuentaBancaria = null;
      state.loading = false;
      state.pending = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    getCuentasBancarias: createRx.asyncThunk(
      async (
        {
          token,
          params,
        }: {
          token: string | undefined;
          params: CuentaBancariaTypeParams;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(cuentasBancariasSlice.actions.setLoading(true));
        try {
          const response = await getCuentasBancarias({
            token,
            params,
          });
          dispatch(cuentasBancariasSlice.actions.setCuentasBancarias(response));
          return response;
        } catch (error: any) {
          dispatch(cuentasBancariasSlice.actions.setError(error.message));
          return rejectWithValue(error);
        } finally {
          dispatch(cuentasBancariasSlice.actions.setLoading(false));
        }
      }
    ),
    getCuentaBancariaById: createRx.asyncThunk(
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
        dispatch(cuentasBancariasSlice.actions.setLoading(true));
        try {
          const response = await getCuentaBancariaById({
            token,
            id,
          });
          dispatch(
            cuentasBancariasSlice.actions.setCurrentCuentaBancaria(
              response.cuentaBancaria
            )
          );
          return response;
        } catch (error: any) {
          dispatch(cuentasBancariasSlice.actions.setError(error.message));
          return rejectWithValue(error);
        } finally {
          dispatch(cuentasBancariasSlice.actions.setLoading(false));
        }
      }
    ),
    createCuentaBancaria: createRx.asyncThunk(
      async (
        {
          token,
          body,
        }: {
          token: string | undefined;
          body: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(cuentasBancariasSlice.actions.setPending(true));
        try {
          const response = await createCuentaBancaria({
            token,
            body,
          });
          return response;
        } catch (error: any) {
          dispatch(cuentasBancariasSlice.actions.setError(error.message));
          return rejectWithValue(error);
        } finally {
          dispatch(cuentasBancariasSlice.actions.setPending(false));
        }
      }
    ),
    updateCuentaBancaria: createRx.asyncThunk(
      async (
        {
          token,
          id,
          body,
        }: {
          token: string | undefined;
          id: string | null;
          body: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(cuentasBancariasSlice.actions.setPending(true));
        try {
          const response = await updateCuentaBancaria({
            token,
            id,
            body,
          });
          return response;
        } catch (error: any) {
          dispatch(cuentasBancariasSlice.actions.setError(error.message));
          return rejectWithValue(error);
        } finally {
          dispatch(cuentasBancariasSlice.actions.setPending(false));
        }
      }
    ),
    deleteCuentaBancaria: createRx.asyncThunk(
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
        dispatch(cuentasBancariasSlice.actions.setPending(true));
        try {
          const response = await deleteCuentaBancaria({
            token,
            id,
          });
          return response;
        } catch (error: any) {
          dispatch(cuentasBancariasSlice.actions.setError(error.message));
          return rejectWithValue(error);
        } finally {
          dispatch(cuentasBancariasSlice.actions.setPending(false));
        }
      }
    ),
    toggleCuentaBancariaStatus: createRx.asyncThunk(
      async (
        {
          token,
          id,
        }: {
          token: string | undefined;
          id: string;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(cuentasBancariasSlice.actions.setPending(true));
        try {
          const response = await toggleCuentaBancariaStatus({
            token,
            id,
          });
          return response;
        } catch (error: any) {
          dispatch(cuentasBancariasSlice.actions.setError(error.message));
          return rejectWithValue(error);
        } finally {
          dispatch(cuentasBancariasSlice.actions.setPending(false));
        }
      }
    ),
    importCuentasBancariasFromExcel: createRx.asyncThunk(
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
        dispatch(cuentasBancariasSlice.actions.setPending(true));
        try {
          const response = await importCuentasBancariasFromExcel({
            token,
            file,
          });
          return response;
        } catch (error: any) {
          dispatch(cuentasBancariasSlice.actions.setError(error.message));
          return rejectWithValue(error);
        } finally {
          dispatch(cuentasBancariasSlice.actions.setPending(false));
        }
      }
    ),
  }),
  selectors: {
    getCuentasBancarias: (state) => state.cuentasBancarias,
    getCurrentCuentaBancaria: (state) => state.currentCuentaBancaria,
    getLoading: (state) => state.loading,
    getPending: (state) => state.pending,
    getError: (state) => state.error,
    getTotalRegistros: (state) => state.totalRegistros,
  },
});

export const {
  actions: cuentasBancariasActions,
  reducer: cuentasBancariasReducer,
} = cuentasBancariasSlice;
