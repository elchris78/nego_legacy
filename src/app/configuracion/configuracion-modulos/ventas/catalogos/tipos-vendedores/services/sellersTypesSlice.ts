import { PayloadAction } from "@reduxjs/toolkit";

import { createSellersTypesSlice } from "./createSlices";
import {
  createSellersType,
  updateSellersType,
  deleteSellersType,
  getSellersTypeById,
  getSellerTypes,
  importSellersTypesFromExcel,
  toggleSellersTypeStatus,
} from "./sellersTypesActions";

import type {
  SellersType,
  SellersTypeParams,
  GetSellerTypeByIdResponse,
  GetSellersTypesResponse,
} from "./sellersTypes";

interface SellersTypesState {
  sellersTypes: SellersType[] | null;
  currentSellersType: SellersType | null;
  loading: boolean;
  error: string | null;
  totalRegistros: number;
}

const initialState: SellersTypesState = {
  sellersTypes: null,
  currentSellersType: null,
  loading: false,
  error: null,
  totalRegistros: 0,
};

const sellersTypesSlice = createSellersTypesSlice({
  name: "sellersTypes",
  initialState,
  reducers: (createRx) => ({
    setSellersTypes: createRx.reducer(
      (state, action: PayloadAction<GetSellersTypesResponse>) => {
        state.sellersTypes = action.payload.tiposVendedor;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentSellersTypes: createRx.reducer(
      (state, action: PayloadAction<GetSellerTypeByIdResponse>) => {
        state.currentSellersType = action.payload.tipoVendedor;
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
      state.sellersTypes = null;
      state.currentSellersType = null;
      state.loading = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    getSellersTypes: createRx.asyncThunk(
      async (
        {
          token,
          params,
        }: {
          token: string | undefined;
          params: SellersTypeParams;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(sellersTypesSlice.actions.setLoading(true));
          const response = await getSellerTypes({ token, params });
          dispatch(sellersTypesSlice.actions.setSellersTypes(response));
        } catch (error: any) {
          dispatch(
            sellersTypesSlice.actions.setError(
              error?.message || "Error al obtener tipos de vendedores"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sellersTypesSlice.actions.setLoading(false));
        }
      }
    ),
    getSellersTypeById: createRx.asyncThunk(
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
          dispatch(sellersTypesSlice.actions.setLoading(true));
          const response = await getSellersTypeById({ token, id });
          dispatch(sellersTypesSlice.actions.setCurrentSellersTypes(response));
          return response;
        } catch (error: any) {
          dispatch(
            sellersTypesSlice.actions.setError(
              error?.message || "Error al obtener el tipo de vendedor"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sellersTypesSlice.actions.setLoading(false));
        }
      }
    ),
    createSellersType: createRx.asyncThunk(
      async (
        {
          token,
          sellersTypes,
        }: {
          token: string | undefined;
          sellersTypes: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(sellersTypesSlice.actions.setLoading(true));
          const response = await createSellersType({ token, body: sellersTypes });
          return response;
        } catch (error: any) {
          dispatch(
            sellersTypesSlice.actions.setError(
              error?.message || "Error al crear el tipo de vendedor"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sellersTypesSlice.actions.setLoading(false));
        }
      }
    ),
    updateSellersType: createRx.asyncThunk(
      async (
        {
          token,
          id,
          sellersTypes,
        }: {
          token: string | undefined;
          id: string | null;
          sellersTypes: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(sellersTypesSlice.actions.setLoading(true));
          const response = await updateSellersType({
            token,
            id,
            body: sellersTypes,
          });
          return response;
        } catch (error: any) {
          dispatch(
            sellersTypesSlice.actions.setError(
              error?.message || "Error al editar el tipo de vendedor"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sellersTypesSlice.actions.setLoading(false));
        }
      }
    ),
    deleteSellersType: createRx.asyncThunk(
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
          dispatch(sellersTypesSlice.actions.setLoading(true));
          const response = await deleteSellersType({ token, id });
          await dispatch(
            sellersTypesSlice.actions.getSellersTypes({
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
            sellersTypesSlice.actions.setError(
              error?.message || "Error al eliminar el tipo de vendedor"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sellersTypesSlice.actions.setLoading(false));
        }
      }
    ),
    importSellersTypesFromExcel: createRx.asyncThunk(
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
          dispatch(sellersTypesSlice.actions.setLoading(true));
          const response = await importSellersTypesFromExcel({ token, file });
          await dispatch(
            sellersTypesSlice.actions.getSellersTypes({
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
            sellersTypesSlice.actions.setError(
              error?.message || "Error al importar tipos de vendedor"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sellersTypesSlice.actions.setLoading(false));
        }
      }
    ),
    toggleSellersTypeStatus: createRx.asyncThunk(
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
          dispatch(sellersTypesSlice.actions.setLoading(true));
          const response = await toggleSellersTypeStatus({
            token,
            id,
          });
          await dispatch(
            sellersTypesSlice.actions.getSellersTypes({
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
            sellersTypesSlice.actions.setError(
              error?.message || "Error al cambiar el estado del tipo de vendedor"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sellersTypesSlice.actions.setLoading(false));
        }
      }
    ),
  }),
  selectors: {
    getSellersTypes: (state) => state.sellersTypes,
    getCurrentSellersType: (state) => state.currentSellersType,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    getTotalRegistros: (state) => state.totalRegistros,
  },
});

export const { actions: sellersTypesActions, reducer: sellersTypesReducer } =
  sellersTypesSlice;
