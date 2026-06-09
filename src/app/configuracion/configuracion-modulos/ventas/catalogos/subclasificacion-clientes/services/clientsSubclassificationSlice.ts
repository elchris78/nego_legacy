import { createClientSubclassificationSlice } from "./createSlices";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  ClientSubclassification,
  CreateClientSubclassificationRequest,
  CreateClientSubclassificationResponse,
  DeletClientSubclassificationRequest,
  DeleteClientSubclassificationResponse,
  GetClientSubclassificationByIdRequest,
  GetClientSubclassificationByIdResponse,
  GetClientSubclassificationRequest,
  GetClientSubclassificationResponse,
  ImportClientSubclassificationResponse,
  ToggleClientSubclassificationRequest,
  ToggleClientSubclassificationResponse,
  UpdateClientSubclassificationRequest,
  UpdateClientSubclassificationResponse,
} from "./clientsSubclassificationTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

interface SubclassificationState {
  clientSubclassificationsData: ClientSubclassification[]; // Lista de subclasificaciones
  clientSubclassification: ClientSubclassification | null; // Detalle de subclasificación
  totalRegistros: number; // Total de registros
  loading: boolean;
  error: string | null;
}

const initialState: SubclassificationState = {
  clientSubclassificationsData: [],
  clientSubclassification: null,
  totalRegistros: 0,
  loading: false,
  error: null,
};

const api = {
  getClientSubclassifications: async (
    token: string,
    params: GetClientSubclassificationRequest = {}
  ): Promise<GetClientSubclassificationResponse> => {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Convertimos a string y eliminamos duplicados convirtiendo a array
        const uniqueValues = Array.from(new Set(value.map(String)));

        if (
          key === "isActive" &&
          uniqueValues.includes("true") &&
          uniqueValues.includes("false")
        ) {
          return; // No agregamos nada a queryParams
        }

        uniqueValues.forEach((val) => queryParams.append(key, val));
      } else if (value) {
        queryParams.append(key, String(value));
      }
    });

    const url = `${BASE_URL}api/SubclasificacionCliente${queryParams.toString() ? `?${queryParams}` : ""}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(
        json.message || "Error al listar subclasificaciones de clientes"
      );
    }

    return json as GetClientSubclassificationResponse;
  },

  getClientSubclassificationById: async (
    token: string,
    request: GetClientSubclassificationByIdRequest
  ): Promise<GetClientSubclassificationByIdResponse> => {
    const { id } = request;
    const response = await fetch(
      `${BASE_URL}/api/SubclasificacionCliente/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Manejo de errores HTTP
    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(
        jsonResponse.message ||
          "Error al obtener la subclasificación del cliente"
      );
    }

    return jsonResponse as GetClientSubclassificationByIdResponse;
  },

  createClientSubclassification: async (
    token: string,
    request: CreateClientSubclassificationRequest
  ): Promise<CreateClientSubclassificationResponse> => {
    const response = await fetch(`${BASE_URL}api/SubclasificacionCliente`, {
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
      throw new Error(
        jsonResponse.message || "Error al crear la subclasificación del cliente"
      );
    }

    return jsonResponse as CreateClientSubclassificationResponse;
  },

  updateClientSubclassification: async (
    token: string,
    id: number,
    request: UpdateClientSubclassificationRequest
  ): Promise<UpdateClientSubclassificationResponse> => {
    const response = await fetch(
      `${BASE_URL}api/SubclasificacionCliente/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );

    // Manejo de errores HTTP
    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(
        jsonResponse.message ||
          "Error al actualizar la subclasificación de cliente"
      );
    }

    return jsonResponse as UpdateClientSubclassificationResponse;
  },

  deleteClientSubclassification: async (
    token: string,
    request: DeletClientSubclassificationRequest
  ): Promise<DeleteClientSubclassificationResponse> => {
    const { id } = request;
    const response = await fetch(
      `${BASE_URL}api/SubclasificacionCliente/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(
        jsonResponse.message ||
          "Error al eliminar la subclasificación de cliente"
      );
    }

    return jsonResponse as DeleteClientSubclassificationResponse;
  },

  toggleClientSubclassification: async (
    token: string,
    request: ToggleClientSubclassificationRequest
  ): Promise<ToggleClientSubclassificationResponse> => {
    const { id } = request;
    const response = await fetch(
      `${BASE_URL}api/SubclasificacionCliente/${id}/status`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Manejo de errores HTTP
    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(
        jsonResponse.message ||
          "Error al cambiar el estado de la subclasificación de cliente"
      );
    }

    return jsonResponse as ToggleClientSubclassificationResponse;
  },

  importClientSubclassifications: async (
    token: string,
    file: File
  ): Promise<ImportClientSubclassificationResponse> => {
    const formData = new FormData();
    formData.append("File", file);

    const response = await fetch(
      `${BASE_URL}api/SubclasificacionCliente/import`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw (
        jsonResponse ||
        "Error al importar el archivo de subclasificación de clientes"
      );
    }

    return jsonResponse as ImportClientSubclassificationResponse;
  },
};

const clientSubclassificationSlice = createClientSubclassificationSlice({
  name: "subclassificationSlice",
  initialState,
  reducers: (createRx) => ({
    setLoading: createRx.reducer((state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }),
    setError: createRx.reducer(
      (state, action: PayloadAction<string | null>) => {
        state.error = action.payload;
      }
    ),
    setClientSubclassifications: createRx.reducer(
      (
        state,
        action: PayloadAction<{
          subclasificaciones: ClientSubclassification[];
          totalRegistros: number;
        }>
      ) => {
        state.clientSubclassificationsData = action.payload.subclasificaciones;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setClientSubclassification: createRx.reducer(
      (state, action: PayloadAction<ClientSubclassification | null>) => {
        state.clientSubclassification = action.payload;
      }
    ),

    // Async Thunks
    getClientSubclassifications: createRx.asyncThunk(
      async (
        {
          token,
          requestParams,
        }: { token: string; requestParams?: GetClientSubclassificationRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.getClientSubclassifications(
            token,
            requestParams
          );

          // Verificar éxito en la respuesta
          if (response.success) {
            thunkAPI.dispatch(
              setClientSubclassifications({
                subclasificaciones: response.subclasificacionesClientes,
                totalRegistros: response.totalRegistros,
              })
            );
          } else {
            throw new Error(
              response.message ||
                "Error desconocido al obtener las subclasificaciones"
            );
          }

          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(
            setError(error.message || "Error al obtener las subclasificaciones")
          );
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    getClientSubclassificationById: createRx.asyncThunk(
      async (
        {
          token,
          request,
        }: { token: string; request: GetClientSubclassificationByIdRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.getClientSubclassificationById(
            token,
            request
          );
          if (response.success) {
            thunkAPI.dispatch(
              setClientSubclassification(response.subclasificacionCliente)
            );
            // Obtener subclasi actualizadas
            await thunkAPI.dispatch(getClientSubclassifications({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(
            setError(error.message || "Error al obtener la subclasificación")
          );
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    createClientSubclassification: createRx.asyncThunk(
      async (
        {
          token,
          request,
        }: { token: string; request: CreateClientSubclassificationRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.createClientSubclassification(
            token,
            request
          );
          if (response.success) {
            // Refrescar la lista tras crear
            await thunkAPI.dispatch(getClientSubclassifications({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(
            setError(error.message || "Error al crear la subclasificación")
          );
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    updateClientSubclassification: createRx.asyncThunk(
      async (
        {
          token,
          id,
          request,
        }: {
          token: string;
          id: number;
          request: UpdateClientSubclassificationRequest;
        },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.updateClientSubclassification(
            token,
            id,
            request
          );
          if (response.success) {
            // Refrescar la lista tras actualizar
            await thunkAPI.dispatch(getClientSubclassifications({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(
            setError(error.message || "Error al actualizar la subclasificación")
          );
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    deleteClientSubclassification: createRx.asyncThunk(
      async (
        {
          token,
          request,
        }: { token: string; request: DeletClientSubclassificationRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.deleteClientSubclassification(
            token,
            request
          );
          if (response.success) {
            // Refrescar la lista tras actualizar
            await thunkAPI.dispatch(getClientSubclassifications({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(
            setError(error.message || "Error al eliminar la subclasificación")
          );
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    toggleClientSubclassificationStatus: createRx.asyncThunk(
      async (
        {
          token,
          request,
        }: { token: string; request: ToggleClientSubclassificationRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.toggleClientSubclassification(
            token,
            request
          );
          if (response.success) {
            // Refrescar la lista tras actualizar
            await thunkAPI.dispatch(getClientSubclassifications({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(
            setError(
              error.message ||
                "Error al cambiar el estado de la subclasificación"
            )
          );
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    importClientSubclassifications: createRx.asyncThunk(
      async ({ token, file }: { token: string; file: File }, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.importClientSubclassifications(
            token,
            file
          );
          if (response.success) {
            // Refrescar la lista tras actualizar
            await thunkAPI.dispatch(getClientSubclassifications({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(
            setError(
              error.message ||
                "Error al cambiar el estado de la subclasificación"
            )
          );
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error);
        }
      }
    ),
  }),

  selectors: {
    clientSubclassificationsData: (state: SubclassificationState) =>
      state.clientSubclassificationsData,
    isLoading: (state: SubclassificationState) => state.loading,
    getError: (state: SubclassificationState) => state.error,
  },
});

export const {
  setLoading,
  setError,
  setClientSubclassifications,
  setClientSubclassification,
  getClientSubclassifications,
  getClientSubclassificationById,
  createClientSubclassification,
  updateClientSubclassification,
  toggleClientSubclassificationStatus,
  deleteClientSubclassification,
  importClientSubclassifications,
} = clientSubclassificationSlice.actions;
export const { clientSubclassificationsData, isLoading, getError } =
  clientSubclassificationSlice.selectors;

export default clientSubclassificationSlice.reducer;
