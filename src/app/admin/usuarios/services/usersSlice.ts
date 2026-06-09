import { createUsersSlice } from "./createSlices";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  UserPayload,
  UserResponse,
  RoleResponse,
  CompaniesPayload,
  IndividualClaim,
  GetAdminUsersParams,
} from "./adminUsersTypes";
import { getUser, createUser } from "./usersActions";

import { apiAdminUsers } from "./adminUsersApi";
import {
  CreateAdminUserRequest,
  CreateAdminUserResponse,
  UpdateAdminUserRequest,
  UpdateAdminUserResponse,
  DeleteAdminUserResponse,
  ToggleAdminUserActiveResponse,
  GetAdminUsersResponse,
  GetAdminUserResponse,
  AssignClaimsRequest,
  GetAdminUserByIdResponse,
  AdminUserResponse,
} from "./adminUsersTypes";
import { setTotalRecordsTemplates } from "../../plantillas/services/plantillasSlice";

// Estado original de peps y nuevos
interface CompanyTab {
  id: string;
  name: string;
}

interface UsersState {
  // Estados originales
  user: UserResponse | AdminUserResponse | null;
  totalRecordsUsers: number | null;
  currentCompanies: CompaniesPayload[] | null;
  currentTemplate: string | null;
  currentPermissions: IndividualClaim[] | null;
  companyTab: CompanyTab | null;
  updatedPermissions: any[] | null;
  roles: RoleResponse[] | null;
  // Nuevo estado para la lista completa de usuarios (GET /api/AdminUsers/get-all)
  users: GetAdminUserResponse[] | null;
  totalRecordsTemplates: number | null;

  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  user: null,
  currentCompanies: null,
  currentTemplate: null,
  currentPermissions: null,
  companyTab: null,
  updatedPermissions: null,
  roles: null,
  
  users: null,
  totalRecordsUsers: null,
  totalRecordsTemplates: null,

  loading: false,
  error: null,
};

const usersSlice = createUsersSlice({
  name: "users",
  initialState,
  reducers: (createRx) => ({
    // Reducers originales
    setUser: createRx.reducer(
      (state, action: PayloadAction<UserResponse | AdminUserResponse | null>) => {
        state.user = action.payload;
      }
    ),
    setRoles: createRx.reducer(
      (state, action: PayloadAction<RoleResponse[] | null>) => {
        state.roles = action.payload;
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
    setCurrentCompanies: createRx.reducer(
      (state, action: PayloadAction<CompaniesPayload[] | null>) => {
        state.currentCompanies = action.payload;
      }
    ),
    setCurrentTemplate: createRx.reducer(
      (state, action: PayloadAction<string | null>) => {
        state.currentTemplate = action.payload;
      }
    ),
    setCurrentPermissionsStore: createRx.reducer(
      (state, action: PayloadAction<IndividualClaim[]>) => {
        state.currentPermissions = action.payload;
      }
    ),
    setCurrentCompanyTab: createRx.reducer(
      (state, action: PayloadAction<CompanyTab | null>) => {
        state.companyTab = action.payload;
      }
    ),
    setUpdatedPermissions: createRx.reducer(
      (state, action: PayloadAction<any[] | null>) => {
        state.updatedPermissions = action.payload;
      }
    ),

    // Nuevo reducer para almacenar el listado de usuarios obtenido por GET /api/AdminUsers/get-all
    setUsers: createRx.reducer(
      (state, action: PayloadAction<GetAdminUserResponse[] | null>) => {
        state.users = action.payload;
      }
    ),
    setTotalRecordsUsers: createRx.reducer(
      (state, action: PayloadAction<number | null>) => {
        state.totalRecordsUsers = action.payload;
      }
    ),
    setTotalRecordsTemplates: createRx.reducer(
      (state, action: PayloadAction<number | null>) => {
        state.totalRecordsTemplates = action.payload;
      }
    ),

    flushAll: createRx.reducer((state) => {
      state.user = null;
      state.roles = null;
      state.currentCompanies = null;
      state.currentPermissions = null;
      state.updatedPermissions = null;
      state.users = null;
      state.totalRecordsUsers = null;
      state.loading = false;
      state.error = null;
    }),
    // Async Thunk para obtener usuarios (GET /api/AdminUsers/get-all)
    getUsers: createRx.asyncThunk(
      async (
        { token, params }: {
          token: string;
          params?: GetAdminUsersParams
        },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        await new Promise((resolve) => setTimeout(resolve, 2000));
        try {
          const response: GetAdminUsersResponse = await apiAdminUsers.getUsers(token, params);
          if (response.success) {
            thunkAPI.dispatch(setUsers(response.users));
            thunkAPI.dispatch(setTotalRecordsUsers(response.totalRegistros));
            thunkAPI.dispatch(setTotalRecordsTemplates(response.totalRegistros));
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
    
    // Async Thunk para obtener un usuario por ID (GET /api/AdminUsers/get/{userId})
    getUserById: createRx.asyncThunk(
      async ({ token, id }: { token: string; id: string }, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response: GetAdminUserByIdResponse = await apiAdminUsers.getUserById(token, id);
          thunkAPI.dispatch(setUser(response.user));
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
    // Async Thunk para crear usuario (POST /api/AdminUsers/create)
    createNewUser: createRx.asyncThunk(
      async ({ token, body }: { token: string; body: CreateAdminUserRequest }, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response: CreateAdminUserResponse = await apiAdminUsers.createUser(token, body);
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
    // Async Thunk para editar usuario (PUT /api/AdminUsers/edit)
    updateUser: createRx.asyncThunk(
      async ({ token, body }: { token: string; body: UpdateAdminUserRequest }, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response: UpdateAdminUserResponse = await apiAdminUsers.updateUser(token, body);
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
    // Async Thunk para cambiar estado de usuario (PUT /api/AdminUsers/toggle-status/{userId})
    toggleUserStatus: createRx.asyncThunk(
      async ({ token, userId }: { token: string; userId: string }, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response: ToggleAdminUserActiveResponse = await apiAdminUsers.toggleUserStatus(token, userId);
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
    // Async Thunk para eliminar usuario (DELETE /api/AdminUsers/delete/{userId})
    deleteUser: createRx.asyncThunk(
      async ({ token, userId }: { token: string; userId: string }, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response: DeleteAdminUserResponse = await apiAdminUsers.deleteUser(token, userId);
          if (response.success) {
            thunkAPI.dispatch(setUser(null));
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
    // Async Thunk para crear usuario sin claims (POST /api/AdminUsers/create-user-no-claims)
    createUserNoClaims: createRx.asyncThunk(
      async ({ token, body }: { token: string; body: CreateAdminUserRequest }, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await apiAdminUsers.createUserNoClaims(token, body);
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
    // Async Thunk para asignar claims a un usuario (POST /api/AdminUsers/assign-claims)
    assignClaims: createRx.asyncThunk(
      async ({ token, body }: { token: string; body: AssignClaimsRequest }, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await apiAdminUsers.assignClaims(token, body);
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
    //////////////////////////////////////////////////////////////////
    // #region Antiguos redux deprecated pero para no romper la app //
    //////////////////////////////////////////////////////////////////
    fetchUser: createRx.asyncThunk(
      async ({ token, id }: { token: string; id: string }, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response: UserResponse = await getUser({ token, id });
          thunkAPI.dispatch(setUser(response));
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),
    addUser: createRx.asyncThunk(
      async ({ token, body }: { token: string; body: UserPayload }, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response: UserResponse = await createUser({ token, body });
          thunkAPI.dispatch(setUser(response));
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),
    // #endregion
  }),
  selectors: {
    // Reducers originales
    user: (state: UsersState) => state.user,
    currentCompanies: (state: UsersState) => state.currentCompanies,
    currentTemplate: (state: UsersState) => state.currentTemplate,
    currentPermissions: (state: UsersState) => state.currentPermissions,
    // Nuevos selectores
    roles: (state: UsersState) => state.roles,
    users: (state: UsersState) => state.users,
    isLoading: (state: UsersState) => state.loading,
    getError: (state: UsersState) => state.error,
  },
});

export const {
  fetchUser,
  addUser,
  createNewUser,
  getUsers,
  getUserById,
  updateUser,
  toggleUserStatus,
  deleteUser,
  createUserNoClaims,
  assignClaims,
  setUser,
  setRoles,
  setLoading,
  setError,
  setCurrentCompanies,
  setCurrentTemplate,
  setCurrentPermissionsStore,
  setCurrentCompanyTab,
  setUpdatedPermissions,
  setUsers,
  setTotalRecordsUsers,
  flushAll,
} = usersSlice.actions;

export const {
  user,
  currentCompanies,
  currentTemplate,
  currentPermissions,
  roles,
  users,
  isLoading,
  getError,
} = usersSlice.selectors;

export default usersSlice.reducer;
