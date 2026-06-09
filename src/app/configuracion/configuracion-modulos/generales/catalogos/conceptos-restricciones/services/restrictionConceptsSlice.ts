import { PayloadAction } from "@reduxjs/toolkit";

import { createRestrictionConceptSlice } from "./createSlices";
import {
  createRestrictionConcept,
  updateRestrictionConcept,
  deleteRestrictionConcept,
  getRestrictionConceptById,
  getRestrictionConcepts,
  importRestrictionConcepts,
  toggleRestrictionConceptStatus,
} from "./restrictionConceptsActions";

import type {
  RestrictionConcept,
  RestrictionConceptTypeParams,
  GetRestrictionConceptByIdResponse,
  GetRestrictionConceptsResponse,
} from "./restrictionConceptsTypes";

interface RestrictionConceptsState {
  restrictionConcepts: RestrictionConcept[] | null;
  currentRestrictionConcept: RestrictionConcept | null;
  loading: boolean;
  error: string | null;
  totalRegistros: number;
}

const initialState: RestrictionConceptsState = {
  restrictionConcepts: null,
  currentRestrictionConcept: null,
  loading: false,
  error: null,
  totalRegistros: 0,
};

const restrictionConceptsSlice = createRestrictionConceptSlice({
  name: "restrictionConcepts",
  initialState,
  reducers: (createRx) => ({
    setRestrictionConcepts: createRx.reducer(
      (state, action: PayloadAction<GetRestrictionConceptsResponse>) => {
        state.restrictionConcepts = action.payload.conceptosRestriccionVenta;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentRestrictionConcept: createRx.reducer(
      (state, action: PayloadAction<GetRestrictionConceptByIdResponse>) => {
        state.currentRestrictionConcept =
          action.payload.conceptoRestriccionVenta;
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
      state.restrictionConcepts = null;
      state.currentRestrictionConcept = null;
      state.loading = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    getRestrictionConcepts: createRx.asyncThunk(
      async (
        {
          token,
          params,
        }: {
          token: string | undefined;
          params: RestrictionConceptTypeParams;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(restrictionConceptsSlice.actions.setLoading(true));
        try {
          const response = await getRestrictionConcepts({ token, params });
          dispatch(
            restrictionConceptsSlice.actions.setRestrictionConcepts(response)
          );
        } catch (error: any) {
          dispatch(
            restrictionConceptsSlice.actions.setError(
              error?.message || "Error al obtener los conceptos de restricción"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(restrictionConceptsSlice.actions.setLoading(false));
        }
      }
    ),
    getRestrictionConceptById: createRx.asyncThunk(
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
        dispatch(restrictionConceptsSlice.actions.setLoading(true));
        try {
          const response = await getRestrictionConceptById({ token, id });
          dispatch(
            restrictionConceptsSlice.actions.setCurrentRestrictionConcept(
              response
            )
          );
          return response;
        } catch (error: any) {
          dispatch(
            restrictionConceptsSlice.actions.setError(
              error?.message || "Error al obtener el concepto de restricción"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(restrictionConceptsSlice.actions.setLoading(false));
        }
      }
    ),
    createRestrictionConcept: createRx.asyncThunk(
      async (
        {
          token,
          data,
        }: {
          token: string | undefined;
          data: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(restrictionConceptsSlice.actions.setLoading(true));
        try {
          const response = await createRestrictionConcept({
            token,
            body: data,
          });
          return response;
        } catch (error: any) {
          dispatch(
            restrictionConceptsSlice.actions.setError(
              error?.message || "Error al crear el concepto de restricción"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(restrictionConceptsSlice.actions.setLoading(false));
        }
      }
    ),
    updateRestrictionConcept: createRx.asyncThunk(
      async (
        {
          token,
          id,
          data,
        }: {
          token: string | undefined;
          id: string | null;
          data: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(restrictionConceptsSlice.actions.setLoading(true));
        try {
          const response = await updateRestrictionConcept({
            token,
            id,
            body: data,
          });
          return response;
        } catch (error: any) {
          dispatch(
            restrictionConceptsSlice.actions.setError(
              error?.message || "Error al editar el concepto de restricción"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(restrictionConceptsSlice.actions.setLoading(false));
        }
      }
    ),
    deleteRestrictionConcept: createRx.asyncThunk(
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
        dispatch(restrictionConceptsSlice.actions.setLoading(true));
        try {
          const response = await deleteRestrictionConcept({ token, id });
          await dispatch(
            restrictionConceptsSlice.actions.getRestrictionConcepts({
              token,
              params: {
                page: 1,
                size: 20,
              },
            })
          ); // Refresh the list after deletion
          return response;
        } catch (error: any) {
          dispatch(
            restrictionConceptsSlice.actions.setError(
              error?.message || "Error al eliminar el concepto de restricción"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(restrictionConceptsSlice.actions.setLoading(false));
        }
      }
    ),
    toggleRestrictionConceptStatus: createRx.asyncThunk(
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
        dispatch(restrictionConceptsSlice.actions.setLoading(true));
        try {
          const response = await toggleRestrictionConceptStatus({
            token,
            id,
          });
          await dispatch(
            restrictionConceptsSlice.actions.getRestrictionConcepts({
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
            restrictionConceptsSlice.actions.setError(
              error?.message ||
                "Error al cambiar el estado del concepto de restricción"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(restrictionConceptsSlice.actions.setLoading(false));
        }
      }
    ),
    importRestrictionConcepts: createRx.asyncThunk(
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
        dispatch(restrictionConceptsSlice.actions.setLoading(true));
        try {
          const response = await importRestrictionConcepts({
            token,
            file,
          });
          await dispatch(
            restrictionConceptsSlice.actions.getRestrictionConcepts({
              token,
              params: {
                page: 1,
                size: 20,
              },
            })
          ); // Refresh the list after import
          return response;
        } catch (error: any) {
          dispatch(
            restrictionConceptsSlice.actions.setError(
              error?.message || "Error al importar los conceptos de restricción"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(restrictionConceptsSlice.actions.setLoading(false));
        }
      }
    ),
  }),
  selectors: {
    getRestrictionsConcepts: (state) => state.restrictionConcepts,
    getCurrentRestrictionsConcept: (state) => state.currentRestrictionConcept,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    getTotalRegistros: (state) => state.totalRegistros,
  },
});

export const {
  actions: restrictionConceptsActions,
  reducer: restrictionConceptsReducer,
} = restrictionConceptsSlice;
