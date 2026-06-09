import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { useAuth } from '@/lib/context/AppProvider';
import Login from '../../login/page';


export const fetchCompanies = createAsyncThunk('company/fetchCompanies', async (_, thunkAPI) => {
  const token = Cookies.get('token');
  if (!token) {
    return thunkAPI.rejectWithValue("Token no encontrado. Por favor inicia sesión.");
  }

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_URL}api/Account/companies`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener las empresas:", error);
    return thunkAPI.rejectWithValue("Error al obtener las empresas");
  }
});



export const selectCompany = async (
  companyId: number,
  setSelectedCompany: React.Dispatch<React.SetStateAction<number | null>>,
  setMessage: React.Dispatch<React.SetStateAction<string | null>>,
  router: ReturnType<typeof useRouter>
) => {
  const token = Cookies.get("auth-token");

  if (!token) {
    const errorMessage =
      "Token de autenticación no encontrado. Inicie sesión nuevamente.";
    console.log(errorMessage); // Log del error
    setMessage(errorMessage);
    router.push("/login");
    return;
  }

  // console.log("Token actual:", token); // Log del token actual

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_URL}api/CompanySwitch/switch-company`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ companyId }),
      }
    );

    const result = await response.json();

    if (response.ok && result.success) {
      // console.log("Respuesta exitosa:", result);

      // Actualizar token en las cookies
      if (result.token) {
        // console.log("Nuevo token recibido:", result.token); // Log del nuevo token
        Cookies.set("auth-token", result.token, { path: "/", secure: true });
      }

      Cookies.set("company", result.selectedCompany, { secure: true });
      Cookies.set("refresh-token", result.refreshToken, { secure: true });
      // console.log("Cookie 'company' configurada:", Cookies.get("company")); // Log de la empresa seleccionada

      setSelectedCompany(companyId);
      // console.log("Empresa seleccionada:", companyId);
      // const successMessage = result.message || "Empresa seleccionada con éxito.";
      // console.log("Mensaje de éxito:", successMessage); // Log del mensaje de éxito
      // setMessage(successMessage);

      // Redirigir a otra página si es necesario
      Cookies.set("companyId", companyId.toString(), { secure: true });
      router.push(`/home/${companyId}`);
    } else {
      const errorMessage = result.message || "Error al seleccionar la empresa.";
      // console.error("Error en la respuesta:", result);
      // console.log("Mensaje de error:", errorMessage); // Log del mensaje de error
      setMessage(errorMessage);
    }
  } catch (error) {
    console.error("Error al seleccionar la empresa:", error);
    const connectionErrorMessage = "Error de conexión. Intente nuevamente.";
    console.log("Mensaje de error de conexión:", connectionErrorMessage); // Log del mensaje de conexión
    setMessage(connectionErrorMessage);
  }
};

