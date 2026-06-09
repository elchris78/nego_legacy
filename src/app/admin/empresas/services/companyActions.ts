// src/features/company/companyActions.ts

import { CompanyProps, DeleteCompanyProps, FetchCompaniesProps } from './companyTypes';

// Crear una compañía
export const createCompany = async ({ companyId, name, token }: CompanyProps) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  if (token) {
    myHeaders.append("Authorization", `Bearer ${token}`);
  }

  const raw = JSON.stringify({
    companyId,
    name,
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}NegoAdmin/Company`, requestOptions);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Error al crear la empresa.');
    }
    console.log('Empresa creada exitosamente:', result);
    return result; 
  } catch (error) {
    console.error('Error al crear la empresa:', error);
    throw error; 
  }
};

// Editar una compañía
export const editCompany = async (company: CompanyProps): Promise<string | undefined> => {
  const { companyId, name, token } = company;
  console.log("Entro a editar");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const raw = JSON.stringify({
    companyId,
    name
  });

  const requestOptions: RequestInit = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}NegoAdmin/Company/update`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la actualización: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Respuesta del servidor:", result);
    return undefined; // Indica que no hubo error

  } catch (error) {
    console.error("Error al actualizar la empresa:", error);
    return `Error al editar la empresa: ${error instanceof Error ? error.message : "Error desconocido"}`;
  }
};

// Eliminar una compañía
export const deleteCompany = async ({ companyId, token }: DeleteCompanyProps): Promise<void> => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions: RequestInit = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/NegoAdmin/Company/${companyId}`, requestOptions);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error('Error occurred:', error);
  }
};

// Obtener todas las compañías
export const fetchAllCompanies = async ({ token }: FetchCompaniesProps): Promise<any[]> => {
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

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}NegoAdmin/Company/all`, requestOptions);
    
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || 'Error al obtener las compañías.');
    }

    const result = await response.json();
    return result; 
  } catch (error) {
    console.error('Error al obtener las compañías:', error);
    throw error; 
  }
};
