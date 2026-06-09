import { createCompanyUsersSlice } from "./createSlices";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  GetCompanyUsersParams,
  IndividualClaims,
  UserPayload
} from "./companyUsersTypes";

import { apiCompanyUsers } from "./companyUsersApi";
import {
  CreateCompanyUserRequest,
  CreateCompanyUserResponse,
  UpdateCompanyUserRequest,
  UpdateCompanyUserResponse,
  DeleteCompanyUserResponse,
  ToggleCompanyUserActiveResponse,
  GetCompanyUsersResponse,
  GetCompanyUserResponse,
  AssignClaimsRequest,
  GetCompanyUserByIdResponse,
} from "./companyUsersTypes";

interface UsersState {
  // Estados originales
  currentUser: UserPayload[] | null;
  currentPermissions: IndividualClaims[] | null;
  // Estados actualizados redux
  user: GetCompanyUserByIdResponse | null;
  users: GetCompanyUserResponse[];
  totalRecordsUsers: number;

  loading: boolean;
  error: string | null;

  selectedTemplatesGUID: string[];
}

const initialState: UsersState = {
  currentUser: null,
  currentPermissions: null,

  user: null,
  users: [],
  totalRecordsUsers: 0,

  loading: false,
  error: null,

  selectedTemplatesGUID: [],
};

const usersSlice = createCompanyUsersSlice({
  name: "usersCompany",
  initialState,
  reducers: (createRx) => ({
    // Reducers originales
    setCurrentUser: createRx.reducer(
      (state, action: PayloadAction<UserPayload[] | null>) => {
        state.currentUser = action.payload;
      }
    ),
    setCurrentPermissionsStore: createRx.reducer(
      (state, action: PayloadAction<IndividualClaims[]>) => {
        state.currentPermissions = action.payload;
      }
    ),

    // Nuevos estados
    setUser: createRx.reducer(
      (state, action: PayloadAction<GetCompanyUserByIdResponse | null>) => {
        state.user = action.payload;
      }
    ),
    setUsers: createRx.reducer(
      (state, action: PayloadAction<GetCompanyUserResponse[]>) => {
        state.users = action.payload;
      }
    ),
    setTotalRecordsUsers: createRx.reducer(
      (state, action: PayloadAction<number>) => {
        state.totalRecordsUsers = action.payload;
      }
    ),
    setSelectedTemplatesGUID: createRx.reducer(
      (state, action: PayloadAction<string[]>) => {
        state.selectedTemplatesGUID = action.payload;
      }
    ),

    setLoading: createRx.reducer((state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }),
    setError: createRx.reducer(
      (state, action: PayloadAction<string | null>) => {
        state.error = action.payload;
      }
    ),

    flushAll: createRx.reducer((state) => {
      state.currentUser = null;
      state.currentPermissions = null;

      state.user = null;
      state.users = [];
      state.loading = false;
      state.error = null;
    }),
    // Async Thunk para obtener usuarios (GET /api/CompanyUsers/get-all)
    getUsers: createRx.asyncThunk(
      async (
        { token, params }: {
          token: string;
          params?: GetCompanyUsersParams
        },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        await new Promise((resolve) => setTimeout(resolve, 2000));
        try {
          const response: GetCompanyUsersResponse = await apiCompanyUsers.getUsers(token, params);
          if (response.success) {
            thunkAPI.dispatch(setUsers(response.users));
            thunkAPI.dispatch(setTotalRecordsUsers(response.totalRegistros));
          } else {
            throw new Error(response.message);
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),
    
    // Async Thunk para obtener un usuario por ID (GET /api/CompanyUsers/get/{userId})
    getUserById: createRx.asyncThunk(
      async ({ token, id }: { token: string; id: string }, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response: GetCompanyUserByIdResponse = await apiCompanyUsers.getUserById(token, id);
          thunkAPI.dispatch(setUser(response));
          if (response.success) {
            await thunkAPI.dispatch(getUsers({ token }));
          } else {
            throw new Error(response.message);
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),
    // Async Thunk para crear usuario (POST /api/CompanyUsers/create)
    createNewUser: createRx.asyncThunk(
      async ({ token, body }: { token: string; body: CreateCompanyUserRequest }, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response: CreateCompanyUserResponse = await apiCompanyUsers.createUser(token, body);
          if (response.success) {
            await thunkAPI.dispatch(getUsers({ token }));
          } else {
            throw new Error(response.message);
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),
    // Async Thunk para editar usuario (PUT /api/CompanyUsers/edit)
    updateUser: createRx.asyncThunk(
      async ({ token, body }: { token: string; body: UpdateCompanyUserRequest }, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response: UpdateCompanyUserResponse = await apiCompanyUsers.updateUser(token, body);
          if (response.success) {
            await thunkAPI.dispatch(getUsers({ token }));
          } else {
            throw new Error(response.message);
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),
    // Async Thunk para cambiar estado de usuario (PUT /api/CompanyUsers/toggle-status/{userId})
    toggleUserStatus: createRx.asyncThunk(
      async ({ token, userId }: { token: string; userId: string }, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response: ToggleCompanyUserActiveResponse = await apiCompanyUsers.toggleUserStatus(token, userId);
          if (response.success) {
            await thunkAPI.dispatch(getUsers({ token }));
          } else {
            throw new Error(response.message);
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),
    // Async Thunk para eliminar usuario (DELETE /api/CompanyUsers/delete/{userId})
    deleteUser: createRx.asyncThunk(
      async ({ token, userId }: { token: string; userId: string }, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response: DeleteCompanyUserResponse = await apiCompanyUsers.deleteUser(token, userId);
          thunkAPI.dispatch(setLoading(false));
          if (response.success) {
            thunkAPI.dispatch(setUser(null));
            await thunkAPI.dispatch(getUsers({ token }));
          } else {
            throw new Error(response.message);
          }
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),
    // Async Thunk para crear usuario sin claims (POST /api/CompanyUsers/create-user-no-claims)
    createUserNoClaims: createRx.asyncThunk(
      async ({ token, body }: { token: string; body: CreateCompanyUserRequest }, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await apiCompanyUsers.createUserNoClaims(token, body);
          if (response.success) {
            await thunkAPI.dispatch(getUsers({ token }));
          } else {
            throw new Error(response.message);
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),
    // Async Thunk para asignar claims a un usuario (POST /api/CompanyUsers/assign-claims)
    assignClaims: createRx.asyncThunk(
      async ({ token, body }: { token: string; body: AssignClaimsRequest }, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await apiCompanyUsers.assignClaims(token, body);
          if (response.success) {
            await thunkAPI.dispatch(getUsers({ token }));
          } else {
            throw new Error(response.message);
          }
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),
  }),
  selectors: {
    // Reducers originales
    currentUser: (state: UsersState) => state.currentUser,
    currentPermissions: (state: UsersState) => state.currentPermissions,
    // Nuevos selectores
    user: (state: UsersState) => state.user,
    users: (state: UsersState) => state.users,
    isLoading: (state: UsersState) => state.loading,
    getError: (state: UsersState) => state.error,
  },
});

export const {
  setCurrentUser,
  setCurrentPermissionsStore,

  setUser,
  setUsers,
  setTotalRecordsUsers,
  setSelectedTemplatesGUID,

  setLoading,
  setError,

  createNewUser,
  getUsers,
  getUserById,
  updateUser,
  toggleUserStatus,
  deleteUser,
  createUserNoClaims,
  assignClaims,

  flushAll,
} = usersSlice.actions;

export const {
  currentUser,
  currentPermissions,

  user,
  users,

  isLoading,
  getError,
} = usersSlice.selectors;

export default usersSlice.reducer;
