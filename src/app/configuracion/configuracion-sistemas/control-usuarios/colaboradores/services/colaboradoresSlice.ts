import { PayloadAction } from "@reduxjs/toolkit";

import { createColaboradoresSlice } from "./createSlices";
import {
  createColaborador,
  getColaboradores,
  updateColaborador,
  deleteColaborador,
  getColaboradorById,
  toggleColaboradorStatus,
  importColaboradores,
} from "./colaboradoresActions";

import type {
  Colaborador,
  ColaboradorParams,
  GetColaboradoresResponse,
  GetColaboradorResponse,
} from "./colaboradoresTypes";

interface ColaboradoresState {
  colaboradores: Colaborador[] | null;
  currentColaborador: Colaborador | null;
  loading: boolean; // Indica si se están cargando los colaboradores
  isPending: boolean; // Indica si una acción está pendiente (como eliminar o cambiar estado)
  isLoadingColaborador: boolean; // Indica si se está cargando un colaborador específico
  error: string | null;
  totalRegistros: number;
}

const initialState: ColaboradoresState = {
  colaboradores: null,
  currentColaborador: null,
  loading: false,
  isPending: false,
  isLoadingColaborador: false,
  error: null,
  totalRegistros: 0,
};

const colaboradoresSlice = createColaboradoresSlice({
  name: "colaboradores",
  initialState,
  reducers: (createRx) => ({
    setColaboradores: createRx.reducer(
      (state, action: PayloadAction<GetColaboradoresResponse>) => {
        state.colaboradores = action.payload.colaboradores;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentColaborador: createRx.reducer(
      (state, action: PayloadAction<GetColaboradorResponse>) => {
        state.currentColaborador = action.payload.colaborador;
      }
    ),
    setLoading: createRx.reducer((state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }),
    setIsPending: createRx.reducer((state, action: PayloadAction<boolean>) => {
      state.isPending = action.payload;
    }),
    setIsLoadingColaborador: createRx.reducer(
      (state, action: PayloadAction<boolean>) => {
        state.isLoadingColaborador = action.payload;
      }
    ),
    setError: createRx.reducer(
      (state, action: PayloadAction<string | null>) => {
        state.error = action.payload;
      }
    ),
    flushAll: createRx.reducer((state) => {
      state.colaboradores = null;
      state.currentColaborador = null;
      state.loading = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    getColaboradores: createRx.asyncThunk(
      async (
        {
          token,
          params,
        }: { token: string | undefined; params: ColaboradorParams },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(colaboradoresSlice.actions.setLoading(true));
        try {
          const response = await getColaboradores({ token, params });
          dispatch(colaboradoresSlice.actions.setColaboradores(response));
          return response;
        } catch (error: any) {
          dispatch(
            colaboradoresSlice.actions.setError(
              error?.message || "Error al obtener los colaboradores"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(colaboradoresSlice.actions.setLoading(false));
        }
      }
    ),
    createColaborador: createRx.asyncThunk(
      async (
        { token, formData }: { token: string | undefined; formData: FormData },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(colaboradoresSlice.actions.setIsPending(true));
        try {
          const response = await createColaborador({ token, formData });
          return response;
        } catch (error: any) {
          dispatch(
            colaboradoresSlice.actions.setError(
              error?.message || "Error al crear el colaborador"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(colaboradoresSlice.actions.setIsPending(false));
        }
      }
    ),
    updateColaborador: createRx.asyncThunk(
      async (
        {
          token,
          id,
          formData,
        }: { token: string | undefined; id: string | null; formData: FormData },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(colaboradoresSlice.actions.setIsPending(true));
        try {
          const response = await updateColaborador({ token, id, formData });
          return response;
        } catch (error: any) {
          dispatch(
            colaboradoresSlice.actions.setError(
              error?.message || "Error al actualizar el colaborador"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(colaboradoresSlice.actions.setIsPending(false));
        }
      }
    ),
    deleteColaborador: createRx.asyncThunk(
      async (
        { token, id }: { token: string | undefined; id: string },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(colaboradoresSlice.actions.setIsPending(true));
        try {
          const response = await deleteColaborador({ token, id });
          return response;
        } catch (error: any) {
          dispatch(
            colaboradoresSlice.actions.setError(
              error?.message || "Error al eliminar el colaborador"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(colaboradoresSlice.actions.setIsPending(false));
        }
      }
    ),
    getColaboradorById: createRx.asyncThunk(
      async (
        { token, id }: { token: string | undefined; id: string },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(colaboradoresSlice.actions.setIsLoadingColaborador(true));
        try {
          const response = await getColaboradorById({ token, id });
          dispatch(colaboradoresSlice.actions.setCurrentColaborador(response));
          return response;
        } catch (error: any) {
          dispatch(
            colaboradoresSlice.actions.setError(
              error?.message || "Error al obtener el colaborador"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(colaboradoresSlice.actions.setIsLoadingColaborador(false));
        }
      }
    ),
    toggleColaboradorStatus: createRx.asyncThunk(
      async (
        { token, id }: { token: string | undefined; id: string },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(colaboradoresSlice.actions.setIsPending(true));
        try {
          const response = await toggleColaboradorStatus({ token, id });
          return response;
        } catch (error: any) {
          dispatch(
            colaboradoresSlice.actions.setError(
              error?.message || "Error al cambiar el estado del colaborador"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(colaboradoresSlice.actions.setIsPending(false));
        }
      }
    ),
    importColaboradores: createRx.asyncThunk(
      async (
        { token, file }: { token: string | undefined; file: File },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(colaboradoresSlice.actions.setIsPending(true));
        try {
          const response = await importColaboradores({ token, file });
          return response;
        } catch (error: any) {
          dispatch(
            colaboradoresSlice.actions.setError(
              error?.message || "Error al importar los colaboradores"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(colaboradoresSlice.actions.setIsPending(false));
        }
      }
    ),
  }),
  selectors: {
    selectColaboradores: (state: ColaboradoresState) => state.colaboradores,
    selectCurrentColaborador: (state: ColaboradoresState) =>
      state.currentColaborador,
    selectLoading: (state: ColaboradoresState) => state.loading,
    selectError: (state: ColaboradoresState) => state.error,
    selectTotalRegistros: (state: ColaboradoresState) => state.totalRegistros,
  },
});

export const { actions: colaboradoresActions, reducer: colaboradoresReducer } =
  colaboradoresSlice;
