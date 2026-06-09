import { createAttributeValueSlice } from "./createSlices";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  AttributeValue,
  CreateAttributeRequest,
  CreateAttributeResponse,
  DeletAttributeRequest,
  DeleteAttributeResponse,
  GetAttributeByIdRequest,
  GetAttributeByIdResponse,
  GetAttributeRequest,
  GetAttributeResponse,
  ImportAttributeResponse,
  ToggleAttributeRequest,
  ToggleAttributeResponse,
  UpdateAttributeRequest,
  UpdateAttributeResponse
} from "./attributesValueTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

interface AttributeValueState {
  attributeValuesData: AttributeValue[]; // Lista de atributops
  attributeValue: AttributeValue | null; // Detalle de atributo
  totalRegistros: number; // Total de registros
  loading: boolean;
  error: string | null;
}

const initialState: AttributeValueState = {
  attributeValuesData: [],
  attributeValue: null,
  totalRegistros: 0,
  loading: false,
  error: null,
};

const api = {
  getAttributes: async (
    token: string,
    atributoId: string,
    params: GetAttributeRequest = {}
  ): Promise<GetAttributeResponse> => {
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
    const url = `${BASE_URL}api/atributos/${atributoId}/Valores${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Error al listar Atributos');
    }

    return json as GetAttributeResponse;
  },

  getAttributeById: async (
    token: string,
    atributoId: string,
    request: GetAttributeByIdRequest
  ): Promise<GetAttributeByIdResponse> => {
    const { id } = request;
    const response = await fetch(`${BASE_URL}/api/atributos/${atributoId}/Valores/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Manejo de errores HTTP
    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Error al obtener el Valor");
    }

    return jsonResponse as GetAttributeByIdResponse;
  },

  createAttribute: async (
    token: string,
    atributoId: string,
    request: CreateAttributeRequest
  ): Promise<CreateAttributeResponse> => {
    const response = await fetch(`${BASE_URL}api/atributos/${atributoId}/Valores`, {
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
      throw new Error(jsonResponse.message || "Error al crear el Valor");
    }

    return jsonResponse as CreateAttributeResponse;
  },

  updateAttribute: async (
    token: string,
    atributoId: string,
    id: string,
    request: UpdateAttributeRequest
  ): Promise<UpdateAttributeResponse> => {
    const response = await fetch(`${BASE_URL}api/atributos/${id}/Valores/${atributoId}`, {
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
      throw new Error(jsonResponse.message || "Error al actualizar el Valor");
    }

    return jsonResponse as UpdateAttributeResponse;
  },

  deleteAttribute: async (
    token: string,
    atributoId: string,
    request: DeletAttributeRequest
  ): Promise<DeleteAttributeResponse> => {
    const { id } = request;
    const response = await fetch(`${BASE_URL}api/atributos/${atributoId}/Valores/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Error al eliminar el Valor");
    }

    return jsonResponse as DeleteAttributeResponse;
  },

  toggleAttribute: async (
    token: string,
    atributoId: string,
    request: ToggleAttributeRequest
  ): Promise<ToggleAttributeResponse> => {
    const { id } = request;
    const response = await fetch(`${BASE_URL}api/atributos/${atributoId}/Valores/${id}/status`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Manejo de errores HTTP
    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Error al cambiar el estado del Valor");
    }

    return jsonResponse as ToggleAttributeResponse;
  },

  importAttributes: async (
    token: string,
    atributoId: string,
    file: File,
  ): Promise<ImportAttributeResponse> => {
    const formData = new FormData();
    formData.append("File", file);

    const response = await fetch(`${BASE_URL}api/atributos/${atributoId}/Valores/import`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw (jsonResponse || "Error al importar el archivo de Atributo");
    }

    return jsonResponse as ImportAttributeResponse;
  },
};

const attributeValueSlice = createAttributeValueSlice({
  name: "attributeValueSlice",
  initialState,
  reducers: (createRx) => ({
    setLoading: createRx.reducer((state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }),
    setError: createRx.reducer((state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }),
    setAttributes: createRx.reducer(
      (state, action: PayloadAction<{
        valores : AttributeValue[]
        totalRegistros: number
      }>) => {
        state.attributeValuesData = action.payload.valores 
        state.totalRegistros = action.payload.totalRegistros
      }
    ),
    setAttribute: createRx.reducer(
      (state, action: PayloadAction<AttributeValue | null>) => {
        state.attributeValue = action.payload;
      }
    ),

    // Async Thunks
    getAttributes: createRx.asyncThunk(
      async (
        { token, atributoId, requestParams }: { token: string; atributoId: string, requestParams?: GetAttributeRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.getAttributes(token, atributoId, requestParams);

          // Verificar éxito en la respuesta
          if (response.success) {
            thunkAPI.dispatch(setAttributes({ 
              valores: response.valores,
              totalRegistros: response.totalRegistros
             }));
          } else {
            throw new Error(response.message || "Error desconocido al obtener los Atributos");
          }

          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al obtener los Atributos"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    getAttributeById: createRx.asyncThunk(
      async (
        { token, atributoId, request }: { token: string; atributoId: string, request: GetAttributeByIdRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.getAttributeById(token, atributoId, request);
          if (response.success) {
            thunkAPI.dispatch(setAttribute(response.nombre));
            // Refrescar la lista tras crear
            await thunkAPI.dispatch(getAttributes({ token, atributoId }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al obtener el Valor"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    createAttribute: createRx.asyncThunk(
      async (
        { token, atributoId, request }: { token: string; atributoId: string, request: CreateAttributeRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.createAttribute(token, atributoId, request);
          if (response.success) {
            // Refrescar la lista tras crear
            await thunkAPI.dispatch(getAttributes({ token, atributoId }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || 'Error al crear el Valor'));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    updateAttribute: createRx.asyncThunk(
      async (
        { token, id, atributoId, request }: { token: string; id: string; atributoId: string, request: UpdateAttributeRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.updateAttribute(token, id, atributoId, request);
          if (response.success) {
            // Refrescar la lista tras actualizar
            await thunkAPI.dispatch(getAttributes({ token, atributoId }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al actualizar el Valor"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    deleteAttribute: createRx.asyncThunk(
      async (
        { token, atributoId, request }: { token: string; atributoId: string, request: DeletAttributeRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.deleteAttribute(token, atributoId, request);
          if (response.success) {
            // Refrescar la lista tras actualizar
            await thunkAPI.dispatch(getAttributes({ token, atributoId }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al eliminar el Valor"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    toggleAttributeStatus: createRx.asyncThunk(
      async (
        { token, atributoId, request }: { token: string; atributoId: string, request: ToggleAttributeRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.toggleAttribute(token, atributoId, request);
          if (response.success) {
            // Refrescar la lista tras actualizar
            await thunkAPI.dispatch(getAttributes({ token, atributoId }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al cambiar el estado del Valor"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    importAttributes: createRx.asyncThunk(
      async (
        { token, atributoId, file }: { token: string; atributoId: string, file: File },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.importAttributes(token, atributoId, file);
          // if (response.success) { // Aunque no se maneje una respuesta con éxito, actualiza los atributos
          // Refrescar la lista tras actualizar
          await thunkAPI.dispatch(getAttributes({ token, atributoId, requestParams: { page: 1, size: 10 } }));
          // }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al cambiar el estado del Valor"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error);
        }
      }
    ),
  }),

  selectors: {
    attributeValuesData: (state: AttributeValueState) => state.attributeValuesData,
    isLoading: (state: AttributeValueState) => state.loading,
    getError: (state: AttributeValueState) => state.error,
  },
});

export const { 
  setLoading, 
  setError, 
  setAttributes, 
  setAttribute,
  getAttributes,
  getAttributeById,
  createAttribute,
  updateAttribute,
  toggleAttributeStatus,
  deleteAttribute,
  importAttributes
} = attributeValueSlice.actions;
export const { attributeValuesData, isLoading, getError } = attributeValueSlice.selectors;

export default attributeValueSlice.reducer;
// AttributeValue