export interface ColaboradorDocumentacion {
  id: string;
  formato: string;
  nombre: string;
  fechaCarga: string;
  url: string;
}

export interface ColaboradorDocumentacionParams {
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

export interface CreateColaboradorDocumentacionResponse extends BaseResponse {}

export interface UpdateColaboradorDocumentacionResponse extends BaseResponse {}

export interface DeleteColaboradorDocumentacionResponse extends BaseResponse {
  id?: string;
}

export interface GetColaboradorDocumentacionResponse extends BaseResponse {
  documentos: ColaboradorDocumentacion[];
  id: string;
  totalRegistros: number;
}

export interface GetColaboradorDocumentacionByIDResponse extends BaseResponse {
  id: string;
  documento: ColaboradorDocumentacion;
}
