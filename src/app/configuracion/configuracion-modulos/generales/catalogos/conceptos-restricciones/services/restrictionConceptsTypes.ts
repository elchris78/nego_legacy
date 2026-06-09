export interface RestrictionConcept {
  id: string;
  uid?: string;
  concepto: string;
  descripcion: string;
  estatus: boolean;
  advertencia: string;
  aplicaPara: string;
  requiereAutorizacion: boolean;
  claveAutorizacion: string;
  requiereNotificacion: boolean;
  correosNotificacion: string[];
  fechaCreacion?: string;
  fechaModificacion?: string;
  creadoPor?: string;
  isDeleted?: boolean;
}

export interface RestrictionConceptTypeParams {
  searchQuery?: string;
  page?: number;
  size?: number;
  isActive?: string[];
  requiereAutorizacion?: string[];
  requiereNotificacion?: string[];
  aplicaPara?: string[];
}

// BaseResponse interface for API responses
export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateRestrictionConceptResponse extends BaseResponse {}
export interface UpdateRestrictionConceptResponse extends BaseResponse {}
export interface DeleteRestrictionConceptResponse extends BaseResponse {}

export interface GetRestrictionConceptsResponse extends BaseResponse {
  conceptosRestriccionVenta: RestrictionConcept[];
  totalRegistros: number;
}

export interface GetRestrictionConceptByIdResponse extends BaseResponse {
  conceptoRestriccionVenta: RestrictionConcept;
}