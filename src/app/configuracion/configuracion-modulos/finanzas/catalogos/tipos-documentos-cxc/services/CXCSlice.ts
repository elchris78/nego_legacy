import { createCXCSlice } from "./createSlices";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  CXC,
  CreateCXCRequest,
  CreateCXCResponse,
  DeleteCXCRequest,
  DeleteCXCResponse,
  GetCXCByIdRequest,
  GetCXCByIdResponse,
  GetCXCRequest,
  GetCXCResponse,
  ImportCXCResponse,
  ToggleCXCRequest,
  ToggleCXCResponse,
  UpdateCXCRequest,
  UpdateCXCResponse
} from "./cxcsTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

interface TipoDocumentoState {
  cxcsData: CXC[]; // Listado de los objetos
  tipoDocumento: CXC | null; // Detalle
  totalRegistros: number; // Total de registros
  loading: boolean;
  error: string | null;
}

const initialState: TipoDocumentoState = {
  cxcsData: [],
  tipoDocumento: null,
  totalRegistros: 0,
  loading: false,
  error: null,
};

const api = {
  getCuentasPorCobrar: async (
    token: string,
    params: GetCXCRequest = {}
  ): Promise<GetCXCResponse> => {
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
    const url = `${BASE_URL}api/TipoDocumentosCuentasPorCobrar${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Error al listar cuentas por cobrar');
    }

    return json as GetCXCResponse;
  },

  getCuentaPorCobrarById: async (
    token: string,
    request: GetCXCByIdRequest
  ): Promise<GetCXCByIdResponse> => {
    const { id } = request;
    const response = await fetch(`${BASE_URL}/api/TipoDocumentosCuentasPorCobrar/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Manejo de errores HTTP
    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Error al obtener el Tipo de documento de cuentas por cobrar");
    }
    
    return jsonResponse as GetCXCByIdResponse;
  },

  createCuentaPorCobrar: async (
    token: string,
    request: CreateCXCRequest
  ): Promise<CreateCXCResponse> => {
    const response = await fetch(`${BASE_URL}api/TipoDocumentosCuentasPorCobrar`, {
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
      throw new Error(jsonResponse.message || "Error al crear el Tipo de documento de cuentas por cobrar");
    }

    return jsonResponse as CreateCXCResponse;
  },

  updateCuentaPorCobrar: async (
    token: string,
    id: string,
    request: UpdateCXCRequest
  ): Promise<UpdateCXCResponse> => {
    const response = await fetch(`${BASE_URL}api/TipoDocumentosCuentasPorCobrar/${id}`, {
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
      throw new Error(jsonResponse.message || "Error al actualizar el Tipo de documento de cuentas por cobrar");
    }

    return jsonResponse as UpdateCXCResponse;
  },

  deleteCuentaPorCobrar: async (
    token: string,
    request: DeleteCXCRequest
  ): Promise<DeleteCXCResponse> => {
    const { id } = request;
    const response = await fetch(`${BASE_URL}api/TipoDocumentosCuentasPorCobrar/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Error al eliminar el Tipo de documento de cuentas por cobrar");
    }

    return jsonResponse as DeleteCXCResponse;
  },

  toggleCuentaPorCobrar: async (
    token: string,
    request: ToggleCXCRequest
  ): Promise<ToggleCXCResponse> => {
    const { id } = request;
    const response = await fetch(`${BASE_URL}api/TipoDocumentosCuentasPorCobrar/${id}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Manejo de errores HTTP
    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Error al cambiar el estado del Tipo de documento de cuentas por cobrar");
    }

    return jsonResponse as ToggleCXCResponse;
  },

  importCuentasPorCobrar: async (
    token: string,
    file: File,
  ): Promise<ImportCXCResponse> => {
    const formData = new FormData();
    formData.append("File", file);

    const response = await fetch(`${BASE_URL}api/TipoDocumentosCuentasPorCobrar/import`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw (jsonResponse || "Error al importar el archivo de Tipo de documento de cuentas por cobrar");
    }

    return jsonResponse as ImportCXCResponse;
  },
};

const cxcSlice = createCXCSlice({
  name: "cuentasPorCobrarSlice",
  initialState,
  reducers: (createRx) => ({
    setLoading: createRx.reducer((state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }),
    setError: createRx.reducer((state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }),
    setCuentasPorCobrar: createRx.reducer(
      (state, action: PayloadAction<{
        CXCs : CXC[]
        totalRegistros: number
      }>) => {
        state.cxcsData = action.payload.CXCs 
        state.totalRegistros = action.payload.totalRegistros
      }
    ),
    setCuentaPorCobrar: createRx.reducer(
      (state, action: PayloadAction<CXC | null>) => {
        state.tipoDocumento = action.payload;
      }
    ),

    // Async Thunks
    getCuentasPorCobrar: createRx.asyncThunk(
      async (
        { token, requestParams }: { token: string; requestParams?: GetCXCRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.getCuentasPorCobrar(token, requestParams);

          // Verificar éxito en la respuesta
          if (response.success) {
            thunkAPI.dispatch(setCuentasPorCobrar({ 
              CXCs : response.tipoDocumentos, 
              totalRegistros: response.totalRegistros
             }));
          } else {
            throw new Error(response.message || "Error desconocido al obtener cuentas por cobrar");
          }

          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al obtener cuentas por cobrar"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    getCuentaPorCobrarById: createRx.asyncThunk(
      async (
        { token, request }: { token: string; request: GetCXCByIdRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.getCuentaPorCobrarById(token, request);
          if (response.success) {
            thunkAPI.dispatch(setCuentaPorCobrar(response.tipoDocumento));
            // Refrescar la lista tras crear
            await thunkAPI.dispatch(getCuentasPorCobrar({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al obtener el Tipo de documento de cuentas por cobrar"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    createCuentaPorCobrar: createRx.asyncThunk(
      async (
        { token, request }: { token: string; request: CreateCXCRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.createCuentaPorCobrar(token, request);
          if (response.success) {
            // Refrescar la lista tras crear
            await thunkAPI.dispatch(getCuentasPorCobrar({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || 'Error al crear el Tipo de documento de cuentas por cobrar'));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    updateCuentaPorCobrar: createRx.asyncThunk(
      async (
        { token, id, request }: { token: string; id: string; request: UpdateCXCRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.updateCuentaPorCobrar(token, id, request);
          if (response.success) {
            // Refrescar la lista tras actualizar
            await thunkAPI.dispatch(getCuentasPorCobrar({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al actualizar el Tipo de documento de cuentas por cobrar"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    deleteCuentaPorCobrar: createRx.asyncThunk(
      async (
        { token, request }: { token: string; request: DeleteCXCRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.deleteCuentaPorCobrar(token, request);
          if (response.success) {
            // Refrescar la lista tras actualizar
            await thunkAPI.dispatch(getCuentasPorCobrar({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al eliminar el Tipo de documento de cuentas por cobrar"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    toggleStatus: createRx.asyncThunk(
      async (
        { token, request }: { token: string; request: ToggleCXCRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.toggleCuentaPorCobrar(token, request);
          if (response.success) {
            // Refrescar la lista tras actualizar
            await thunkAPI.dispatch(getCuentasPorCobrar({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al cambiar el estado del Tipo de documento de cuentas por cobrar"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    importCuentasPorCobrar: createRx.asyncThunk(
      async (
        { token, file }: { token: string; file: File },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.importCuentasPorCobrar(token, file);
          // if (response.success) { // Aunque no se maneje una respuesta con éxito, actualiza cuentas por cobrar
          // Refrescar la lista tras actualizar
          await thunkAPI.dispatch(getCuentasPorCobrar({ token, requestParams: { page: 1, size: 10 } }));
          // }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al cambiar el estado del Tipo de documento de cuentas por cobrar"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error);
        }
      }
    ),
  }),

  selectors: {
    cxcsData: (state: TipoDocumentoState) => state.cxcsData,
    isLoading: (state: TipoDocumentoState) => state.loading,
    getError: (state: TipoDocumentoState) => state.error,
  },
});

export const { 
  setLoading,
  setError, 
  setCuentasPorCobrar, 
  setCuentaPorCobrar,
  getCuentasPorCobrar,
  getCuentaPorCobrarById,
  createCuentaPorCobrar,
  updateCuentaPorCobrar,
  toggleStatus,
  deleteCuentaPorCobrar,
  importCuentasPorCobrar,
} = cxcSlice.actions;
export const { cxcsData, isLoading, getError } = cxcSlice.selectors;

export default cxcSlice.reducer;
// CXC