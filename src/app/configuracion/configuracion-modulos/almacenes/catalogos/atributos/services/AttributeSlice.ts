import { createAttributeSlice } from "./createSlices";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  Attribute,
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
} from "./attributesTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

interface AttributeState {
  attributesData: Attribute[]; // Lista de atributops
  attribute: Attribute | null; // Detalle de atributo
  totalRegistros: number; // Total de registros
  loading: boolean;
  error: string | null;

  savedAttributeMode: "new" | "edit" | "view" | null;
}

const initialState: AttributeState = {
  attributesData: [],
  attribute: null,
  totalRegistros: 0,
  loading: false,
  error: null,

  savedAttributeMode: null
};

const api = {
  getAttributes: async (
    token: string,
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
    const url = `${BASE_URL}api/Atributos${queryParams.toString() ? `?${queryParams}` : ''}`;
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
    // json.atributos es el array que recibes
    const atributosFormateados: Attribute[] = json.atributos.map((a: any) => ({
      uid: a.uid,
      id: (a.id),
      nombre: a.nombre,
      estatus: a.estatus,
      fechaCreacion: a.fechaCreacion,
      fechaModificacion: a.fechaModificacion,
      creadoPor: a.creadoPor,
      isDeleted: a.isDeleted,
      valores: Array.isArray(a.valores) ? a.valores.join(', ') : a.valores
    }));

    const atributosFormateadosResponse: GetAttributeResponse = {
      success: json.success,
      message: json.message,
      totalRegistros: json.totalRegistros,
      atributosCompletos: atributosFormateados
    };

    return atributosFormateadosResponse as GetAttributeResponse;
  },

  getAttributeById: async (
    token: string,
    request: GetAttributeByIdRequest
  ): Promise<GetAttributeByIdResponse> => {
    const { id } = request;
    const response = await fetch(`${BASE_URL}/api/Atributos/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Manejo de errores HTTP
    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Error al obtener el Atributo");
    }
    const a = jsonResponse.atributo;
    const atributoFormateado: Attribute = {
      id: (a.id),
      nombre: a.nombre,
      estatus: a.estatus,
      fechaCreacion: a.fechaCreacion,
      fechaModificacion: a.fechaModificacion,
      creadoPor: a.creadoPor,
      isDeleted: a.isDeleted,
      valores: Array.isArray(a.valores) ? a.valores.join(', ') : a.valores
    };
    
    const atributoFormateadoResponse: GetAttributeByIdResponse = {
      success: jsonResponse.success,
      message: jsonResponse.message,
      atributoIndividual: atributoFormateado
    };
    return atributoFormateadoResponse as GetAttributeByIdResponse;
  },

  createAttribute: async (
    token: string,
    request: CreateAttributeRequest
  ): Promise<CreateAttributeResponse> => {
    const response = await fetch(`${BASE_URL}api/Atributos`, {
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
      throw new Error(jsonResponse.message || "Error al crear el Atributo");
    }

    return jsonResponse as CreateAttributeResponse;
  },

  updateAttribute: async (
    token: string,
    id: string,
    request: UpdateAttributeRequest
  ): Promise<UpdateAttributeResponse> => {
    const response = await fetch(`${BASE_URL}api/Atributos/${id}`, {
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
      throw new Error(jsonResponse.message || "Error al actualizar el Atributo");
    }

    return jsonResponse as UpdateAttributeResponse;
  },

  deleteAttribute: async (
    token: string,
    request: DeletAttributeRequest
  ): Promise<DeleteAttributeResponse> => {
    const { id } = request;
    const response = await fetch(`${BASE_URL}api/Atributos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Error al eliminar el Atributo");
    }

    return jsonResponse as DeleteAttributeResponse;
  },

  toggleAttribute: async (
    token: string,
    request: ToggleAttributeRequest
  ): Promise<ToggleAttributeResponse> => {
    const { id } = request;
    const response = await fetch(`${BASE_URL}api/Atributos/${id}/status`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Manejo de errores HTTP
    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Error al cambiar el estado del Atributo");
    }

    return jsonResponse as ToggleAttributeResponse;
  },

  importAttributes: async (
    token: string,
    file: File,
  ): Promise<ImportAttributeResponse> => {
    const formData = new FormData();
    formData.append("File", file);

    const response = await fetch(`${BASE_URL}api/Atributos/import`, {
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

const attributeSlice = createAttributeSlice({
  name: "attributesSlice",
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
        atributos : Attribute[]
        totalRegistros: number
      }>) => {
        state.attributesData = action.payload.atributos 
        state.totalRegistros = action.payload.totalRegistros
      }
    ),
    setAttribute: createRx.reducer(
      (state, action: PayloadAction<Attribute | null>) => {
        state.attribute = action.payload;
      }
    ),
    setSavedAttributeMode: createRx.reducer(
      (state, action: PayloadAction<"new" | "edit" | "view" | null>) => {
        state.savedAttributeMode = action.payload;
      }
    ),

    // Async Thunks
    getAttributes: createRx.asyncThunk(
      async (
        { token, requestParams }: { token: string; requestParams?: GetAttributeRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.getAttributes(token, requestParams);

          // Verificar éxito en la respuesta
          if (response.success) {
            thunkAPI.dispatch(setAttributes({ 
              atributos : response.atributosCompletos, 
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
        { token, request }: { token: string; request: GetAttributeByIdRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.getAttributeById(token, request);
          if (response.success) {
            thunkAPI.dispatch(setAttribute(response.atributoIndividual));
            // Refrescar la lista tras crear
            await thunkAPI.dispatch(getAttributes({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al obtener el Atributo"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    createAttribute: createRx.asyncThunk(
      async (
        { token, request }: { token: string; request: CreateAttributeRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.createAttribute(token, request);
          if (response.success) {
            // Refrescar la lista tras crear
            await thunkAPI.dispatch(getAttributes({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || 'Error al crear el Atributo'));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    updateAttribute: createRx.asyncThunk(
      async (
        { token, id, request }: { token: string; id: string; request: UpdateAttributeRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.updateAttribute(token, id, request);
          if (response.success) {
            // Refrescar la lista tras actualizar
            await thunkAPI.dispatch(getAttributes({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al actualizar el Atributo"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    deleteAttribute: createRx.asyncThunk(
      async (
        { token, request }: { token: string; request: DeletAttributeRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.deleteAttribute(token, request);
          if (response.success) {
            // Refrescar la lista tras actualizar
            await thunkAPI.dispatch(getAttributes({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al eliminar el Atributo"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    toggleAttributeStatus: createRx.asyncThunk(
      async (
        { token, request }: { token: string; request: ToggleAttributeRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.toggleAttribute(token, request);
          if (response.success) {
            // Refrescar la lista tras actualizar
            await thunkAPI.dispatch(getAttributes({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al cambiar el estado del Atributo"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    importAttributes: createRx.asyncThunk(
      async (
        { token, file }: { token: string; file: File },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.importAttributes(token, file);
          // if (response.success) { // Aunque no se maneje una respuesta con éxito, actualiza los atributos
          // Refrescar la lista tras actualizar
          await thunkAPI.dispatch(getAttributes({ token, requestParams: { page: 1, size: 10 } }));
          // }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al cambiar el estado del Atributo"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error);
        }
      }
    ),
  }),

  selectors: {
    attributesData: (state: AttributeState) => state.attributesData,
    isLoading: (state: AttributeState) => state.loading,
    getError: (state: AttributeState) => state.error,
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
  importAttributes,
  setSavedAttributeMode
} = attributeSlice.actions;
export const { attributesData, isLoading, getError } = attributeSlice.selectors;

export default attributeSlice.reducer;
// Attribute