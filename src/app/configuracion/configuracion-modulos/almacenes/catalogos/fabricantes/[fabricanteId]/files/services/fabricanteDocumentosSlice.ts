import { PayloadAction } from "@reduxjs/toolkit";

import { createFabricantesDocumentosSlice } from "./createSlices";
import {
  createFabricanteDocumento,
  updateFabricanteDocumento,
  deleteFabricanteDocumento,
  getFabricanteDocumentoById,
  getFabricanteDocumentos,
} from "./fabricantesDocumentosActions";

import type {
  FabricanteDocumento,
  FabricanteDocumentoTypeParams,
  FabricanteDocumentoByIdResponse,
  GetFabricanteDocumentosResponse,
} from "./fabricantesDocumentosTypes";

interface FabricanteDocumentosState {
  documentos: FabricanteDocumento[] | null;
  currentDocumento: FabricanteDocumento | null;
  loading: boolean; // Indicates if the list of documents is being loaded
  isPending: boolean; // Indicates if a document is being created or updated or deleted
  isLoadingDocument: boolean; // Indicates if a specific document is being loaded
  error: string | null;
  totalRegistros: number;
}

const initialState: FabricanteDocumentosState = {
  documentos: null,
  currentDocumento: null,
  loading: false,
  isPending: false,
  isLoadingDocument: false,
  error: null,
  totalRegistros: 0,
};

const fabricanteDocumentosSlice = createFabricantesDocumentosSlice({
  name: "fabricanteDocumentos",
  initialState,
  reducers: (createRx) => ({
    setDocumentos: createRx.reducer(
      (state, action: PayloadAction<GetFabricanteDocumentosResponse>) => {
        state.documentos = action.payload.documentos;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentDocumento: createRx.reducer(
      (state, action: PayloadAction<FabricanteDocumentoByIdResponse>) => {
        state.currentDocumento = action.payload.documento;
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
      state.documentos = null;
      state.currentDocumento = null;
      state.loading = false;
      state.isPending = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    getFabricanteDocumentos: createRx.asyncThunk(
      async (
        {
          token,
          params,
          fabricanteId,
        }: {
          token: string | undefined;
          params: FabricanteDocumentoTypeParams;
          fabricanteId: string;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(fabricanteDocumentosSlice.actions.setLoading(true));
        try {
          const response = await getFabricanteDocumentos({
            token,
            params,
            fabricanteId,
          });
          dispatch(fabricanteDocumentosSlice.actions.setDocumentos(response));
        } catch (error: any) {
          dispatch(
            fabricanteDocumentosSlice.actions.setError(
              error.message || "Error al obtener documentos"
            )
          );
          return rejectWithValue(error.message);
        } finally {
          dispatch(fabricanteDocumentosSlice.actions.setLoading(false));
        }
      }
    ),
    getFabricanteDocumentoById: createRx.asyncThunk(
      async (
        {
          token,
          id,
          fabricanteId,
        }: {
          token: string | undefined;
          id: string | null;
          fabricanteId: string;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(fabricanteDocumentosSlice.actions.setIsLoadingDocument(true));
        try {
          const response = await getFabricanteDocumentoById({
            token,
            id,
            fabricanteId,
          });
          dispatch(
            fabricanteDocumentosSlice.actions.setCurrentDocumento(response)
          );
          return response;
        } catch (error: any) {
          dispatch(
            fabricanteDocumentosSlice.actions.setError(
              error.message || "Error al obtener documento por ID"
            )
          );
          return rejectWithValue(error.message);
        } finally {
          dispatch(
            fabricanteDocumentosSlice.actions.setIsLoadingDocument(false)
          );
        }
      }
    ),
    createFabricanteDocumento: createRx.asyncThunk(
      async (
        {
          token,
          body,
          fabricanteId,
        }: {
          token: string | undefined;
          body: any;
          fabricanteId: string;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(fabricanteDocumentosSlice.actions.setIsPending(true));
        try {
          const response = await createFabricanteDocumento({
            token,
            body,
            fabricanteId,
          });
          return response;
        } catch (error: any) {
          dispatch(
            fabricanteDocumentosSlice.actions.setError(
              error.message || "Error al crear documento"
            )
          );
          return rejectWithValue(error.message);
        } finally {
          dispatch(fabricanteDocumentosSlice.actions.setIsPending(false));
        }
      }
    ),
    updateFabricanteDocumento: createRx.asyncThunk(
      async (
        {
          token,
          id,
          body,
          fabricanteId,
        }: {
          token: string | undefined;
          id: string | null;
          body: any;
          fabricanteId: string;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(fabricanteDocumentosSlice.actions.setIsPending(true));
        try {
          const response = await updateFabricanteDocumento({
            token,
            id,
            body,
            fabricanteId,
          });
          return response;
        } catch (error: any) {
          dispatch(
            fabricanteDocumentosSlice.actions.setError(
              error.message || "Error al actualizar documento"
            )
          );
          return rejectWithValue(error.message);
        } finally {
          dispatch(fabricanteDocumentosSlice.actions.setIsPending(false));
        }
      }
    ),
    deleteFabricanteDocumento: createRx.asyncThunk(
      async (
        {
          token,
          id,
          fabricanteId,
        }: {
          token: string | undefined;
          id: string | null;
          fabricanteId: string;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(fabricanteDocumentosSlice.actions.setIsPending(true));
        try {
          const response = await deleteFabricanteDocumento({
            token,
            id,
            fabricanteId,
          });
          return response;
        } catch (error: any) {
          dispatch(
            fabricanteDocumentosSlice.actions.setError(
              error.message || "Error al eliminar documento"
            )
          );
          return rejectWithValue(error.message);
        } finally {
          dispatch(fabricanteDocumentosSlice.actions.setIsPending(false));
        }
      }
    ),
  }),
  selectors: {
    selectDocumentos: (state: FabricanteDocumentosState) => state.documentos,
    selectCurrentDocumento: (state: FabricanteDocumentosState) =>
      state.currentDocumento,
    selectLoading: (state: FabricanteDocumentosState) => state.loading,
    selectIsPending: (state: FabricanteDocumentosState) => state.isPending,
    selectError: (state: FabricanteDocumentosState) => state.error,
    selectTotalRegistros: (state: FabricanteDocumentosState) =>
      state.totalRegistros,
  },
});

export const {
  actions: fabricanteDocumentosActions,
  reducer: fabricanteDocumentosReducer,
} = fabricanteDocumentosSlice;
