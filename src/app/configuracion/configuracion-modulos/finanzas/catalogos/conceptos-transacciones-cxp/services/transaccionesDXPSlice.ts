import { PayloadAction } from "@reduxjs/toolkit";

import { createTransaccionesDXPSlice } from "./createSlices";
import {
  createTransaccionesDXP,
  updateTransaccionesDXP,
  deleteTransaccionesDXP,
  getTransaccionesDXPById,
  getTransaccionesDXP,
  importTransaccionesDXPFromExcel,
  toggleTransaccionesDXPStatus,
  getFormasPago,
} from "./transaccionesDXPActions";

import type {
  TransaccionesDXP,
  TransaccionesDXPParams,
  GetTransaccionDXPByIdResponse,
  GetTransaccionesDXPResponse,
} from "./transaccionesDXPTypes";
import { Option } from "@/components/ui/multiselect";

interface TransaccionesDXPState {
  transaccionesDXP: TransaccionesDXP[] | null;
  currentTransaccionesDXP: TransaccionesDXP | null;
  loading: boolean;
  error: string | null;
  totalRegistros: number;
  catalogoFormasPago: Option[];
}

const initialState: TransaccionesDXPState = {
  transaccionesDXP: null,
  currentTransaccionesDXP: null,
  loading: false,
  error: null,
  totalRegistros: 0,
  catalogoFormasPago: [],
};

const transaccionesDXPSlice = createTransaccionesDXPSlice({
  name: "transacciones",
  initialState,
  reducers: (createRx) => ({
    setTransaccionesDXP: createRx.reducer(
      (state, action: PayloadAction<GetTransaccionesDXPResponse>) => {
        state.transaccionesDXP = action.payload.conceptoTransacciones;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentTransaccionesDXP: createRx.reducer(
      (state, action: PayloadAction<GetTransaccionDXPByIdResponse>) => {
        state.currentTransaccionesDXP = action.payload.conceptoTransaccion;
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
    setCatalogoFormasPago: createRx.reducer(
      (state, action: PayloadAction<{ value: string; label: string }[]>) => {
        state.catalogoFormasPago = action.payload;
      }
    ),
    flushAll: createRx.reducer((state) => {
      state.transaccionesDXP = null;
      state.currentTransaccionesDXP = null;
      state.loading = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    getCatalogoFormasPago: createRx.asyncThunk(
      async (
        { token }: { token: string },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(transaccionesDXPSlice.actions.setLoading(true));
          const result = await getFormasPago(token);
          dispatch(transaccionesDXPSlice.actions.setCatalogoFormasPago(result));
          return result;
        } catch (error: any) {
          dispatch(
            transaccionesDXPSlice.actions.setError(error?.message || "Error al obtener catálogo de formas de pago")
          );
          return rejectWithValue(error);
        } finally {
          dispatch(transaccionesDXPSlice.actions.setLoading(false));
        }
      }
    ),

    getTransaccionesDXP: createRx.asyncThunk(
      async (
        {
          token,
          params,
        }: {
          token: string | undefined;
          params?: TransaccionesDXPParams;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(transaccionesDXPSlice.actions.setLoading(true));
          const response = await getTransaccionesDXP({ token, params });
          console.log("🚀 ~ getTransaccionesDXP ~ response:", response);
          dispatch(transaccionesDXPSlice.actions.setTransaccionesDXP(response));
        } catch (error: any) {
          dispatch(
            transaccionesDXPSlice.actions.setError(
              error?.message || "Error al obtener "
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(transaccionesDXPSlice.actions.setLoading(false));
        }
      }
    ),
    getTransaccionesDXPById: createRx.asyncThunk(
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
          dispatch(transaccionesDXPSlice.actions.setLoading(true));
          const response = await getTransaccionesDXPById({ token, id });
          dispatch(transaccionesDXPSlice.actions.setCurrentTransaccionesDXP(response));
          return response;
        } catch (error: any) {
          dispatch(
            transaccionesDXPSlice.actions.setError(
              error?.message || "Error al obtener"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(transaccionesDXPSlice.actions.setLoading(false));
        }
      }
    ),
    createTransaccionesDXP: createRx.asyncThunk(
      async (
        {
          token,
          transaccionesDXP,
        }: {
          token: string | undefined;
          transaccionesDXP: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(transaccionesDXPSlice.actions.setLoading(true));
          const response = await createTransaccionesDXP({ token, body: transaccionesDXP });
          return response;
        } catch (error: any) {
          dispatch(
            transaccionesDXPSlice.actions.setError(
              error?.message || "Error al crear"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(transaccionesDXPSlice.actions.setLoading(false));
        }
      }
    ),
    updateTransaccionesDXP: createRx.asyncThunk(
      async (
        {
          token,
          id,
          transaccionesDXP,
        }: {
          token: string | undefined;
          id: string | null;
          transaccionesDXP: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(transaccionesDXPSlice.actions.setLoading(true));
          const response = await updateTransaccionesDXP({
            token,
            id,
            body: transaccionesDXP,
          });
          return response;
        } catch (error: any) {
          dispatch(
            transaccionesDXPSlice.actions.setError(
              error?.message || "Error al editar "
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(transaccionesDXPSlice.actions.setLoading(false));
        }
      }
    ),
    deleteTransaccionesDXP: createRx.asyncThunk(
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
          dispatch(transaccionesDXPSlice.actions.setLoading(true));
          const response = await deleteTransaccionesDXP({ token, id });
          await dispatch(
            transaccionesDXPSlice.actions.getTransaccionesDXP({
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
            transaccionesDXPSlice.actions.setError(
              error?.message || "Error al eliminar el "
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(transaccionesDXPSlice.actions.setLoading(false));
        }
      }
    ),
    importTransaccionesDXPFromExcel: createRx.asyncThunk(
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
          dispatch(transaccionesDXPSlice.actions.setLoading(true));
          const response = await importTransaccionesDXPFromExcel({ token, file });
          await dispatch(
            transaccionesDXPSlice.actions.getTransaccionesDXP({
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
            transaccionesDXPSlice.actions.setError(
              error?.message || "Error al importar "
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(transaccionesDXPSlice.actions.setLoading(false));
        }
      }
    ),
    toggleTransaccionesDXPStatus: createRx.asyncThunk(
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
          dispatch(transaccionesDXPSlice.actions.setLoading(true));
          const response = await toggleTransaccionesDXPStatus({
            token,
            id,
          });
          await dispatch(
            transaccionesDXPSlice.actions.getTransaccionesDXP({
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
            transaccionesDXPSlice.actions.setError(
              error?.message || "Error al cambiar el estado "
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(transaccionesDXPSlice.actions.setLoading(false));
        }
      }
    ),
  }),
  selectors: {
    getTransaccionesDXP: (state) => state.transaccionesDXP,
    getCurrentTransaccionesDXP: (state) => state.currentTransaccionesDXP,
    getCatalogoFormasPago: (state) => state.catalogoFormasPago,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    getTotalRegistros: (state) => state.totalRegistros,
  },
});

export const { actions: transaccionesDXPActions, reducer: transaccionesDXPReducer } =
  transaccionesDXPSlice;
