import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCompanies } from './companyActions';

interface Company {
  companyName: string;
}

interface CompanyState {
  companies: Company[];
  selectedCompany: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  companies: [],
  selectedCompany: null,
  isLoading: false,
  error: null,
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setSelectedCompany: (state, action: PayloadAction<string>) => {
      state.selectedCompany = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action: PayloadAction<Company[]>) => {
        state.isLoading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string | null;
      });
  },
});

export const { setSelectedCompany } = companySlice.actions;
export default companySlice.reducer;
