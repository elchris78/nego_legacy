import { PayloadAction } from "@reduxjs/toolkit";

import { createEmpresaSlice } from "./createSlices";
import { getCompanyInfo, updateCompanyInfo } from "./empresaActions";

import type { Company, EmpresaResponse } from "./companyTypes";

interface EmpresaState {
  company: Company | null;
  loading: boolean; // Indicates if the company information is being loaded
  isPending: boolean; // Indicates if the company information is being updated
  error: string | null;
}

const initialState: EmpresaState = {
  company: null,
  loading: false,
  isPending: false,
  error: null,
};

const empresaSlice = createEmpresaSlice({
  name: "empresa",
  initialState,
  reducers: (createRx) => ({
    setCompany: createRx.reducer(
      (state, action: PayloadAction<EmpresaResponse | null>) => {
        state.company = action.payload?.company || null;
      }
    ),
    setLoading: createRx.reducer((state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }),
    setIsPending: createRx.reducer((state, action: PayloadAction<boolean>) => {
      state.isPending = action.payload;
    }),
    setError: createRx.reducer(
      (state, action: PayloadAction<string | null>) => {
        state.error = action.payload;
      }
    ),
    flushAll: createRx.reducer((state) => {
      state.company = null;
      state.loading = false;
      state.isPending = false;
      state.error = null;
    }),
    getCompanyInfo: createRx.asyncThunk(
      async (
        {
          token,
          companyId,
        }: { token: string | undefined; companyId: string | undefined },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(empresaSlice.actions.setLoading(true));
          const companyInfo = await getCompanyInfo({ token, companyId });
          dispatch(empresaSlice.actions.setCompany(companyInfo));
          return companyInfo;
        } catch (error: any) {
          dispatch(
            empresaSlice.actions.setError(
              error.message || "Failed to fetch company info"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(empresaSlice.actions.setLoading(false));
        }
      }
    ),
    updateCompanyInfo: createRx.asyncThunk(
      async (
        {
          token,
          companyId,
          formData,
        }: {
          token: string | undefined;
          companyId: string | undefined;
          formData: FormData;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(empresaSlice.actions.setIsPending(true));
          const updatedCompanyInfo = await updateCompanyInfo({
            token,
            companyId,
            formData,
          });
          return updatedCompanyInfo;
        } catch (error: any) {
          dispatch(
            empresaSlice.actions.setError(
              error.message || "Failed to update company info"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(empresaSlice.actions.setIsPending(false));
        }
      }
    ),
  }),
  selectors: {
    getCompany: (state: EmpresaState) => state.company,
    isLoading: (state: EmpresaState) => state.loading,
    isPending: (state: EmpresaState) => state.isPending,
    getError: (state: EmpresaState) => state.error,
  },
});

export const { actions: empresaActions, reducer: empresaReducer } =
  empresaSlice;
