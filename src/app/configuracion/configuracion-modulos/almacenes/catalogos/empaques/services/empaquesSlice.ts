import { PayloadAction } from "@reduxjs/toolkit";

import { createEmpaquesSlice } from "./createSlices";
import {
  createEmpaque,
  updateEmpaque,
  deleteEmpaque,
  getEmpaqueById,
  getEmpaques,
  importEmpaques,
  toggleEmpaqueStatus,
} from "./empaquesActions";

import type {
  Empaque,
  EmpaqueTypeParams,
  GetEmpaqueByIdResponse,
  GetEmpaquesResponse,
} from "./empaquesTypes";

interface EmpaquesState {
  empaques: Empaque[] | null;
  currentEmpaque: Empaque | null;
  loading: boolean;
  error: string | null;
  totalRegistros: number;
}

const initialState: EmpaquesState = {
  empaques: null,
  currentEmpaque: null,
  loading: false,
  error: null,
  totalRegistros: 0,
};

const empaquesSlice = createEmpaquesSlice({
  name: "empaques",
  initialState,
  reducers: (createRx) => ({
    setEmpaques: createRx.reducer(
      (state, action: PayloadAction<GetEmpaquesResponse>) => {
        state.empaques = action.payload.empaques;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setCurrentEmpaque: createRx.reducer(
      (state, action: PayloadAction<GetEmpaqueByIdResponse>) => {
        state.currentEmpaque = action.payload.empaque;
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
      state.empaques = null;
      state.currentEmpaque = null;
      state.loading = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    getEmpaques: createRx.asyncThunk(
      async (
        {
          token,
          params,
        }: {
          token: string | undefined;
          params: EmpaqueTypeParams;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(empaquesSlice.actions.setLoading(true));
        try {
          const response = await getEmpaques({ token, params });
          dispatch(empaquesSlice.actions.setEmpaques(response));
        } catch (error: any) {
          dispatch(
            empaquesSlice.actions.setError(
              error.message || "Error al cargar los empaques"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(empaquesSlice.actions.setLoading(false));
        }
      }
    ),
    getEmpaqueById: createRx.asyncThunk(
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
        dispatch(empaquesSlice.actions.setLoading(true));
        try {
          const response = await getEmpaqueById({ token, id });
          dispatch(empaquesSlice.actions.setCurrentEmpaque(response));
          return response;
        } catch (error: any) {
          dispatch(
            empaquesSlice.actions.setError(
              error.message || "Error al cargar el empaque"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(empaquesSlice.actions.setLoading(false));
        }
      }
    ),
    createEmpaque: createRx.asyncThunk(
      async (
        {
          token,
          empaque,
        }: {
          token: string | undefined;
          empaque: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(empaquesSlice.actions.setLoading(true));
        try {
          const response = await createEmpaque({ token, body: empaque });
          return response;
        } catch (error: any) {
          dispatch(
            empaquesSlice.actions.setError(
              error.message || "Error al crear el empaque"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(empaquesSlice.actions.setLoading(false));
        }
      }
    ),
    updateEmpaque: createRx.asyncThunk(
      async (
        {
          token,
          id,
          empaque,
        }: {
          token: string | undefined;
          id: string | null;
          empaque: any;
        },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(empaquesSlice.actions.setLoading(true));
        try {
          const response = await updateEmpaque({ token, id, body: empaque });
          return response;
        } catch (error: any) {
          dispatch(
            empaquesSlice.actions.setError(
              error.message || "Error al actualizar el empaque"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(empaquesSlice.actions.setLoading(false));
        }
      }
    ),
    deleteEmpaque: createRx.asyncThunk(
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
        dispatch(empaquesSlice.actions.setLoading(true));
        try {
          const response = await deleteEmpaque({ token, id });
          await dispatch(
            empaquesSlice.actions.getEmpaques({
              token,
              params: {
                page: 1,
                size: 20,
              },
            })
          ); // Refresh the list
          return response;
        } catch (error: any) {
          dispatch(
            empaquesSlice.actions.setError(
              error.message || "Error al eliminar el empaque"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(empaquesSlice.actions.setLoading(false));
        }
      }
    ),
    toggleEmpaqueStatus: createRx.asyncThunk(
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
        dispatch(empaquesSlice.actions.setLoading(true));
        try {
          const response = await toggleEmpaqueStatus({ token, id });
          await dispatch(
            empaquesSlice.actions.getEmpaques({
              token,
              params: {
                page: 1,
                size: 20,
              },
            })
          ); // Refresh the list
          return response;
        } catch (error: any) {
          dispatch(
            empaquesSlice.actions.setError(
              error.message || "Error al cambiar el estatus del empaque"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(empaquesSlice.actions.setLoading(false));
        }
      }
    ),
    importEmpaques: createRx.asyncThunk(
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
        dispatch(empaquesSlice.actions.setLoading(true));
        try {
          const response = await importEmpaques({ token, file });
          await dispatch(
            empaquesSlice.actions.getEmpaques({
              token,
              params: {
                page: 1,
                size: 20,
              },
            })
          ); // Refresh the list
          return response;
        } catch (error: any) {
          dispatch(
            empaquesSlice.actions.setError(
              error.message || "Error al importar los empaques"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(empaquesSlice.actions.setLoading(false));
        }
      }
    ),
  }),
  selectors: {
    selectEmpaques: (state: EmpaquesState) => state.empaques,
    selectCurrentEmpaque: (state: EmpaquesState) => state.currentEmpaque,
    selectLoading: (state: EmpaquesState) => state.loading,
    selectError: (state: EmpaquesState) => state.error,
    selectTotalRegistros: (state: EmpaquesState) => state.totalRegistros,
  },
});

export const { actions: empaquesActions, reducer: empaquesReducer } =
  empaquesSlice;
