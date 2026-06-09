export interface FabricanteDocumento {
  id: string;
  nombre: string;
  formato: string;
  fechaCarga: string;
  url: string;
}

export interface FabricanteDocumentoTypeParams {
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

export interface CreateFabricanteDocumentoResponse extends BaseResponse {}
export interface UpdateFabricanteDocumentoResponse extends BaseResponse {}
export interface DeleteFabricanteDocumentoResponse extends BaseResponse {}

export interface GetFabricanteDocumentosResponse extends BaseResponse {
  documentos: FabricanteDocumento[];
  id: string;
  totalRegistros: number;
}

export interface FabricanteDocumentoByIdResponse extends BaseResponse {
  id: string;
  documento: FabricanteDocumento;
}
