//#region Interfaces para Claims
export interface ClaimDto {
 claimType: string;
 claimValue: string;
}
//#endregion

//#region Interfaces para Requests
export interface CreateAdminUserRequest {
 fullName: string;
 userName: string;
 email: string;
 password: string;
 confirmPassword: string;
 isActive: boolean;
 typeOfUser: string;
 companies: CompanyWithClaimsRequest[];
}

export interface CompanyWithClaimsRequest {
 id: number;
 roleTemplateId: string;
 individualClaims: ClaimDto[];
}

export interface CreateAdminUserNoClaimsRequest {
 fullName: string;
 userName: string;
 email: string;
 password: string;
 confirmPassword: string;
 isActive: boolean;
}

export interface UpdateAdminUserRequest {
 id: string;
 fullName: string;
 userName: string;
 email: string;
 password: string;
 confirmPassword: string;
 isActive: boolean;
 typeOfUser: string;
 companies: CompanyWithClaimsRequest[];
}

export interface AssignClaimsRequest {
 userId: string;
 companies: CompanyWithClaimsRequest[];
}
//#endregion

//#region Interfaces para Responses
export interface BaseResponse {
 success: boolean;
 message: string;
}

export interface CreateAdminUserResponse extends BaseResponse {
 userId: string;
}

export interface UpdateAdminUserResponse extends BaseResponse {}

export interface DeleteAdminUserResponse extends BaseResponse {}

export interface ToggleAdminUserActiveResponse extends BaseResponse {}

export interface GetAdminUsersResponse extends BaseResponse {
 totalRegistros: number;
 users: GetAdminUserResponse[];
}

export interface GetAdminUserByIdResponse extends BaseResponse {
 user: AdminUserResponse;
}

export interface AdminUserResponse {
 userId: string;
 fullName: string;
 userName: string;
 email: string;
 typeOfUser: string;
 isActive: boolean;
 gender: string;
 dateOfBirth: string;
 phoneNumber: string;
 profilePicture: string;
 createdAt?: Date;
 createdBy: string;
 companies: UserCompanyDetails[];
}

export interface GetAdminUserResponse {
 id: string;
 fullName: string;
 userName: string;
 email: string;
 typeOfUser: string;
 createdAt?: string;
 createdBy: string;
 companies: UserCompanyDetails[];
 isActive: boolean;
 roleTemplateName: string;
}

export interface UserCompanyDetails {
 companyId: number;
 name: string;
 normalizedName: string;
 roleTemplateId: string;
 individualClaims: ClaimDto[];
}

export interface GetAdminUsersParams {
  page?: number;
  size?: number;
  searchQuery?: string;
  status?: string[];
  companyId?: string[];
  roleTemplateIds?: string[];
  startDate?: string;
  endDate?: string;
}
//#endregion


//#region Interfaces viejas
export interface UserPayload {
 userName: string;
 email: string;
 fullName: string;
 typeOfUser: string;
 roles: string[];
 password?: string;
 confirmPassword?: string;
}

export interface EditUserPayload extends Partial<UserPayload> {
 id: string;
}

export interface UserResponse {
 success: boolean;
 message?: string;
 data: {
   id: string;
   userName: string;
   email: string;
   fullName: string;
   typeOfUser: string;
   roles: string[];
   createdAt: string;
   lastLoginTime: string;
 };
}

export interface RoleResponse {
 roles: roles[];
}

export interface roles {
 roleId: string;
 roleName: string;
}

export interface UserState {
 user: UserResponse | null;
 roles: RoleResponse[];
 loading: boolean;
 error: string | null;
}


export interface CompaniesPayload {
 companyId: number;
 name: string;
 normalizedName: string;
 roleTemplateId?: any;
 individualClaims: IndividualClaim[];
}

export  interface IndividualClaim {
 claimType: string;
 claimValue: string;
}
//#endregion
