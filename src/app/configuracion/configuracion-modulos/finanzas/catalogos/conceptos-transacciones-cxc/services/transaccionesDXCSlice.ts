import { PayloadAction } from "@reduxjs/toolkit";

import { createTransaccionesDXCSlice } from "./createSlices";
import {
  createTransaccionesDXC,
  updateTransaccionesDXC,
  deleteTransaccionesDXC,
  getTransaccionesDXCById,
  getTransaccionesDXC,
  importTransaccionesDXCFromExcel,
  toggleTransaccionesDXCStatus,
  getTiposRelacion,
  getFormasPago,
} from "./transaccionesDXCActions";

import type {
  TransaccionesDXC,
  TransaccionesDXCParams,
  GetTransaccionDXCByIdResponse,
  GetTransaccionesDXCResponse,
} from "./transaccionesDXCTypes";
import { Option } from "@/components/ui/multiselect";

interface TransaccionesDXCState {
  transaccionesDXC: TransaccionesDXC[] | null;
  currentTransaccionesDXC: TransaccionesDXC | null;
  loading: boolean;
  error: string | null;
  totalRegistros: number;
  catalogoTiposRelacion: Option[];
  catalogoFormasPago: Option[];
}

const initialState: TransaccionesDXCState = {
  transaccionesDXC: null,
  currentTransaccionesDXC: null,
  loading: false,
  error: null,
  totalRegistros: 0,
  catalogoTiposRelacion: [],
  catalogoFormasPago: [],
};

const transaccionesDXCSlice = createTransaccionesDXCSlice({
  name: "transacciones",
  initialState,
  reducers: (createRx) => ({
    setTransaccionesDXC: createRx.reducer(
      (state, action: PayloadAction<GetTransaccionesDXCResponse>) => {
        state.transaccionesDXC = action.payload.conceptoTransacciones;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentTransaccionesDXC: createRx.reducer(
      (state, action: PayloadAction<GetTransaccionDXCByIdResponse>) => {
        state.currentTransaccionesDXC = action.payload.conceptoTransaccion;
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
    setCatalogoTiposRelacion: createRx.reducer(
      (state, action: PayloadAction<{ value: string; label: string }[]>) => {
        state.catalogoTiposRelacion = action.payload;
      }
    ),
    setCatalogoFormasPago: createRx.reducer(
      (state, action: PayloadAction<{ value: string; label: string }[]>) => {
        state.catalogoFormasPago = action.payload;
      }
    ),
    flushAll: createRx.reducer((state) => {
      state.transaccionesDXC = null;
      state.currentTransaccionesDXC = null;
      state.loading = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    getCatalogoTiposRelacion: createRx.asyncThunk(
      async (
        { token }: { token: string },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(transaccionesDXCSlice.actions.setLoading(true));
          const result = await getTiposRelacion(token);
          dispatch(transaccionesDXCSlice.actions.setCatalogoTiposRelacion(result));
          return result;
        } catch (error: any) {
          dispatch(
            transaccionesDXCSlice.actions.setError(error?.message || "Error al obtener catálogo de tipos de relación")
          );
          return rejectWithValue(error);
        } finally {
          dispatch(transaccionesDXCSlice.actions.setLoading(false));
        }
      }
    ),
    getCatalogoFormasPago: createRx.asyncThunk(
      async (
        { token }: { token: string },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(transaccionesDXCSlice.actions.setLoading(true));
          const result = await getFormasPago(token);
          dispatch(transaccionesDXCSlice.actions.setCatalogoFormasPago(result));
          return result;
        } catch (error: any) {
          dispatch(
            transaccionesDXCSlice.actions.setError(error?.message || "Error al obtener catálogo de formas de pago")
          );
          return rejectWithValue(error);
        } finally {
          dispatch(transaccionesDXCSlice.actions.setLoading(false));
        }
      }
    ),

    getTransaccionesDXC: createRx.asyncThunk(
      async (
        {
          token,
          params,
        }: {
          token: string | undefined;
          params?: TransaccionesDXCParams;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(transaccionesDXCSlice.actions.setLoading(true));
          const response = await getTransaccionesDXC({ token, params });
          console.log("🚀 ~ getTransaccionesDXC ~ response:", response);
          dispatch(transaccionesDXCSlice.actions.setTransaccionesDXC(response));
        } catch (error: any) {
          dispatch(
            transaccionesDXCSlice.actions.setError(
              error?.message || "Error al obtener "
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(transaccionesDXCSlice.actions.setLoading(false));
        }
      }
    ),
    getTransaccionesDXCById: createRx.asyncThunk(
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
          dispatch(transaccionesDXCSlice.actions.setLoading(true));
          const response = await getTransaccionesDXCById({ token, id });
          dispatch(transaccionesDXCSlice.actions.setCurrentTransaccionesDXC(response));
          return response;
        } catch (error: any) {
          dispatch(
            transaccionesDXCSlice.actions.setError(
              error?.message || "Error al obtener"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(transaccionesDXCSlice.actions.setLoading(false));
        }
      }
    ),
    createTransaccionesDXC: createRx.asyncThunk(
      async (
        {
          token,
          transaccionesDXC,
        }: {
          token: string | undefined;
          transaccionesDXC: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(transaccionesDXCSlice.actions.setLoading(true));
          const response = await createTransaccionesDXC({ token, body: transaccionesDXC });
          return response;
        } catch (error: any) {
          dispatch(
            transaccionesDXCSlice.actions.setError(
              error?.message || "Error al crear"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(transaccionesDXCSlice.actions.setLoading(false));
        }
      }
    ),
    updateTransaccionesDXC: createRx.asyncThunk(
      async (
        {
          token,
          id,
          transaccionesDXC,
        }: {
          token: string | undefined;
          id: string | null;
          transaccionesDXC: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(transaccionesDXCSlice.actions.setLoading(true));
          const response = await updateTransaccionesDXC({
            token,
            id,
            body: transaccionesDXC,
          });
          return response;
        } catch (error: any) {
          dispatch(
            transaccionesDXCSlice.actions.setError(
              error?.message || "Error al editar "
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(transaccionesDXCSlice.actions.setLoading(false));
        }
      }
    ),
    deleteTransaccionesDXC: createRx.asyncThunk(
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
          dispatch(transaccionesDXCSlice.actions.setLoading(true));
          const response = await deleteTransaccionesDXC({ token, id });
          await dispatch(
            transaccionesDXCSlice.actions.getTransaccionesDXC({
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
            transaccionesDXCSlice.actions.setError(
              error?.message || "Error al eliminar el "
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(transaccionesDXCSlice.actions.setLoading(false));
        }
      }
    ),
    importTransaccionesDXCFromExcel: createRx.asyncThunk(
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
          dispatch(transaccionesDXCSlice.actions.setLoading(true));
          const response = await importTransaccionesDXCFromExcel({ token, file });
          await dispatch(
            transaccionesDXCSlice.actions.getTransaccionesDXC({
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
            transaccionesDXCSlice.actions.setError(
              error?.message || "Error al importar "
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(transaccionesDXCSlice.actions.setLoading(false));
        }
      }
    ),
    toggleTransaccionesDXCStatus: createRx.asyncThunk(
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
          dispatch(transaccionesDXCSlice.actions.setLoading(true));
          const response = await toggleTransaccionesDXCStatus({
            token,
            id,
          });
          await dispatch(
            transaccionesDXCSlice.actions.getTransaccionesDXC({
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
            transaccionesDXCSlice.actions.setError(
              error?.message || "Error al cambiar el estado "
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(transaccionesDXCSlice.actions.setLoading(false));
        }
      }
    ),
  }),
  selectors: {
    getTransaccionesDXC: (state) => state.transaccionesDXC,
    getCurrentTransaccionesDXC: (state) => state.currentTransaccionesDXC,
    getCatalogoTiposRelacion: (state) => state.catalogoTiposRelacion,
    getCatalogoFormasPago: (state) => state.catalogoFormasPago,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    getTotalRegistros: (state) => state.totalRegistros,
  },
});

export const { actions: transaccionesDXCActions, reducer: transaccionesDXCReducer } =
  transaccionesDXCSlice;
