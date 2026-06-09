import { PayloadAction } from "@reduxjs/toolkit";

import { createClientTypesSlice } from "./createSlices";
import {
  createClientType,
  updateClientType,
  deleteClientType,
  getClientTypeById,
  getClientTypes,
  importClientTypesFromExcel,
  toggleClientTypeStatus,
} from "./clientTypesActions";

import type {
  ClientType,
  ClientTypeParams,
  GetClientTypeByIdResponse,
  GetClientTypesResponse,
} from "./clientTypes";

interface ClientTypesState {
  clientTypes: ClientType[] | null;
  currentClientType: ClientType | null;
  loading: boolean;
  error: string | null;
  totalRegistros: number;
}

const initialState: ClientTypesState = {
  clientTypes: null,
  currentClientType: null,
  loading: false,
  error: null,
  totalRegistros: 0,
};

const clientTypesSlice = createClientTypesSlice({
  name: "clientTypes",
  initialState,
  reducers: (createRx) => ({
    setClientTypes: createRx.reducer(
      (state, action: PayloadAction<GetClientTypesResponse>) => {
        state.clientTypes = action.payload.tipoClientes;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentClientType: createRx.reducer(
      (state, action: PayloadAction<GetClientTypeByIdResponse>) => {
        state.currentClientType = action.payload.tipoCliente;
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
      state.clientTypes = null;
      state.currentClientType = null;
      state.loading = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    getClientTypes: createRx.asyncThunk(
      async (
        {
          token,
          params,
        }: {
          token: string | undefined;
          params: ClientTypeParams;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(clientTypesSlice.actions.setLoading(true));
          const response = await getClientTypes({ token, params });
          dispatch(clientTypesSlice.actions.setClientTypes(response));
        } catch (error: any) {
          dispatch(
            clientTypesSlice.actions.setError(
              error?.message || "Error al obtener tipos de clientes"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(clientTypesSlice.actions.setLoading(false));
        }
      }
    ),
    getClientTypeById: createRx.asyncThunk(
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
        try {
          dispatch(clientTypesSlice.actions.setLoading(true));
          const response = await getClientTypeById({ token, id });
          dispatch(clientTypesSlice.actions.setCurrentClientType(response));
          return response;
        } catch (error: any) {
          dispatch(
            clientTypesSlice.actions.setError(
              error?.message || "Error al obtener el tipo de cliente"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(clientTypesSlice.actions.setLoading(false));
        }
      }
    ),
    createClientType: createRx.asyncThunk(
      async (
        {
          token,
          clientType,
        }: {
          token: string | undefined;
          clientType: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(clientTypesSlice.actions.setLoading(true));
          const response = await createClientType({ token, body: clientType });
          return response;
        } catch (error: any) {
          dispatch(
            clientTypesSlice.actions.setError(
              error?.message || "Error al crear el tipo de cliente"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(clientTypesSlice.actions.setLoading(false));
        }
      }
    ),
    updateClientType: createRx.asyncThunk(
      async (
        {
          token,
          id,
          clientType,
        }: {
          token: string | undefined;
          id: string | null;
          clientType: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(clientTypesSlice.actions.setLoading(true));
          const response = await updateClientType({
            token,
            id,
            body: clientType,
          });
          return response;
        } catch (error: any) {
          dispatch(
            clientTypesSlice.actions.setError(
              error?.message || "Error al editar el tipo de cliente"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(clientTypesSlice.actions.setLoading(false));
        }
      }
    ),
    deleteClientType: createRx.asyncThunk(
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
        try {
          dispatch(clientTypesSlice.actions.setLoading(true));
          const response = await deleteClientType({ token, id });
          await dispatch(
            clientTypesSlice.actions.getClientTypes({
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
            clientTypesSlice.actions.setError(
              error?.message || "Error al eliminar el tipo de cliente"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(clientTypesSlice.actions.setLoading(false));
        }
      }
    ),
    importClientTypesFromExcel: createRx.asyncThunk(
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
        try {
          dispatch(clientTypesSlice.actions.setLoading(true));
          const response = await importClientTypesFromExcel({ token, file });
          await dispatch(
            clientTypesSlice.actions.getClientTypes({
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
            clientTypesSlice.actions.setError(
              error?.message || "Error al importar tipos de clientes"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(clientTypesSlice.actions.setLoading(false));
        }
      }
    ),
    toggleClientTypeStatus: createRx.asyncThunk(
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
        try {
          dispatch(clientTypesSlice.actions.setLoading(true));
          const response = await toggleClientTypeStatus({
            token,
            id,
          });
          await dispatch(
            clientTypesSlice.actions.getClientTypes({
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
            clientTypesSlice.actions.setError(
              error?.message || "Error al cambiar el estado del tipo de cliente"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(clientTypesSlice.actions.setLoading(false));
        }
      }
    ),
  }),
  selectors: {
    getClientTypes: (state) => state.clientTypes,
    getCurrentClientType: (state) => state.currentClientType,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    getTotalRegistros: (state) => state.totalRegistros,
  },
});

export const { actions: clientTypesActions, reducer: clientTypesReducer } =
  clientTypesSlice;
