import { PayloadAction } from "@reduxjs/toolkit";

import { createSubZonasSlice } from "./createSlices";
import {
  createSubZona,
  updateSubZona,
  deleteSubZona,
  getSubZonas,
  toggleSubZonaStatus,
  importSubZonas,
  getSubZonaById,
} from "./subZonasActions";

import type {
  SubZona,
  SubZonaTypeParams,
  GetSubZonaByIdResponse,
  GetSubZonasResponse,
} from "./subZonasTypes";

interface SubZonasState {
  subzonas: SubZona[] | null;
  currentSubZona: SubZona | null;
  loading: boolean;
  error: string | null;
  totalRegistros: number;
}

const initialState: SubZonasState = {
  subzonas: null,
  currentSubZona: null,
  loading: false,
  error: null,
  totalRegistros: 0,
};

const subZonasSlice = createSubZonasSlice({
  name: "subzonas",
  initialState,
  reducers: (createRx) => ({
    setSubZonas: createRx.reducer(
      (state, action: PayloadAction<GetSubZonasResponse>) => {
        state.subzonas = action.payload.subZonas;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentSubZona: createRx.reducer(
      (state, action: PayloadAction<GetSubZonaByIdResponse>) => {
        state.currentSubZona = action.payload.subZona;
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
      state.subzonas = null;
      state.currentSubZona = null;
      state.loading = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    getSubZonas: createRx.asyncThunk(
      async (
        {
          token,
          params,
        }: {
          token: string | undefined;
          params: SubZonaTypeParams;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(subZonasSlice.actions.setLoading(true));
        try {
          const response = await getSubZonas({ token, params });
          dispatch(subZonasSlice.actions.setSubZonas(response));
        } catch (error: any) {
          dispatch(
            subZonasSlice.actions.setError(
              error.message || "Error al obtener subzonas"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(subZonasSlice.actions.setLoading(false));
        }
      }
    ),
    getSubZonaById: createRx.asyncThunk(
      async (
        { token, id }: { token: string | undefined; id: string | null },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(subZonasSlice.actions.setLoading(true));
        try {
          const response = await getSubZonaById({ token, id });
          dispatch(subZonasSlice.actions.setCurrentSubZona(response));
          return response;
        } catch (error: any) {
          dispatch(
            subZonasSlice.actions.setError(
              error.message || "Error al obtener subzona por ID"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(subZonasSlice.actions.setLoading(false));
        }
      }
    ),
    createSubZona: createRx.asyncThunk(
      async (
        {
          token,
          subzona,
        }: {
          token: string | undefined;
          subzona: SubZona;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(subZonasSlice.actions.setLoading(true));
        try {
          const response = await createSubZona({ token, body: subzona });
          return response;
        } catch (error: any) {
          dispatch(
            subZonasSlice.actions.setError(
              error.message || "Error al crear subzona"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(subZonasSlice.actions.setLoading(false));
        }
      }
    ),
    updateSubZona: createRx.asyncThunk(
      async (
        {
          token,
          id,
          subzona,
        }: {
          token: string | undefined;
          id: string | null;
          subzona: SubZona;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(subZonasSlice.actions.setLoading(true));
        try {
          const response = await updateSubZona({ token, id, body: subzona });
          return response;
        } catch (error: any) {
          dispatch(
            subZonasSlice.actions.setError(
              error.message || "Error al actualizar subzona"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(subZonasSlice.actions.setLoading(false));
        }
      }
    ),
    deleteSubZona: createRx.asyncThunk(
      async (
        { token, id }: { token: string | undefined; id: string | null },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(subZonasSlice.actions.setLoading(true));
        try {
          const response = await deleteSubZona({ token, id });
          await dispatch(
            subZonasSlice.actions.getSubZonas({
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
            subZonasSlice.actions.setError(
              error.message || "Error al eliminar subzona"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(subZonasSlice.actions.setLoading(false));
        }
      }
    ),
    toggleSubZonaStatus: createRx.asyncThunk(
      async (
        { token, id }: { token: string | undefined; id: string | null },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(subZonasSlice.actions.setLoading(true));
        try {
          const response = await toggleSubZonaStatus({ token, id });
          await dispatch(
            subZonasSlice.actions.getSubZonas({
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
            subZonasSlice.actions.setError(
              error.message || "Error al cambiar estado de subzona"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(subZonasSlice.actions.setLoading(false));
        }
      }
    ),
    importSubZonas: createRx.asyncThunk(
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
        dispatch(subZonasSlice.actions.setLoading(true));
        try {
          const response = await importSubZonas({ token, file });
          await dispatch(
            subZonasSlice.actions.getSubZonas({
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
            subZonasSlice.actions.setError(
              error.message || "Error al importar subzonas"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(subZonasSlice.actions.setLoading(false));
        }
      }
    ),
  }),
  selectors: {
    selectSubZonas: (state: SubZonasState) => state.subzonas,
    selectCurrentSubZona: (state: SubZonasState) => state.currentSubZona,
    selectLoading: (state: SubZonasState) => state.loading,
    selectError: (state: SubZonasState) => state.error,
    selectTotalRegistros: (state: SubZonasState) => state.totalRegistros,
  },
});

export const { actions: subZonasActions, reducer: subZonasReducer } =
  subZonasSlice;
