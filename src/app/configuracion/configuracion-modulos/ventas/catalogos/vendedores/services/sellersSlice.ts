import { PayloadAction } from "@reduxjs/toolkit";

import { createSellersSlice } from "./createSlices";
import {
  createSellers,
  updateSellers,
  deleteSellers,
  getSellersById,
  getSeller,
  importSellersFromExcel,
  toggleSellersStatus,
} from "./sellersActions";

import type {
  Sellers,
  SellersParams,
  GetSellerByIdResponse,
  GetSellersResponse,
} from "./sellersTypes";

interface SellersState {
  sellers: Sellers[] | null;
  currentSellers: Sellers | null;
  loading: boolean;
  error: string | null;
  totalRegistros: number;
}

const initialState: SellersState = {
  sellers: null,
  currentSellers: null,
  loading: false,
  error: null,
  totalRegistros: 0,
};

const sellersSlice = createSellersSlice({
  name: "sellers",
  initialState,
  reducers: (createRx) => ({
    setSellers: createRx.reducer(
      (state, action: PayloadAction<GetSellersResponse>) => {
        state.sellers = action.payload.vendedores;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentSellers: createRx.reducer(
      (state, action: PayloadAction<GetSellerByIdResponse>) => {
        state.currentSellers = action.payload.vendedor;
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
      state.sellers = null;
      state.currentSellers = null;
      state.loading = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    getSellers: createRx.asyncThunk(
      async (
        {
          token,
          params,
        }: {
          token: string | undefined;
          params: SellersParams;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(sellersSlice.actions.setLoading(true));
          const response = await getSeller({ token, params });
          dispatch(sellersSlice.actions.setSellers(response));
        } catch (error: any) {
          dispatch(
            sellersSlice.actions.setError(
              error?.message || "Error al obtener tipos de vendedores"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sellersSlice.actions.setLoading(false));
        }
      }
    ),
    getSellersById: createRx.asyncThunk(
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
          dispatch(sellersSlice.actions.setLoading(true));
          const response = await getSellersById({ token, id });
          dispatch(sellersSlice.actions.setCurrentSellers(response));
          return response;
        } catch (error: any) {
          dispatch(
            sellersSlice.actions.setError(
              error?.message || "Error al obtener el tipo de vendedor"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sellersSlice.actions.setLoading(false));
        }
      }
    ),
    createSellers: createRx.asyncThunk(
      async (
        {
          token,
          sellers,
        }: {
          token: string | undefined;
          sellers: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(sellersSlice.actions.setLoading(true));
          const response = await createSellers({ token, body: sellers });
          return response;
        } catch (error: any) {
          dispatch(
            sellersSlice.actions.setError(
              error?.message || "Error al crear el tipo de vendedor"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sellersSlice.actions.setLoading(false));
        }
      }
    ),
    updateSellers: createRx.asyncThunk(
      async (
        {
          token,
          id,
          sellers,
        }: {
          token: string | undefined;
          id: string | null;
          sellers: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(sellersSlice.actions.setLoading(true));
          const response = await updateSellers({
            token,
            id,
            body: sellers,
          });
          return response;
        } catch (error: any) {
          dispatch(
            sellersSlice.actions.setError(
              error?.message || "Error al editar el tipo de vendedor"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sellersSlice.actions.setLoading(false));
        }
      }
    ),
    deleteSellers: createRx.asyncThunk(
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
          dispatch(sellersSlice.actions.setLoading(true));
          const response = await deleteSellers({ token, id });
          await dispatch(
            sellersSlice.actions.getSellers({
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
            sellersSlice.actions.setError(
              error?.message || "Error al eliminar el vendedor"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sellersSlice.actions.setLoading(false));
        }
      }
    ),
    importSellersFromExcel: createRx.asyncThunk(
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
          dispatch(sellersSlice.actions.setLoading(true));
          const response = await importSellersFromExcel({ token, file });
          await dispatch(
            sellersSlice.actions.getSellers({
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
            sellersSlice.actions.setError(
              error?.message || "Error al importar vendedor"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sellersSlice.actions.setLoading(false));
        }
      }
    ),
    toggleSellersStatus: createRx.asyncThunk(
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
          dispatch(sellersSlice.actions.setLoading(true));
          const response = await toggleSellersStatus({
            token,
            id,
          });
          await dispatch(
            sellersSlice.actions.getSellers({
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
            sellersSlice.actions.setError(
              error?.message || "Error al cambiar el estado del tipo de vendedor"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sellersSlice.actions.setLoading(false));
        }
      }
    ),
  }),
  selectors: {
    getSellers: (state) => state.sellers,
    getCurrentSellers: (state) => state.currentSellers,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    getTotalRegistros: (state) => state.totalRegistros,
  },
});

export const { actions: sellersActions, reducer: sellersReducer } =
  sellersSlice;
