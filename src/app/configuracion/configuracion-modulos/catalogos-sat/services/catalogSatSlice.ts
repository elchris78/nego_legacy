import { getCatalogsSat } from "./catalogSatApi";
import { GetSatCatalogResponse } from "./CatalogsTypes";
import { catalogSatCreateSlice } from "./createSlices";

interface CatalogSatState {
  catalogs: GetSatCatalogResponse[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: CatalogSatState = {
  catalogs: null,
  loading: false,
  error: null,
};

const catalogSatSlice = catalogSatCreateSlice({
  name: "catalogSat",
  initialState,
  reducers: (createRx) => ({
    setCatalogs: createRx.reducer(
      (state, action: { payload: GetSatCatalogResponse[] }) => {
        state.catalogs = action.payload;
      }
    ),
    setLoading: createRx.reducer((state, action: { payload: boolean }) => {
      state.loading = action.payload;
    }),
    setError: createRx.reducer((state, action: { payload: string | null }) => {
      state.error = action.payload;
    }),

    getCatalogs: createRx.asyncThunk(
      async (
        { token, params }: { token: string | undefined; params?: any },
        { dispatch, rejectWithValue }
      ) => {
        dispatch(catalogSatSlice.actions.setLoading(true));
        try {
          const catalogs = await getCatalogsSat(token ?? "");
          dispatch(catalogSatSlice.actions.setCatalogs(catalogs));
          return catalogs;
        } catch (error: any) {
          dispatch(catalogSatSlice.actions.setError(error.message));
          return rejectWithValue(error.message);
        } finally {
          dispatch(catalogSatSlice.actions.setLoading(false));
        }
      }
    ),
  }),
  selectors: {
    selectCatalogs: (state: CatalogSatState) => state.catalogs,
    selectLoading: (state: CatalogSatState) => state.loading,
    selectError: (state: CatalogSatState) => state.error,
  },
});

export const { actions: catalogSatActions, reducer: catalogSatReducer } =
  catalogSatSlice;
