export interface ReturnConcept {
  uidConcepto?: string;
  id: string;
  concepto: string;
  afectaA: string;
  estatus: boolean;
  fechaCreacion?: string;
  fechaModificacion?: string;
  creadoPor?: string;
  isDeleted?: boolean;
}

export interface ReturnConceptTypeParams {
  searchQuery?: string;
  page?: number;
  size?: number;
  isActive?: string[];
  affectTo?: string[];
}

// BaseResponse interface for API responses
export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateReturnConceptResponse extends BaseResponse {}
export interface UpdateReturnConceptResponse extends BaseResponse {}
export interface DeleteReturnConceptResponse extends BaseResponse {}
export interface GetReturnConceptsResponse extends BaseResponse {
  conceptosDevolucion: ReturnConcept[];
  totalRegistros: number;
}
export interface GetReturnConceptByIdResponse extends BaseResponse {
  conceptoDevolucion: ReturnConcept;
}
