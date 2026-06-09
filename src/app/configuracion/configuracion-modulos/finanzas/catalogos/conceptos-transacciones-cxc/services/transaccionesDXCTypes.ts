export interface TransaccionesDXC {
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
  tipoRelacionSat: string;
  requiereAutorizacion: boolean;
  generaDocumento: string;
  afectaDepositos: boolean;
  validaReferencias: boolean;
  observaciones: string;
  cancelaNotaCredito: boolean;
  cancelaPago: boolean;
  formaPago: string;
  tipoRelacionSatNombre: string;
  formaPagoNombre: string
}

export interface TransaccionesDXCParams {
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

export interface CreateTransaccionesDXCResponse extends BaseResponse {}
export interface UpdateTransaccionesDXCResponse extends BaseResponse {}
export interface DeleteTransaccionesDXCResponse extends BaseResponse {}

export interface GetTransaccionesDXCResponse extends BaseResponse {
  conceptoTransacciones: TransaccionesDXC[];
  totalRegistros: number;
}

export interface GetTransaccionDXCByIdResponse extends BaseResponse {
  conceptoTransaccion: TransaccionesDXC;
}