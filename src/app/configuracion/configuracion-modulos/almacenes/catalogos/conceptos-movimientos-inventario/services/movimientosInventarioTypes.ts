export interface MovimientoInventario {
  uid: string;
  id: string;
  claveConcepto: string;
  estatus: boolean;
  origen: string;
  concepto: string;
  aplicaPara: string;
  tipoMovimiento: string;
  folio: number;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

export interface MovimientoInventarioTypeParams {
  searchQuery?: string;
  page?: number;
  size?: number;
  estatus?: string[];
  origen?: string[];
  aplicaPara?: string[];
  tipoMovimiento?: string[];
}

export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateMovimientoInventarioResponse extends BaseResponse {}
export interface UpdateMovimientoInventarioResponse extends BaseResponse {}
export interface DeleteMovimientoInventarioResponse extends BaseResponse {}

export interface GetMovimientosInventarioResponse extends BaseResponse {
  conceptosMovimientoInventario: MovimientoInventario[];
  id: string;
  totalRegistros: number;
}

export interface GetMovimientoInventarioByIdResponse extends BaseResponse {
  id: string;
  concepto: MovimientoInventario;
}

export interface GeneralDataFormValues {
  userProvidedId?: string;
  userProvidedPrefix?: string;
  concepto: string;
  origen?: string;
  aplicaPara: string;
  tipoMovimiento: string;
  estatus: string;
}
