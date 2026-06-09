import { PayloadAction } from "@reduxjs/toolkit";

import { createColaboradorDocumentacionSlice } from "./createSlices";
import {
  createColaboradorDocumentacion,
  getColaboradorDocumentacion,
  updateColaboradorDocumentacion,
  deleteColaboradorDocumentacion,
  getColaboradorDocumentacionById,
} from "./colaboradorDocumentacionActions";

import type {
  ColaboradorDocumentacion,
  ColaboradorDocumentacionParams,
  GetColaboradorDocumentacionResponse,
  GetColaboradorDocumentacionByIDResponse,
} from "./colaboradorDocumentacionTypes";

interface ColaboradorDocumentacionState {
  documentacion: ColaboradorDocumentacion[] | null;
  currentDocumentacion: ColaboradorDocumentacion | null;
  loading: boolean; // Indicates if the list of documents is being loaded
  isPending: boolean; // Indicates if a document is being created or updated or deleted
  isLoadingDocument: boolean; // Indicates if a specific document is being loaded
  error: string | null;
  totalRegistros: number;
}

const initialState: ColaboradorDocumentacionState = {
  documentacion: null,
  currentDocumentacion: null,
  loading: false,
  isPending: false,
  isLoadingDocument: false,
  error: null,
  totalRegistros: 0,
};

const colaboradorDocumentacionSlice = createColaboradorDocumentacionSlice({
  name: "colaboradorDocumentacion",
  initialState,
  reducers: (createRx) => ({
    setDocumentacion: createRx.reducer(
      (state, action: PayloadAction<GetColaboradorDocumentacionResponse>) => {
        state.documentacion = action.payload.documentos;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentDocumentacion: createRx.reducer(
      (
        state,
        action: PayloadAction<GetColaboradorDocumentacionByIDResponse>
      ) => {
        state.currentDocumentacion = action.payload.documento;
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
      state.totalRegistros = 0;
    }),
    getColaboradorDocumentacion: createRx.asyncThunk(
      async (
        {
          token,
          params,
          colaboradorId,
        }: {
          token: string | undefined;
          params: ColaboradorDocumentacionParams;
          colaboradorId: string;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(colaboradorDocumentacionSlice.actions.setLoading(true));
        try {
          const response = await getColaboradorDocumentacion({
            token,
            params,
            colaboradorId,
          });
          dispatch(
            colaboradorDocumentacionSlice.actions.setDocumentacion(response)
          );
        } catch (error: any) {
          dispatch(
            colaboradorDocumentacionSlice.actions.setError(
              error?.message ||
                "Error al obtener la documentación del colaborador"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(colaboradorDocumentacionSlice.actions.setLoading(false));
        }
      }
    ),
    createColaboradorDocumentacion: createRx.asyncThunk(
      async (
        {
          token,
          body,
          colaboradorId,
        }: { token: string | undefined; body: any; colaboradorId: string },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(colaboradorDocumentacionSlice.actions.setIsPending(true));
        try {
          const response = await createColaboradorDocumentacion({
            token,
            body,
            colaboradorId,
          });
          return response;
        } catch (error: any) {
          dispatch(
            colaboradorDocumentacionSlice.actions.setError(
              error?.message ||
                "Error al crear la documentación del colaborador"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(colaboradorDocumentacionSlice.actions.setIsPending(false));
        }
      }
    ),
    updateColaboradorDocumentacion: createRx.asyncThunk(
      async (
        {
          token,
          id,
          body,
          colaboradorId,
        }: {
          token: string | undefined;
          id: string | null;
          body: any;
          colaboradorId: string;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(colaboradorDocumentacionSlice.actions.setIsPending(true));
        try {
          const response = await updateColaboradorDocumentacion({
            token,
            id,
            body,
            colaboradorId,
          });
          return response;
        } catch (error: any) {
          dispatch(
            colaboradorDocumentacionSlice.actions.setError(
              error?.message ||
                "Error al actualizar la documentación del colaborador"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(colaboradorDocumentacionSlice.actions.setIsPending(false));
        }
      }
    ),
    deleteColaboradorDocumentacion: createRx.asyncThunk(
      async (
        {
          token,
          id,
          colaboradorId,
        }: {
          token: string | undefined;
          id: string | null;
          colaboradorId: string;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(colaboradorDocumentacionSlice.actions.setIsPending(true));
        try {
          const response = await deleteColaboradorDocumentacion({
            token,
            id,
            colaboradorId,
          });
          return response;
        } catch (error: any) {
          dispatch(
            colaboradorDocumentacionSlice.actions.setError(
              error?.message ||
                "Error al eliminar la documentación del colaborador"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(colaboradorDocumentacionSlice.actions.setIsPending(false));
        }
      }
    ),
    getColaboradorDocumentacionById: createRx.asyncThunk(
      async (
        {
          token,
          id,
          colaboradorId,
        }: {
          token: string | undefined;
          id: string | null;
          colaboradorId: string;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(
          colaboradorDocumentacionSlice.actions.setIsLoadingDocument(true)
        );
        try {
          const response = await getColaboradorDocumentacionById({
            token,
            id,
            colaboradorId,
          });
          dispatch(
            colaboradorDocumentacionSlice.actions.setCurrentDocumentacion(
              response
            )
          );
          return response;
        } catch (error: any) {
          dispatch(
            colaboradorDocumentacionSlice.actions.setError(
              error?.message ||
                "Error al obtener la documentación del colaborador por ID"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(
            colaboradorDocumentacionSlice.actions.setIsLoadingDocument(false)
          );
        }
      }
    ),
  }),
  selectors: {
    selectDocumentacion: (state: ColaboradorDocumentacionState) =>
      state.documentacion,
    selectAllDocumentacion: (state: ColaboradorDocumentacionState) =>
      state.currentDocumentacion,
    selectLoading: (state: ColaboradorDocumentacionState) => state.loading,
    selectError: (state: ColaboradorDocumentacionState) => state.error,
  },
});

export const {
  actions: colaboradorDocumentacionActions,
  reducer: colaboradorDocumentacionReducer,
} = colaboradorDocumentacionSlice;
