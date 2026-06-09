// adminUsersApi.ts

import {
 CreateAdminUserRequest,
 CreateAdminUserResponse,
 UpdateAdminUserRequest,
 UpdateAdminUserResponse,
 DeleteAdminUserResponse,
 ToggleAdminUserActiveResponse,
 GetAdminUsersResponse,
 GetAdminUserByIdResponse,
 CreateAdminUserNoClaimsRequest,
 AssignClaimsRequest,
 BaseResponse,
 GetAdminUsersParams,
} from "./adminUsersTypes";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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

export const apiAdminUsers = {
 // POST /api/AdminUsers/create
 createUser: async (
   token: string,
   body: CreateAdminUserRequest
 ): Promise<CreateAdminUserResponse> => {
   const response = await fetch(`${BASE_URL}api/AdminUsers/create`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,
     },
     body: JSON.stringify(body),
   });
   const jsonResponse: CreateAdminUserResponse = await parseResponse(response);
   if (!response.ok || !jsonResponse.success) {
     throw new Error(jsonResponse.message || "Error al crear el usuario");
   }
   return jsonResponse;
 },

 // GET /api/AdminUsers/get-all
 getUsers: async (
   token: string,
   params: GetAdminUsersParams = {}
 ): Promise<GetAdminUsersResponse> => {
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

   const url = `${BASE_URL}api/AdminUsers/get-all${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
   const response = await fetch(url, {
     method: "GET",
     headers: {
       Authorization: `Bearer ${token}`,
     },
   });
   const jsonResponse: GetAdminUsersResponse = await parseResponse(response);
   if (!response.ok || !jsonResponse.success) {
     throw new Error(jsonResponse.message || "Error al obtener los usuarios");
   }
   return jsonResponse;
 },

 // GET /api/AdminUsers/get/{userId}
 getUserById: async (
   token: string,
   userId: string
 ): Promise<GetAdminUserByIdResponse> => {
   const response = await fetch(`${BASE_URL}api/AdminUsers/get/${userId}`, {
     method: "GET",
     headers: {
       Authorization: `Bearer ${token}`,
     },
   });
   const jsonResponse: GetAdminUserByIdResponse = await parseResponse(response);
   if (!response.ok || !jsonResponse.success) {
     throw new Error(jsonResponse.message || "Error al obtener el usuario");
   }
   return jsonResponse;
 },

 // PUT /api/AdminUsers/edit
 updateUser: async (
   token: string,
   body: UpdateAdminUserRequest
 ): Promise<UpdateAdminUserResponse> => {
   const response = await fetch(`${BASE_URL}api/AdminUsers/edit`, {
     method: "PUT",
     headers: {
       "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,
     },
     body: JSON.stringify(body),
   });
   const jsonResponse: UpdateAdminUserResponse = await parseResponse(response);
   if (!response.ok || !jsonResponse.success) {
     throw new Error(jsonResponse.message || "Error al actualizar el usuario");
   }
   return jsonResponse;
 },

 // PUT /api/AdminUsers/toggle-status/{userId}
 toggleUserStatus: async (
   token: string,
   userId: string
 ): Promise<ToggleAdminUserActiveResponse> => {
   const response = await fetch(`${BASE_URL}api/AdminUsers/toggle-status/${userId}`, {
     method: "PUT",
     headers: {
       Authorization: `Bearer ${token}`,
     },
   });
   const jsonResponse: ToggleAdminUserActiveResponse = await parseResponse(response);
   if (!response.ok || !jsonResponse.success) {
     throw new Error(jsonResponse.message || "Error al cambiar el estado del usuario");
   }
   return jsonResponse;
 },

 // DELETE /api/AdminUsers/delete/{userId}
 deleteUser: async (
   token: string,
   userId: string
 ): Promise<DeleteAdminUserResponse> => {
   const response = await fetch(`${BASE_URL}api/AdminUsers/delete/${userId}`, {
     method: "DELETE",
     headers: {
       "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,
     },
   });
   const jsonResponse: DeleteAdminUserResponse = await parseResponse(response);
   if (!response.ok || !jsonResponse.success) {
     throw new Error(jsonResponse.message || "Error al eliminar el usuario");
   }
   return jsonResponse;
 },

 // POST /api/AdminUsers/create-user-no-claims
 createUserNoClaims: async (
   token: string,
   body: CreateAdminUserNoClaimsRequest
 ): Promise<BaseResponse> => {
   const response = await fetch(`${BASE_URL}api/AdminUsers/create-user-no-claims`, {
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

 // POST /api/AdminUsers/assign-claims
 assignClaims: async (
   token: string,
   body: AssignClaimsRequest
 ): Promise<BaseResponse> => {
   const response = await fetch(`${BASE_URL}api/AdminUsers/assign-claims`, {
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
