import { PayloadAction } from "@reduxjs/toolkit";

import { createTiposContratosBSlice } from "./createSlices";
import {
  createTiposContratosB,
  updateTiposContratosB,
  deleteTiposContratosB,
  getTiposContratosBById,
  getTiposContratosB,
  importTiposContratosBFromExcel,
  toggleTiposContratosBStatus,
} from "./tiposContratosBActions";

import type {
  TiposContratosB,
  TiposContratosBParams,
  GetTiposContratosBByIdResponse,
  GetTiposContratosBResponse,
} from "./tiposContratosBTypes";
import { Option } from "@/components/ui/multiselect";

interface TiposContratosBState {
  tiposContratosB: TiposContratosB[] | null;
  currentTiposContratosB: TiposContratosB | null;
  loading: boolean;
  error: string | null;
  totalRegistros: number;
  catalogoFormasPago: Option[];
}

const initialState: TiposContratosBState = {
  tiposContratosB: null,
  currentTiposContratosB: null,
  loading: false,
  error: null,
  totalRegistros: 0,
  catalogoFormasPago: [],
};

const tiposContratosBSlice = createTiposContratosBSlice({
  name: "tiposContratosB",
  initialState,
  reducers: (createRx) => ({
    setTiposContratosB: createRx.reducer(
      (state, action: PayloadAction<GetTiposContratosBResponse>) => {
        state.tiposContratosB = action.payload.tiposContratos;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentTiposContratosB: createRx.reducer(
      (state, action: PayloadAction<GetTiposContratosBByIdResponse>) => {
        state.currentTiposContratosB = action.payload.tipoContrato;
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
      state.tiposContratosB = null;
      state.currentTiposContratosB = null;
      state.loading = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    getTiposContratosB: createRx.asyncThunk(
      async (
        {
          token,
          params,
        }: {
          token: string | undefined;
          params?: TiposContratosBParams;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(tiposContratosBSlice.actions.setLoading(true));
          const response = await getTiposContratosB({ token, params });
          console.log("🚀 ~ getTiposContratosB ~ response:", response);
          dispatch(tiposContratosBSlice.actions.setTiposContratosB(response));
        } catch (error: any) {
          dispatch(
            tiposContratosBSlice.actions.setError(
              error?.message || "Error al obtener "
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(tiposContratosBSlice.actions.setLoading(false));
        }
      }
    ),
    getTiposContratosBById: createRx.asyncThunk(
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
          dispatch(tiposContratosBSlice.actions.setLoading(true));
          const response = await getTiposContratosBById({ token, id });
          dispatch(tiposContratosBSlice.actions.setCurrentTiposContratosB(response));
          return response;
        } catch (error: any) {
          dispatch(
            tiposContratosBSlice.actions.setError(
              error?.message || "Error al obtener"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(tiposContratosBSlice.actions.setLoading(false));
        }
      }
    ),
    createTiposContratosB: createRx.asyncThunk(
      async (
        {
          token,
          tiposContratosB,
        }: {
          token: string | undefined;
          tiposContratosB: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(tiposContratosBSlice.actions.setLoading(true));
          const response = await createTiposContratosB({ token, body: tiposContratosB });
          return response;
        } catch (error: any) {
          dispatch(
            tiposContratosBSlice.actions.setError(
              error?.message || "Error al crear"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(tiposContratosBSlice.actions.setLoading(false));
        }
      }
    ),
    updateTiposContratosB: createRx.asyncThunk(
      async (
        {
          token,
          id,
          tiposContratosB,
        }: {
          token: string | undefined;
          id: string | null;
          tiposContratosB: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(tiposContratosBSlice.actions.setLoading(true));
          const response = await updateTiposContratosB({
            token,
            id,
            body: tiposContratosB,
          });
          return response;
        } catch (error: any) {
          dispatch(
            tiposContratosBSlice.actions.setError(
              error?.message || "Error al editar "
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(tiposContratosBSlice.actions.setLoading(false));
        }
      }
    ),
    deleteTiposContratosB: createRx.asyncThunk(
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
          dispatch(tiposContratosBSlice.actions.setLoading(true));
          const response = await deleteTiposContratosB({ token, id });
          await dispatch(
            tiposContratosBSlice.actions.getTiposContratosB({
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
            tiposContratosBSlice.actions.setError(
              error?.message || "Error al eliminar el "
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(tiposContratosBSlice.actions.setLoading(false));
        }
      }
    ),
    importTiposContratosBFromExcel: createRx.asyncThunk(
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
          dispatch(tiposContratosBSlice.actions.setLoading(true));
          const response = await importTiposContratosBFromExcel({ token, file });
          await dispatch(
            tiposContratosBSlice.actions.getTiposContratosB({
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
            tiposContratosBSlice.actions.setError(
              error?.message || "Error al importar "
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(tiposContratosBSlice.actions.setLoading(false));
        }
      }
    ),
    toggleTiposContratosBStatus: createRx.asyncThunk(
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
          dispatch(tiposContratosBSlice.actions.setLoading(true));
          const response = await toggleTiposContratosBStatus({
            token,
            id,
          });
          await dispatch(
            tiposContratosBSlice.actions.getTiposContratosB({
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
            tiposContratosBSlice.actions.setError(
              error?.message || "Error al cambiar el estado "
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(tiposContratosBSlice.actions.setLoading(false));
        }
      }
    ),
  }),
  selectors: {
    getTiposContratosB: (state) => state.tiposContratosB,
    getCurrentTiposContratosB: (state) => state.currentTiposContratosB,
    getCatalogoFormasPago: (state) => state.catalogoFormasPago,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    getTotalRegistros: (state) => state.totalRegistros,
  },
});

export const { actions: tiposContratosBActions, reducer: tiposContratosBReducer } =
  tiposContratosBSlice;
