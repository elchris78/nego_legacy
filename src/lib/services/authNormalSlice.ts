import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  datosUsuarioNormal: any;
}

const initialState: AuthState = {
  datosUsuarioNormal: null,
};

const authNormalSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<{ datosUsuarioNormal: any }>) => {
      
      state.datosUsuarioNormal = action.payload.datosUsuarioNormal;
    },
    clearUserData: (state) => {
      
      state.datosUsuarioNormal = null;
    },
  },
});

export const { setUserData, clearUserData } = authNormalSlice.actions;
export default authNormalSlice.reducer;
