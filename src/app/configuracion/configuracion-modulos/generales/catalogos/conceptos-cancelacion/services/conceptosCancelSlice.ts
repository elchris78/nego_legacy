import { PayloadAction } from "@reduxjs/toolkit";

import { createConceptosCancelSlice } from "./createSlice";  
import {
    createCancelConcepts,
    updateCancelConcepts,
    getCancelConcepts,
    getCancelConceptsById,
    deleteCancelConcepts,
    toggleCancelConceptsStatus,
    importConceptCancel,
    getMotivosSat
} from "./conceptosCancelAction"

import type {
    CancelConcepts,
    CancelConceptsParams,
    GetCancelConceptsResponse,
    GetCancelConceptResponse,
} from "./cancelConceptsTypes";

interface CancelConceptsState {
  cancelConcepts: CancelConcepts[] | null;
  currentCancelConcepts: CancelConcepts | null;
  motivosSat: { c_Periodicidad: string; descripcion: string }[];
  loading: boolean;
  error: string | null;
  totalRegistros: number;
}

const initialState: CancelConceptsState = {
  cancelConcepts: null,
  currentCancelConcepts: null,
  motivosSat: [],
  loading: false,
  error: null,
  totalRegistros: 0,
};

const cancelConceptsSlice = createConceptosCancelSlice({
  name: "CancelConcepts",
  initialState,
  reducers: (createRx) => ({
    setConceptCancel: createRx.reducer(
      (state, action: PayloadAction<GetCancelConceptsResponse>) => {
        state.cancelConcepts = action.payload.conceptosCancelacion;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentConceptCancel: createRx.reducer(
      (state, action: PayloadAction<GetCancelConceptResponse>) => {
        state.currentCancelConcepts = action.payload.conceptoCancelacion;
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
    setMotivosSat: createRx.reducer(
      (state, action: PayloadAction<{ c_Periodicidad: string; descripcion: string }[]>) => {
        state.motivosSat = action.payload;
      }
    ),
    flushAll: createRx.reducer((state) => {
      state.cancelConcepts = null;
      state.currentCancelConcepts = null;
      state.loading = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    getConceptCancel: createRx.asyncThunk(
      async (
        { token, params }: { token: string | undefined; params?: CancelConceptsParams },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(cancelConceptsSlice.actions.setLoading(true));
        try {
          const conceptCancel = await getCancelConcepts({ token, params });
          dispatch(cancelConceptsSlice.actions.setConceptCancel(conceptCancel));
          return conceptCancel;
        } catch (error: any) {
          dispatch(cancelConceptsSlice.actions.setError(error.message));
          return rejectWithValue({
            message: error?.message || "Error al obtener áreas",
            stack: error?.stack,
          });
        } finally {
          dispatch(cancelConceptsSlice.actions.setLoading(false));
        }
      }
    ),
    createConceptCancel: createRx.asyncThunk(
      async (
        { token, conceptCancel }: { token: string; conceptCancel: CancelConcepts },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(cancelConceptsSlice.actions.setLoading(true));
        try {
          const response = await createCancelConcepts({ token, body: conceptCancel });
          return response;
        } catch (error: any) {
          dispatch(cancelConceptsSlice.actions.setError(error.message));
          return rejectWithValue(error.message);
        } finally {
          dispatch(cancelConceptsSlice.actions.setLoading(false));
        }
      }
    ),
    updateConceptCancel: createRx.asyncThunk(
      async (
        { token, id, ConceptCancel }: { token: string; id: string; ConceptCancel: CancelConcepts },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(cancelConceptsSlice.actions.setLoading(true));
        try {
          const response = await updateCancelConcepts({ token, id, body: ConceptCancel });
          return response;
        } catch (error: any) {
          dispatch(cancelConceptsSlice.actions.setError(error.message));
          return rejectWithValue(error.message);
        } finally {
          dispatch(cancelConceptsSlice.actions.setLoading(false));
        }
      }
    ),
    deleteConceptCancel: createRx.asyncThunk(
      async (
        { token, id }: { token: string; id: string },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(cancelConceptsSlice.actions.setLoading(true));
        try {
          const response = await deleteCancelConcepts({ token, id });
          await dispatch(cancelConceptsSlice.actions.getConceptCancel({ token })); // Refresh areas list
          return response;
        } catch (error: any) {
          dispatch(cancelConceptsSlice.actions.setError(error.message));
          return rejectWithValue(error.message);
        } finally {
          dispatch(cancelConceptsSlice.actions.setLoading(false));
        }
      }
    ),
    getConceptCancelById: createRx.asyncThunk(
      async (
        { token, id }: { token: string; id: string },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(cancelConceptsSlice.actions.setLoading(true));
        try {
          const response = await getCancelConceptsById({ token, id });
          dispatch(cancelConceptsSlice.actions.setCurrentConceptCancel(response));
          return response;
        } catch (error: any) {
          dispatch(cancelConceptsSlice.actions.setError(error.message));
          return rejectWithValue(error.message);
        } finally {
          dispatch(cancelConceptsSlice.actions.setLoading(false));
        }
      }
    ),
    toggleConceptCancelStatus: createRx.asyncThunk(
      async (
        { token, id, isActive }: { token: string; id: string, isActive: boolean },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(cancelConceptsSlice.actions.setLoading(true));
        try {
          const response = await toggleCancelConceptsStatus({ token, id, isActive  });
          await dispatch(cancelConceptsSlice.actions.getConceptCancel({ token })); // Refresh areas list
          return response;
        } catch (error: any) {
          dispatch(cancelConceptsSlice.actions.setError(error.message));
          return rejectWithValue(error.message);
        } finally {
          dispatch(cancelConceptsSlice.actions.setLoading(false));
        }
      }
    ),
    importConceptCancel: createRx.asyncThunk(
      async (
        { token, file }: { token: string | undefined; file: File },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(cancelConceptsSlice.actions.setLoading(true));
        try {
          const response = await importConceptCancel({ token, file });
          await dispatch(cancelConceptsSlice.actions.getConceptCancel({ token, params: {} }));
          return response;
        } catch (error: any) {
          dispatch(cancelConceptsSlice.actions.setError(error.message || "Error al importar"));
          return rejectWithValue(error);
        } finally {
          dispatch(cancelConceptsSlice.actions.setLoading(false));
        }
      }
    ),
    getMotivosSat: createRx.asyncThunk(
      async (
        { token }: { token: string | undefined },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(cancelConceptsSlice.actions.setLoading(true));
        try {
          const response = await getMotivosSat({ token });
          dispatch(cancelConceptsSlice.actions.setMotivosSat(response)); // 👈 actualiza el state
          return response;
        } catch (error: any) {
          dispatch(cancelConceptsSlice.actions.setError(error.message || "Error al obtener motivos SAT"));
          return rejectWithValue(error);
        } finally {
          dispatch(cancelConceptsSlice.actions.setLoading(false));
        }
      }
    ),
  }),
  selectors: {
    selectcancelConcepts: (state: CancelConceptsState) => state.cancelConcepts,
    selectLoading: (state: CancelConceptsState) => state.loading,
    selectError: (state: CancelConceptsState) => state.error,
    selectTotalRegistros: (state: CancelConceptsState) => state.totalRegistros,
  },
});

export const { actions: CancelConceptsActions, reducer: CancelConceptsReducer } = cancelConceptsSlice;
