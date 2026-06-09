import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  roles: string[];
  datosUsuario: any;
}

const initialState: AuthState = {
  roles: [],
  datosUsuario: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<{ roles: string[]; datosUsuario: any }>) => {
      state.roles = action.payload.roles;
      state.datosUsuario = action.payload.datosUsuario;
    },
    clearUserData: (state) => {
      state.roles = [];
      state.datosUsuario = null;
    },
  },
});

export const { setUserData, clearUserData } = authSlice.actions;
export default authSlice.reducer;
