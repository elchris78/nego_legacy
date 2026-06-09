import { PayloadAction } from "@reduxjs/toolkit";

import { createAreasSlice } from "./createSlices";
import {
  createArea,
  getAreas,
  updateArea,
  deleteArea,
  getAreaById,
  toggleAreaStatus,
  importAreas,
} from "./areasActions";

import type {
  Area,
  AreaParams,
  GetAreasResponse,
  GetAreaResponse,
} from "./areaTypes";

interface AreasState {
  areas: Area[] | null;
  currentArea: Area | null;
  loading: boolean;
  error: string | null;
  totalRegistros: number;
}

const initialState: AreasState = {
  areas: null,
  currentArea: null,
  loading: false,
  error: null,
  totalRegistros: 0,
};

const areasSlice = createAreasSlice({
  name: "areas",
  initialState,
  reducers: (createRx) => ({
    setAreas: createRx.reducer(
      (state, action: PayloadAction<GetAreasResponse>) => {
        state.areas = action.payload.areas;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentArea: createRx.reducer(
      (state, action: PayloadAction<GetAreaResponse>) => {
        state.currentArea = action.payload.area;
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
      state.areas = null;
      state.currentArea = null;
      state.loading = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    getAreas: createRx.asyncThunk(
      async (
        { token, params }: { token: string | undefined; params?: AreaParams },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(areasSlice.actions.setLoading(true));
        try {
          const areas = await getAreas({ token, params });
          dispatch(areasSlice.actions.setAreas(areas));
          return areas;
        } catch (error: any) {
          dispatch(
            areasSlice.actions.setError(
              error.message || "Error al obtener áreas"
            )
          );
          return rejectWithValue({
            message: error?.message || "Error al obtener áreas",
            stack: error?.stack,
          }); // Propaga el error
        } finally {
          dispatch(areasSlice.actions.setLoading(false));
        }
      }
    ),
    createArea: createRx.asyncThunk(
      async (
        { token, area }: { token: string | undefined; area: any },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(areasSlice.actions.setLoading(true));
        try {
          const response = await createArea({ token, body: area });
          return response;
        } catch (error: any) {
          dispatch(
            areasSlice.actions.setError(
              error.message || "Error al crear el área"
            )
          );
          return rejectWithValue(error); // Propaga el error
        } finally {
          dispatch(areasSlice.actions.setLoading(false));
        }
      }
    ),
    updateArea: createRx.asyncThunk(
      async (
        {
          token,
          id,
          area,
        }: { token: string | undefined; id: string; area: Area },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(areasSlice.actions.setLoading(true));
        try {
          const response = await updateArea({ token, id, body: area });
          return response;
        } catch (error: any) {
          dispatch(
            areasSlice.actions.setError(
              error.message || "Error al editar el área"
            )
          );
          return rejectWithValue(error); // Propaga el error
        } finally {
          dispatch(areasSlice.actions.setLoading(false));
        }
      }
    ),
    deleteArea: createRx.asyncThunk(
      async (
        { token, id }: { token: string | undefined; id: string },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(areasSlice.actions.setLoading(true));
        try {
          const response = await deleteArea({ token, id });
          await dispatch(areasSlice.actions.getAreas({ token, params: {} })); // Refresh areas list
          return response;
        } catch (error: any) {
          dispatch(
            areasSlice.actions.setError(
              error.message || "Error al eliminar el área"
            )
          );
          return rejectWithValue(error); // Propaga el error
        } finally {
          dispatch(areasSlice.actions.setLoading(false));
        }
      }
    ),
    getAreaById: createRx.asyncThunk(
      async (
        { token, id }: { token: string; id: string | null },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(areasSlice.actions.setLoading(true));
        try {
          const response = await getAreaById({ token, id });
          dispatch(areasSlice.actions.setCurrentArea(response));
          return response;
        } catch (error: any) {
          dispatch(
            areasSlice.actions.setError(
              error.message || "Error al obtener el área"
            )
          );
          return rejectWithValue(error); // Propaga el error
        } finally {
          dispatch(areasSlice.actions.setLoading(false));
        }
      }
    ),
    toggleAreaStatus: createRx.asyncThunk(
      async (
        { token, id }: { token: string | undefined; id: string },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(areasSlice.actions.setLoading(true));
        try {
          const response = await toggleAreaStatus({ token, id });
          await dispatch(areasSlice.actions.getAreas({ token, params: {} })); // Refresh areas list
          return response;
        } catch (error: any) {
          dispatch(
            areasSlice.actions.setError(error.message || "Error al actualizar")
          );
          return rejectWithValue(error); // Propaga el error
        } finally {
          dispatch(areasSlice.actions.setLoading(false));
        }
      }
    ),
    importAreas: createRx.asyncThunk(
      async (
        { token, file }: { token: string | undefined; file: File },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(areasSlice.actions.setLoading(true));
        try {
          const response = await importAreas({ token, file });
          await dispatch(
            areasSlice.actions.getAreas({
              token,
              params: {
                page: 1,
                size: 10,
              },
            })
          ); // Refresh areas list
          return response;
        } catch (error: any) {
          dispatch(
            areasSlice.actions.setError(error.message || "Error al importar")
          );
          return rejectWithValue(error); // Propaga el error
        } finally {
          dispatch(areasSlice.actions.setLoading(false));
        }
      }
    ),
  }),
  selectors: {
    selectAreas: (state: AreasState) => state.areas,
    selectLoading: (state: AreasState) => state.loading,
    selectError: (state: AreasState) => state.error,
    selectTotalRegistros: (state: AreasState) => state.totalRegistros,
  },
});

export const { actions: areasActions, reducer: areasReducer } = areasSlice;
