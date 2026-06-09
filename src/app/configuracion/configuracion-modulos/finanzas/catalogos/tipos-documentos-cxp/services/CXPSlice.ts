import { createCXPSlice } from "./createSlices";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  CXP,
  CreateCXPRequest,
  CreateCXPResponse,
  DeleteCXPRequest,
  DeleteCXPResponse,
  GetCXPByIdRequest,
  GetCXPByIdResponse,
  GetCXPRequest,
  GetCXPResponse,
  ImportCXPResponse,
  ToggleCXPRequest,
  ToggleCXPResponse,
  UpdateCXPRequest,
  UpdateCXPResponse
} from "./cxpsTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

interface TipoDocumentoState {
  cxpsData: CXP[]; // Listado de los objetos
  tipoDocumento: CXP | null; // Detalle
  totalRegistros: number; // Total de registros
  loading: boolean;
  error: string | null;
}

const initialState: TipoDocumentoState = {
  cxpsData: [],
  tipoDocumento: null,
  totalRegistros: 0,
  loading: false,
  error: null,
};

const api = {
  getCuentasPorPagar: async (
    token: string,
    params: GetCXPRequest = {}
  ): Promise<GetCXPResponse> => {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Si algún día llegas a usar arrays (ej. filtros múltiples), trátalos aquí
        const uniqueValues = Array.from(new Set(value.map(String)));
        uniqueValues.forEach(val => queryParams.append(key, val));
      } else if (value !== undefined && value !== null && value !== '') {
        // Para booleans y strings/números
        queryParams.append(key, String(value));
      }
    });
    const url = `${BASE_URL}api/TipoDocumentosCuentasPorPagar${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Error al listar cuentas por pagar');
    }

    return json as GetCXPResponse;
  },

  getCuentaPorPagarById: async (
    token: string,
    request: GetCXPByIdRequest
  ): Promise<GetCXPByIdResponse> => {
    const { id } = request;
    const response = await fetch(`${BASE_URL}/api/TipoDocumentosCuentasPorPagar/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Manejo de errores HTTP
    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Error al obtener el Tipo de documento de cuentas por pagar");
    }
    
    return jsonResponse as GetCXPByIdResponse;
  },

  createCuentaPorPagar: async (
    token: string,
    request: CreateCXPRequest
  ): Promise<CreateCXPResponse> => {
    const response = await fetch(`${BASE_URL}api/TipoDocumentosCuentasPorPagar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    // Manejo de errores HTTP
    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Error al crear el Tipo de documento de cuentas por pagar");
    }

    return jsonResponse as CreateCXPResponse;
  },

  updateCuentaPorPagar: async (
    token: string,
    id: string,
    request: UpdateCXPRequest
  ): Promise<UpdateCXPResponse> => {
    const response = await fetch(`${BASE_URL}api/TipoDocumentosCuentasPorPagar/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    // Manejo de errores HTTP
    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Error al actualizar el Tipo de documento de cuentas por pagar");
    }

    return jsonResponse as UpdateCXPResponse;
  },

  deleteCuentaPorPagar: async (
    token: string,
    request: DeleteCXPRequest
  ): Promise<DeleteCXPResponse> => {
    const { id } = request;
    const response = await fetch(`${BASE_URL}api/TipoDocumentosCuentasPorPagar/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Error al eliminar el Tipo de documento de cuentas por pagar");
    }

    return jsonResponse as DeleteCXPResponse;
  },

  toggleCuentaPorPagar: async (
    token: string,
    request: ToggleCXPRequest
  ): Promise<ToggleCXPResponse> => {
    const { id } = request;
    const response = await fetch(`${BASE_URL}api/TipoDocumentosCuentasPorPagar/${id}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Manejo de errores HTTP
    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Error al cambiar el estado del Tipo de documento de cuentas por pagar");
    }

    return jsonResponse as ToggleCXPResponse;
  },

  importCuentasPorPagar: async (
    token: string,
    file: File,
  ): Promise<ImportCXPResponse> => {
    const formData = new FormData();
    formData.append("File", file);

    const response = await fetch(`${BASE_URL}api/TipoDocumentosCuentasPorPagar/import`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw (jsonResponse || "Error al importar el archivo de Tipo de documento de cuentas por pagar");
    }

    return jsonResponse as ImportCXPResponse;
  },
};

const cxpSlice = createCXPSlice({
  name: "cuentasPorPagarSlice",
  initialState,
  reducers: (createRx) => ({
    setLoading: createRx.reducer((state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }),
    setError: createRx.reducer((state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }),
    setCuentasPorPagar: createRx.reducer(
      (state, action: PayloadAction<{
        CXPs : CXP[]
        totalRegistros: number
      }>) => {
        state.cxpsData = action.payload.CXPs 
        state.totalRegistros = action.payload.totalRegistros
      }
    ),
    setCuentaPorPagar: createRx.reducer(
      (state, action: PayloadAction<CXP | null>) => {
        state.tipoDocumento = action.payload;
      }
    ),

    // Async Thunks
    getCuentasPorPagar: createRx.asyncThunk(
      async (
        { token, requestParams }: { token: string; requestParams?: GetCXPRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.getCuentasPorPagar(token, requestParams);

          // Verificar éxito en la respuesta
          if (response.success) {
            thunkAPI.dispatch(setCuentasPorPagar({ 
              CXPs : response.tipoDocumentos, 
              totalRegistros: response.totalRegistros
             }));
          } else {
            throw new Error(response.message || "Error desconocido al obtener cuentas por pagar");
          }

          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al obtener cuentas por pagar"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    getCuentaPorPagarById: createRx.asyncThunk(
      async (
        { token, request }: { token: string; request: GetCXPByIdRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.getCuentaPorPagarById(token, request);
          if (response.success) {
            thunkAPI.dispatch(setCuentaPorPagar(response.tipoDocumento));
            // Refrescar la lista tras crear
            await thunkAPI.dispatch(getCuentasPorPagar({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al obtener el Tipo de documento de cuentas por pagar"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    createCuentaPorPagar: createRx.asyncThunk(
      async (
        { token, request }: { token: string; request: CreateCXPRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.createCuentaPorPagar(token, request);
          if (response.success) {
            // Refrescar la lista tras crear
            await thunkAPI.dispatch(getCuentasPorPagar({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || 'Error al crear el Tipo de documento de cuentas por pagar'));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    updateCuentaPorPagar: createRx.asyncThunk(
      async (
        { token, id, request }: { token: string; id: string; request: UpdateCXPRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.updateCuentaPorPagar(token, id, request);
          if (response.success) {
            // Refrescar la lista tras actualizar
            await thunkAPI.dispatch(getCuentasPorPagar({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al actualizar el Tipo de documento de cuentas por pagar"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    deleteCuentaPorPagar: createRx.asyncThunk(
      async (
        { token, request }: { token: string; request: DeleteCXPRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.deleteCuentaPorPagar(token, request);
          if (response.success) {
            // Refrescar la lista tras actualizar
            await thunkAPI.dispatch(getCuentasPorPagar({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al eliminar el Tipo de documento de cuentas por pagar"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    toggleStatus: createRx.asyncThunk(
      async (
        { token, request }: { token: string; request: ToggleCXPRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.toggleCuentaPorPagar(token, request);
          if (response.success) {
            // Refrescar la lista tras actualizar
            await thunkAPI.dispatch(getCuentasPorPagar({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al cambiar el estado del Tipo de documento de cuentas por pagar"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    importCuentasPorPagar: createRx.asyncThunk(
      async (
        { token, file }: { token: string; file: File },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.importCuentasPorPagar(token, file);
          // if (response.success) { // Aunque no se maneje una respuesta con éxito, actualiza cuentas por pagar
          // Refrescar la lista tras actualizar
          await thunkAPI.dispatch(getCuentasPorPagar({ token, requestParams: { page: 1, size: 10 } }));
          // }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al cambiar el estado del Tipo de documento de cuentas por pagar"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error);
        }
      }
    ),
  }),

  selectors: {
    cxpsData: (state: TipoDocumentoState) => state.cxpsData,
    isLoading: (state: TipoDocumentoState) => state.loading,
    getError: (state: TipoDocumentoState) => state.error,
  },
});

export const { 
  setLoading,
  setError, 
  setCuentasPorPagar, 
  setCuentaPorPagar,
  getCuentasPorPagar,
  getCuentaPorPagarById,
  createCuentaPorPagar,
  updateCuentaPorPagar,
  toggleStatus,
  deleteCuentaPorPagar,
  importCuentasPorPagar,
} = cxpSlice.actions;
export const { cxpsData, isLoading, getError } = cxpSlice.selectors;

export default cxpSlice.reducer;
// CXP