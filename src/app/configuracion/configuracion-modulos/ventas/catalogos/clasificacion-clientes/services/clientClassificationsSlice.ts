import { PayloadAction } from "@reduxjs/toolkit";

import { createClientClassificationSlice } from "./createSlices";
import {
  createClientClassification,
  getClientClassifications,
  updateClientClassification,
  deleteClientClassification,
  getClientClassification,
  toggleClientClassificationStatus,
  importClientClassifications,
} from "./clientClassificationsActions";

import type {
  ClientClassification,
  ClientClassificationParams,
  GetClientClassificationsResponse,
  GetClientClassificationResponse,
} from "./clientesClassificationTypes";

interface ClientClassificationsState {
  clientClassifications: ClientClassification[] | null;
  currentClientClassification: ClientClassification | null;
  loading: boolean;
  error: string | null;
  totalRegistros: number;
}

const initialState: ClientClassificationsState = {
  clientClassifications: null,
  currentClientClassification: null,
  loading: false,
  error: null,
  totalRegistros: 0,
};

const clientClassificationsSlice = createClientClassificationSlice({
  name: "clientClassifications",
  initialState,
  reducers: (createRx) => ({
    setClientClassifications: createRx.reducer(
      (state, action: PayloadAction<GetClientClassificationsResponse>) => {
        state.clientClassifications = action.payload.clasificaciones;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentClientClassification: createRx.reducer(
      (state, action: PayloadAction<GetClientClassificationResponse>) => {
        state.currentClientClassification = action.payload.clasificacion;
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
      state.clientClassifications = null;
      state.currentClientClassification = null;
      state.loading = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    getClientClassifications: createRx.asyncThunk(
      async (
        {
          token,
          params,
        }: {
          token: string | undefined;
          params?: ClientClassificationParams;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(clientClassificationsSlice.actions.setLoading(true));
        try {
          const response = await getClientClassifications({
            token,
            params,
          });
          dispatch(clientClassificationsSlice.actions.setLoading(false));
          dispatch(
            clientClassificationsSlice.actions.setClientClassifications(
              response
            )
          );
        } catch (error: any) {
          dispatch(
            clientClassificationsSlice.actions.setError(
              error.message ||
                "Error al obtener las clasificaciones de clientes"
            )
          );
          return rejectWithValue({
            message: error?.message || "Error",
            stack: error?.stack,
          });
        } finally {
          dispatch(clientClassificationsSlice.actions.setLoading(false));
        }
      }
    ),
    createClientClassification: createRx.asyncThunk(
      async (
        {
          token,
          clientClassification,
        }: {
          token: string | undefined;
          clientClassification: ClientClassification;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(clientClassificationsSlice.actions.setLoading(true));
        try {
          const response = await createClientClassification({
            token,
            body: clientClassification,
          });
          return response;
        } catch (error: any) {
          dispatch(
            clientClassificationsSlice.actions.setError(
              error.message || "Error al crear la clasificación de cliente"
            )
          );
          return rejectWithValue(error); // Propaga el mensaje de error
        } finally {
          dispatch(clientClassificationsSlice.actions.setLoading(false));
        }
      }
    ),
    updateClientClassification: createRx.asyncThunk(
      async (
        {
          token,
          id,
          clientClassification,
        }: {
          token: string | undefined;
          id: string | null;
          clientClassification: ClientClassification;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(clientClassificationsSlice.actions.setLoading(true));
        try {
          const response = await updateClientClassification({
            token,
            id,
            body: clientClassification,
          });
          return response;
        } catch (error: any) {
          dispatch(
            clientClassificationsSlice.actions.setError(
              error.message || "Error al editar la clasificación de cliente"
            )
          );
          return rejectWithValue(error); // Propaga el mensaje de error
        } finally {
          dispatch(clientClassificationsSlice.actions.setLoading(false));
        }
      }
    ),
    deleteClientClassification: createRx.asyncThunk(
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
        dispatch(clientClassificationsSlice.actions.setLoading(true));
        try {
          const response = await deleteClientClassification({
            token,
            id,
          });
          await dispatch(
            clientClassificationsSlice.actions.getClientClassifications({
              token,
              params: {},
            }) // Refresh client classifications list
          );
          return response;
        } catch (error: any) {
          dispatch(
            clientClassificationsSlice.actions.setError(
              error.message || "Error al eliminar la clasificación de cliente"
            )
          );
          return rejectWithValue(error); // Propaga el mensaje de error
        } finally {
          dispatch(clientClassificationsSlice.actions.setLoading(false));
        }
      }
    ),
    getClientClassification: createRx.asyncThunk(
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
        dispatch(clientClassificationsSlice.actions.setLoading(true));
        try {
          const response = await getClientClassification({
            token,
            id,
          });
          dispatch(
            clientClassificationsSlice.actions.setCurrentClientClassification(
              response
            )
          );
          return response;
        } catch (error: any) {
          dispatch(
            clientClassificationsSlice.actions.setError(
              error.message || "Error al obtener la clasificación de cliente"
            )
          );
          return rejectWithValue(error); // Propaga el mensaje de error
        } finally {
          dispatch(clientClassificationsSlice.actions.setLoading(false));
        }
      }
    ),
    toggleClientClassificationStatus: createRx.asyncThunk(
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
        dispatch(clientClassificationsSlice.actions.setLoading(true));
        try {
          const response = await toggleClientClassificationStatus({
            token,
            id,
          });
          await dispatch(
            clientClassificationsSlice.actions.getClientClassifications({
              token,
              params: {},
            }) // Refresh client classifications list
          );
          return response;
        } catch (error: any) {
          dispatch(
            clientClassificationsSlice.actions.setError(
              error.message ||
                "Error al cambiar el estatus de la clasificación de cliente"
            )
          );
          return rejectWithValue(error); // Propaga el mensaje de error
        } finally {
          dispatch(clientClassificationsSlice.actions.setLoading(false));
        }
      }
    ),
    importClientClassifications: createRx.asyncThunk(
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
        dispatch(clientClassificationsSlice.actions.setLoading(true));
        try {
          const response = await importClientClassifications({
            token,
            file,
          });
          await dispatch(
            clientClassificationsSlice.actions.getClientClassifications({
              token,
              params: {
                page: 1,
                size: 20,
              },
            }) // Refresh client classifications list
          );
          return response;
        } catch (error: any) {
          dispatch(
            clientClassificationsSlice.actions.setError(
              error.message ||
                "Error al importar las clasificaciones de clientes"
            )
          );
          return rejectWithValue(error); // Propaga el mensaje de error
        } finally {
          dispatch(clientClassificationsSlice.actions.setLoading(false));
        }
      }
    ),
  }),
  selectors: {
    getClientClassifications: (state) => state.clientClassifications,
    getCurrentClientClassification: (state) =>
      state.currentClientClassification,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    getTotalRegistros: (state) => state.totalRegistros,
  },
});

export const {
  actions: clientClassificationsActions,
  reducer: clientClassificationsReducer,
} = clientClassificationsSlice;
