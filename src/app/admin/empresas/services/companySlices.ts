import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllCompanies } from './companyActions';
import { Company } from './companyTypes';

interface CompanyState {
  companies: Company[];
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  companies: [],
  loading: false,
  error: null,
};

// Thunk para obtener las compañías
export const getCompanies = createAsyncThunk<
  Company[], 
  string, 
  { rejectValue: string }
>(
  'company/fetchAll',
  async (token, { rejectWithValue }) => {
    try {
      const companies = await fetchAllCompanies({ token });
      return companies;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener compañías');
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(getCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error desconocido';
      });
  },
});

export default companySlice.reducer;
