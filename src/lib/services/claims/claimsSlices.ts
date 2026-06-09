import { PayloadAction } from "@reduxjs/toolkit";
import { createClaimsSlice } from "./createSlices"; // Asegúrate de tener `buildCreateSlice` y `asyncThunkCreator` configurados aquí.
import { Claim } from "./claimsTypes";
import Swal from "sweetalert2";
import { set } from "date-fns";
import { se } from "date-fns/locale";
import Cookies from "js-cookie";

interface ClaimsByTab {
  companyId: string;
  claims: UserClaims[];
}

interface UserClaims {
  permissionType?: string;
  roleTemplateId?: string;
  individualClaims?: IndividualClaims[];
}

type IndividualClaims = {
  claimType: string;
  claimValue: string;
};

interface ClaimsState {
  data: Claim[];
  dataAll: Claim[]
  loading: boolean;
  error: string | null;
  selectedTabCompanyId: string;
  selectedTabClaims: IndividualClaims[];
  selectedTabTemplate: string;
  selectedTabTemplateName: string;
  claimsByTabId: ClaimsByTab[];
  permissionType: string;
  fullName: string; // <-- nuevo
  profilePicture: string; // <-- nuevo
}

const initialState: ClaimsState = {
  data: [],
  dataAll: [],
  loading: false,
  error: null,
  selectedTabCompanyId: "",
  claimsByTabId: [],
  selectedTabTemplate: "",
  selectedTabTemplateName: "",
  permissionType: "",
  selectedTabClaims: [],
  fullName: "", // <-- nuevo
  profilePicture: "", // <-- nuevo
};

const BASE_URL_AUTH = process.env.NEXT_PUBLIC_AUTH_URL;
const BASE_URL_BACK = process.env.NEXT_PUBLIC_BACKEND_URL;

const api = {
  fetchClaims: async (token: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (token) {
      myHeaders.append("Authorization", `Bearer ${token}`);
    }

    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(
      `${BASE_URL_AUTH}api/Account/getme`,
      requestOptions
    );

    if (!response.ok) {
      const result = await response.json();

      throw new Error(result.message || "Error al obtener los claims.");
    }

    return response.json();
  },
  fetchAllClaims: async (token: string) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
  
      if (token) {
        myHeaders.append("Authorization", `Bearer ${token}`);
      }
  
      const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
  
      const response = await fetch(
        `${BASE_URL_BACK}NegoAdmin/Claim/getAllClaims`,
        requestOptions
      );
  
      if (!response.ok) {
        const result = await response.json();
  
        throw new Error(result.message || "Error al obtener los claims.");
      }
  
      return response.json();
    },
  fetchClaimsWithParams: async (token: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (token) {
      myHeaders.append("Authorization", `Bearer ${token}`);
    }

    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(
      `${BASE_URL_AUTH}api/Claims/getall`,
      requestOptions
    );

    if (!response.ok) {
      const result = await response.json();

      throw new Error(result.message || "Error al obtener los claims.");
    }

    return response.json();
  },
};

const claimsSlice = createClaimsSlice({
  name: "claims",
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
    setData: createRx.reducer((state, action: PayloadAction<Claim[]>) => {
      state.data = action.payload;
    }),
    setDataAll: createRx.reducer((state, action: PayloadAction<Claim[]>) => {
      state.dataAll = action.payload;
    }),
    setTabCompanyId: createRx.reducer((state, action: PayloadAction<string>) => {
        state.selectedTabCompanyId = action.payload;
    }),
    setClaimsByTabId: createRx.reducer((state, action: PayloadAction<ClaimsByTab[]>) => {
        state.claimsByTabId = action.payload;
    }),
    setPermissionType: createRx.reducer((state, action: PayloadAction<string>) => {
      state.permissionType = action.payload;
    }),
    setSelectedTabClaims: createRx.reducer((state, action: PayloadAction<IndividualClaims[]>) => {
      state.selectedTabClaims = action.payload;
    }),
    setSelectedTabTemplate: createRx.reducer((state, action: PayloadAction<string>) => {
      state.selectedTabTemplate = action.payload;
    }),
    setSelectedTabTemplateName : createRx.reducer((state, action: PayloadAction<string>) => {
      state.selectedTabTemplateName = action.payload
    }),
    setFullName: createRx.reducer((state, action: PayloadAction<string>) => {
      state.fullName = action.payload;
    }),
    setProfilePicture: createRx.reducer((state, action: PayloadAction<string>) => {
      state.profilePicture = action.payload;
    }),

    fetchClaims: createRx.asyncThunk(async (token: string, thunkAPI) => {
      let userType = Cookies.get("user-type");
      let company = Cookies.get("company");
      thunkAPI.dispatch(setLoading(true));
      thunkAPI.dispatch(setError(null));
      try {
        const response = await api.fetchClaims(token);
        const claims = response.claimDetails.claims || [];
        thunkAPI.dispatch(setData(response.claimDetails.claims));
        thunkAPI.dispatch(setFullName(response.fullName || ""));
        thunkAPI.dispatch(setProfilePicture(response.profilePicture || ""));
        thunkAPI.dispatch(setLoading(false));
        if (userType === "compartido" && !company) {
          return claims;
        }
        if (response.claimDetails.claims.length === 0) {
            Swal.fire({
              title: "¡ERROR!",
              text: "No tienes permisos asignados en esta empresa. Favor de comunicarte con el administrador.",
              icon: "error",
              confirmButtonText: "Volver a intentar",
              customClass: {
                container: 'swal2-container',
                popup: 'swal-popup-error', 
                confirmButton: 'swal-confirm-button', 
                title: 'swal-title', 
              },
            });
        }
        return response.claimDetails.claims;
      } catch (error: any) {
        thunkAPI.dispatch(
          setError(error.message || "Error al obtener los claims")
        );
        thunkAPI.dispatch(setLoading(false));
        return thunkAPI.rejectWithValue(error);
      }
    }),
    fetchClaimsWithParams: createRx.asyncThunk(
      async (token: string, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        thunkAPI.dispatch(setError(null));
        try {
          const response = await api.fetchClaimsWithParams(token);

          thunkAPI.dispatch(setData(response.claimDetails.claims));
          thunkAPI.dispatch(setLoading(false));
          return response.claimDetails.claims;
        } catch (error: any) {
          thunkAPI.dispatch(
            setError(error.message || "Error al obtener los claims")
          );
          thunkAPI.dispatch(setLoading(false));
          return thunkAPI.rejectWithValue(error);
        }
      }
    ),
    fetchAllClaims: createRx.asyncThunk(async (token: string, thunkAPI) => {
          thunkAPI.dispatch(setLoading(true));
          thunkAPI.dispatch(setError(null));
          try {
            const response = await api.fetchAllClaims(token);
    
            thunkAPI.dispatch(setDataAll(response));
            thunkAPI.dispatch(setLoading(false));
            return response;
          } catch (error: any) {
            thunkAPI.dispatch(
              setError(error.message || "Error al obtener los claims")
            );
            thunkAPI.dispatch(setLoading(false));
            return thunkAPI.rejectWithValue(error);
          }
        }),
  }),
  selectors: {
    dataAll: (state: ClaimsState) => state.dataAll, 
    data: (state: ClaimsState) => state.data,
    isLoading: (state: ClaimsState) => state.loading,
    getError: (state: ClaimsState) => state.error,
    selectedTabCompanyId: (state: ClaimsState) => state.selectedTabCompanyId,
    claimsByTabId: (state: ClaimsState) => state.claimsByTabId,
    permissionType: (state: ClaimsState) => state.permissionType,
    selectedTabClaims: (state: ClaimsState) => state.selectedTabClaims,
    selectedTabTemplate: (state: ClaimsState) => state.selectedTabTemplate,
    selectedTabTemplateName: (state: ClaimsState) => state.selectedTabTemplate,
    fullName: (state: ClaimsState) => state.fullName,
    profilePicture: (state: ClaimsState) => state.profilePicture,
  },
});

export const { setLoading, setError, setData, setDataAll, fetchClaims, fetchAllClaims, setTabCompanyId, setClaimsByTabId, setPermissionType, setSelectedTabClaims, setSelectedTabTemplate, setSelectedTabTemplateName, setFullName, setProfilePicture } =
  claimsSlice.actions;
export const { data, dataAll, isLoading, getError, selectedTabCompanyId, claimsByTabId, permissionType, selectedTabClaims, selectedTabTemplate, selectedTabTemplateName, fullName, profilePicture} = claimsSlice.selectors;

export default claimsSlice.reducer;
