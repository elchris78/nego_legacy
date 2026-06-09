export interface EmpresaDocumentacionAdicional {
  id: string;
  formato: string;
  nombre: string;
  fechaCarga: string;
  url: string;
}

export interface EmpresaDocumentacionAdicionalParams {
  searchQuery?: string;
  page?: number;
  size?: number;
  formatos?: string[];
}

// BaseResponse interface for API responses
export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateEmpresaDocumentacionAdicionalResponse extends BaseResponse {}

export interface UpdateEmpresaDocumentacionAdicionalResponse extends BaseResponse {}

export interface DeleteEmpresaDocumentacionAdicionalResponse extends BaseResponse {
  id?: string;
}

export interface GetEmpresaDocumentacionAdicionalResponse extends BaseResponse {
  documentos: EmpresaDocumentacionAdicional[];
  id: string;
  totalRegistros: number;
}

export interface GetEmpresaDocumentacionAdicionalByIDResponse extends BaseResponse {
  id: string;
  documento: EmpresaDocumentacionAdicional;
}