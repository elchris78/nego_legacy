import { PayloadAction } from "@reduxjs/toolkit";

import { createSucursalesSlice } from "./createSlices";
import {
  createSucursal,
  updateSucursal,
  deleteSucursal,
  getSucursalById,
  getSucursal,
  importSucursalFromExcel,
  toggleSucursalStatus,
  addDocumentSucursal,
  getDocumentById,
  getDocumentSucursalById,
  updateDocumentSucursal,
  deleteSucursalDoc
} from "./sucursalesActions";

import type {
  Sucursal,
  SucursalesParams,
  GetSucursalByIdResponse,
  GetSucursalResponse,
  GetDocumentByIdRequest,
  AddDocumentSucursal,
  GetDocumentByIdResponse,
  GetDocumentByIdsResponse,
} from "./sucursalesTypes";
import { Option } from "@/components/ui/multiselect";

interface SucursalState {
  sucursal: Sucursal[] | null;
  documentos: AddDocumentSucursal[] | null;
  documento: AddDocumentSucursal | null;
  currentSucursal: Sucursal | null;
  loading: boolean;
  error: string | null;
  totalRegistros: number;
  sucursalOptions: Sucursal[] | null; 
  savedSucursalMode: "new" | "edit" | "view" | null;
  filtroOptions: {
  paises: Option[];
  estados: Option[];
  ciudades: Option[];
  codigosPostales: Option[];
},

}

const initialState: SucursalState = {
  sucursal: null,
  sucursalOptions: null,
  currentSucursal: null,
  documentos: null,
  documento: null,
  loading: false,
  error: null,
  totalRegistros: 0,
  savedSucursalMode: null,
  filtroOptions: {
    paises: [],
    estados: [],
    ciudades: [],
    codigosPostales: [],
  },
};


const sucursalSlice = createSucursalesSlice({
  name: "sucursal",
  initialState,
  reducers: (createRx) => ({
    setSucursal: createRx.reducer(
      (state, action: PayloadAction<GetSucursalResponse>) => {
        state.sucursal = action.payload.sucursales;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setSavedSucursalMode: createRx.reducer(
      (state, action: PayloadAction<"new" | "edit" | "view" | null>) => {
        state.savedSucursalMode = action.payload;
      }
    ),
    setCurrentSucursal: createRx.reducer(
      (state, action: PayloadAction<GetSucursalByIdResponse>) => {
        state.currentSucursal = action.payload.sucursal;
      }
    ),
    setSucursalDocumentos: createRx.reducer(
      (state, action: PayloadAction<GetDocumentByIdResponse>) => {
        state.documentos = action.payload.documentos;
        state.totalRegistros = action.payload.totalRegistros;
      }
    ),
    setSucursalDocumento: createRx.reducer(
      (state, action: PayloadAction<AddDocumentSucursal>) => {
        state.documento = action.payload;
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
    setFiltroOptions: createRx.reducer(
      (state, action: PayloadAction<{
        paises: Option[];
        estados: Option[];
        ciudades: Option[];
        codigosPostales: Option[];
      }>) => {
        state.filtroOptions = action.payload;
      }
    ),
    setSucursalOptions: createRx.reducer(
      (state, action: PayloadAction<Sucursal[]>) => {
        state.sucursalOptions = action.payload;
      }
    ),

    flushAll: createRx.reducer((state) => {
      state.sucursal = null;
      state.currentSucursal = null;
      state.loading = false;
      state.error = null;
      state.totalRegistros = 0;
    }),
    getSucursal: createRx.asyncThunk(
      async (
        {
          token,
          params,
        }: {
          token: string | undefined;
          params: SucursalesParams;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(sucursalSlice.actions.setLoading(true));
          const response = await getSucursal({ token, params });
          dispatch(sucursalSlice.actions.setSucursal(response));
        } catch (error: any) {
          dispatch(
            sucursalSlice.actions.setError(
              error?.message || "Error al obtener tipos de vendedores"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sucursalSlice.actions.setLoading(false));
        }
      }
    ),
    getSucursalById: createRx.asyncThunk(
      async (
        {
          token,
          id,
        }: {
          token: string | undefined;
          id: string | null;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(sucursalSlice.actions.setLoading(true));
          const response = await getSucursalById({ token, id });
          dispatch(sucursalSlice.actions.setCurrentSucursal(response));
          return response;
        } catch (error: any) {
          dispatch(
            sucursalSlice.actions.setError(
              error?.message || "Error al obtener el tipo de sucursal"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sucursalSlice.actions.setLoading(false));
        }
      }
    ),
    createSucursal: createRx.asyncThunk(
      async (
        { token, formData }: { token: string | undefined; formData: FormData },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(sucursalSlice.actions.setLoading(true));
        try {
          const response = await createSucursal({ token, formData });
          return response;
        } catch (error: any) {
          dispatch(
            sucursalSlice.actions.setError(
              error?.message || "Error al crear el Sucursal"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sucursalSlice.actions.setLoading(false));
        }
      }
    ),
    addDocumentSucursal: createRx.asyncThunk(
      async (
        { token, formData }: { token: string | undefined; formData: FormData },
        { dispatch, rejectWithValue}
      ) => {
        dispatch(sucursalSlice.actions.setLoading(true));
        try {
          const response = await addDocumentSucursal({ token, formData });
          return response;
        } catch (error: any) {
          dispatch(
            sucursalSlice.actions.setError(
              error?.message || "Error al subir el archivo"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sucursalSlice.actions.setLoading(true))
        }
      }
    ),
    getDocumentsBySucursalId: createRx.asyncThunk(
      async (
        {
          token,
          id,
        }: {
          token: string | undefined;
          id: string | null;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(sucursalSlice.actions.setLoading(true));
          const response = await getDocumentById({ token, id });
        
          dispatch(sucursalSlice.actions.setSucursalDocumentos(response));
          return response.documentos;
        } catch (error: any) {
          dispatch(
            sucursalSlice.actions.setError(
              error?.message || "Error al obtener los documentos de la sucursal"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sucursalSlice.actions.setLoading(false));
        }
      }
    ),
    updateSucursal: createRx.asyncThunk(
      async (
        {
          token,
          id,
          formData,
        }: { token: string | undefined; id: string | null; formData: FormData},
        { dispatch, rejectWithValue }
      ) => {
        dispatch(sucursalSlice.actions.setLoading(true));
        try {
          const response = await updateSucursal({ token, id, formData });
          return response;
        } catch (error: any) {
          dispatch(
            sucursalSlice.actions.setError(
              error?.message || "Error al actualizar el Sucursal"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sucursalSlice.actions.setLoading(false));
        }
      }
    ),
    deleteSucursal: createRx.asyncThunk(
      async (
        {
          token,
          id,
        }: {
          token: string | undefined;
          id: string | null;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(sucursalSlice.actions.setLoading(true));
          const response = await deleteSucursal({ token, id });
          await dispatch(
            sucursalSlice.actions.getSucursal({
              token,
              params: {
                page: 1,
                size: 20,
              },
            })
          );
          return response;
        } catch (error: any) {
          dispatch(
            sucursalSlice.actions.setError(
              error?.message || "Error al eliminar el vendedor"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sucursalSlice.actions.setLoading(false));
        }
      }
    ),
    deleteSucursalDoc: createRx.asyncThunk(
      async (
        {
          token,
          id,
          sucursalId,
        }: {
          token: string | undefined;
          id: number;
          sucursalId: string;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(sucursalSlice.actions.setLoading(true));

          const response = await deleteSucursalDoc({ token, id, sucursalId });

          await dispatch(
            sucursalSlice.actions.getSucursal({
              token,
              params: {
                page: 1,
                size: 20,
              },
            })
          );

          return response;
        } catch (error: any) {
          dispatch(
            sucursalSlice.actions.setError(
              error?.message || "Error al eliminar el documento de la sucursal"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sucursalSlice.actions.setLoading(false));
        }
      }
    ),
    getSucursalOption: createRx.asyncThunk(
        async (
          {
            token,
            params,
          }: {
            token: string | undefined;
            params: SucursalesParams;
          },
          { dispatch, rejectWithValue }
        ) => {
          try {
            dispatch(sucursalSlice.actions.setLoading(true));
            const response = await getSucursal({
              token,
              params: {
                ...params,
                page: 1, // <-- fuerza siempre page 1
              },
            });

          // Procesar filtroOptions
          const paises: Option[] = [];
          const estados: Option[] = [];
          const ciudades: Option[] = [];
          const codigosPostales: Option[] = [];

          response.sucursales.forEach((sucursal) => {
            const domicilio = sucursal.domicilioFiscal;
            if (!domicilio) return;

            if (domicilio.pais && domicilio.paisNombre) {
              if (!paises.some((opt) => opt.value === domicilio.pais)) {
                paises.push({ value: domicilio.pais, label: domicilio.paisNombre });
              }
            }

            if (domicilio.estado && domicilio.estadoNombre) {
              if (!estados.some((opt) => opt.value === domicilio.estado)) {
                estados.push({ value: domicilio.estado, label: domicilio.estadoNombre });
              }
            }

            if (domicilio.codigoPostal) {
              if (!codigosPostales.some((opt) => opt.value === domicilio.codigoPostal)) {
                codigosPostales.push({
                  value: domicilio.codigoPostal,
                  label: domicilio.codigoPostal,
                });
              }
            }

            if (domicilio.ciudad && domicilio.ciudadNombre) {
              if (!ciudades.some((opt) => opt.value === domicilio.ciudad)) {
                ciudades.push({ value: domicilio.ciudad, label: domicilio.ciudadNombre });
              }
            }
          });

          dispatch(
            sucursalSlice.actions.setFiltroOptions({
              paises,
              estados,
              ciudades,
              codigosPostales,
            })
          );

          dispatch(sucursalSlice.actions.setSucursalOptions(response.sucursales));
          return response;
        } catch (error: any) {
          dispatch(
            sucursalSlice.actions.setError(
              error?.message || "Error al obtener tipos de vendedores"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sucursalSlice.actions.setLoading(false));
        }
      }
    ),
    importSucursalFromExcel: createRx.asyncThunk(
      async (
        {
          token,
          file,
        }: {
          token: string | undefined;
          file: File;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(sucursalSlice.actions.setLoading(true));
          const response = await importSucursalFromExcel({ token, file });
          await dispatch(
            sucursalSlice.actions.getSucursal({
              token,
              params: {
                page: 1,
                size: 20,
              },
            })
          );
          return response;
        } catch (error: any) {
          dispatch(
            sucursalSlice.actions.setError(
              error?.message || "Error al importar vendedor"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sucursalSlice.actions.setLoading(false));
        }
      }
    ),
    getDocumentSucursalById: createRx.asyncThunk(
      async (
        {
          token,
          id,
        }: {
          token: string | undefined;
          id: string | number;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(sucursalSlice.actions.setLoading(true));
          const response = await getDocumentSucursalById({ token, id });
          dispatch(sucursalSlice.actions.setSucursalDocumento(response.documento));
          return response.documento;
        } catch (error: any) {
          dispatch(
            sucursalSlice.actions.setError(
              error?.message || "Error al obtener el documento por ID"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sucursalSlice.actions.setLoading(false));
        }
      }
    ),
    updateDocumentSucursal: createRx.asyncThunk(
      async (
        {
          token,
          id,
          sucursalId,
          nombreDocumento,
          isDeleted,
          archivo,
        }: {
          token: string | undefined;
          id: number;
          sucursalId: string;
          nombreDocumento: string;
          isDeleted: boolean;
          archivo?: File | null;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(sucursalSlice.actions.setLoading(true));
          const response = await updateDocumentSucursal({
            token,
            id,
            sucursalId,
            nombreDocumento,
            isDeleted,
            archivo,
          });
          return response;
        } catch (error: any) {
          dispatch(
            sucursalSlice.actions.setError(
              error?.message || "Error al actualizar el documento"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sucursalSlice.actions.setLoading(false));
        }
      }
    ),
    toggleSucursalStatus: createRx.asyncThunk(
      async (
        {
          token,
          id,
        }: {
          token: string | undefined;
          id: string | null;
        },
        { dispatch, rejectWithValue }
      ) => {
        try {
          dispatch(sucursalSlice.actions.setLoading(true));
          const response = await toggleSucursalStatus({
            token,
            id,
          });
          await dispatch(
            sucursalSlice.actions.getSucursal({
              token,
              params: {
                page: 1,
                size: 20,
              },
            })
          );
          return response;
        } catch (error: any) {
          dispatch(
            sucursalSlice.actions.setError(
              error?.message || "Error al cambiar el estado del tipo de vendedor"
            )
          );
          return rejectWithValue(error);
        } finally {
          dispatch(sucursalSlice.actions.setLoading(false));
        }
      }
    ),
  }),
  selectors: {
    getSucursal: (state) => state.sucursal,
    getCurrentSucursal: (state) => state.currentSucursal,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    getTotalRegistros: (state) => state.totalRegistros,
  },
});

export const { actions: sucursalActions, reducer: sucursalReducer } =
  sucursalSlice;
