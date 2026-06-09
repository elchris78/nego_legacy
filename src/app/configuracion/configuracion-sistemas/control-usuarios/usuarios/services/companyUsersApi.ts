// adminUsersApi.ts

import {
 CreateCompanyUserRequest,
 CreateCompanyUserResponse,
 UpdateCompanyUserRequest,
 UpdateCompanyUserResponse,
 DeleteCompanyUserResponse,
 ToggleCompanyUserActiveResponse,
 GetCompanyUsersResponse,
 GetCompanyUserByIdResponse,
 CreateCompanyUserNoClaimsRequest,
 AssignClaimsRequest,
 BaseResponse,
 GetCompanyUsersParams,
} from "./companyUsersTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Función auxiliar para parsear la respuesta y capturar errores en caso de no ser JSON.
async function parseResponse<T>(response: Response): Promise<T> {
 const contentType = response.headers.get("content-type");
 if (contentType && contentType.includes("application/json")) {
   return await response.json();
 } else {
   const text = await response.text();
   return { message: text, success: false } as unknown as T;
 }
}

export const apiCompanyUsers = {
 // POST /api/Users/create
 createUser: async (
   token: string,
   body: CreateCompanyUserRequest
 ): Promise<CreateCompanyUserResponse> => {
   const response = await fetch(`${BASE_URL}api/Users/create`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,
     },
     body: JSON.stringify(body),
   });
   const jsonResponse: CreateCompanyUserResponse = await parseResponse(response);
   if (!response.ok || !jsonResponse.success) {
     throw new Error(jsonResponse.message || "Error al crear el usuario");
   }
   return jsonResponse;
 },

 // GET /api/Users/get-all
 getUsers: async (
   token: string,
   params: GetCompanyUsersParams = {}
 ): Promise<GetCompanyUsersResponse> => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Convertimos a string y eliminamos duplicados convirtiendo a array
      const uniqueValues = Array.from(new Set(value.map(String)));
  
      if (key === "status" && uniqueValues.includes("true") && uniqueValues.includes("false")) {
        return; // No agregamos nada a queryParams
      }
  
      uniqueValues.forEach((val) => queryParams.append(key, val));
    } else if (value) {
      queryParams.append(key, String(value));
    }
  });

   const url = `${BASE_URL}api/Users/get-all${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
   const response = await fetch(url, {
     method: "GET",
     headers: {
       Authorization: `Bearer ${token}`,
     },
   });
   const jsonResponse: GetCompanyUsersResponse = await parseResponse(response);
   if (!response.ok || !jsonResponse.success) {
     throw new Error(jsonResponse.message || "Error al obtener los usuarios");
   }
   return jsonResponse;
 },

 // GET /api/Users/get/{userId}
 getUserById: async (
   token: string,
   userId: string
 ): Promise<GetCompanyUserByIdResponse> => {
   const response = await fetch(`${BASE_URL}api/Users/get/${userId}`, {
     method: "GET",
     headers: {
       Authorization: `Bearer ${token}`,
     },
   });
   const jsonResponse: GetCompanyUserByIdResponse = await parseResponse(response);
   if (!response.ok || !jsonResponse.success) {
     throw new Error(jsonResponse.message || "Error al obtener el usuario");
   }
   return jsonResponse;
 },

 // PUT /api/Users/edit
 updateUser: async (
   token: string,
   body: UpdateCompanyUserRequest
 ): Promise<UpdateCompanyUserResponse> => {
   const response = await fetch(`${BASE_URL}api/Users/edit`, {
     method: "PUT",
     headers: {
       "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,
     },
     body: JSON.stringify(body),
   });
   const jsonResponse: UpdateCompanyUserResponse = await parseResponse(response);
   if (!response.ok || !jsonResponse.success) {
     throw new Error(jsonResponse.message || "Error al actualizar el usuario");
   }
   return jsonResponse;
 },

 // PUT /api/Users/toggle-status/{userId}
 toggleUserStatus: async (
   token: string,
   userId: string
 ): Promise<ToggleCompanyUserActiveResponse> => {
   const response = await fetch(`${BASE_URL}api/Users/toggle-status/${userId}`, {
     method: "PUT",
     headers: {
       Authorization: `Bearer ${token}`,
     },
   });
   const jsonResponse: ToggleCompanyUserActiveResponse = await parseResponse(response);
   if (!response.ok || !jsonResponse.success) {
     throw new Error(jsonResponse.message || "Error al cambiar el estado del usuario");
   }
   return jsonResponse;
 },

 // DELETE /api/Users/delete/{userId}
 deleteUser: async (
   token: string,
   userId: string
 ): Promise<DeleteCompanyUserResponse> => {
   const response = await fetch(`${BASE_URL}api/Users/delete/${userId}`, {
     method: "DELETE",
     headers: {
       "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,
     },
   });
   const jsonResponse: DeleteCompanyUserResponse = await parseResponse(response);
   if (!response.ok || !jsonResponse.success) {
     throw new Error(jsonResponse.message || "Error al eliminar el usuario");
   }
   return jsonResponse;
 },

 // POST /api/Users/create-user-no-claims
 createUserNoClaims: async (
   token: string,
   body: CreateCompanyUserNoClaimsRequest
 ): Promise<BaseResponse> => {
   const response = await fetch(`${BASE_URL}api/Users/create-no-claims`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,
     },
     body: JSON.stringify(body),
   });
   const jsonResponse: BaseResponse = await parseResponse(response);
   if (!response.ok || !jsonResponse.success) {
     throw new Error(jsonResponse.message || "Error al crear el usuario sin claims");
   }
   return jsonResponse;
 },

 // POST /api/Users/assign-claims
 assignClaims: async (
   token: string,
   body: AssignClaimsRequest
 ): Promise<BaseResponse> => {
   const response = await fetch(`${BASE_URL}api/Users/assign-claims`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,
     },
     body: JSON.stringify(body),
   });
   const jsonResponse: BaseResponse = await parseResponse(response);
   if (!response.ok || !jsonResponse.success) {
     throw new Error(jsonResponse.message || "Error al asignar claims");
   }
   return jsonResponse;
 },
};
