import { PayloadAction } from "@reduxjs/toolkit";

import { createEmpresaDocumentacionSlice } from "./createSlices";
import {
  createEmpresaDocumentacionAdicional,
  getEmpresaDocumentacionAdicional,
  updateEmpresaDocumentacionAdicional,
  deleteEmpresaDocumentacionAdicional,
  getEmpresaDocumentacionAdicionalByID,
} from "./empresaDocumentacionAdicionalActions";

import type {
  EmpresaDocumentacionAdicional,
  EmpresaDocumentacionAdicionalParams,
  GetEmpresaDocumentacionAdicionalResponse,
  GetEmpresaDocumentacionAdicionalByIDResponse,
} from "./empresaDocumentacionAdicionalTypes";

interface EmpresaDocumentacionAdicionalState {
  documentacion: EmpresaDocumentacionAdicional[] | null;
  currentDocumentacion: EmpresaDocumentacionAdicional | null;
  loading: boolean; // Indicates if the list of documents is being loaded
  isPending: boolean; // Indicates if a document is being created or updated or deleted
  isLoadingDocument: boolean; // Indicates if a specific document is being loaded
  error: string | null;
  totalRegistros: number;
}

const initialState: EmpresaDocumentacionAdicionalState = {
  documentacion: null,
  currentDocumentacion: null,
  loading: false,
  isPending: false,
  isLoadingDocument: false,
  error: null,
  totalRegistros: 0,
};

const empresaDocumentacionAdicionalSlice = createEmpresaDocumentacionSlice({
  name: "empresaDocumentacionAdicional",
  initialState,
  reducers: (createRx) => ({
    setDocumentacion: createRx.reducer(
      (
        state,
        action: PayloadAction<GetEmpresaDocumentacionAdicionalResponse>
      ) => {
        state.documentacion = action.payload.documentos;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentDocumentacion: createRx.reducer(
      (state, action: PayloadAction<EmpresaDocumentacionAdicional | null>) => {
        state.currentDocumentacion = action.payload;
      }
    ),
    setLoading: createRx.reducer((state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }),
    setIsPending: createRx.reducer((state, action: PayloadAction<boolean>) => {
      state.isPending = action.payload;
    }),
    setIsLoadingDocument: createRx.reducer(
      (state, action: PayloadAction<boolean>) => {
        state.isLoadingDocument = action.payload;
      }
    ),
    setError: createRx.reducer(
      (state, action: PayloadAction<string | null>) => {
        state.error = action.payload;
      }
    ),
    flushAll: createRx.reducer((state) => {
      state.documentacion = null;
      state.currentDocumentacion = null;
      state.loading = false;
      state.error = null;
      state.isPending = false;
      state.isLoadingDocument = false;
      state.totalRegistros = 0;
    }),
    getEmpresaDocumentacionAdicional: createRx.asyncThunk(
      async (
        {
          token,
          params,
          empresaId,
        }: {
          token: string | undefined;
          params: EmpresaDocumentacionAdicionalParams;
          empresaId: string;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(empresaDocumentacionAdicionalSlice.actions.setLoading(true));
        try {
          const response = await getEmpresaDocumentacionAdicional({
            token,
            empresaId,
            params,
          });
          dispatch(
            empresaDocumentacionAdicionalSlice.actions.setDocumentacion(
              response
            )
          );
        } catch (error: any) {
          dispatch(
            empresaDocumentacionAdicionalSlice.actions.setError(
              error.message || "Error fetching documents"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(
            empresaDocumentacionAdicionalSlice.actions.setLoading(false)
          );
        }
      }
    ),
    createEmpresaDocumentacionAdicional: createRx.asyncThunk(
      async (
        {
          token,
          body,
          empresaId,
        }: {
          token: string | undefined;
          body: any;
          empresaId: string;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(empresaDocumentacionAdicionalSlice.actions.setIsPending(true));
        try {
          const response = await createEmpresaDocumentacionAdicional({
            token,
            body,
            empresaId,
          });
          return response;
        } catch (error: any) {
          dispatch(
            empresaDocumentacionAdicionalSlice.actions.setError(
              error.message || "Error creating document"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(
            empresaDocumentacionAdicionalSlice.actions.setIsPending(false)
          );
        }
      }
    ),
    updateEmpresaDocumentacionAdicional: createRx.asyncThunk(
      async (
        {
          token,
          id,
          body,
          empresaId,
        }: {
          token: string | undefined;
          id: string | null;
          body: any;
          empresaId: string;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(empresaDocumentacionAdicionalSlice.actions.setIsPending(true));
        try {
          const response = await updateEmpresaDocumentacionAdicional({
            token,
            id,
            body,
            empresaId,
          });
          return response;
        } catch (error: any) {
          dispatch(
            empresaDocumentacionAdicionalSlice.actions.setError(
              error.message || "Error updating document"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(
            empresaDocumentacionAdicionalSlice.actions.setIsPending(false)
          );
        }
      }
    ),
    deleteEmpresaDocumentacionAdicional: createRx.asyncThunk(
      async (
        {
          token,
          id,
          empresaId,
        }: { token: string | undefined; id: string | null; empresaId: string },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(empresaDocumentacionAdicionalSlice.actions.setIsPending(true));
        try {
          const response = await deleteEmpresaDocumentacionAdicional({
            token,
            id,
            empresaId,
          });
          return response;
        } catch (error: any) {
          dispatch(
            empresaDocumentacionAdicionalSlice.actions.setError(
              error.message || "Error deleting document"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(
            empresaDocumentacionAdicionalSlice.actions.setIsPending(false)
          );
        }
      }
    ),
    getEmpresaDocumentacionAdicionalByID: createRx.asyncThunk(
      async (
        {
          token,
          id,
          empresaId,
        }: { token: string | undefined; id: string | null; empresaId: string },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(
          empresaDocumentacionAdicionalSlice.actions.setIsLoadingDocument(true)
        );
        try {
          const response = await getEmpresaDocumentacionAdicionalByID({
            token,
            id,
            empresaId,
          });
          dispatch(
            empresaDocumentacionAdicionalSlice.actions.setCurrentDocumentacion(
              response.documento
            )
          );
          return response;
        } catch (error: any) {
          dispatch(
            empresaDocumentacionAdicionalSlice.actions.setError(
              error.message || "Error fetching document"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(
            empresaDocumentacionAdicionalSlice.actions.setIsLoadingDocument(
              false
            )
          );
        }
      }
    ),
  }),
  selectors: {
    selectDocumentacion: (state: EmpresaDocumentacionAdicionalState) =>
      state.documentacion,
    selectCurrentDocumentacion: (state: EmpresaDocumentacionAdicionalState) =>
      state.currentDocumentacion,
    selectLoading: (state: EmpresaDocumentacionAdicionalState) => state.loading,
    selectIsPending: (state: EmpresaDocumentacionAdicionalState) =>
      state.isPending,
    selectIsLoadingDocument: (state: EmpresaDocumentacionAdicionalState) =>
      state.isLoadingDocument,
    selectError: (state: EmpresaDocumentacionAdicionalState) => state.error,
    selectTotalRegistros: (state: EmpresaDocumentacionAdicionalState) =>
      state.totalRegistros,
  },
});

export const {
  actions: empresaDocumentacionAdicionalActions,
  reducer: empresaDocumentacionAdicionalReducer,
} = empresaDocumentacionAdicionalSlice;
