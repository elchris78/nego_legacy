import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllClaims } from "./claimsActions";

export type Claim = {
  claimType: string;
  claimValue: string;
};

type ClaimsState = {
  data: Claim[];
  loading: boolean;
  error: string | null;
};

const initialState: ClaimsState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchClaims = createAsyncThunk<
  Claim[], 
  string, 
  { rejectValue: string }
>(
  'claim/fetchAll',
  async (token, { rejectWithValue }) => {
    try {
      const claims = await fetchAllClaims({ token });

      console.log("🚀 ~ file: claimsSlice.ts ~ line 47 ~ api.fetchClaims ~ response", claims);
      return claims;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener los claims');
    }
  }
);

const claimsSlice = createSlice({
  name: "claims",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default claimsSlice.reducer;
