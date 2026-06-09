import { createPlantillasComppanySlice } from "./createSlices";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  RoleTemplateResponse,
  GetRoleTemplatesResponse,
  CreateRoleTemplateWithCompaniesRequest,
  UpdateRoleTemplateWithCompaniesRequest,
  TemplatePayload,
  Claim,
  RoleTemplatesParams,
} from "./plantillasCompanyTypes";
import { apiRoleTemplates } from "./api";

// Definición del estado
interface PlantillasState {
  // Estado original
  currentTemplate: TemplatePayload[] | null;
  currentPermissions: Claim[] | null;
  // Nuevos estados para los endpoints de role templates
  roleTemplates: RoleTemplateResponse[];
  totalRecordsTemplates: number | null;
  roleTemplateById: RoleTemplateResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: PlantillasState = {
  currentTemplate: null,
  currentPermissions: null,
  roleTemplates: [],
  totalRecordsTemplates: null,
  roleTemplateById: null,
  loading: false,
  error: null,
};

const plantillasCompanySlice = createPlantillasComppanySlice({
  name: "plantillasCompany",
  initialState,
  reducers: (createRx) => ({
    // Reducers originales
    setCurrentTemplate: createRx.reducer((state, action: PayloadAction<TemplatePayload[] | null>) => {
      state.currentTemplate = action.payload;
    }),
    setCurrentPermissionsStore: createRx.reducer((state, action: PayloadAction<Claim[]>) => {
      state.currentPermissions = action.payload;
    }),
    // Actualizacion reducers
    setRoleTemplates: createRx.reducer((state, action: PayloadAction<RoleTemplateResponse[]>) => {
      state.roleTemplates = action.payload;
    }),
    setTotalRecordsTemplates: createRx.reducer((state, action: PayloadAction<number | null>) => {
      state.totalRecordsTemplates = action.payload;
    }),
    setRoleCurrentTemplate: createRx.reducer((state, action: PayloadAction<RoleTemplateResponse>) => {
      state.roleTemplateById = action.payload;
    }),
    setLoading: createRx.reducer((state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }),
    setError: createRx.reducer((state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }),

    // Async Thunk para obtener listado de role templates con parámetros opcionales
    getTemplates: createRx.asyncThunk(
      async (
        { token, params }: { token: string; params?: RoleTemplatesParams },
        thunkAPI
      ) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response: GetRoleTemplatesResponse = await apiRoleTemplates.getTemplates(token, params);
          if (response.success) {
            thunkAPI.dispatch(setRoleTemplates(response.roleTemplates));
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

    // Async Thunk para obtener un role template por ID
    getTemplateById: createRx.asyncThunk(
      async ({ token, id }: { token: string; id: string }, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response: RoleTemplateResponse = await apiRoleTemplates.getTemplate(token, id);
          thunkAPI.dispatch(setRoleCurrentTemplate(response));
          thunkAPI.dispatch(setLoading(false));
          return response;
        } catch (error: any) {
          thunkAPI.dispatch(setError(error.message));
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error.message);
        }
      }
    ),

    // Async Thunk para crear role template
    createTemplate: createRx.asyncThunk(
      async ({ token, body }: { token: string; body: CreateRoleTemplateWithCompaniesRequest }, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await apiRoleTemplates.createTemplate(token, body);
          if (response.success) {
            await thunkAPI.dispatch(getTemplates({ token }));
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

    // Async Thunk para editar role template
    updateTemplate: createRx.asyncThunk(
      async ({ token, id, body }: { token: string; id: string; body: Omit<UpdateRoleTemplateWithCompaniesRequest, "roleTemplateId"> }, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await apiRoleTemplates.updateTemplate(token, id, body);
          if (response.success) {
            await thunkAPI.dispatch(getTemplates({ token }));
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

    // Async Thunk para eliminar role template
    deleteTemplate: createRx.asyncThunk(
      async ({ token, id }: { token: string; id: string }, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await apiRoleTemplates.deleteTemplate(token, id);
          if (response.success) {
            await thunkAPI.dispatch(getTemplates({ token }));
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

    // Async Thunk para cambiar estatus de role template
    toggleTemplateStatus: createRx.asyncThunk(
      async ({ token, id }: { token: string; id: string }, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await apiRoleTemplates.toggleTemplateStatus(token, id);
          if (response.success) {
            await thunkAPI.dispatch(getTemplates({ token }));
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
    // Antiguos setters
    currentTemplate: (state: PlantillasState) => state.currentTemplate,
    currentPermissions: (state: PlantillasState) => state.currentPermissions,

    templates: (state: PlantillasState) => state.roleTemplates,
    roleTemplateById: (state: PlantillasState) => state.roleTemplateById,

    isLoading: (state: PlantillasState) => state.loading,
    getError: (state: PlantillasState) => state.error,
  },
});

export const {
  setLoading,
  setError,
  setCurrentTemplate,
  setCurrentPermissionsStore,
  setRoleTemplates,
  setTotalRecordsTemplates,
  setRoleCurrentTemplate,
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  toggleTemplateStatus,
} = plantillasCompanySlice.actions;

export const {
  templates,
  currentTemplate,
  currentPermissions,
  roleTemplateById,
  isLoading,
  getError,
} = plantillasCompanySlice.selectors;

export default plantillasCompanySlice.reducer;
