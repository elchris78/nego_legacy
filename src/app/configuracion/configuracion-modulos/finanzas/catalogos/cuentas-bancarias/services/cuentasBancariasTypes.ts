export interface CuentaBancaria {
  uid?: string;
  id: string;
  estatus: boolean;
  numeroCuenta: string;
  descripcion: string;
  banco: string;
  bancoId?: string;
  plaza: string;
  sucursal: string;
  clabe: string;
  cuentaContable: string;
  swift: string;
  moneda: string;
  monedaId?: string;
  tipoInstrumentoBancario: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
  creadoPor?: string;
  isDeleted?: boolean;
}

export interface CuentaBancariaTypeParams {
  searchTerm?: string;
  page?: number;
  size?: number;
  estatus?: string[];
  bancoIds?: string[];
  monedaIds?: string[];
  tipoInstrumentoBancario?: string[];
  cuentaContable?: string[];
}

// BaseResponse interface for API responses
export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateCuentaBancariaResponse extends BaseResponse {}
export interface UpdateCuentaBancariaResponse extends BaseResponse {}
export interface DeleteCuentaBancariaResponse extends BaseResponse {}

export interface GetCuentasBancariasResponse extends BaseResponse {
  id: string;
  cuentasBancarias: CuentaBancaria[];
  totalRegistros: number;
}

export interface GetCuentaBancariaByIdResponse extends BaseResponse {
  cuentaBancaria: CuentaBancaria;
}

// GeneralDataFormValues interface for form data
export interface GeneralDataFormValues {
  userProvidedId?: string;
  userProvidedPrefix?: string;
  estatus: string;
  numeroCuenta: string;
  descripcion: string;
  banco: string;
  plaza: string;
  sucursal: string;
  clabe: string;
  cuentaContable: string;
  swift: string;
  moneda: string;
  tipoInstrumentoBancario: string;
}

export interface Moneda {
  uid:                      string;
  claveNego:                number;
  fechaCreacion:            string;
  fechaUltimaActualizacion: string;
  estatus:                  boolean;
  c_Moneda:                 string;
  descripcion:              string;
  decimales:                number;
  porcentajeVariacion:      number;
  fechaInicioVigencia:      string;
  fechaFinVigencia:         string;
}
