import { PayloadAction } from "@reduxjs/toolkit";

import { createKeyConfigurationSlice } from "./createSlices";
import {
  createKeyConfiguration,
  updateKeyConfiguration,
  deleteKeyConfiguration,
  getKeyConfigurationById,
  getKeyConfiguration,
  getCatsType,
} from "./keyConfigurationActions";

import type {
  KeyConfiguration,
  KeyConfigurationParams,
  GetKeyConfiguratiByIdResponse,
  GetKeyConfigurationResponse,
  CatsType,
  GetCatsType,
  GetCatalogoClaveParams,
} from "./keyConfigurationTypes";

interface KeyConfigurationState {
  keyConfiguration: KeyConfiguration[] | null;
  currentKeyConfiguration: KeyConfiguration | null;
  loading: boolean;
  error: string | null;
  totalRegistros: number;
  catalogos: CatsType[];     
  tiposClave: CatsType[]
}

const initialState: KeyConfigurationState = {
  keyConfiguration: null,
  currentKeyConfiguration: null,
  loading: false,
  error: null,
  totalRegistros: 0,
  catalogos: [],
  tiposClave: []
};

const keyConfigurationSlice = createKeyConfigurationSlice({
  name: "keyConfiguration",
  initialState,
  reducers: (createRx) => ({
    setKeyConfiguration: createRx.reducer(
      (state, action: PayloadAction<GetKeyConfigurationResponse>) => {
        state.keyConfiguration = action.payload.catalogs;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentKeyConfiguration: createRx.reducer(
      (state, action: PayloadAction<GetKeyConfiguratiByIdResponse>) => {
        state.currentKeyConfiguration = action.payload.catalog;
      }
    ),
    setLoading: createRx.reducer((state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }),
    setCatsType: createRx.reducer(
      (state, action: PayloadAction<GetCatsType>) => {
        state.catalogos = action.payload.catalogos;
        state.tiposClave = action.payload.tiposClave;
      }
    ),
    setError: createRx.reducer(
      (state, action: PayloadAction<string | null>) => {
        state.error = action.payload;
      }
    ),
    flushAll: createRx.reducer((state) => {
      state.keyConfiguration = null;
      state.currentKeyConfiguration = null;
      state.loading = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    getKeyConfiguration: createRx.asyncThunk(
      async (
        {
          token,
          params,
        }: {
          token: string | undefined;
          params: KeyConfigurationParams;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(keyConfigurationSlice.actions.setLoading(true));
          const response = await getKeyConfiguration({ token, params });
          dispatch(keyConfigurationSlice.actions.setKeyConfiguration(response));
        } catch (error: any) {
          dispatch(
            keyConfigurationSlice.actions.setError(
              error?.message || "Error al obtener tipos de vendedores"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(keyConfigurationSlice.actions.setLoading(false));
        }
      }
    ),
    getKeyConfigurationById: createRx.asyncThunk(
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
          dispatch(keyConfigurationSlice.actions.setLoading(true));
          const response = await getKeyConfigurationById({ token, id });
          dispatch(keyConfigurationSlice.actions.setCurrentKeyConfiguration(response));
          return response;
        } catch (error: any) {
          dispatch(
            keyConfigurationSlice.actions.setError(
              error?.message || "Error al obtener el tipo de vendedor"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(keyConfigurationSlice.actions.setLoading(false));
        }
      }
    ),
    createKeyConfiguration: createRx.asyncThunk(
      async (
        {
          token,
          keyConfiguration,
        }: {
          token: string | undefined;
          keyConfiguration: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(keyConfigurationSlice.actions.setLoading(true));
          const response = await createKeyConfiguration({ token, body: keyConfiguration });
          return response;
        } catch (error: any) {
          dispatch(
            keyConfigurationSlice.actions.setError(
              error?.message || "Error al crear el tipo de vendedor"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(keyConfigurationSlice.actions.setLoading(false));
        }
      }
    ),
    updateKeyConfiguration: createRx.asyncThunk(
      async (
        {
          token,
          id,
          keyConfiguration,
        }: {
          token: string | undefined;
          id: string | null;
          keyConfiguration: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(keyConfigurationSlice.actions.setLoading(true));
          const response = await updateKeyConfiguration({
            token,
            id,
            body: keyConfiguration,
          });
          return response;
        } catch (error: any) {
          dispatch(
            keyConfigurationSlice.actions.setError(
              error?.message || "Error al editar el tipo de vendedor"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(keyConfigurationSlice.actions.setLoading(false));
        }
      }
    ),
    deleteKeyConfiguration: createRx.asyncThunk(
      async (
        {
          token,
          params,
        }: {
          token: string | undefined;
          params: GetCatalogoClaveParams;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(keyConfigurationSlice.actions.setLoading(true));
          const response = await deleteKeyConfiguration({ token, params  });
          await dispatch(
            keyConfigurationSlice.actions.getKeyConfiguration({
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
            keyConfigurationSlice.actions.setError(
              error?.message || "Error al eliminar el tipo de vendedor"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(keyConfigurationSlice.actions.setLoading(false));
        }
      }
    ),
    getCatsType: createRx.asyncThunk(
      async (
        { token }: { token: string | undefined },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(keyConfigurationSlice.actions.setLoading(true));
          const response = await getCatsType({ token });
          dispatch(keyConfigurationSlice.actions.setCatsType(response));
          return response;
        } catch (error: any) {
          dispatch(
            keyConfigurationSlice.actions.setError(
              error?.message || "Error al obtener catálogos y tipos de clave"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(keyConfigurationSlice.actions.setLoading(false));
        }
      }
    ),
  }),
  selectors: {
    getKeyConfiguration: (state) => state.keyConfiguration,
    getCurrentKeyConfiguration: (state) => state.currentKeyConfiguration,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    getTotalRegistros: (state) => state.totalRegistros,
    getCatalogos: (state) => state.catalogos,
    getTiposClave: (state) => state.tiposClave, 
  },
});

export const { actions: keyConfigurationActions, reducer: keyConfigurationReducer } =
  keyConfigurationSlice;
