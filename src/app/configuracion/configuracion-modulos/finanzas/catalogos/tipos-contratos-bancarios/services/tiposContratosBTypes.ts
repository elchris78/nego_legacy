export interface TiposContratosB {
  id: string;
  uid?: string;
  userProvidedId?: any
  numeroContrato: string;
  nombre: string;
  estatus: boolean;
}

export interface TiposContratosBParams {
  searchQuery?: string;
  page?: number;
  size?: number;
  estatus?: string[];
}

// BaseResponse interface for API responses
export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateTiposContratosBResponse extends BaseResponse {}
export interface UpdateTiposContratosBResponse extends BaseResponse {}
export interface DeleteTiposContratosBResponse extends BaseResponse {}

export interface GetTiposContratosBResponse extends BaseResponse {
  tiposContratos: TiposContratosB[];
  totalRegistros: number;
}

export interface GetTiposContratosBByIdResponse extends BaseResponse {
  tipoContrato: TiposContratosB;
}