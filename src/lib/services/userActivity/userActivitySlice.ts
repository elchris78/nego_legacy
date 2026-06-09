import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ActionsActivityHistoryDto,
  GetActionsHistoryResponse,
  GetActivityCompanyHistoryRequest,
  GetActivityHistoryRequest,
  GetUserActivityHistoryResponse,
  UserActivityHistoryDto,
} from "./userActivityTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

interface UserActivityState {
  userActivityHistory: UserActivityHistoryDto[];
  actionsActivityHistory: ActionsActivityHistoryDto[];
  actionsTotalRecords: number;
  totalRecords: number;
  loading: boolean;
  error: string | null;
}

const initialState: UserActivityState = {
  userActivityHistory: [],
  actionsActivityHistory: [],
  totalRecords: 0,
  actionsTotalRecords: 0,
  loading: false,
  error: null,
};

const api = {
  getUserActivityHistory: async (
    token: string,
    requestParams: GetActivityHistoryRequest = {}
  ): Promise<GetUserActivityHistoryResponse> => {
    const queryParams = new URLSearchParams();
  
    Object.entries(requestParams).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((val) => queryParams.append(key, String(val))); // Agrega múltiples valores correctamente
        } else {
          queryParams.append(key, String(value));
        }
      }
    });
  
    const response = await fetch(`${BASE_URL}Api/UserActivity/online?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Error al obtener el historial de actividad");
    }
  
    return jsonResponse as GetUserActivityHistoryResponse;
  },
  

  getCompanieActivityHistory: async (
    token: string,
    requestParams: GetActivityCompanyHistoryRequest = {}
  ): Promise<GetActionsHistoryResponse> => {
    const queryParams = new URLSearchParams();
  
    Object.entries(requestParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Para arrays, agregamos cada valor por separado en la query
        value.forEach((val) => queryParams.append(key, String(val)));
      } else if (value) {
        queryParams.append(key, String(value));
      }
    });
  
    const response = await fetch(`${BASE_URL}Api/UserActivity/action-history?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    const jsonResponse = await response.json();
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Error al obtener el historial de actividad empresarial");
    }
  
    return jsonResponse as GetActionsHistoryResponse;
  }
};

const userActivitySlice = createSlice({
  name: "userActivity",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setUserActivityHistory: (
      state,
      action: PayloadAction<{
        data: UserActivityHistoryDto[];
        totalRecords: number;
      }>
    ) => {
      state.userActivityHistory = action.payload.data;
      state.totalRecords = action.payload.totalRecords;
    },
    setCompanieActivityHistory: (
      state,
      action: PayloadAction<{
        data: ActionsActivityHistoryDto[];
        actionsTotalRecords: number;
      }>
    ) => {
      state.actionsActivityHistory = action.payload.data;
      state.actionsTotalRecords = action.payload.actionsTotalRecords;
    },
  },
});

export const {
  setLoading,
  setError,
  setUserActivityHistory,
  setCompanieActivityHistory,
} = userActivitySlice.actions;

export const fetchUserActivityHistory = (
  token: string,
  requestParams?: GetActivityHistoryRequest
) => async (dispatch: any) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    const response = await api.getUserActivityHistory(token, requestParams);
    dispatch(
      setUserActivityHistory({
        data: response.userActivityHistoryDatas,
        totalRecords: response.totalRegistros,
      })
    );
    dispatch(setLoading(false));
  } catch (error: any) {
    dispatch(setError(error.message || "Error al obtener el historial de actividad"));
    dispatch(setLoading(false));
  }
};

export const fetchActionActivityHistory = (
  token: string,
  requestParams?: GetActivityCompanyHistoryRequest
) => async (dispatch: any) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  try {
    const response = await api.getCompanieActivityHistory(token, requestParams);
    dispatch(
      setCompanieActivityHistory({
        data: response.userActionsHistory,
        actionsTotalRecords: response.totalRegistros,
      })
    );
    dispatch(setLoading(false));
  } catch (error: any) {
    dispatch(
      setError(error.message || "Error al obtener el historial de actividad empresarial")
    );
    dispatch(setLoading(false));
  }
};

export default userActivitySlice.reducer;
