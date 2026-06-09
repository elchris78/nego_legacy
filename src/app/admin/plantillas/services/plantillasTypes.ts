// ======================== Deprecated ========================
export interface TemplatePayload {
    roleTemplateName?: string;
    description?:      string;
    claims?:           Claim[];
    companyIds?:       string[];
    active?:           boolean;
}

export interface Claim {
    claimType?:  string;
    claimValue?: string;
}

// Base Response
export interface BaseResponse {
    success: boolean;
    message: string;
}

// Request Interfaces
export interface CreateRoleTemplateWithCompaniesRequest {
    roleTemplateName: string;
    description: string;
    claims: ClaimDto[];
    companyIds: string[];
    active: boolean;
}

export interface UpdateRoleTemplateWithCompaniesRequest {
    roleTemplateId: string;
    roleTemplateName: string;
    description: string;
    claims: ClaimDto[];
    companyIds: string[];
    active: boolean;
}

export interface GetRolesByCompanyAndCompanyIdRequest {
    companyId: string;
}

// Response Interfaces
export interface CreateRoleTemplateResponse extends BaseResponse {}

export interface UpdateRoleTemplateResponse extends BaseResponse {}

export interface DeleteRoleTemplateResponse extends BaseResponse {}

export interface SwitchActiveResponse extends BaseResponse {}

export interface GetRoleTemplatesResponse extends BaseResponse {
    totalRegistros: number;
    roleTemplates: RoleTemplateResponse[];
}

export interface RoleTemplateResponse {
    roleTemplateId: string;
    roleTemplateName: string;
    description: string;
    active: boolean;
    defaultRole: boolean;
    createdAt: string;
    companies: {
        item1: string;
        item2: string;
    }[];
    claims: ClaimDto[];
}

export interface GetRolesByCompanyAndCompanyIdResponse extends BaseResponse {
    roles: RoleResponse[];
}

export interface RoleResponse {
    roleTemplateId: string;
    roleTemplateName: string;
    description: string;
    active: boolean;
    createdAt: Date;
    defaultRole: boolean;
}

// Interface para Claims
export interface ClaimDto {
    claimType: string;
    claimValue: string;
}

export interface RolTemplatesAdminParams {
    searchQuery?: string;
    page?: number;
    size?: number;
    active?: string[];
    companyId?: string[];
    startDate?: string;
    endDate?: string;
}