export interface Monedas {
  id: string;
  uid: string;
  userProvidedId?: string;
  monedaSat: string;
  monedaSatId: string;
  paisNombre: string;
  paisId?: string;
  tipoCambio: string;
  descripcion: string;
  estatus: boolean;
}

export interface MonedasParams {
  searchQuery?: string;
  page?: number;
  size?: number;
  estatus?: string[];
  monedaSatIds?: string[];
  paisIds?: string[];
}

// BaseResponse interface for API responses
export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface CreateMonedasResponse extends BaseResponse {}
export interface UpdateMonedasResponse extends BaseResponse {}
export interface DeleteMonedasResponse extends BaseResponse {}

export interface GetMonedasResponse extends BaseResponse {
  monedas: Monedas[];
  totalRegistros: number;
}

export interface GetMonedaByIdResponse extends BaseResponse {
  moneda: Monedas;
}