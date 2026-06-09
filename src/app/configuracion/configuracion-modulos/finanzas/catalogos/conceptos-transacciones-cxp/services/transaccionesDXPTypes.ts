export interface TransaccionesDXP {
  id: string;
  uid?: string;
  userProvidedId?: any
  conceptoTransaccion: string;
  estatus: boolean;
  origen: string;
  fechaCreacion: string;  
  fechaModificacion: string; 
  creadoPor: string;
  contrapartidaId: string;
  contrapartidaNombre: string;
  tipoTransaccion: string;
  observaciones: string;
  formaPago: string;
  tipoRelacionSatNombre: string;
  formaPagoNombre: string
  requiereAutorizacion: boolean;
  requiereNotaCredito: boolean;
  afectaCheques: boolean;
  cancelaNotaCredito: boolean;
  cancelaPago: boolean;
  validaReferencia: boolean;
}

export interface TransaccionesDXPParams {
  searchQuery?: string;
  page?: number;
  size?: number;
  isActive?: string[];
  origen?: string[];
  contraPartida?: string[];
  tipoTransaccion?: string[];
  tipoRelacionSat?: string[];
  formaPago?: string[];
}

// BaseResponse interface for API responses
export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateTransaccionesDXPResponse extends BaseResponse {}
export interface UpdateTransaccionesDXPResponse extends BaseResponse {}
export interface DeleteTransaccionesDXPResponse extends BaseResponse {}

export interface GetTransaccionesDXPResponse extends BaseResponse {
  conceptoTransacciones: TransaccionesDXP[];
  totalRegistros: number;
}

export interface GetTransaccionDXPByIdResponse extends BaseResponse {
  conceptoTransaccion: TransaccionesDXP;
}