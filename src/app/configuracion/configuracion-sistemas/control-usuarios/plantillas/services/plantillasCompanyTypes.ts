// ======================== Deprecated ========================
export interface TemplatePayload {
    roleTemplateName?: string;
    description?:      string;
    claims?:           Claim[];
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
}

export interface UpdateRoleTemplateWithCompaniesRequest {
    roleTemplateId: string;
    roleTemplateName: string;
    description: string;
    claims: ClaimDto[];
    active: boolean;
    defaultRole: boolean,
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
    success: boolean;
    message: string;
    roleTemplateId: string;
    roleTemplateName: string;
    description: string;
    active: boolean;
    defaultRole: boolean;
    createdAt: string;
    roleTemplateType: string;
    claims: ClaimDto[];
    companies?: any[]
}

// Interface para Claims
export interface ClaimDto {
    claimType: string;
    claimValue: string;
}

export interface RoleTemplatesParams {
    searchQuery?: string;
    page?: number;
    size?: number;
    type?: string[];
    active?: string[];
    startDate?: string;
    endDate?: string;
}