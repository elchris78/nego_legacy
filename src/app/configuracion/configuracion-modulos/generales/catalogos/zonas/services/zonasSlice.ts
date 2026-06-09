import { PayloadAction } from "@reduxjs/toolkit";

import { createZonasSlice } from "./createSlices";
import {
  createZona,
  updateZona,
  deleteZona,
  getZonas,
  toggleZonaStatus,
  importZonas,
  getZonaById,
} from "./zonasActions";

import type {
  Zona,
  ZonaTypeParams,
  GetZonaByIdResponse,
  GetZonasResponse,
} from "./zonasTypes";

interface ZonasState {
  zonas: Zona[] | null;
  currentZona: Zona | null;
  loading: boolean;
  error: string | null;
  totalRegistros: number;
}

const initialState: ZonasState = {
  zonas: null,
  currentZona: null,
  loading: false,
  error: null,
  totalRegistros: 0,
};

const zonasSlice = createZonasSlice({
  name: "zonas",
  initialState,
  reducers: (createRx) => ({
    setZonas: createRx.reducer(
      (state, action: PayloadAction<GetZonasResponse>) => {
        state.zonas = action.payload.zonas;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentZona: createRx.reducer(
      (state, action: PayloadAction<GetZonaByIdResponse>) => {
        state.currentZona = action.payload.zona;
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
      state.zonas = null;
      state.currentZona = null;
      state.loading = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    getZonas: createRx.asyncThunk(
      async (
        {
          token,
          params,
        }: {
          token: string | undefined;
          params: ZonaTypeParams;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(zonasSlice.actions.setLoading(true));
        try {
          const response = await getZonas({ token, params });
          dispatch(zonasSlice.actions.setZonas(response));
        } catch (error: any) {
          dispatch(
            zonasSlice.actions.setError(
              error.message || "Error al obtener zonas"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(zonasSlice.actions.setLoading(false));
        }
      }
    ),
    getZonaById: createRx.asyncThunk(
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
        dispatch(zonasSlice.actions.setLoading(true));
        try {
          const response = await getZonaById({ token, id });
          dispatch(zonasSlice.actions.setCurrentZona(response));
          return response;
        } catch (error: any) {
          dispatch(
            zonasSlice.actions.setError(
              error.message || "Error al obtener la zona"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(zonasSlice.actions.setLoading(false));
        }
      }
    ),
    createZona: createRx.asyncThunk(
      async (
        {
          token,
          zona,
        }: {
          token: string | undefined;
          zona: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(zonasSlice.actions.setLoading(true));
        try {
          const response = await createZona({ token, body: zona });
          return response;
        } catch (error: any) {
          dispatch(
            zonasSlice.actions.setError(
              error.message || "Error al crear la zona"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(zonasSlice.actions.setLoading(false));
        }
      }
    ),
    updateZona: createRx.asyncThunk(
      async (
        {
          token,
          id,
          zona,
        }: {
          token: string | undefined;
          id: string | null;
          zona: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(zonasSlice.actions.setLoading(true));
        try {
          const response = await updateZona({ token, id, body: zona });
          return response;
        } catch (error: any) {
          dispatch(
            zonasSlice.actions.setError(
              error.message || "Error al actualizar la zona"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(zonasSlice.actions.setLoading(false));
        }
      }
    ),
    deleteZona: createRx.asyncThunk(
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
        dispatch(zonasSlice.actions.setLoading(true));
        try {
          const response = await deleteZona({ token, id });
          await dispatch(
            zonasSlice.actions.getZonas({
              token,
              params: {
                page: 1,
                size: 10,
              },
            })
          );
          return response;
        } catch (error: any) {
          dispatch(
            zonasSlice.actions.setError(
              error.message || "Error al eliminar la zona"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(zonasSlice.actions.setLoading(false));
        }
      }
    ),
    toggleZonaStatus: createRx.asyncThunk(
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
        dispatch(zonasSlice.actions.setLoading(true));
        try {
          const response = await toggleZonaStatus({ token, id });
          await dispatch(
            zonasSlice.actions.getZonas({
              token,
              params: {
                page: 1,
                size: 10,
              },
            })
          );
          return response;
        } catch (error: any) {
          dispatch(
            zonasSlice.actions.setError(
              error.message || "Error al cambiar el estado de la zona"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(zonasSlice.actions.setLoading(false));
        }
      }
    ),
    importZonas: createRx.asyncThunk(
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
        dispatch(zonasSlice.actions.setLoading(true));
        try {
          const response = await importZonas({ token, file });
          await dispatch(
            zonasSlice.actions.getZonas({
              token,
              params: {
                page: 1,
                size: 10,
              },
            })
          );
          return response;
        } catch (error: any) {
          dispatch(
            zonasSlice.actions.setError(
              error.message || "Error al importar zonas"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(zonasSlice.actions.setLoading(false));
        }
      }
    ),
  }),
  selectors: {
    selectZonas: (state: ZonasState) => state.zonas,
    selectCurrentZona: (state: ZonasState) => state.currentZona,
    selectLoading: (state: ZonasState) => state.loading,
    selectError: (state: ZonasState) => state.error,
    selectTotalRegistros: (state: ZonasState) => state.totalRegistros,
  },
});

export const { actions: zonasActions, reducer: zonasReducer } = zonasSlice;
