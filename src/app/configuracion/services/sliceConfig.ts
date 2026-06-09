import { PayloadAction } from "@reduxjs/toolkit";

import { createConfigSlice } from "./createSlice";
import { getCompanyIsConfigured } from "./actionConfiguracion";
import { GetCompanyConfigParams } from "./typesConfiguracion";

interface ConfiguracionState {
    isConfigured: boolean | null;
    loading: boolean;
    error: string | null;
}

const initialState: ConfiguracionState = {
    isConfigured: null,
    loading: false,
    error: null,
};

const configuracionSlice = createConfigSlice({
    name: "configuracion",
    initialState,
    reducers: (createRx) => ({
        setIsConfigured: createRx.reducer(
        (state, action: PayloadAction<boolean>) => {
            state.isConfigured = action.payload;
        }
        ),
        setLoading: createRx.reducer(
        (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        }
        ),
        setError: createRx.reducer(
        (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
        ),
        flushAll: createRx.reducer((state) => {
        state.isConfigured = null;
        state.loading = false;
        state.error = null;
        }),
        getCompanyIsConfigured: createRx.asyncThunk(
        async (
            { companyId, token }: GetCompanyConfigParams,
            { dispatch, rejectWithValue }
        ) => {
            try {
            dispatch(configuracionSlice.actions.setLoading(true));
            const response = await getCompanyIsConfigured({ companyId, token });
            dispatch(configuracionSlice.actions.setIsConfigured(response));
            return response;
            } catch (error: any) {
            dispatch(
                configuracionSlice.actions.setError(
                error?.message || "Error al verificar configuración de la compañía"
                )
            );
            return rejectWithValue(error);
            } finally {
            dispatch(configuracionSlice.actions.setLoading(false));
            }
        }
        ),
    }),
    selectors: {
        getIsConfigured: (state) => state.isConfigured,
        getLoading: (state) => state.loading,
        getError: (state) => state.error,
    },
});

export const { actions: configuracionActions, reducer: configuracionReducer } =
    configuracionSlice;
