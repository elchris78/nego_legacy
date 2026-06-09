import { PayloadAction } from "@reduxjs/toolkit";

import { createReturnConceptSlice } from "./createSlices";
import {
  createReturnConcept,
  updateReturnConcept,
  deleteReturnConcept,
  getReturnConcepts,
  toggleReturnConceptStatus,
  importReturnConcepts,
  getReturnConceptById,
} from "./returnConceptsActions";

import type {
  ReturnConcept,
  ReturnConceptTypeParams,
  GetReturnConceptByIdResponse,
  GetReturnConceptsResponse,
} from "./ReturnConceptTypes";

interface ReturnConceptsState {
  returnConcepts: ReturnConcept[] | null;
  currentReturnConcept: ReturnConcept | null;
  loading: boolean;
  error: string | null;
  totalRegistros: number;
}

const initialState: ReturnConceptsState = {
  returnConcepts: null,
  currentReturnConcept: null,
  loading: false,
  error: null,
  totalRegistros: 0,
};

const returnConceptsSlice = createReturnConceptSlice({
  name: "returnConcepts",
  initialState,
  reducers: (createRx) => ({
    setReturnConcepts: createRx.reducer(
      (state, action: PayloadAction<GetReturnConceptsResponse>) => {
        state.returnConcepts = action.payload.conceptosDevolucion;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentReturnConcept: createRx.reducer(
      (state, action: PayloadAction<GetReturnConceptByIdResponse>) => {
        state.currentReturnConcept = action.payload.conceptoDevolucion;
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
      state.returnConcepts = null;
      state.currentReturnConcept = null;
      state.loading = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    getReturnConcepts: createRx.asyncThunk(
      async (
        {
          token,
          params,
        }: {
          token: string | undefined;
          params?: ReturnConceptTypeParams;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(returnConceptsSlice.actions.setLoading(true));
        try {
          const response = await getReturnConcepts({ token, params });
          dispatch(returnConceptsSlice.actions.setReturnConcepts(response));
        } catch (error: any) {
          dispatch(
            returnConceptsSlice.actions.setError(
              error.message || "Error al obtener los conceptos de devolución"
            )
          );
          return rejectWithValue({
            message: error?.message || "Error al obtener áreas",
            stack: error?.stack,
          }); // Propaga el error
        } finally {
          dispatch(returnConceptsSlice.actions.setLoading(false));
        }
      }
    ),
    getReturnConceptById: createRx.asyncThunk(
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
        dispatch(returnConceptsSlice.actions.setLoading(true));
        try {
          const response = await getReturnConceptById({ token, id });
          dispatch(
            returnConceptsSlice.actions.setCurrentReturnConcept(response)
          );
          return response;
        } catch (error: any) {
          dispatch(
            returnConceptsSlice.actions.setError(
              error.message || "Error al obtener el concepto de devolución"
            )
          );
          return rejectWithValue(error); // Propaga el error
        } finally {
          dispatch(returnConceptsSlice.actions.setLoading(false));
        }
      }
    ),
    createReturnConcept: createRx.asyncThunk(
      async (
        {
          token,
          returnConcept,
        }: {
          token: string | undefined;
          returnConcept: ReturnConcept;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(returnConceptsSlice.actions.setLoading(true));
        try {
          const response = await createReturnConcept({
            token,
            body: returnConcept,
          });
          return response;
        } catch (error: any) {
          dispatch(
            returnConceptsSlice.actions.setError(
              error.message || "Error al crear el concepto de devolución"
            )
          );
          return rejectWithValue(error); // Propaga el mensaje de error
        } finally {
          dispatch(returnConceptsSlice.actions.setLoading(false));
        }
      }
    ),
    updateReturnConcept: createRx.asyncThunk(
      async (
        {
          token,
          id,
          returnConcept,
        }: {
          token: string | undefined;
          id: string | null;
          returnConcept: ReturnConcept;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(returnConceptsSlice.actions.setLoading(true));
        try {
          const response = await updateReturnConcept({
            token,
            id,
            body: returnConcept,
          });
          return response;
        } catch (error: any) {
          dispatch(
            returnConceptsSlice.actions.setError(
              error.message || "Error al editar el concepto de devolución"
            )
          );
          return rejectWithValue(error); // Propaga el mensaje de error
        } finally {
          dispatch(returnConceptsSlice.actions.setLoading(false));
        }
      }
    ),
    deleteReturnConcept: createRx.asyncThunk(
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
        dispatch(returnConceptsSlice.actions.setLoading(true));
        try {
          const response = await deleteReturnConcept({ token, id });
          await dispatch(
            returnConceptsSlice.actions.getReturnConcepts({
              token,
              params: {
                page: 1,
                size: 20,
              },
            })
          ); // Refresh the list after toggling status
          return response;
        } catch (error: any) {
          dispatch(
            returnConceptsSlice.actions.setError(
              error.message || "Error al eliminar el concepto de devolución"
            )
          );
          return rejectWithValue(error); // Propaga el mensaje de error
        } finally {
          dispatch(returnConceptsSlice.actions.setLoading(false));
        }
      }
    ),
    toggleReturnConceptStatus: createRx.asyncThunk(
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
        dispatch(returnConceptsSlice.actions.setLoading(true));
        try {
          const response = await toggleReturnConceptStatus({
            token,
            id,
          });
          await dispatch(
            returnConceptsSlice.actions.getReturnConcepts({
              token,
              params: {
                page: 1,
                size: 20,
              },
            })
          ); // Refresh the list after toggling status
          return response;
        } catch (error: any) {
          const errorMessage: string =
            error.message ||
            "Error al cambiar el estado del concepto de devolución";
          dispatch(returnConceptsSlice.actions.setError(errorMessage));
          return rejectWithValue(error); // Propaga el mensaje de error
        } finally {
          dispatch(returnConceptsSlice.actions.setLoading(false));
        }
      }
    ),
    importReturnConcepts: createRx.asyncThunk(
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
        dispatch(returnConceptsSlice.actions.setLoading(true));
        try {
          const response = await importReturnConcepts({
            token,
            file,
          });
          await dispatch(
            returnConceptsSlice.actions.getReturnConcepts({
              token,
              params: {
                page: 1,
                size: 20,
              },
            })
          ); // Refresh the list after toggling status
          return response;
        } catch (error: any) {
          const errorMessage: string =
            error.message || "Error al importar los conceptos de devolución";
          dispatch(returnConceptsSlice.actions.setError(errorMessage));
          return rejectWithValue(error); // Propaga el mensaje de error
        } finally {
          dispatch(returnConceptsSlice.actions.setLoading(false));
        }
      }
    ),
  }),
  selectors: {
    getReturnConcepts: (state) => state.returnConcepts,
    getCurrentReturnConcept: (state) => state.currentReturnConcept,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    getTotalRegistros: (state) => state.totalRegistros,
  },
});

export const {
  actions: returnConceptsActions,
  reducer: returnConceptsReducer,
} = returnConceptsSlice;
