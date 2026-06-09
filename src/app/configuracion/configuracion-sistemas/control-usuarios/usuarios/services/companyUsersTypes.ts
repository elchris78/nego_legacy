import { UserCompanyDetails } from "@/app/admin/usuarios/services/adminUsersTypes";

//#region Interfaces para Claims
export interface ClaimDto {
  claimType: string;
  claimValue: string;
}
//#endregion

//#region Interfaces para Requests
export interface CreateCompanyUserRequest {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  isActive: string;
  userType: string;
  // roleTemplateId: string;
  // individualClaims: ClaimDto[];
}

export interface CompanyWithClaimsRequest {
  id: number;
  roleTemplateId: string;
  individualClaims: ClaimDto[];
}

export interface CreateCompanyUserNoClaimsRequest {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  isActive: string;
  userType: string;
  // roleTemplateId: string;
  // individualClaims: ClaimDto[];
}

export interface UpdateCompanyUserRequest {
  userId: string;
  fullName: string;
  userName: string;
  email: string;
  isActive: boolean;
  userType: string;
  roleTemplateId: string;
  individualClaims: ClaimDto[];
  password: string;
  confirmPassword: string;
}

export interface AssignClaimsRequest {
  userId: string;
  roleTemplateId?: string;
  individualClaims: ClaimDto[];
}
//#endregion

//#region Interfaces para Responses
export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateCompanyUserResponse extends BaseResponse {
  userId: string;
}

export interface UpdateCompanyUserResponse extends BaseResponse {}

export interface DeleteCompanyUserResponse extends BaseResponse {}

export interface ToggleCompanyUserActiveResponse extends BaseResponse {}

export interface GetCompanyUsersResponse extends BaseResponse {
  totalRegistros: number;
  users: GetCompanyUserResponse[];
}

export interface GetCompanyUserByIdResponse extends BaseResponse {
  userId: string;
  fullName: string;
  userName: string;
  email: string;
  isActive: boolean;
  userType: string;
  roleTemplateId: string;
  claims: ClaimDto[];
  createdAt?: Date;
  createdBy: string;
}

export interface GetCompanyUserResponse {
  userId: string;
  fullName: string;
  userName: string;
  email: string;
  isActive: boolean;
  userType: string;
  roleTemplateId: string;
  roleTemplateNames?: any[];
  claims: ClaimDto[];
  createdAt?: string;
  createdBy: string;
  companies: UserCompanyDetails[];
}

//#endregion


//#region Interfaces viejas
export interface UserPayload {
  fullName:         string;
  userName:         string;
  email:            string;
  password:         string;
  confirmPassword:  string;
  isActive:         boolean;
  userType:         string;
  roleTemplateId:   string;
  individualClaims: IndividualClaims[];
}

export interface IndividualClaims {
  claimType:  string;
  claimValue: string;
}
//#endregion

export interface GetCompanyUsersParams {
  page?: number; // Default: 1
  size?: number; // Default: 10
  searchQuery?: string; // Término general
  roleTemplateId?: string[]; // Listado de plantillas
  status?: string[]; // Estatus del usuario
  startDate?: string;
  endDate?: string;
}