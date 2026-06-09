import { createBranchesSlice } from "./createSlices";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  GetBranchesResponse,
  BranchDto,
  GetBranchesRequest,
  GetBranchByIdRequest,
  GetBranchByIdResponse,
  CreateBranchRequest,
  CreateBranchResponse,
  UpdateBranchRequest,
  UpdateBranchResponse,
  ToggleBranchRequest,
  ToggleBranchResponse,
  DeleteBranchRequest,
  DeleteBranchResponse,
} from "./branchesTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

interface BranchState {
  branches: BranchDto[]; // Lista de sucursales
  branchById: GetBranchByIdResponse | null; // Sucursal por ID
  loading: boolean;
  error: string | null;
}

const initialState: BranchState = {
  branches: [],
  branchById: null,
  loading: false,
  error: null,
};

const api = {
  getBranches: async (
    token: string,
    requestParams: GetBranchesRequest = {}
  ): Promise<GetBranchesResponse> => {
    const queryString = new URLSearchParams(
      Object.entries(requestParams).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const response = await fetch(`${BASE_URL}Negoadmin/Branches/branches?${queryString}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Error al obtener las sucursales");
    }

    return jsonResponse as GetBranchesResponse;
  },

  getBranchById: async (
    token: string,
    request: GetBranchByIdRequest
  ): Promise<GetBranchByIdResponse> => {
    const { branchId } = request;
    const response = await fetch(`${BASE_URL}Negoadmin/Branches/branch/${branchId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Error al obtener la sucursal");
    }

    return jsonResponse as GetBranchByIdResponse;
  },

  createBranch: async (
    token: string,
    request: CreateBranchRequest
  ): Promise<CreateBranchResponse> => {
    const response = await fetch(`${BASE_URL}Negoadmin/Branches/create-branch`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Error al crear la sucursal");
    }

    return jsonResponse as CreateBranchResponse;
  },

  updateBranch: async (
    token: string,
    request: UpdateBranchRequest
  ): Promise<UpdateBranchResponse> => {
    const response = await fetch(`${BASE_URL}Negoadmin/Branches/update-branch`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Error al actualizar la sucursal");
    }

    return jsonResponse as UpdateBranchResponse;
  },

  deleteBranch: async (
    token: string,
    request: DeleteBranchRequest
  ): Promise<DeleteBranchResponse> => {
    const { branchId } = request;
    const response = await fetch(`${BASE_URL}Negoadmin/Branches/delete-branch/${branchId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Error al eliminar la sucursal");
    }

    return jsonResponse as DeleteBranchResponse;
  },

  toggleBranchStatus: async (
    token: string,
    request: ToggleBranchRequest
  ): Promise<ToggleBranchResponse> => {
    const { branchId, isActive } = request;
    const response = await fetch(`${BASE_URL}Negoadmin/Branches/toggle-branch-status/${branchId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive }),
    });

    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Error al cambiar el estado de la sucursal");
    }

    return jsonResponse as ToggleBranchResponse;
  },
};


const branchSlice = createBranchesSlice({
  name: "branches",
  initialState,
  reducers: (createRx) => ({
    setLoading: createRx.reducer((state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }),
    setError: createRx.reducer((state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }),
    setBranches: createRx.reducer((state, action: PayloadAction<BranchDto[]>) => {
      state.branches = action.payload;
    }),
    setBranchById: createRx.reducer((state, action: PayloadAction<GetBranchByIdResponse | null>) => {
      state.branchById = action.payload;
    }),
    // Async Thunks
    getBranches: createRx.asyncThunk(
      async (
        { token, requestParams }: { token: string; requestParams?: GetBranchesRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.getBranches(token, requestParams);
          if (response.success) {
            thunkAPI.dispatch(setBranches(response.branches));
          } else {
            throw new Error(response.message || "Error desconocido al obtener las sucursales");
          }

          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al obtener las sucursales"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    getBranchById: createRx.asyncThunk(
      async (
        { token, request }: { token: string; request: GetBranchByIdRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.getBranchById(token, request);
          if (response.success) {
            // Obtener sucursales actualizadas
            await thunkAPI.dispatch(setBranchById(response));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al obtener la sucursal"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    createBranch: createRx.asyncThunk(
      async (
        { token, request }: { token: string; request: CreateBranchRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.createBranch(token, request);
          if (response.success) {
            // Obtener sucursales actualizadas
            await thunkAPI.dispatch(getBranches({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al crear la sucursal"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    updateBranch: createRx.asyncThunk(
      async (
        { token, request }: { token: string; request: UpdateBranchRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.updateBranch(token, request);
          if (response.success) {
            // Obtener sucursales actualizadas
            await thunkAPI.dispatch(getBranches({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al actualizar la sucursal"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    deleteBranch: createRx.asyncThunk(
      async (
        { token, request }: { token: string; request: DeleteBranchRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.deleteBranch(token, request);
          if (response.success) {
            // Obtener sucursales actualizadas
            await thunkAPI.dispatch(getBranches({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al eliminar la sucursal"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    toggleBranchStatus: createRx.asyncThunk(
      async (
        { token, request }: { token: string; request: ToggleBranchRequest },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.toggleBranchStatus(token, request);
          if (response.success) {
            // Obtener sucursales actualizadas
            await thunkAPI.dispatch(getBranches({ token }));
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message || "Error al cambiar el estado de la sucursal"));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),
  }),
  selectors: {
    branches: (state: BranchState) => state.branches,
    branchById: (state: BranchState) => state.branchById,
    isLoading: (state: BranchState) => state.loading,
    getError: (state: BranchState) => state.error,
  },
});

export const {
  setLoading,
  setError,
  setBranches,
  setBranchById,
  getBranches,
  getBranchById,
  createBranch,
  updateBranch,
  toggleBranchStatus,
  deleteBranch,
} = branchSlice.actions;
export const { branches, branchById, isLoading, getError } = branchSlice.selectors;

export default branchSlice.reducer;
