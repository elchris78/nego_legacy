import { PayloadAction } from "@reduxjs/toolkit";

import { createFabricantesSlice } from "./createSlices";
import {
  createFabricante,
  updateFabricante,
  deleteFabricante,
  getFabricanteById,
  getFabricantes,
  importFabricantesFromExcel,
  toggleFabricanteStatus,
} from "./fabricantesActions";

import type {
  Fabricante,
  FabricanteTypeParams,
  GetFabricanteByIdResponse,
  GetFabricantesResponse,
} from "./fabricantesTypes";

interface FabricantesState {
  fabricantes: Fabricante[] | null;
  currentFabricante: Fabricante | null;
  loading: boolean;
  error: string | null;
  totalRegistros: number;

  savedAttributeMode: "new" | "edit" | "view" | null;
}

const initialState: FabricantesState = {
  fabricantes: null,
  currentFabricante: null,
  loading: false,
  error: null,
  totalRegistros: 0,
  savedAttributeMode: null,
};

const fabricanteSlice = createFabricantesSlice({
  name: "fabricantes",
  initialState,
  reducers: (createRx) => ({
    setFabricantes: createRx.reducer(
      (state, action: PayloadAction<GetFabricantesResponse>) => {
        state.fabricantes = action.payload.fabricantes;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentFabricante: createRx.reducer(
      (state, action: PayloadAction<GetFabricanteByIdResponse>) => {
        state.currentFabricante = action.payload.fabricante;
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
      state.fabricantes = null;
      state.currentFabricante = null;
      state.loading = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    setSavedAttributeMode: createRx.reducer(
      (state, action: PayloadAction<"new" | "edit" | "view" | null>) => {
        state.savedAttributeMode = action.payload;
      }
    ),
    getFabricantes: createRx.asyncThunk(
      async (
        {
          token,
          params,
        }: {
          token: string | undefined;
          params: FabricanteTypeParams;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(fabricanteSlice.actions.setLoading(true));
        try {
          const response = await getFabricantes({ token, params });
          dispatch(fabricanteSlice.actions.setFabricantes(response));
        } catch (error: any) {
          dispatch(
            fabricanteSlice.actions.setError(
              error.message || "Error al obtener fabricantes"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(fabricanteSlice.actions.setLoading(false));
        }
      }
    ),
    getFabricanteById: createRx.asyncThunk(
      async (
        { token, id }: { token: string | undefined; id: string | null },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(fabricanteSlice.actions.setLoading(true));
        try {
          const response = await getFabricanteById({ token, id });
          dispatch(fabricanteSlice.actions.setCurrentFabricante(response));
          return response;
        } catch (error: any) {
          dispatch(
            fabricanteSlice.actions.setError(
              error.message || "Error al obtener fabricante por ID"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(fabricanteSlice.actions.setLoading(false));
        }
      }
    ),
    createFabricante: createRx.asyncThunk(
      async (
        {
          token,
          fabricante,
        }: {
          token: string | undefined;
          fabricante: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(fabricanteSlice.actions.setLoading(true));
        try {
          const response = await createFabricante({ token, body: fabricante });
          return response;
        } catch (error: any) {
          dispatch(
            fabricanteSlice.actions.setError(
              error.message || "Error al crear fabricante"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(fabricanteSlice.actions.setLoading(false));
        }
      }
    ),
    updateFabricante: createRx.asyncThunk(
      async (
        {
          token,
          id,
          fabricante,
        }: {
          token: string | undefined;
          id: string | null;
          fabricante: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(fabricanteSlice.actions.setLoading(true));
        try {
          const response = await updateFabricante({
            token,
            id,
            body: fabricante,
          });
          return response;
        } catch (error: any) {
          dispatch(
            fabricanteSlice.actions.setError(
              error.message || "Error al actualizar fabricante"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(fabricanteSlice.actions.setLoading(false));
        }
      }
    ),
    deleteFabricante: createRx.asyncThunk(
      async (
        { token, id }: { token: string | undefined; id: string | null },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(fabricanteSlice.actions.setLoading(true));
        try {
          const response = await deleteFabricante({ token, id });
          await dispatch(
            fabricanteSlice.actions.getFabricantes({
              token,
              params: {
                page: 1,
                size: 10,
              },
            })
          );
          return response;
        } catch (error: any) {
          dispatch(
            fabricanteSlice.actions.setError(
              error.message || "Error al eliminar fabricante"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(fabricanteSlice.actions.setLoading(false));
        }
      }
    ),
    toggleFabricanteStatus: createRx.asyncThunk(
      async (
        { token, id }: { token: string | undefined; id: string },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(fabricanteSlice.actions.setLoading(true));
        try {
          const response = await toggleFabricanteStatus({ token, id });
          await dispatch(
            fabricanteSlice.actions.getFabricantes({
              token,
              params: {
                page: 1,
                size: 10,
              },
            })
          );
          return response;
        } catch (error: any) {
          dispatch(
            fabricanteSlice.actions.setError(
              error.message || "Error al cambiar el estado del fabricante"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(fabricanteSlice.actions.setLoading(false));
        }
      }
    ),
    importFabricantes: createRx.asyncThunk(
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
        dispatch(fabricanteSlice.actions.setLoading(true));
        try {
          const response = await importFabricantesFromExcel({ token, file });
          await dispatch(
            fabricanteSlice.actions.getFabricantes({
              token,
              params: {
                page: 1,
                size: 10,
              },
            })
          ); // Refresh the list
          return response;
        } catch (error: any) {
          dispatch(
            fabricanteSlice.actions.setError(
              error.message || "Error al importar fabricantes desde Excel"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(fabricanteSlice.actions.setLoading(false));
        }
      }
    ),
  }),
  selectors: {
    selectFabricantes: (state: FabricantesState) => state.fabricantes,
    selectCurrentFabricante: (state: FabricantesState) =>
      state.currentFabricante,
    selectLoading: (state: FabricantesState) => state.loading,
    selectError: (state: FabricantesState) => state.error,
    selectTotalRegistros: (state: FabricantesState) => state.totalRegistros,
  },
});

export const { actions: fabricanteActions, reducer: fabricanteReducer } =
  fabricanteSlice;
