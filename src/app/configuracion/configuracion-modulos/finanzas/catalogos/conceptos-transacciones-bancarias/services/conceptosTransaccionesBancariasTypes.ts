export interface ConceptoTransaccionBancaria {
  uid?: string;
  id: string;
  estatus: boolean;
  concepto: string;
  tipoTransaccion: string;
  folio: string;
  observaciones: string;
  validaReferencia: boolean;
  fechaCreacion?: string;
  fechaModificacion?: string;
  creadoPor?: string;
  isDeleted?: boolean;
}

export interface ConceptoTransaccionBancariaTypeParams {
  searchQuery?: string;
  page?: number;
  size?: number;
  estatus?: string[];
  tipoTransaccion?: string[];
}

// BaseResponse interface for API responses
export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateConceptoTransaccionBancariaResponse extends BaseResponse {}
export interface UpdateConceptoTransaccionBancariaResponse extends BaseResponse {}
export interface DeleteConceptoTransaccionBancariaResponse extends BaseResponse {}

export interface GetConceptosTransaccionesBancariasResponse extends BaseResponse {
  id: string;
  conceptosTransacciones: ConceptoTransaccionBancaria[];
  totalRegistros: number;
}

export interface GetConceptoTransaccionBancariaByIdResponse extends BaseResponse {
  conceptoTransaccion: ConceptoTransaccionBancaria;
}

// Form values for the general data form
export interface GeneralDataFormValues {
  userProvidedId?: string;
  userProvidedPrefix?: string;
  estatus: string;
  concepto: string;
  tipoTransaccion: string;
  folio?: string;
  validaReferencia: string;
  observaciones: string;
}