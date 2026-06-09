import { createDepartmentsSlice } from "./createSlices";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  GetDepartmentsResponse,
  DepartmentDto,
  GetDepartmentsRequest,
  GetDepartmentByIdRequest,
  GetDepartmentByIdResponse,
  CreateDepartmentRequest,
  CreateDepartmentResponse,
  UpdateDepartmentRequest,
  UpdateDepartmentResponse,
  ToggleDepartmentRequest,
  ToggleDepartmentResponse,
  DeleteDepartmentRequest,
  DeleteDepartmentResponse,
} from "./departmentsTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

interface DepartmentState {
  departments: DepartmentDto[]; // Lista de departamentos
  totalRecords: number; // Total de registros
  loading: boolean; // Estado de carga para datos
  pending: boolean; // Estado de carga para acciones
  error: string | null; // Mensaje de error
}

const initialState: DepartmentState = {
  departments: [],
  totalRecords: 0,
  loading: false,
  pending: false,
  error: null,
};

const api = {
  getDepartments: async (
    token: string,
    requestParams: GetDepartmentsRequest = {}
  ): Promise<GetDepartmentsResponse> => {
    const queryParams = new URLSearchParams();

    Object.entries(requestParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Convertimos a string y eliminamos duplicados convirtiendo a array
        const uniqueValues = Array.from(new Set(value.map(String)));

        if (
          key === "Status" &&
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

    const response = await fetch(
      `${BASE_URL}NegoAdmin/Departments/departments?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Manejo de errores HTTP
    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(
        jsonResponse.message || "Error al obtener los departamentos"
      );
    }

    return jsonResponse as GetDepartmentsResponse;
  },

  getDepartmentById: async (
    token: string,
    request: GetDepartmentByIdRequest
  ): Promise<GetDepartmentByIdResponse> => {
    const { departmentId } = request;
    const response = await fetch(
      `${BASE_URL}NegoAdmin/Departments/department/${departmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Manejo de errores HTTP
    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(
        jsonResponse.message || "Error al obtener el departamento"
      );
    }

    return jsonResponse as GetDepartmentByIdResponse;
  },

  createDepartment: async (
    token: string,
    request: CreateDepartmentRequest
  ): Promise<CreateDepartmentResponse> => {
    const response = await fetch(
      `${BASE_URL}NegoAdmin/Departments/create-department`,
      {
        method: "POST",
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
      throw new Error(jsonResponse.message || "Error al crear el departamento");
    }

    return jsonResponse as CreateDepartmentResponse;
  },

  updateDepartment: async (
    token: string,
    request: UpdateDepartmentRequest
  ): Promise<UpdateDepartmentResponse> => {
    const response = await fetch(
      `${BASE_URL}NegoAdmin/Departments/update-department`,
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
        jsonResponse.message || "Error al actualizar el departamento"
      );
    }

    return jsonResponse as UpdateDepartmentResponse;
  },

  deleteDepartment: async (
    token: string,
    request: DeleteDepartmentRequest
  ): Promise<DeleteDepartmentResponse> => {
    const { departmentId } = request;
    const response = await fetch(
      `${BASE_URL}NegoAdmin/Departments/delete-department/${departmentId}`,
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
        jsonResponse.message || "Error al eliminar el departamento"
      );
    }

    return jsonResponse as DeleteDepartmentResponse;
  },

  toggleDepartmentStatus: async (
    token: string,
    request: ToggleDepartmentRequest
  ): Promise<ToggleDepartmentResponse> => {
    const { departmentId, isActive } = request;
    const response = await fetch(
      `${BASE_URL}NegoAdmin/Departments/toggle-department-status/${departmentId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
      }
    );

    // Manejo de errores HTTP
    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(
        jsonResponse.message || "Error al cambiar el estado del departamento"
      );
    }

    return jsonResponse as ToggleDepartmentResponse;
  },

  importDepartmentsFromExcelFile: async (
    token: string,
    file: File
  ): Promise<{ success: boolean; message: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}NegoAdmin/Departments/import`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }
    return await response.json();
  },
};

const departmentSlice = createDepartmentsSlice({
  name: "departments",
  initialState,
  reducers: (createRx) => ({
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
    setDepartments: createRx.reducer(
      (
        state,
        action: PayloadAction<{
          data: DepartmentDto[];
          totalRecords: number;
        }>
      ) => {
        state.departments = action.payload.data;
        state.totalRecords = action.payload.totalRecords;
      }
    ),

    // Async Thunks
    getDepartments: createRx.asyncThunk(
      async (
        {
          token,
          requestParams,
        }: { token: string; requestParams?: GetDepartmentsRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.getDepartments(token, requestParams);

          // Verificar éxito en la respuesta
          if (response.success) {
            thunkAPI.dispatch(
              setDepartments({
                data: response.departments,
                totalRecords: response.totalRecords,
              })
            );
          } else {
            throw new Error(
              response.message ||
                "Error desconocido al obtener los departamentos"
            );
          }

          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(
            setError(error.message || "Error al obtener los departamentos")
          );
          return thunkAPI.rejectWithValue(error.message);
        } finally {
          thunkAPI.dispatch(setLoading(false));
          thunkAPI.dispatch(setPending(false));
        }
      }
    ),

    getDepartmentById: createRx.asyncThunk(
      async (
        {
          token,
          request,
        }: { token: string; request: GetDepartmentByIdRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.getDepartmentById(token, request);
          if (response.success) {
            // Obtener departamentos actualizados
            await thunkAPI.dispatch(getDepartments({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(
            setError(error.message || "Error al obtener el departamento")
          );
          return thunkAPI.rejectWithValue(error.message);
        } finally {
          thunkAPI.dispatch(setLoading(false));
          thunkAPI.dispatch(setPending(false));
        }
      }
    ),

    createDepartment: createRx.asyncThunk(
      async (
        { token, request }: { token: string; request: CreateDepartmentRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setPending(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.createDepartment(token, request);
          if (response.success) {
            // Obtener departamentos actualizados
            await thunkAPI.dispatch(getDepartments({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(
            setError(error.message || "Error al crear el departamento")
          );
          return thunkAPI.rejectWithValue(error.message);
        } finally {
          thunkAPI.dispatch(setLoading(false));
          thunkAPI.dispatch(setPending(false));
        }
      }
    ),

    updateDepartment: createRx.asyncThunk(
      async (
        { token, request }: { token: string; request: UpdateDepartmentRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setPending(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.updateDepartment(token, request);
          if (response.success) {
            // Obtener departamentos actualizados
            await thunkAPI.dispatch(getDepartments({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(
            setError(error.message || "Error al actualizar el departamento")
          );
          return thunkAPI.rejectWithValue(error.message);
        } finally {
          thunkAPI.dispatch(setLoading(false));
          thunkAPI.dispatch(setPending(false));
        }
      }
    ),

    deleteDepartment: createRx.asyncThunk(
      async (
        { token, request }: { token: string; request: DeleteDepartmentRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setPending(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.deleteDepartment(token, request);
          if (response.success) {
            // Obtener departamentos actualizados
            await thunkAPI.dispatch(getDepartments({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(
            setError(error.message || "Error al eliminar el departamento")
          );
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        } finally {
          thunkAPI.dispatch(setLoading(false));
          thunkAPI.dispatch(setPending(false));
        }
      }
    ),

    toggleDepartmentStatus: createRx.asyncThunk(
      async (
        { token, request }: { token: string; request: ToggleDepartmentRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setPending(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.toggleDepartmentStatus(token, request);
          if (response.success) {
            // Obtener departamentos actualizados
            await thunkAPI.dispatch(getDepartments({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(
            setError(
              error.message || "Error al cambiar el estado del departamento"
            )
          );
          return thunkAPI.rejectWithValue(error.message);
        } finally {
          thunkAPI.dispatch(setLoading(false));
          thunkAPI.dispatch(setPending(false));
        }
      }
    ),

    importDepartmentsFromExcelFile: createRx.asyncThunk(
      async ({ token, file }: { token: string; file: File }, thunkAPI) => {
        thunkAPI.dispatch(setPending(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.importDepartmentsFromExcelFile(
            token,
            file
          );
          if (response.success) {
            // Obtener departamentos actualizados
            await thunkAPI.dispatch(getDepartments({ token }));
          }
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(
            setError(
              error.message ||
                "Error al importar departamentos desde el archivo Excel"
            )
          );
          return thunkAPI.rejectWithValue(error);
        } finally {
          thunkAPI.dispatch(setPending(false));
        }
      }
    ),
  }),
  selectors: {
    departments: (state: DepartmentState) => state.departments,
    isLoading: (state: DepartmentState) => state.loading,
    isPending: (state: DepartmentState) => state.pending,
    getError: (state: DepartmentState) => state.error,
  },
});

export const {
  setLoading,
  setPending,
  setError,
  setDepartments,
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  toggleDepartmentStatus,
  deleteDepartment,
  importDepartmentsFromExcelFile,
} = departmentSlice.actions;
export const { departments, isLoading, isPending, getError } = departmentSlice.selectors;

export default departmentSlice.reducer;
