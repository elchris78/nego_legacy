import { PayloadAction } from "@reduxjs/toolkit";

import { createConceptosTransaccionesBancariasSlice } from "./createSlices";
import {
  createConceptoTransaccionBancaria,
  updateConceptoTransaccionBancaria,
  deleteConceptoTransaccionBancaria,
  getConceptosTransaccionesBancarias,
  toggleEstatusConceptoTransaccionBancaria,
  importConceptosTransaccionesBancariasFromExcel,
  getConceptoTransaccionBancariaById,
} from "./conceptosTransaccionesBancariasActions";

import type {
  ConceptoTransaccionBancaria,
  ConceptoTransaccionBancariaTypeParams,
  GetConceptosTransaccionesBancariasResponse,
} from "./conceptosTransaccionesBancariasTypes";

interface ConceptosTransaccionesBancariasState {
  conceptosTransaccionesBancarias: ConceptoTransaccionBancaria[] | null;
  currentConceptoTransaccionBancaria: ConceptoTransaccionBancaria | null;
  loading: boolean;
  pending: boolean;
  error: string | null;
  totalRegistros: number;
}

const initialState: ConceptosTransaccionesBancariasState = {
  conceptosTransaccionesBancarias: null,
  currentConceptoTransaccionBancaria: null,
  loading: false,
  pending: false,
  error: null,
  totalRegistros: 0,
};

const conceptosTransaccionesBancariasSlice =
  createConceptosTransaccionesBancariasSlice({
    name: "conceptosTransaccionesBancarias",
    initialState,
    reducers: (createRx) => ({
      setConceptosTransaccionesBancarias: createRx.reducer(
        (
          state,
          action: PayloadAction<GetConceptosTransaccionesBancariasResponse>
        ) => {
          state.conceptosTransaccionesBancarias =
            action.payload.conceptosTransacciones;
          state.totalRegistros = action.payload.totalRegistros;
        }
      ),
      setCurrentConceptoTransaccionBancaria: createRx.reducer(
        (state, action: PayloadAction<ConceptoTransaccionBancaria | null>) => {
          state.currentConceptoTransaccionBancaria = action.payload;
        }
      ),
      setLoading: createRx.reducer((state, action: PayloadAction<boolean>) => {
        state.loading = action.payload;
      }),
      setPending: createRx.reducer((state, action: PayloadAction<boolean>) => {
        state.pending = action.payload;
      }),
      setError: createRx.reducer(
        (state, action: PayloadAction<string | null>) => {
          state.error = action.payload;
        }
      ),
      flushAll: createRx.reducer((state) => {
        state.conceptosTransaccionesBancarias = null;
        state.currentConceptoTransaccionBancaria = null;
        state.loading = false;
        state.pending = false;
        state.error = null;
        state.totalRegistros = 0;
      }),
      getConceptosTransaccionesBancarias: createRx.asyncThunk(
        async (
          {
            token,
            params,
          }: {
            token: string | undefined;
            params: ConceptoTransaccionBancariaTypeParams;
          },
          { dispatch, rejectWithValue }
        ) => {
          dispatch(
            conceptosTransaccionesBancariasSlice.actions.setLoading(true)
          );
          try {
            const response = await getConceptosTransaccionesBancarias({
              token,
              params,
            });
            dispatch(
              conceptosTransaccionesBancariasSlice.actions.setConceptosTransaccionesBancarias(
                response
              )
            );
            return response;
          } catch (error) {
            return rejectWithValue(error);
          } finally {
            dispatch(
              conceptosTransaccionesBancariasSlice.actions.setLoading(false)
            );
          }
        }
      ),
      getConceptoTransaccionBancariaById: createRx.asyncThunk(
        async (
          {
            token,
            id,
          }: {
            token: string | undefined;
            id: string;
          },
          { dispatch, rejectWithValue }
        ) => {
          dispatch(
            conceptosTransaccionesBancariasSlice.actions.setLoading(true)
          );
          try {
            const response = await getConceptoTransaccionBancariaById({
              token,
              id,
            });
            dispatch(
              conceptosTransaccionesBancariasSlice.actions.setCurrentConceptoTransaccionBancaria(
                response.conceptoTransaccion
              )
            );
            return response;
          } catch (error) {
            return rejectWithValue(error);
          } finally {
            dispatch(
              conceptosTransaccionesBancariasSlice.actions.setLoading(false)
            );
          }
        }
      ),
      createConceptoTransaccionBancaria: createRx.asyncThunk(
        async (
          {
            token,
            body,
          }: {
            token: string | undefined;
            body: any;
          },
          { dispatch, rejectWithValue }
        ) => {
          dispatch(
            conceptosTransaccionesBancariasSlice.actions.setPending(true)
          );
          try {
            const response = await createConceptoTransaccionBancaria({
              token,
              body,
            });
            return response;
          } catch (error) {
            return rejectWithValue(error);
          } finally {
            dispatch(
              conceptosTransaccionesBancariasSlice.actions.setPending(false)
            );
          }
        }
      ),
      updateConceptoTransaccionBancaria: createRx.asyncThunk(
        async (
          {
            token,
            id,
            body,
          }: {
            token: string | undefined;
            id: string;
            body: any;
          },
          { dispatch, rejectWithValue }
        ) => {
          dispatch(
            conceptosTransaccionesBancariasSlice.actions.setPending(true)
          );
          try {
            const response = await updateConceptoTransaccionBancaria({
              token,
              id,
              body,
            });
            return response;
          } catch (error) {
            return rejectWithValue(error);
          } finally {
            dispatch(
              conceptosTransaccionesBancariasSlice.actions.setPending(false)
            );
          }
        }
      ),
      deleteConceptoTransaccionBancaria: createRx.asyncThunk(
        async (
          {
            token,
            id,
          }: {
            token: string | undefined;
            id: string;
          },
          { dispatch, rejectWithValue }
        ) => {
          dispatch(
            conceptosTransaccionesBancariasSlice.actions.setPending(true)
          );
          try {
            const response = await deleteConceptoTransaccionBancaria({
              token,
              id,
            });
            return response;
          } catch (error) {
            return rejectWithValue(error);
          } finally {
            dispatch(
              conceptosTransaccionesBancariasSlice.actions.setPending(false)
            );
          }
        }
      ),
      toggleEstatusConceptoTransaccionBancaria: createRx.asyncThunk(
        async (
          {
            token,
            id,
          }: {
            token: string | undefined;
            id: string;
          },
          { dispatch, rejectWithValue }
        ) => {
          dispatch(
            conceptosTransaccionesBancariasSlice.actions.setPending(true)
          );
          try {
            const response = await toggleEstatusConceptoTransaccionBancaria({
              token,
              id,
            });
            return response;
          } catch (error) {
            return rejectWithValue(error);
          } finally {
            dispatch(
              conceptosTransaccionesBancariasSlice.actions.setPending(false)
            );
          }
        }
      ),
      importConceptosTransaccionesBancariasFromExcel: createRx.asyncThunk(
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
          dispatch(
            conceptosTransaccionesBancariasSlice.actions.setPending(true)
          );
          try {
            const response =
              await importConceptosTransaccionesBancariasFromExcel({
                token,
                file,
              });
            return response;
          } catch (error) {
            return rejectWithValue(error);
          } finally {
            dispatch(
              conceptosTransaccionesBancariasSlice.actions.setPending(false)
            );
          }
        }
      ),
    }),
    selectors: {
      selectConceptosTransaccionesBancarias: (
        state: ConceptosTransaccionesBancariasState
      ) => state.conceptosTransaccionesBancarias,
      selectCurrentConceptoTransaccionBancaria: (
        state: ConceptosTransaccionesBancariasState
      ) => state.currentConceptoTransaccionBancaria,
      selectLoading: (state: ConceptosTransaccionesBancariasState) =>
        state.loading,
      selectPending: (state: ConceptosTransaccionesBancariasState) =>
        state.pending,
      selectError: (state: ConceptosTransaccionesBancariasState) => state.error,
      selectTotalRegistros: (state: ConceptosTransaccionesBancariasState) =>
        state.totalRegistros,
    },
  });

export const {
  actions: conceptosTransaccionesBancariasActions,
  reducer: conceptosTransaccionesBancariasReducer,
} = conceptosTransaccionesBancariasSlice;
